const path = require('path');

module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            querystring: path.resolve(__dirname, 'node_modules/querystring-es3'),
        },
    };
    return config;
};
