const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
	    // 对客户端构建进行优化
	    if (!isServer) {
	      config.optimization.splitChunks = {
	        chunks: 'all',
	        maxInitialRequests: Infinity,
	        minSize: 0,
	        cacheGroups: {
	          vendor: {
	            test: /[\\/]node_modules[\\/]/,
	            name(module) {
	              // 获取包名
	              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
	              // npm 包名可能包含 @，我们需要替换掉
	              return `npm.${packageName.replace('@', '')}`;
	            },
	          },
	        },
	      };
	    }
	    return config;
        },

	staticPageGenerationTimeout: 1000,
	images: {
		unoptimized: true, // for cloudflare pages
		domains: ['icons.llama.fi', 'assets.coingecko.com', 'icons.llamao.fi']
	},
	compiler: {
		styledComponents: true
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*'
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET'
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-Requested-With, content-type, Authorization'
					}
				]
			}
		];
	},
	experimental: {}
};

module.exports = withBundleAnalyzer(nextConfig);
