'use strict';

function KineticScroll (augNsUtils, augNsOptions, kineticEngine) {
    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        transclude: true,
        replace: true,
        template: '<span data-name="kinetic-scroll" ng-transclude></span>',
        link: function (scope, element) {
            scope.hasTouch = 'ontouchstart' in window;
            scope.DETECT_EVT = scope.hasTouch ? 'touchstart' : 'mouseover';
            scope.$listener = element[0];
            scope.childNodes = [ scope.$listener ];

            scope.userOptions = angular.extend({}, augNsOptions, scope.options);

            kineticEngine.call(this, scope, augNsUtils);

            // expose few methods to the parent controller
            if ( scope.userOptions.hasOwnProperty(name) ) {
                scope.$parent[scope.userOptions.name] = scope.exposedMethods;
            }
        }
    }
}

KineticScroll.$inject = ['augNsUtils', 'augNsOptions', 'kineticEngine'];

module.exports = KineticScroll;
