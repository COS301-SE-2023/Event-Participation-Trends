import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Socket } from 'socket.io';
import { types as MediasoupTypes, createWorker } from 'mediasoup'
import * as dns from 'dns';

interface User {
    socket: Socket,
    producer: MediasoupTypes.Producer,
    consumer: MediasoupTypes.Consumer,
    transport: MediasoupTypes.Transport,
}

@Injectable()
export class SocketServiceService {
  private worker: MediasoupTypes.Worker;
  private router: MediasoupTypes.Router;
  public users: Map<string, User>;
  
  constructor() {
    this.users = new Map<string, User>();
  }

  getRouterRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async onModuleInit() {
    this.worker = await createWorker({
      logLevel: 'debug',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
      ],
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });
  
    this.worker.on('died', () => {
      Logger.error('mediasoup worker died, exiting [pid:%d]', this.worker.pid);
      process.exit(1);
    });
  
    this.router = await this.worker.createRouter( {
      mediaCodecs: [
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters:
            {
              'x-google-start-bitrate': 1000
            }
        },
        {
          kind: 'video',
          mimeType: 'video/H264',
          clockRate: 90000,
          parameters: {
            'profile-level-id': '42e01f',
            'packetization-mode': 1,
          }
        },
      ]
    });
    Logger.debug('Done creating router');
  }

  async createWebRtcTransport(client: Socket){
    Logger.debug(`Client createWebRtcTransport: ${client.id}`);
    const maxIncomingBitrate = 1500000;
    const initialAvailableOutgoingBitrate = 1000000;

    const transport = await this.router.createWebRtcTransport({
      listenIps: [{
        ip: '0.0.0.0',
        announcedIp: '192.168.0.194' // to be replaced with public ip of server.
      }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {
        Logger.error(error);
      }
    }
    if(!this.users.has(client.id)){
      this.users.set(client.id, {
        socket: client,
        producer: null,
        consumer: null,
        transport: transport,
      });
    }
    else{
      this.users.get(client.id).transport = transport;
    }

    return {
      transport,
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      },
    };
  }

  async createConsumer(client: Socket, producerId: string, rtpCapabilities: MediasoupTypes.RtpCapabilities) {
    Logger.debug(`Client createConsumer: ${client.id}`);
    let producer: MediasoupTypes.Producer<MediasoupTypes.AppData>;
    this.users.forEach((user) => {
      if(user?.producer?.id === producerId){
        producer = user.producer;
      }
    });
    if (!producer) {
      Logger.error('producer not found');
      return;
    }
    if (!this.router.canConsume(
      {
        producerId: producer.id,
        rtpCapabilities,
      })
    ) {
      Logger.error('Cannnot consume');
      return;
    }
    let consumer;
    try {
      consumer = await this.users.get(client.id).transport.consume({
        producerId: producer.id,
        rtpCapabilities,
        paused: producer.kind === 'video',
      });
    } catch (error) {
      Logger.error('Consume failed', error);
      return;
    }
  
    if (consumer.type === 'simulcast') {
      Logger.debug('simulcast true');
      await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
    }

    if(!consumer){
      Logger.error('consumer is null');
      return;
    }

    if(!this.users.has(client.id)){
      this.users.set(client.id, {
        socket: client,
        producer: null,
        consumer: consumer,
        transport: null,
      });
    }
    else{
      this.users.get(client.id).consumer = consumer;
    }
  
    return {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused
    };
  }

}
