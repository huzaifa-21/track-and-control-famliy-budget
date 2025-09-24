module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
            "@components": "./components",
            "@config": "./config",
            "@constants": "./constants",
            "@context": "./context",
            "@hooks": "./hooks",
            "@interfaces": "./interfaces",
            "@services": "./services",
            "@types": "./types",
            "@utils": "./utils",
            "@firebase": "./node_modules/@firebase",
          },
        },
      ],
    ],
  };
};
