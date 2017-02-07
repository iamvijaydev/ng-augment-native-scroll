'use strict';

var angular = require('angular');

angular.module('exampleApp', [require('../../dist/ng-augment-native-scroll.js')])
    .factory('exampleAppUtils', require('./exampleAppUtils.factory.js'))
    .controller('connectScrollsExample', require('./connectScrollsExample.controller.js'))
    .controller('kineticScrollExample', require('./kineticScrollExample.controller.js'));
