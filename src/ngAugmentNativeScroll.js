'use strict';

angular.module('ngAugmentNativeScroll')
    .directive('connectScrolls', function () {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            template: '<span ng-transclude></span>',
            link: function (scope, element, attrs, controller, transcludeFn) {
                function findMatchingTarget (target, nodes) {
                    if ( ! nodes.length || target.tagName === 'BODY' ) {
                        return 'BODY';
                    }

                    let found = nodes.find(function (node) {
                        return node.id === target.id
                    });

                    if ( found ) {
                        return target.id;
                    } else {
                        return findMatchingTarget(target.parentElement, nodes);
                    }
                }

                var hasTouch = 'ontouchstart' in window;
                var DETECT_EVT = hasTouch ? 'touchstart' : 'mouseover';
                var activeId = undefined;
                var $listener = element[0];
                var scrollLeft = 0;
                var lastScrollLeft = 0;
                var scrollTop = 0;
                var lastScrollTop = 0;

                var setActiveNode = function (e) {
                    activeId = findMatchingTarget(e.target, scope.childNodes)
                }

                var onScrollHandler = function (e) {
                    if ( this.pressed || this.isAutoScrolling ) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    let target = e.target;
                    let valX = undefined;
                    let valY = undefined;

                    if ( target.clientWidth !== target.scrollWidth ) {
                        valX = target.scrollLeft;
                        lastScrollLeft = scrollLeft;
                        scrollLeft = valX;
                    } else {
                        valX = scrollLeft;
                    }
                    if ( target.clientHeight !== target.scrollHeight ) {
                        valY = target.scrollTop;
                        lastScrollTop = scrollTop;
                        scrollTop = valY;
                    } else {
                        valY = scrollTop;
                    }

                    childNodes.forEach(function(node) {
                        if ( node.id !== activeId ) {
                            node.children[0].scrollLeft = valX;
                            node.children[0].scrollTop = valY;
                        }
                    });
                }

                $listener.addEventListener( DETECT_EVT, setActiveNode, true );
                $listener.addEventListener( 'scroll', onScrollHandler, true );

                scope.on('$destroy', function() {
                    $listener.removeEventListener( DETECT_EVT, setActiveNode );
                    $listener.removeEventListener( 'scroll', onScrollHandler );
                });
            },
            controller: ['$scope', function ConnectScrollsController($scope) {
                var childNodes = $scope.childNodes = [];

                this.addScrollArea = function (node) {
                    childNodes.push(node);
                }
            }
        }
    })
    .directive('scrollArea', function () {
        return {
            require: '^^connectScrolls'
            restrict: 'E',
            template: '<span ng-transclude></span>',
            link: function (scope, element) {
                element.attr( 'id', 'PARTICIPATING_NODE_' + Math.random().toString().substring(2, 15) );

                tabsCtrl.addScrollArea(element[0]);
            }
        }
    })
