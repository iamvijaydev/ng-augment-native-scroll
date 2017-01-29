'use strict';

function ConnectScrolls (utils, kineticEngine) {
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

            scope.defaultOptions = {
                enableKinetics: false,
                movingAverage: 0.1
            };
            scope.userOptions = angular.extend({}, scope.defaultOptions, scope.options);

            kineticEngine.call(this, scope, utils);

            scope.setActiveNode = function (e) {
                scope.activeId = utils.findMatchingTarget(e.target, scope.childNodes);
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
            scope.$parent.connectedScrolls = {
                scrollToStart: function () {
                    scope.cancelAutoScroll();

                    scope.timeStamp = utils.getTime();
                    scope.targetLeft = 0;
                    scope.targetTop = 0;
                    scope.amplitudeLeft = -scope.scrollLeft
                    scope.amplitudeTop = -scope.scrollTop;

                    scope.isAutoScrolling = true;
                    scope.autoScrollTracker = requestAnimationFrame(scope.autoScroll);
                },
                scrollToStartLeft: function () {
                    scope.cancelAutoScroll();

                    scope.timeStamp = utils.getTime();
                    scope.targetLeft = 0;
                    scope.targetTop = scope.scrollTop;
                    scope.amplitudeLeft = -scope.scrollLeft;
                    scope.amplitudeTop = 0;

                    scope.isAutoScrolling = true;
                    scope.autoScrollTracker = requestAnimationFrame(scope.autoScroll);
                },
                scrollToStartTop: function () {
                    scope.cancelAutoScroll();

                    scope.timeStamp = utils.getTime();
                    scope.targetLeft = scope.scrollLeft;
                    scope.targetTop = 0;
                    scope.amplitudeLeft = 0;
                    scope.amplitudeTop = -scope.scrollTop;

                    scope.isAutoScrolling = true;
                    scope.autoScrollTracker = requestAnimationFrame(scope.autoScroll);
                },
                scrollToEnd: function () {
                    var maxScrollLeft = 0;
                    var maxScrollTop = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollX = $el.scrollWidth - $el.clientWidth;
                        var maxScrollY = $el.scrollHeight - $el.clientHeight;

                        if ( maxScrollX > maxScrollLeft ) {
                            maxScrollLeft = maxScrollX;
                        }
                        if ( maxScrollY > maxScrollTop ) {
                            maxScrollTop = maxScrollY;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(maxScrollLeft, maxScrollTop);
                },
                scrollToEndLeft: function () {
                    var maxScrollLeft = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollX = $el.scrollWidth - $el.clientWidth;

                        if ( maxScrollX > maxScrollLeft ) {
                            maxScrollLeft = maxScrollX;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(maxScrollLeft, scope.scrollTop);
                },
                scrollToEndTop: function () {
                    var maxScrollTop = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollY = $el.scrollHeight - $el.clientHeight;

                        if ( maxScrollY > maxScrollTop ) {
                            maxScrollTop = maxScrollY;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(scope.scrollLeft, maxScrollTop);
                }
            }
        },
        controller: ['$scope', function connectScrollsCtrl($scope) {
            var childNodes = $scope.childNodes = [];

            this.addScrollArea = function (node) {
                childNodes.push(node);
            }
        }]
    }
}

ConnectScrolls.$inject = ['utils', 'kineticEngine'];

module.exports = ConnectScrolls;
