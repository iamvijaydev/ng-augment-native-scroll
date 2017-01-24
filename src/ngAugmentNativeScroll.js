'use strict';

angular.module('ngAugmentNativeScroll', [])
    .factory('utils', function () {
        return {
            findMatchingTarget: function (target, nodes) {
                var found;

                if ( ! nodes.length || target.tagName === 'BODY' ) {
                    return 'BODY';
                }

                found = nodes.find(function (node) {
                    return node.id === target.id
                });

                if ( found ) {
                    return target.id;
                } else {
                    return this.findMatchingTarget(target.parentElement, nodes);
                }
            },
            getPoint: function (e, hasTouch) {
                var point;

                if( hasTouch && event.touches.length ) {
                    point = {
                        'x' : event.touches[0].clientX,
                        'y' : event.touches[0].clientY
                    }
                } else {
                    point = {
                        'x' : event.clientX,
                        'y' : event.clientY
                    }
                }

                return point;
            },
            getTime: Date.now || function getTime () { return new Date().utils.getTime(); }
        }
    })
    .directive('connectScrolls', function (utils) {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            transclude: true,
            replace: true,
            template: '<span data-name="conntect-scrolls" ng-transclude></span>',
            link: function (scope, element) {
                var hasTouch = 'ontouchstart' in window;
                var DETECT_EVT = hasTouch ? 'touchstart' : 'mouseover';
                var activeId = undefined;
                var $listener = element[0];

                var scrollLeft = 0;
                var scrollTop = 0;
                var lastScrollLeft = 0;
                var lastScrollTop = 0;
                var targetTop = 0;
                var targetLeft = 0;

                var velocityTop = 0;
                var velocityLeft = 0;
                var amplitudeTop = 0;
                var amplitudeLeft = 0;

                var timeStamp = 0;
                var referenceX = 0;
                var referenceY = 0;
                var pressed = false;
                var autoScrollTracker = null;
                var isAutoScrolling = false;

                var setActiveNode = function (e) {
                    activeId = utils.findMatchingTarget(e.target, scope.childNodes);
                }

                var leftTracker = function () {
                    var now, elapsed, delta;

                    now = utils.getTime();
                    elapsed = now - timeStamp;
                    timeStamp = now;
                    delta = scrollLeft - lastScrollLeft;
                    lastScrollLeft = scrollLeft;

                    velocityLeft = userOptions.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * velocityLeft;
                }

                var topTracker = function () {
                    var now, elapsed, delta;

                    now = utils.getTime();
                    elapsed = now - timeStamp;
                    timeStamp = now;
                    delta = scrollTop - lastScrollTop;
                    lastScrollTop = scrollTop;

                    velocityTop = userOptions.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * velocityTop;
                }

                var scrollTo = function(left, top) {
                    var correctedLeft = Math.round(left);
                    var correctedTop = Math.round(top);

                    scope.childNodes.forEach(function(node) {
                        var $el = node.children[0];
                        var maxScrollX = $el.scrollWidth - $el.clientWidth;
                        var maxScrollY = $el.scrollHeight - $el.clientHeight;

                        if ( maxScrollX > 0 && correctedLeft >= 0 && correctedLeft <= maxScrollX ) {
                            $el.scrollLeft = correctedLeft;
                            scrollLeft = correctedLeft;
                        }
                        if ( maxScrollY > 0 && correctedTop >= 0 && correctedTop <= maxScrollY ) {
                            $el.scrollTop = correctedTop;
                            scrollTop = correctedTop;
                        }
                    })
                }

                var onScrollHandler = function (e) {
                    if ( this.pressed || this.isAutoScrolling ) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    var target = e.target;
                    var valX = undefined;
                    var valY = undefined;

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

                    scope.childNodes.forEach(function(node) {
                        if ( node.id !== activeId ) {
                            node.children[0].scrollLeft = valX;
                            node.children[0].scrollTop = valY;
                        }
                    });
                }

                var autoScroll = function() {
                    var elapsed;
                    var deltaY = 0, deltaX = 0, scrollX = 0, scrollY = 0;
                    var timeConstant = 325;

                    elapsed = utils.getTime() - timeStamp;

                    if ( amplitudeTop ) {
                        deltaY = -amplitudeTop * Math.exp(-elapsed / timeConstant);
                    }
                    if ( amplitudeLeft ) {
                        deltaX = -amplitudeLeft * Math.exp(-elapsed / timeConstant);
                    }

                    if ( deltaX > 0.5 || deltaX < -0.5 ) {
                        scrollX = deltaX;
                    } else {
                        scrollX = 0;
                    }

                    if ( deltaY > 0.5 || deltaY < -0.5 ) {
                        scrollY = deltaY;
                    } else {
                        scrollY = 0;
                    }

                    scrollTo(targetLeft + scrollX, targetTop + scrollY);

                    if ( scrollX !== 0 || scrollY !== 0 ) {
                        autoScrollTracker = requestAnimationFrame(autoScroll);
                    } else {
                        isAutoScrolling = false;
                        autoScrollTracker = null;
                    }
                }

                var cancelAutoScroll = function () {
                    if ( isAutoScrolling ) {
                        cancelAnimationFrame(autoScrollTracker);
                        isAutoScrolling = false;
                        autoScrollTracker = null;
                    }
                }

                var tap = function (e) {
                    pressed = true;
                    referenceX = utils.getPoint(e, hasTouch).x;
                    referenceY = utils.getPoint(e, hasTouch).y;

                    velocityTop = amplitudeTop = 0;
                    velocityLeft = amplitudeLeft = 0;

                    lastScrollTop = scrollTop;
                    lastScrollLeft = scrollLeft;

                    timeStamp = utils.getTime();

                    cancelAutoScroll();

                    $listener.addEventListener( 'mousemove', swipe, true );
                    $listener.addEventListener( 'mouseup', end, true );

                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                var swipe = function (e) {
                    var x, y, deltaX, deltaY;

                    if (pressed) {
                        x = utils.getPoint(e, hasTouch).x;
                        y = utils.getPoint(e, hasTouch).y;

                        deltaX = referenceX - x;
                        deltaY = referenceY - y;

                        if (deltaX > 2 || deltaX < -2) {
                            referenceX = x;
                        } else {
                            deltaX = 0;
                        }
                        if (deltaY > 2 || deltaY < -2) {
                            referenceY = y;
                        } else {
                            deltaY = 0;
                        }

                        topTracker();
                        leftTracker();

                        scrollTo( scrollLeft + deltaX, scrollTop + deltaY );
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                var end = function(e) {
                    pressed = false;

                    timeStamp = utils.getTime();
                    topTracker();
                    leftTracker();

                    if (velocityTop > 10 || velocityTop < -10) {
                        amplitudeTop = 0.8 * velocityTop;
                        targetTop = Math.round(scrollTop + amplitudeTop);
                    } else {
                        targetTop = scrollTop;
                    }
                    if (velocityLeft > 10 || velocityLeft < -10) {
                        amplitudeLeft = 0.8 * velocityLeft;
                        targetLeft = Math.round(scrollLeft + amplitudeLeft);
                    } else {
                        targetLeft = scrollLeft;
                    }

                    isAutoScrolling = true;
                    autoScrollTracker = requestAnimationFrame(autoScroll);

                    $listener.removeEventListener( 'mousemove', swipe );
                    $listener.removeEventListener( 'mouseup', end );

                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }


                var bindKinetic = function () {
                    $listener.addEventListener( 'mousedown', tap, true );
                }

                var unbindKinetic = function () {
                    $listener.removeEventListener( 'mousedown', tap );
                }

                var defaultOptions = {
                    enableKinetics: false,
                    movingAverage: 0.1
                };
                var userOptions = angular.extend({}, defaultOptions, scope.options);

                $listener.addEventListener( DETECT_EVT, setActiveNode, true );
                $listener.addEventListener( 'scroll', onScrollHandler, true );
                if ( ! hasTouch && userOptions.enableKinetics ) {
                    bindKinetic();
                }

                scope.$on('$destroy', function() {
                    $listener.removeEventListener( DETECT_EVT, setActiveNode );
                    $listener.removeEventListener( 'scroll', onScrollHandler );
                    unbindKinetic();
                });

                // expose few methods to the parent controller
                scope.$parent.connectedScrolls = {
                    scrollToStart: function () {
                        cancelAutoScroll();
                        scrollTo(0, 0);
                    },
                    scrollToStartLeft: function () {
                        cancelAutoScroll();
                        scrollTo(0, scrollTop);
                    },
                    scrollToStartTop: function () {
                        cancelAutoScroll();
                        scrollTo(scrollLeft, 0);
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

                        cancelAutoScroll();
                        scrollTo(maxScrollLeft, maxScrollTop);
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

                        cancelAutoScroll();
                        scrollTo(maxScrollLeft, scrollTop);
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

                        cancelAutoScroll();
                        scrollTo(scrollLeft, maxScrollTop);
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
    })
    .directive('scrollArea', function () {
        return {
            require: '^^connectScrolls',
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<span  data-name="scroll-area" ng-transclude></span>',
            link: function (scope, element, attrs, connectScrollsCtrl) {
                element.attr( 'id', 'PARTICIPATING_NODE_' + Math.random().toString().substring(2, 15) );
                connectScrollsCtrl.addScrollArea(element[0]);
            }
        }
    })
