module.exports = {
	apps: [
		{
			name: 'rad-backend',
			exec_mode: 'cluster',
			instances: 1,
			script: './dist/main.js',
			args: 'start',
		},
	],
};
