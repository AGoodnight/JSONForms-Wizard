/* config-overrides.js */

const { override } = require("customize-cra");

module.exports = {
  webpack: override((config) => {
    // May need to be changed when one updates create-react-app
    config.module.rules[1].oneOf[4].options.ignore = [
      "./node_modules/mapbox-gl/dist/mapbox-gl.js",
    ];

    return config;
  }),
};
