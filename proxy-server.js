// proxy-server.js
const cors_proxy = require("cors-anywhere");

// 8080 포트로 프록시 서버 실행
cors_proxy
  .createServer({
    originWhitelist: [], // 모든 출처 허용
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(8082, "0.0.0.0", () => {
    console.log("Running CORS Anywhere on http://10.70.206.4:8082");
  });
