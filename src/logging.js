import Bunyan from 'bunyan';
import config from './config';

export default Bunyan.createLogger({
    name: 'ringomotos',
    streams: config.logs.streams
});
