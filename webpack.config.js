module.exports = {
    context: __dirname + '/src',
    entry: {
        'ngAugmentNativeScroll': './index.js'
    },
    output: {
        path: __dirname + '/release',
        filename: '[name].js'
    }
};
