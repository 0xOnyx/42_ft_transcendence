import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
    constructor(private eventEmitter: EventEmitter2) {}
    create() : string
     {
        this.eventEmitter.emit(
            'game.create',
            {
              actionId: 1,
              payload: {},
            },
        );

        return "created";
    }
}