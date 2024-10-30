const PROXY_CONFIG = [
    {
        context: ['/api'],
        target: 'http://10.113.130.39:3000/',
        secure: false,
        logLevel: 'debug',
        pathRewrite: {'^/api': ''}
    }
];

module.exports = PROXY_CONFIG;