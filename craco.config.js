const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        assert: 'assert',
        buffer: 'buffer',
        console: 'console-browserify',
        crypto: 'crypto-browserify',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify/browser',
        process: 'process/browser',
        stream: 'stream-browserify',
        url: 'url',
        querystring: 'querystring-es3',
      };

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ]);

      return webpackConfig;
    },
  },
};
