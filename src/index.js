'use strict';

var moduleName = 'ng-augment-native-scroll';
var angular = require('angular');

angular.module(moduleName, [])
    .factory('augNsUtils', require('./augNsUtils.factory.js'))
    .value('augNsOptions', require('./augNsOptions.value.js'))
    .value('kineticEngine', require('./kineticEngine.value.js'))
    .directive('connectScrolls', require('./connectScrolls.directive.js'))
    .directive('scrollArea', require('./scrollArea.directive.js'))
    .directive('kineticScroll', require('./kineticScroll.directive.js'));

return moduleName;
