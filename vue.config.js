module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8080,
    public: "0.0.0.0:8080"
  },
  publicPath: "./",
  // https://github.com/vuejs/vue-cli/issues/4053#issuecomment-544641072
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      const scssRule = config.module.rule('scss');
      scssRule.uses.clear();
      scssRule
        .use('null-loader')
        .loader('null-loader');
    }
  },
};
