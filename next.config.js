const path = require('path');

module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, 'public/styles')],
	},
	webpack: (config) => {
		config.experiments = { ...config.experiments, topLevelAwait: true };
		return config;
	}
};