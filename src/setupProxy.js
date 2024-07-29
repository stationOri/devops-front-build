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
};

// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: `${process.env.REACT_APP_API_URI}`,
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '/api',
//       },
//     })
//   );
// };