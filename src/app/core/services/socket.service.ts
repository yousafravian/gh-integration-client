import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable( {
  providedIn: 'root',
} )
export class SocketService {

  #socket: Socket;

  constructor() {
    this.#socket = io( "ws://localhost:3000", {
      transports: [ 'websocket' ],
    } );
  }

  on( event: string, callback: ( data: any ) => void ) {
    this.#socket.on( event, callback );
  }


}
