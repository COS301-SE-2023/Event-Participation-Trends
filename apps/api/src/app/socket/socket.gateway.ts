import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketServiceService as SocketService } from './socket-service.service';
import { Logger } from '@nestjs/common';
import { types as MediasoupTypes } from 'mediasoup';

@WebSocketGateway({path: '/api'})
export class SocketGateway implements OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  constructor(private readonly appService: SocketService) { 
  }

  handleDisconnect(client: any) {
    this.appService.users.delete(client.id);
    this.server.emit('producers', this.getProducers());
  }

  @SubscribeMessage('chat')
  chat(client: Socket, payload:any){
    Logger.debug(`Client chat: ${client.id}`);
    client.broadcast.emit('chat', payload);
    return '';
  }

  getProducers() {
    const producers = [];
    this.appService.users.forEach((user)=> {
      if(user.producer){
        producers.push(user.producer.id);
      }
    })
    Logger.debug('announcing new producers');
    // this.server.emit('producers', producers);
    return producers;
  }

  @SubscribeMessage('connection')
  connection(client: Socket, payload: any) {
    Logger.debug(`Client connected: ${client.id}`);
    if (this.appService.users.size > 0) {
      const producers = [];
      this.appService.users.forEach((user)=> {
        if(user.producer){
          producers.push(user.producer);
        }
      });
      client.emit('producers', this.getProducers());
    }
    return '';
  }

  @SubscribeMessage('disconnect')
  disconnect(client: Socket, payload: any) {
    Logger.debug(`Client disconnected: ${client.id}`);
    this.appService.users.delete(client.id);
    return '';
  }

  @SubscribeMessage('connect_error')
  connect_error(client: Socket, payload: any) {
    Logger.debug(`Client connect error: ${client.id}`);
    this.appService.users.delete(client.id);
    return '';
  };

  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities(client: Socket, payload: any) {
    Logger.debug(`Client getRouterRtpCapabilities: ${client.id}`);
    return this.appService.getRouterRtpCapabilities();
  }

  @SubscribeMessage('createProducerTransport')
  async createProducerTransport(client: Socket, payload: any) {
    Logger.debug(`Client createProducerTransport: ${client.id}`);
    try {
      const { params } = await this.appService.createWebRtcTransport(client);
      return params;
    } catch (err) {
      Logger.error(err);
      return { error: err.message };
    }
  };

  @SubscribeMessage('createConsumerTransport')
  async createConsumerTransport(client: Socket, payload: any) {
    Logger.debug(`Client createConsumerTransport: ${client.id}`);
    try {
      const { params } = await this.appService.createWebRtcTransport(client);
      return params;
    } catch (err) {
      Logger.error(err);
      return { error: err.message };
    }
  };

  @SubscribeMessage('connectProducerTransport')
  async connectProducerTransport(client: Socket, payload: any) {
    Logger.debug(`Client connectProducerTransport: ${client.id}`);
    await this.appService.users.get(client.id).transport.connect({ dtlsParameters: payload.dtlsParameters });
    return '';
  };

  @SubscribeMessage('connectConsumerTransport')
  async connectConsumerTransport(client: Socket, payload: any) {
    Logger.debug(`Client connectConsumerTransport: ${client.id}`);
    let consumerTransport: MediasoupTypes.Transport;
    this.appService.users.forEach(async (user) => {
      if (user?.transport?.id === payload.transportId) {
        consumerTransport = user.transport;
      }
    })
    await consumerTransport.connect({ dtlsParameters: payload.dtlsParameters });
    return '';
  };

  @SubscribeMessage('produce')
  async produce(client: Socket, payload: any) {
    Logger.debug(`Client produce: ${client.id}`);
    const { kind, rtpParameters } = payload;
    const producer = await (this.appService.users.get(client.id).transport).produce({ kind, rtpParameters });
    this.appService.users.get(client.id).producer = producer;
    // client.broadcast.emit('newProducer');
    this.server.emit('producers', this.getProducers());
    return { id: producer.id };
  };

  @SubscribeMessage('consume')
  async consume(client: Socket, payload: any) {
    Logger.debug(`Client consume: ${client.id}`);
    let producer;
    this.appService.users.forEach((user)=>{
      if(user?.producer?.id === payload.producerId){
        producer = user.producer;
      }
    });
    return await this.appService.createConsumer(client, producer?.id, payload.rtpCapabilities);
  };

  @SubscribeMessage('resume')
  async resume(client: Socket) {
    Logger.debug(`Client resume: ${client.id}`);
    await this.appService.users.get(client.id).consumer.resume();
  };
}
