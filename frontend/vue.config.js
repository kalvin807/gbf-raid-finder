const devConfig = {
  configureWebpack: {
    devtool: "source-map",
  },
};

const prodConfig = {
  publicPath: "/gbf-raid-finder/",
};

module.exports = {
  ...(process.env.NODE_ENV === "production" ? devConfig : prodConfig),
};
