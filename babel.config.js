module.exports = function(api) {
  let presets = ['@vue/app'];
  api.cache(true);

  return {
    presets,
    plugins: [
      "@babel/plugin-transform-modules-commonjs"
    ],
    sourceType: 'unambiguous'
  };
};
