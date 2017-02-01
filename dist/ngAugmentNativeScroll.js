/*!
 * v0.11.0
 * 
 * MIT License
 * 
 * Copyright (c) 2017 Vijay Dev (http://vijaydev.com/)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	angular.module('ngAugmentNativeScroll', []).factory('augNsUtils', __webpack_require__(2)).value('augNsOptions', __webpack_require__(3)).value('kineticEngine', __webpack_require__(4)).directive('connectScrolls', __webpack_require__(5)).directive('scrollArea', __webpack_require__(6)).directive('kineticScroll', __webpack_require__(7));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports) {

	function augNsUtils() {
	    /*eslint-disable angular/window-service, angular/timeout-service */
	    (function () {
	        var lastTime = 0;
	        var vendors = ['ms', 'moz', 'webkit', 'o'];
	        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	        }

	        if (!window.requestAnimationFrame) {
	            window.requestAnimationFrame = function (callback) {
	                var currTime = new Date().getTime();
	                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	                var id = window.setTimeout(function () {
	                    callback(currTime + timeToCall);
	                }, timeToCall);
	                lastTime = currTime + timeToCall;
	                return id;
	            };
	        }

	        if (!window.cancelAnimationFrame) {
	            window.cancelAnimationFrame = function (id) {
	                clearTimeout(id);
	            };
	        }
	    })();

	    return {
	        findMatchingTarget: function (target, nodes) {
	            var found;

	            if (!nodes.length || target.tagName === 'BODY') {
	                return 'BODY';
	            }

	            found = nodes.find(function (node) {
	                return node.id === target.id;
	            });

	            if (found) {
	                return target.id;
	            } else {
	                return this.findMatchingTarget(target.parentElement, nodes);
	            }
	        },
	        getPoint: function (e, hasTouch) {
	            var point;

	            if (hasTouch && event.touches.length) {
	                point = {
	                    x: event.touches[0].clientX,
	                    y: event.touches[0].clientY
	                };
	            } else {
	                point = {
	                    x: event.clientX,
	                    y: event.clientY
	                };
	            }

	            return point;
	        },
	        getTime: Date.now || function getTime() {
	            return new Date().utils.getTime();
	        },
	        preventDefaultException: function (el, exceptions) {
	            for (var i in exceptions) {
	                if (exceptions[i].test(el[i])) {
	                    return true;
	                }
	            }

	            return false;
	        }
	    };
	}

	module.exports = augNsUtils;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var augNsOptions = {
	    enableKinetics: true,
	    movingAverage: 0.1,
	    preventDefaultException: {
	        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
	    }
	};

	module.exports = augNsOptions;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	function KineticEngine(context, utils) {
	    context.scrollLeft = 0;
	    context.scrollTop = 0;
	    context.lastScrollLeft = 0;
	    context.lastScrollTop = 0;
	    context.targetTop = 0;
	    context.targetLeft = 0;

	    context.velocityTop = 0;
	    context.velocityLeft = 0;
	    context.amplitudeTop = 0;
	    context.amplitudeLeft = 0;

	    context.timeStamp = 0;
	    context.referenceX = 0;
	    context.referenceY = 0;
	    context.pressed = false;
	    context.autoScrollTracker = null;
	    context.isAutoScrolling = false;

	    context.leftTracker = function () {
	        var now, elapsed, delta;

	        now = utils.getTime();
	        elapsed = now - context.timeStamp;
	        context.timeStamp = now;
	        delta = context.scrollLeft - context.lastScrollLeft;
	        context.lastScrollLeft = context.scrollLeft;

	        context.velocityLeft = context.userOptions.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * context.velocityLeft;
	    };

	    context.topTracker = function () {
	        var now, elapsed, delta;

	        now = utils.getTime();
	        elapsed = now - context.timeStamp;
	        context.timeStamp = now;
	        delta = context.scrollTop - context.lastScrollTop;
	        context.lastScrollTop = context.scrollTop;

	        context.velocityTop = context.userOptions.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * context.velocityTop;
	    };

	    context.scrollTo = function (left, top) {
	        var correctedLeft = Math.round(left);
	        var correctedTop = Math.round(top);

	        context.childNodes.forEach(function (node) {
	            var $el = node.children[0];
	            var maxScrollX = $el.scrollWidth - $el.clientWidth;
	            var maxScrollY = $el.scrollHeight - $el.clientHeight;

	            if (maxScrollX > 0 && correctedLeft >= 0 && correctedLeft <= maxScrollX) {
	                $el.scrollLeft = correctedLeft;
	                context.scrollLeft = correctedLeft;
	            }
	            if (maxScrollY > 0 && correctedTop >= 0 && correctedTop <= maxScrollY) {
	                $el.scrollTop = correctedTop;
	                context.scrollTop = correctedTop;
	            }
	        });
	    };

	    context.autoScroll = function () {
	        var elapsed;
	        var deltaY = 0,
	            deltaX = 0,
	            scrollX = 0,
	            scrollY = 0;
	        var timeConstant = 325;

	        elapsed = utils.getTime() - context.timeStamp;

	        if (context.amplitudeTop) {
	            deltaY = -context.amplitudeTop * Math.exp(-elapsed / timeConstant);
	        }
	        if (context.amplitudeLeft) {
	            deltaX = -context.amplitudeLeft * Math.exp(-elapsed / timeConstant);
	        }

	        if (deltaX > 0.5 || deltaX < -0.5) {
	            scrollX = deltaX;
	        } else {
	            scrollX = 0;
	        }

	        if (deltaY > 0.5 || deltaY < -0.5) {
	            scrollY = deltaY;
	        } else {
	            scrollY = 0;
	        }

	        context.scrollTo(context.targetLeft + scrollX, context.targetTop + scrollY);

	        if (scrollX !== 0 || scrollY !== 0) {
	            context.autoScrollTracker = requestAnimationFrame(context.autoScroll);
	        } else {
	            context.isAutoScrolling = false;
	            context.autoScrollTracker = null;
	        }
	    };

	    context.cancelAutoScroll = function () {
	        if (context.isAutoScrolling) {
	            cancelAnimationFrame(context.autoScrollTracker);
	            context.isAutoScrolling = false;
	            context.autoScrollTracker = null;
	        }
	    };

	    context.tap = function (e) {
	        context.pressed = true;
	        context.referenceX = utils.getPoint(e, context.hasTouch).x;
	        context.referenceY = utils.getPoint(e, context.hasTouch).y;

	        context.velocityTop = context.amplitudeTop = 0;
	        context.velocityLeft = context.amplitudeLeft = 0;

	        context.lastScrollTop = context.scrollTop;
	        context.lastScrollLeft = context.scrollLeft;

	        context.timeStamp = utils.getTime();

	        context.cancelAutoScroll();

	        context.$listener.addEventListener('mousemove', context.swipe, true);
	        context.$listener.addEventListener('mouseup', context.release, true);

	        if (utils.preventDefaultException(e.target, context.userOptions.preventDefaultException)) {
	            e.preventDefault();
	        }
	    };

	    context.swipe = function (e) {
	        var x, y, deltaX, deltaY;

	        if (context.pressed) {
	            x = utils.getPoint(e, context.hasTouch).x;
	            y = utils.getPoint(e, context.hasTouch).y;

	            deltaX = context.referenceX - x;
	            deltaY = context.referenceY - y;

	            if (deltaX > 2 || deltaX < -2) {
	                context.referenceX = x;
	            } else {
	                deltaX = 0;
	            }
	            if (deltaY > 2 || deltaY < -2) {
	                context.referenceY = y;
	            } else {
	                deltaY = 0;
	            }

	            context.topTracker();
	            context.leftTracker();

	            context.scrollTo(context.scrollLeft + deltaX, context.scrollTop + deltaY);
	        }
	    };

	    context.release = function () {
	        context.pressed = false;

	        context.timeStamp = utils.getTime();
	        context.topTracker();
	        context.leftTracker();

	        if (context.velocityTop > 10 || context.velocityTop < -10) {
	            context.amplitudeTop = 0.8 * context.velocityTop;
	            context.targetTop = Math.round(context.scrollTop + context.amplitudeTop);
	        } else {
	            context.targetTop = context.scrollTop;
	        }
	        if (context.velocityLeft > 10 || context.velocityLeft < -10) {
	            context.amplitudeLeft = 0.8 * context.velocityLeft;
	            context.targetLeft = Math.round(context.scrollLeft + context.amplitudeLeft);
	        } else {
	            context.targetLeft = context.scrollLeft;
	        }

	        context.isAutoScrolling = true;
	        context.autoScrollTracker = requestAnimationFrame(context.autoScroll);

	        context.$listener.removeEventListener('mousemove', context.swipe);
	        context.$listener.removeEventListener('mouseup', context.release);
	    };

	    if (!context.hasTouch && context.userOptions.enableKinetics) {
	        context.$listener.addEventListener('mousedown', context.tap, true);
	    }

	    context.$on('$destroy', function () {
	        context.$listener.removeEventListener('mousedown', context.tap);
	    });

	    var scrollGen = function (start, left, top) {
	        return function () {
	            var targetLeft = 0,
	                targetTop = 0,
	                amplitudeLeft = 0,
	                amplitudeTop = 0,
	                maxScrollLeft = 0,
	                maxScrollTop = 0;

	            if (start) {
	                targetLeft = left ? 0 : context.scrollLeft;
	                targetTop = top ? 0 : context.scrollTop;
	                amplitudeLeft = left ? -context.scrollLeft : 0;
	                amplitudeTop = top ? -context.scrollTop : 0;
	            } else {
	                context.childNodes.forEach(function (node) {
	                    var $el = node.children[0];
	                    var maxScrollX = $el.scrollWidth - $el.clientWidth;
	                    var maxScrollY = $el.scrollHeight - $el.clientHeight;

	                    if (maxScrollX > maxScrollLeft) {
	                        maxScrollLeft = maxScrollX;
	                    }
	                    if (maxScrollY > maxScrollTop) {
	                        maxScrollTop = maxScrollY;
	                    }
	                });

	                targetLeft = left ? maxScrollLeft : context.scrollLeft;
	                targetTop = top ? maxScrollTop : context.scrollTop;
	                amplitudeLeft = left ? maxScrollLeft - context.scrollLeft : 0;
	                amplitudeTop = top ? maxScrollTop - context.scrollTop : 0;
	            }

	            if (amplitudeLeft !== 0 || amplitudeTop !== 0) {
	                context.cancelAutoScroll();

	                context.timeStamp = utils.getTime();
	                context.targetLeft = targetLeft;
	                context.targetTop = targetTop;
	                context.amplitudeLeft = amplitudeLeft;
	                context.amplitudeTop = amplitudeTop;

	                context.isAutoScrolling = true;
	                context.autoScrollTracker = requestAnimationFrame(context.autoScroll);
	            }
	        };
	    };

	    var start = true,
	        notStart = false,
	        left = true,
	        notLeft = false,
	        top = true,
	        notTop = false;

	    context.exposedMethods = {
	        scrollToStart: scrollGen(start, left, top),
	        scrollToStartLeft: scrollGen(start, left, notTop),
	        scrollToStartTop: scrollGen(start, notLeft, top),
	        scrollToEnd: scrollGen(notStart, left, top),
	        scrollToEndLeft: scrollGen(notStart, left, notTop),
	        scrollToEndTop: scrollGen(notStart, notLeft, top)
	    };
	}

	module.exports = KineticEngine;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	function ConnectScrolls(augNsUtils, augNsOptions, kineticEngine) {
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
	            };

	            scope.onScroll = function (e) {
	                if (scope.pressed || scope.isAutoScrolling) {
	                    e.preventDefault();
	                    e.stopPropagation();
	                    return;
	                }

	                var target = e.target;
	                var valX = undefined;
	                var valY = undefined;

	                if (target.clientWidth !== target.scrollWidth) {
	                    valX = target.scrollLeft;
	                    scope.lastScrollLeft = scope.scrollLeft;
	                    scope.scrollLeft = valX;
	                } else {
	                    valX = scope.scrollLeft;
	                }
	                if (target.clientHeight !== target.scrollHeight) {
	                    valY = target.scrollTop;
	                    scope.lastScrollTop = scope.scrollTop;
	                    scope.scrollTop = valY;
	                } else {
	                    valY = scope.scrollTop;
	                }

	                scope.childNodes.forEach(function (node) {
	                    if (node.id !== scope.activeId) {
	                        node.children[0].scrollLeft = valX;
	                        node.children[0].scrollTop = valY;
	                    }
	                });
	            };

	            scope.$listener.addEventListener(scope.DETECT_EVT, scope.setActiveNode, true);
	            scope.$listener.addEventListener('scroll', scope.onScroll, true);

	            scope.$on('$destroy', function () {
	                scope.$listener.removeEventListener(scope.DETECT_EVT, scope.setActiveNode);
	                scope.$listener.removeEventListener('scroll', scope.onScroll);
	            });

	            // expose few methods to the parent controller
	            scope.$parent.augNs = scope.exposedMethods;
	        },
	        controller: ['$scope', function connectScrollsCtrl($scope) {
	            var childNodes = $scope.childNodes = [];

	            this.addScrollArea = function (node) {
	                childNodes.push(node);
	            };
	        }]
	    };
	}

	ConnectScrolls.$inject = ['augNsUtils', 'augNsOptions', 'kineticEngine'];

	module.exports = ConnectScrolls;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	function ScrollArea() {
	    return {
	        require: '^^connectScrolls',
	        restrict: 'E',
	        transclude: true,
	        replace: true,
	        template: '<span  data-name="scroll-area" ng-transclude></span>',
	        link: function (scope, element, attrs, connectScrollsCtrl) {
	            element.attr('id', 'PARTICIPATING_NODE_' + Math.random().toString().substring(2, 15));
	            connectScrollsCtrl.addScrollArea(element[0]);
	        }
	    };
	}

	module.exports = ScrollArea;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	function KineticScroll(augNsUtils, augNsOptions, kineticEngine) {
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
	            scope.childNodes = [scope.$listener];

	            scope.userOptions = angular.extend({}, augNsOptions, scope.options);

	            kineticEngine.call(this, scope, augNsUtils);

	            // expose few methods to the parent controller
	            scope.$parent.augNs = scope.exposedMethods;
	        }
	    };
	}

	KineticScroll.$inject = ['augNsUtils', 'augNsOptions', 'kineticEngine'];

	module.exports = KineticScroll;

/***/ }
/******/ ]);