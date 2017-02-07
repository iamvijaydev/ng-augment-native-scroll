const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

module.exports = function() {
    return {
        entry: './examples/scripts/index.js',
        output: {
            filename: 'exampleApp.bundle.js',
            path: path.resolve(__dirname, 'examples/scripts'),
        },
        target: 'node',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            }),
            new webpack.BannerPlugin({
                banner: `v${require('./package.json').version}\n\n${fs.readFileSync('./LICENSE', 'utf8')}`,
                raw: false,
                entryOnly: true
            })
        ]
    };
}
