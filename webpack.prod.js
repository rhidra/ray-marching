const webpackCommon = require('./webpack.common');

const glsl = webpackCommon.module.rules.find(r => r.use?.loader === 'webpack-glsl-minify');
glsl.use.options.preserveAll = false;
glsl.use.options.disableMangle = false;

module.exports = {
  ...webpackCommon,
  mode: "production",
};