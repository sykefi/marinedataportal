module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/merihavainnot/'
    : '/',
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: {
        port: 8080,
      }
    },
  },
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
