// Base configuration
import config from './development';

// Override configurations for Production environment
// config.app.routePrefix = '/api';
config.logs.folder = '/var/log';
config.logs.streams = [
    {
        level: 'info',
        path: config.logs.folder + '/atlas.log'
    }
];
config.uploads.folder = path.join(process.cwd(), 'uploads');
config.uploads.baseUrl = 'http://ringomotos.com';
config.storefront.baseUrl = 'http://ringomotos.com';
config.switchPayments.baseUrl = 'http://api.switchpayments.com/v2';

// Export
export default config;
