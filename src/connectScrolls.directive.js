'use strict';

function ConnectScrolls (augNsUtils, augNsOptions, kineticEngine) {
    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        transclude: true,
        replace: true,
        template: '<span data-name="conntect-scroll" ng-transclude></span>',
        link: function (scope, element) {
            scope.hasTouch = 'ontouchstart' in window;
            scope.DETECT_EVT = scope.hasTouch ? 'touchstart' : 'mouseover';
            scope.activeId = undefined;
            scope.$listener = element[0];

            scope.userOptions = angular.extend({}, augNsOptions, scope.options);

            kineticEngine.call(this, scope, augNsUtils);

            scope.setActiveNode = function (e) {
                scope.activeId = augNsUtils.findMatchingTarget(e.target, scope.childNodes);
            }

            scope.onScroll = function (e) {
                if ( scope.pressed || scope.isAutoScrolling ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                var target = e.target;
                var valX = undefined;
                var valY = undefined;

                if ( target.clientWidth !== target.scrollWidth ) {
                    valX = target.scrollLeft;
                    scope.lastScrollLeft = scope.scrollLeft;
                    scope.scrollLeft = valX;
                } else {
                    valX = scope.scrollLeft;
                }
                if ( target.clientHeight !== target.scrollHeight ) {
                    valY = target.scrollTop;
                    scope.lastScrollTop = scope.scrollTop;
                    scope.scrollTop = valY;
                } else {
                    valY = scope.scrollTop;
                }

                scope.childNodes.forEach(function(node) {
                    if ( node.id !== scope.activeId ) {
                        node.children[0].scrollLeft = valX;
                        node.children[0].scrollTop = valY;
                    }
                });
            }

            scope.$listener.addEventListener( scope.DETECT_EVT, scope.setActiveNode, true );
            scope.$listener.addEventListener( 'scroll', scope.onScroll, true );

            scope.$on('$destroy', function() {
                scope.$listener.removeEventListener( scope.DETECT_EVT, scope.setActiveNode );
                scope.$listener.removeEventListener( 'scroll', scope.onScroll );
            });

            // expose few methods to the parent controller
            scope.$parent.augNs = scope.exposedMethods;
        },
        controller: ['$scope', function connectScrollsCtrl($scope) {
            var childNodes = $scope.childNodes = [];

            this.addScrollArea = function (node) {
                childNodes.push(node);
            }
        }]
    }
}

ConnectScrolls.$inject = ['augNsUtils', 'augNsOptions', 'kineticEngine'];

module.exports = ConnectScrolls;
