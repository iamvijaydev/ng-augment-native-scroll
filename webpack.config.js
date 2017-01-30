var webpack = require('webpack');
var fs = require('fs');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        filename: __dirname + '/dist/ngAugmentNativeScroll.js',
        library: 'ngAugmentNativeScroll',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
    ],
    progress: true,
    profile: true,
    colors: true
};
