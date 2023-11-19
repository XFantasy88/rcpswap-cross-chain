/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  eslint: {
    dirs: [
      // ...
      "app",
      "components",
      "functions",
      "lib",
      "pages",
      "providers",
      "types",
      "ui",
    ],
  },
  webpack: (config, { webpack }) => {
    if (config.plugins) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        })
      );
    }
    // Ignore import trace warnings from graphclient & sentry
    config.ignoreWarnings = [
      {
        module: /node_modules\/@graphql-mesh\/utils\/esm\/defaultImportFn\.js/,
      },
      { file: /node_modules\/@graphql-mesh\/utils\/esm\/defaultImportFn\.js/ },
      {
        module: /node_modules\/@sentry\/utils\/esm\/index\.js/,
      },
      { file: /node_modules\/@sentry\/utils\/esm\/index\.js/ },
      {
        module: /node_modules\/@sentry\/utils\/esm\/isBrowser\.js/,
      },
      { file: /node_modules\/@sentry\/utils\/esm\/isBrowser\.js/ },
      {
        module: /node_modules\/@whatwg-node\/fetch\/dist\/node-ponyfill\.js/,
      },
      { file: /node_modules\/@whatwg-node\/fetch\/dist\/node-ponyfill\.js/ },
    ];
    return config;
  },
};

module.exports = defaultNextConfig;
