import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SocketIOService {

    socket;

    constructor() { }
    setupSocketConnection(onComplete: Subject<number>) {
        this.socket = io(environment.coreServiceUrl, {
            transports: ['websocket'],
            secure: true
        });
        //this.socket.emit('my message', 'Hello there from Minecraft.');
        this.socket.on('my broadcast', (data) => {
            console.log(data.server.loss);
            onComplete.next(data.server.loss);
        });
    }

}