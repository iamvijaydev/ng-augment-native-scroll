var webpack = require('webpack');

module.exports = {
    context: __dirname + '/src',
    entry: {
        'ngAugmentNativeScroll.min': './index.js',
    },
    output: {
        path: __dirname + '/release',
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
    devtool: 'source-map'
};
