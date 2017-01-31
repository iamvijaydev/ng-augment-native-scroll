var webpack = require('webpack');
var fs = require('fs');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        filename: __dirname + '/dist/ngAugmentNativeScroll.js'
    },
    target: 'node',
    externals: 'angular',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules|bower_components/,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.BannerPlugin( 'v' + require('./package.json').version + '\n\n' + fs.readFileSync('./LICENSE', 'utf8'))
    ],
    progress: true,
    profile: true,
    colors: true
};
