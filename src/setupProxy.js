const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/vwapi",
    createProxyMiddleware({
      target: "https://api.vworld.kr",
      changeOrigin: true,
      pathRewrite: {
        "^/vwapi": "",
      },
    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://waitmate.shop',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    })
  );
};