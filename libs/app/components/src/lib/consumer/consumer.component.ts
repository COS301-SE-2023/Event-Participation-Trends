import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { types as MediasoupTypes, Device } from 'mediasoup-client';
import { Socket } from 'ngx-socket-io'

@Component({
  selector: 'event-participation-trends-consumer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css'],
})
export class ConsumerComponent {
  private device!: Device;
  public socket!: Socket;
  private producer!: MediasoupTypes.Producer;
  private transport!: MediasoupTypes.Transport;
  public producers: string[] = [];
  public eventID = '';
  public currentStream = '';
  private connected = false;
  @ViewChild('remote_video') remoteVideo!: ElementRef<HTMLVideoElement>;

  async emitEvent(event: string, data: any): Promise<any> {
    // console.log("emitEvent: ", event, data);
    return new Promise((resolve, reject) => {
      let done = false;
      this.socket.emit(event, data, (response: any) => {
        // console.log("emitEventResponse: ", event, response);
        if (response.error) {
          done = true;
          console.error(response.error);
          reject(response.error);
        } else {
          done = true;
          resolve(response);
        }
      });
      setTimeout(()=>{
        if(!done){
          // console.log(event, " did not complete in 500ms, assuming empty response");
          resolve(null);
        }
      }, 500);
    });
  }

  async nextStream(){
    const index = this.producers.indexOf(this.currentStream);
    this.currentStream = this.producers[(index+1)%this.producers.length];
    // this.remoteVideo.nativeElement.srcObject = null;
    if(!this.currentStream){
      this.currentStream = '';
      return;
    }
    if(this.transport){
      this.consume(this.transport);
    }
    else{
      this.subscribe();
    }
  }

  async prevStream(){
    const index = this.producers.indexOf(this.currentStream);
    this.currentStream = this.producers[(index-1+this.producers.length)%this.producers.length];
    // this.remoteVideo.nativeElement.srcObject = null;
    if(!this.currentStream){
      this.currentStream = '';
      return;
    }
    if(this.transport){
      this.consume(this.transport);
    }
    else{
      this.subscribe();
    }
  }

  async getUserMedia(transport: MediasoupTypes.Transport, isWebcam: boolean) {
    if (!this.device.canProduce('video')) {
      return;
    }

    let stream;
    try {
      stream = isWebcam ?
        await navigator.mediaDevices.getUserMedia({ video: true }) :
        await navigator.mediaDevices.getDisplayMedia({ video: true });
    } catch (err: any) {
      console.error('getUserMedia() failed:', err?.message);
      throw err;
    }
    return stream;
  }

  async connect() {
    this.socket = new Socket({
      url: '/',
      options: {
        path: '/api/ws',
        transports: ['websocket'],
      },
    });
    this.socket.connect();

    
    this.socket.on('connect', async () => {
      this.emitEvent('connection', { eventID: this.eventID});
      await this.emitEvent('getRouterRtpCapabilities', null).then(async (data: any) => {
        await this.loadDevice(data!);
        // .then(() => console.log("Device loaded"))
      });
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection failed:', error);
    });
  
    this.socket.fromEvent('producers').subscribe((data:any)=>{
      this.producers = data;
      this.updateCurrentStream();
    });
  }

  updateCurrentStream(){
    const data = this.producers;
    if(!this.connected){
      this.currentStream = '';
      return;
    }
    this.producers = data;
    if(this.producers.length <= 0){
      this.currentStream = '';
      return;
    }
    if(this.producers.filter((p:string)=>p===this.currentStream).length === 0){
      this.currentStream = '';
      this.remoteVideo.nativeElement.srcObject = null;
      this.remoteVideo.nativeElement.hidden = true;
    }
    if(this.currentStream === '' && this.producers.length > 0){
      this.currentStream = this.producers[0];
      // this.subscribe();
      if(this.transport){
        this.remoteVideo.nativeElement.hidden = false;
        this.consume(this.transport);
      }
      else{
        this.remoteVideo.nativeElement.hidden = false;
        this.subscribe();
      }
    }
  }

  async loadDevice(routerRtpCapabilities: MediasoupTypes.RtpCapabilities) {
    try {
      this.device = new Device();
    } catch (error: any) {
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
      else{
        console.error(error);
      }
    }
    await this.device.load({ routerRtpCapabilities });
    this.connected = true;
    this.updateCurrentStream();
  }

  async publish(e: any) {
    const isWebcam = (e.target.id === 'btn_webcam');

    const data: any = await this.emitEvent('createProducerTransport', {
      forceTcp: false,
      rtpCapabilities: this.device.rtpCapabilities,
    })
    if (data.error) {
      console.error(data.error);
      return;
    }
  
    const transport = this.device.createSendTransport(data);
    this.transport = transport;

    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      // console.log("TRANSPORT CONNECT EVENT");
      this.emitEvent('connectProducerTransport', { dtlsParameters })
        .then(callback)
        .catch((err:any)=>{
          console.error(err);
          errback(err);
        });
    });
  
    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      // console.log("TRANSPORT PRODUCE EVENT");
      try {
        const { id } = await this.emitEvent('produce', {
          transportId: transport.id,
          kind,
          rtpParameters,
        });
        callback({ id });
      } catch (err: any) {
        console.error(err);
        errback(err);
      }
    });
  
    transport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          // this.fsSubscribe.nativeElement.disabled = true;
        break;
  
        case 'connected':
          // this.fsSubscribe.nativeElement.disabled = false;
        break;
  
        case 'failed':
          // transport.close();
          // this.fsSubscribe.nativeElement.disabled = true;
        break;
  
        default: break;
      }
    });
  
    let stream : MediaStream;
    try {
      stream = await this.getUserMedia(transport, isWebcam) as MediaStream;
      if(!stream) {
        return;
      }
      const track = stream.getVideoTracks()[0];
      const params: any = { track };
      this.producer = await transport.produce(params);
    } catch (err) {
      console.error(err);
    }
  }

  async subscribe() {
    const data = await this.emitEvent('createConsumerTransport', {
      forceTcp: false,
    });
    if (data.error) {
      console.error(data.error);
      return;
    }
  
    const transport = this.device.createRecvTransport(data);
    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
      this.emitEvent('connectConsumerTransport', {
        transportId: transport.id,
        dtlsParameters
      })
        .then(callback)
        .catch((err:any)=>{
          console.error(err);
          errback(err);
        });
    });
  
    transport.on('connectionstatechange', async (state) => {
      switch (state) {
        case 'connecting':
          // this.fsSubscribe.nativeElement.disabled = true;
          break;
  
        case 'connected':
          this.remoteVideo.nativeElement.srcObject = await stream;
          this.remoteVideo.nativeElement.hidden = false;
          await this.emitEvent('resume', null);
          this.remoteVideo.nativeElement.play();
          // this.fsSubscribe.nativeElement.disabled = true;
          break;
  
        case 'failed':
          transport.close();
          // this.fsSubscribe.nativeElement.disabled = false;
          break;
  
        default: break;
      }
    });
  
    const stream = this.consume(transport);
  }

  async consume(transport: MediasoupTypes.Transport) {
    const { rtpCapabilities } = this.device;
    const data = await this.emitEvent('consume', { rtpCapabilities, producerId: this.currentStream});
    const {
      producerId,
      id,
      kind,
      rtpParameters,
    } = data;
  
    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    return stream;
  }
}
