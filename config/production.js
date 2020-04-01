// Base configuration
import config from './development';

// Override configurations for Production environment
config.app.routePrefix = '/api';
config.logs.folder = '/var/log';
config.logs.streams = [
    {
        level: 'info',
        path: config.logs.folder + '/atlas.log'
    }
];
config.uploads.folder = '/uploads';
config.uploads.baseUrl = 'http://ec2-18-228-42-125.sa-east-1.compute.amazonaws.com';
config.storefront.baseUrl = 'http://ec2-18-228-42-125.sa-east-1.compute.amazonaws.com';
config.switchPayments.baseUrl = 'http://api.switchpayments.com/v2';

// Export
export default config;
