module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/merihavainnot/' : '/',
  devServer: {
    allowedHosts: 'all',
  },
};
