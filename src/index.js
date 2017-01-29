'use strict';

angular.module('ngAugmentNativeScroll', [])
    .factory('augNsUtils', require('./augNsUtils.factory.js'))
    .value('augNsOptions', require('./augNsOptions.value.js'))
    .value('kineticEngine', require('./kineticEngine.value.js'))
    .directive('connectScrolls', require('./connectScrolls.directive.js'))
    .directive('scrollArea', require('./scrollArea.directive.js'))
    .directive('kineticScroll', require('./kineticScroll.directive.js'));
