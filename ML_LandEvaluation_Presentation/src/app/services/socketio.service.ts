import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable()
export class SocketIOService {

    socket;
    private socketEndPoint: string = 'http://localhost:3600';

    constructor() { }
    setupSocketConnection(onComplete: Subject<number>) {
        this.socket = io(this.socketEndPoint);
        this.socket.emit('my message', 'Hello there from Angular.');
        this.socket.on('my broadcast', (data) => {
            console.log(data.server.loss);
            onComplete.next(data.server.loss);
        });
    }

}