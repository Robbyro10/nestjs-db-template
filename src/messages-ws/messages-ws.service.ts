import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io/dist/socket';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
    private connectedClients: ConnectedClients = {}

    registerClient( client: Socket ) {
        this.connectedClients[client.id] = client;
    }

    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients );
    }
}
