const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const bundleFileName = 'bundle';
const dirName = 'wwwroot/dist';

module.exports = (env, argv) => {
	return {
		mode: argv.mode === "production" ? "production" : "development",
		devtool: argv.mode === "production" ? 'hidden-source-map' : 'source-map',
		entry: [
			'./node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js',
			'./node_modules/bootstrap/dist/js/bootstrap.bundle.js',
			'./wwwroot/js/site.js',
			'./wwwroot/scss/site.scss'
		],
		output: {
			filename: bundleFileName + '.js',
			path: path.resolve(__dirname, dirName),
			clean: true
		},
		externals: { jquery: 'jQuery'},
		module: {
			rules: [
				{
					test: /\.s[c|a]ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{ loader: 'css-loader', options: { sourceMap: true } },
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: function () {
										let plugins = [require('autoprefixer')];
										if (argv.mode === "production") {
											plugins.push(require('cssnano'));
										}
										return plugins;
									}
								},
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader', options: {
								sourceMap: true,
								// Prefer `dart-sass`
								implementation: require("sass")
							}
						},
					]
				}
			]
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: true,
					//exclude: /\/excludes/,
					terserOptions: {
						mangle: true,
						//ie8: false,
						//safari10: false
					}
				}),
				new CssMinimizerPlugin()
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: bundleFileName + '.css'
			}),
			new CleanWebpackPlugin()
		]
	}
};
