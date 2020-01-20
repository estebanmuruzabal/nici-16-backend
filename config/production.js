// Base configuration
import config from './development';

// Override configurations for Production environment
//config.app.routePrefix = '/api';
config.logs.folder = '/var/log';
config.logs.streams = [
    {
        level: 'info',
        path: config.logs.folder + '/atlas.log'
    }
];
config.uploads.folder = '/uploads';
config.uploads.baseUrl = 'tienda765.com/files';
config.storefront.baseUrl = 'http://tienda765.com';
config.switchPayments.baseUrl = 'http://api.switchpayments.com/v2';

// Export
export default config;
