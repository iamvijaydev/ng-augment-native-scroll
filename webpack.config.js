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
    devtool: 'inline-source-map',
    progress: true,
    profile: true,
    colors: true
};
