const defaultNextConfig = require("@rcpswap/nextjs-config");

module.exports = {
  ...defaultNextConfig,
  transpilePackages: ["@rcpswap/wagmi"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
