const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = function() {
    return {
        entry: './src/index.js',
        output: {
            filename: 'ng-augment-native-scroll.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'ng-augment-native-scroll',
            libraryTarget: 'umd'
        },
        target: 'node',
        externals: 'angular'
    };
}
