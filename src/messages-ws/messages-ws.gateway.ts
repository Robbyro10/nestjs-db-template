import { ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log('Client connected: ', client.id);
    this.messagesWsService.registerClient(client);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected: ', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(@MessageBody() client: Socket, payload: NewMessageDto) {
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no message'
    // });

    // client.broadcast.emit('message-from-server', {
    //     fullName: 'Soy yo',
    //     message: payload.message || 'no message'
    // });

    this.wss.emit('message-from-server', {
      fullName: 'Soy yo',
      client
    });
  }
}
