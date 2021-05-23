const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const bundleFileName = 'bundle';
const dirName = 'wwwroot/dist';

module.exports = (env, argv) => {
    return {
        mode: argv.mode === "production" ? "production" : "development",
        devtool: argv.mode === "production" ? 'hidden-source-map' : 'source-map',
        entry: [
            './node_modules/jquery/dist/jquery.js',
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
        module: {
            rules: [
                {
                    test: require.resolve("jquery"),
                    loader: "expose-loader",
                    options: {
                        exposes: ["$", "jQuery"],
                    },
                },
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
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                }
            ]
        },
        optimization: {
            minimize: true,
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                `...`,
                new CssMinimizerPlugin(),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: bundleFileName + '.css'
            })
        ]
    }
};
