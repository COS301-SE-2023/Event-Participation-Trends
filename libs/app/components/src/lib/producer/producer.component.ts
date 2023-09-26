import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { types as MediasoupTypes, Device } from 'mediasoup-client';
import { Socket } from 'ngx-socket-io'

@Component({
  selector: 'event-participation-trends-producer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css'],
})
export class ProducerComponent implements AfterViewInit {
  private device!: Device;
  private socket!: Socket;
  private producer!: MediasoupTypes.Producer;
  public eventID = '';
  @ViewChild('fs_publish') fsPublish!: ElementRef<HTMLFieldSetElement>;
  @ViewChild('btn_webcam') btnWebcam!: ElementRef<HTMLButtonElement>;
  @ViewChild('btn_screen') btnScreen!: ElementRef<HTMLButtonElement>;
  @ViewChild('webcam_status') txtWebcam!: ElementRef<HTMLSpanElement>;
  @ViewChild('screen_status') txtScreen!: ElementRef<HTMLSpanElement>;
  @ViewChild('local_video') localVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
   if (typeof navigator?.mediaDevices?.getDisplayMedia === 'undefined') {
      this.txtScreen.nativeElement.innerHTML = 'Not supported';
      this.btnScreen.nativeElement.disabled = true;
    }
    // this.connect();
    this.btnWebcam.nativeElement.addEventListener('click', this.publish.bind(this));
    this.btnScreen.nativeElement.addEventListener('click', this.publish.bind(this));
    // window.localStorage.setItem('debug', 'mediasoup-client:*');
  }

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

  async getUserMedia(transport: MediasoupTypes.Transport, isWebcam: boolean) {
    if (!this.device.canProduce('video')) {
      return;
    }

    let stream;
    try {
      stream = isWebcam ?
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false }) :
        await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
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
      this.emitEvent('connection', {
        eventID: this.eventID
      });
      this.fsPublish.nativeElement.disabled = false;

      await this.emitEvent('getRouterRtpCapabilities', null).then(async (data: any) => {
        await this.loadDevice(data!);
        // .then(() => console.log("Device loaded"))
      });
    });
  
    this.socket.on('disconnect', () => {
      this.fsPublish.nativeElement.disabled = true;
    });
  
    this.socket.on('connect_error', (error: any) => {
      console.error('Connection failed:', error);
    });
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
          this.fsPublish.nativeElement.disabled = true;
        break;
  
        case 'connected':
          this.localVideo.nativeElement.hidden = false;
          this.localVideo.nativeElement.srcObject = stream;
          this.fsPublish.nativeElement.disabled = true;
        break;
  
        case 'failed':
          transport.close();
          this.fsPublish.nativeElement.disabled = false;
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
      // if (this.chkSimulcast.nativeElement.checked) {
        // Add commented parts back if simulcast is needed
      // params.encodings = [
      //   { maxBitrate: 100000 },
      //   { maxBitrate: 300000 },
      //   { maxBitrate: 900000 },
      //   // { maxBitrate: 1200000 },
      //   // { maxBitrate: 1500000 },
      //   // { maxBitrate: 1700000 },
      // ];
      params.codecOptions = {
        videoGoogleStartBitrate : 1000
      };
      // }
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
        case 'connected':
          await this.emitEvent('resume', null);
          break;
        default: break;
      }
    });
  
    const stream = this.consume(transport);
  }

  async consume(transport: MediasoupTypes.Transport) {
    const { rtpCapabilities } = this.device;
    const data = await this.emitEvent('consume', { rtpCapabilities });
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
