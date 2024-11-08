/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");
const allowedOrigins = [
  "https://api-v2-mumbai.lens.dev/",
  "https://api-v2.lens.dev/",
  "https://thedial.infura-ipfs.io",
  "https://gateway-arbitrum.network.thegraph.com/",
  "https://arweave.net/",
  "https://gw.ipfs-lens.dev",
  "https://hey.xyz",
  "https://livepeer.studio/api/",
];

const nextConfig = {
  reactStrictMode: true,
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thedial.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
    unoptimized: true,
  },
  async headers() {
    let headersConfig = [];

    allowedOrigins.forEach((origin) => {
      headersConfig.push({
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: origin,
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      });
    });

    return headersConfig;
  },
  rewrites() {
    return [
      {
        source: "/:lang(en|es|ar)/:path*",
        destination: "/:path*",
      },
    ];
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [path.resolve(__dirname, "node_modules/kinora-sdk")],
      use: [options.defaultLoaders.babel, { loader: "ts-loader" }],
    });

    // config.resolve.fallback = {
    //   fs: false,
    //   net: false,
    //   tls: false,
    //   buffer: require.resolve("buffer/"),
    //   "core-js/modules/es.array.map.js": require.resolve(
    //     "core-js/es/array/map"
    //   ),
    // };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
