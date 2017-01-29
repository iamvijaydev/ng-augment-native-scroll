'use strict';

angular.module('ngAugmentNativeScroll', [])
    .factory('utils', require('./utils.factory.js'))
    .value('kineticEngine', require('./kineticEngine.value.js'))
    .directive('connectScrolls', require('./connectScrolls.directive.js'))
    .directive('scrollArea', require('./scrollArea.directive.js'))
    .directive('kineticScroll', require('./kineticScroll.directive.js'));
