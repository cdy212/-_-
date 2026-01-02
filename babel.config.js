module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"], // 경로 기준이 될 루트 폴더 (src 폴더를 기준으로 하겠다)
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"], // 지원할 확장자
          alias: {
            "@components": "../components", // @components는 src/components를 가리킴
            //"@screens": "./src/screens", // @screens는 src/screens를 가리킴
            // "@utils": "./src/utils", // @utils는 src/utils를 가리킴
          },
        },
      ],
    ],
  };
};
