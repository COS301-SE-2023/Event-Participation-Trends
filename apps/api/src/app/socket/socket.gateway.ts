import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketServiceService as SocketService } from './socket-service.service';
import { Logger } from '@nestjs/common';
import { types as MediasoupTypes } from 'mediasoup';
import { EventService } from '@event-participation-trends/api/event/feature';

@WebSocketGateway({path: '/api/ws'})
export class SocketGateway implements OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly appService: SocketService,
    private readonly eventService: EventService,
    ) { 
  }

  handleDisconnect(client: any) {
    const eventID = this.appService.users.get(client.id)?.eventID;
    const user = this.appService.users.get(client.id);
    if(user?.transport){
      user?.transport?.close();
    }
    this.appService.users.delete(client.id);
    this.server.to(eventID).emit('producers', this.getProducers(eventID));
  }

  getProducers(eventID: string) {
    const producers = [];
    this.appService.users.forEach((user)=> {
      if(user.producer && user.eventID === eventID){
        producers.push(user.producer.id);
      }
    })
    return producers;
  }

  @SubscribeMessage('message')
  message(client: Socket, payload: any){
    const eventId = this.appService.users.get(client.id).eventID;
    Logger.debug(eventId);
    this.eventService.addEventChatMessage({
        eventId: eventId,
        messagePacket: payload,
    });
    this.server.to(this.appService.users.get(client.id).eventID).emit('message', payload);
  }

  @SubscribeMessage('connection')
  connection(client: Socket, payload: any) {
    Logger.debug(`Client connected: ${client.id}`);
    this.appService.users.set(client.id, {
      consumer: null,
      producer: null,
      socket: client,
      transport: null,
      eventID: payload?.eventID || "",
    });
    client.join(payload?.eventID || "");
    if (this.appService.users.size > 0) {
      const producers = [];
      this.appService.users.forEach((user)=> {
        if(user.producer){
          producers.push(user.producer);
        }
      });
      client.emit('producers', this.getProducers(this.appService.users.get(client.id).eventID));
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
    const eventID = this.appService.users.get(client.id).eventID;
    this.server.to(eventID).emit('producers', this.getProducers(eventID));
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
