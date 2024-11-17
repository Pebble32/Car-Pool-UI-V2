const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const fallback = webpackConfig.resolve.fallback || {};
      Object.assign(fallback, {
        "assert": require.resolve("assert"),
        "buffer": require.resolve("buffer"),
        "console": require.resolve("console-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "process": require.resolve("process/browser"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url"),
        "querystring": require.resolve("querystring-es3"), // Add this line
      });
      webpackConfig.resolve.fallback = fallback;

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
