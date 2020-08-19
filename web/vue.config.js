const devConfig = {
  configureWebpack: {
    devtool: "source-map",
  },
};

const prodConfig = {
  publicPath: "/gbf-raid-finder/",
  configureWebpack: {
    resolve: {
      alias: {
        moment: "moment/src/moment",
      },
    },
  },
};

module.exports = {
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
};
