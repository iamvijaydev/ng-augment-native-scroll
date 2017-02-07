const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.base.js');

module.exports = function(env) {
    return webpackMerge(commonConfig(), {
        plugins: [
            new webpack.BannerPlugin({
                banner: `v${require('./package.json').version}\n\n${fs.readFileSync('./LICENSE', 'utf8')}`,
                raw: false,
                entryOnly: true
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, '/'),
            publicPath: '/dist/',
            inline: false,
            compress: true,
            port: 3000
        }
    });
}
