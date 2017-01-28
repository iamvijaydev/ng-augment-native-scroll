'use strict';

angular.module('ngAugmentNativeScroll', [])
    .value('kineticEngine', require('./kineticEngine.value'))
    .factory('utils', require('./utils.factory'))
    .directive('connectScrolls', require('./connectScrolls.directive'))
    .directive('scrollArea', require('./scrollArea.directive'));
