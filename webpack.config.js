const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'ngAugmentNativeScroll.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: 'node',
    externals: 'angular',
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
};
