import EventEmitter from 'events';
import { processTokens } from './controllers/token.controller';
import { IActivity } from './types';

const eventEmitter = new EventEmitter();

eventEmitter.on('newEvent', (data: IActivity) => processTokens(data));

export default eventEmitter;
