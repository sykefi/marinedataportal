const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: {
        port: 8080,
      }
    },
    plugins: [new ESLintPlugin()],
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
