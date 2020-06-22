require('dotenv').config();
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const webpack = require('webpack');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const {
  shopifyApiKey,
  debugMode,
  amplitudeApiKey,
  dev,
} = require('./server/config');

function HACK_removeMinimizeOptionFromCssLoaders(config) {
  console.warn(
    'HACK: Removing `minimize` option from `css-loader` entries in Webpack config',
  );
  config.module.rules.forEach((rule) => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach((useItem) => {
        if (useItem.loader === 'css-loader' && useItem.options) {
          delete useItem.options.minimize;
        }
      });
    }
  });
}

const apiKey = JSON.stringify(shopifyApiKey);
const amplitudeKey = JSON.stringify(amplitudeApiKey);
module.exports = withCSS(
  withSass(
    withFonts(
      withImages({
        webpack: (config) => {
          HACK_removeMinimizeOptionFromCssLoaders(config);
          const env = {
            API_KEY: apiKey,
            DEBUG_MODE: debugMode,
            AMPLITUDE_API_KEY: amplitudeKey,
            DEV_MODE: dev,
          };

          const newEntry = async () => {
            try {
              const entry = await config.entry();
              return {
                ...entry,
                // './static/widget.js': './widget'
              };
            } catch (err) {
              return {};
            }
          };

          return {
            ...config,
            entry: newEntry,
            plugins: [...config.plugins, new webpack.DefinePlugin(env)],
            node: {
              fs: 'empty',
            },
          };
        },
      }),
    ),
  ),
);
