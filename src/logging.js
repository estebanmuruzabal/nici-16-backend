import Bunyan from 'bunyan';
import config from './config';

export default Bunyan.createLogger({
    name: 'tienda765',
    streams: config.logs.streams
});
