/*!
 * MIT License
 * 
 * Copyright (c) 2017 Vijay Dev
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
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ngAugmentNativeScroll"] = factory();
	else
		root["ngAugmentNativeScroll"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	angular.module('ngAugmentNativeScroll', []).factory('utils', __webpack_require__(1)).value('kineticEngine', __webpack_require__(2)).directive('connectScrolls', __webpack_require__(3)).directive('scrollArea', __webpack_require__(4)).directive('kineticScroll', __webpack_require__(5));

/***/ },
/* 1 */
/***/ function(module, exports) {

	function UtilsFactory() {
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
	                    'x': event.touches[0].clientX,
	                    'y': event.touches[0].clientY
	                };
	            } else {
	                point = {
	                    'x': event.clientX,
	                    'y': event.clientY
	                };
	            }
	
	            return point;
	        },
	        getTime: Date.now || function getTime() {
	            return new Date().utils.getTime();
	        }
	    };
	}
	
	module.exports = UtilsFactory;

/***/ },
/* 2 */
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
	
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
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
	
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	    };
	
	    context.release = function (e) {
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
	
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	    };
	
	    if (!context.hasTouch && context.userOptions.enableKinetics) {
	        context.$listener.addEventListener('mousedown', context.tap, true);
	    }
	
	    context.$on('$destroy', function () {
	        context.$listener.removeEventListener('mousedown', context.tap);
	    });
	}
	
	module.exports = KineticEngine;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	function ConnectScrolls(utils, kineticEngine) {
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
	            scope.$parent.connectedScrolls = {
	                scrollToStart: function () {
	                    scope.cancelAutoScroll();
	
	                    scope.timeStamp = utils.getTime();
	                    scope.targetLeft = 0;
	                    scope.targetTop = 0;
	                    scope.amplitudeLeft = -scope.scrollLeft;
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
	
	                        if (maxScrollX > maxScrollLeft) {
	                            maxScrollLeft = maxScrollX;
	                        }
	                        if (maxScrollY > maxScrollTop) {
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
	
	                        if (maxScrollX > maxScrollLeft) {
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
	
	                        if (maxScrollY > maxScrollTop) {
	                            maxScrollTop = maxScrollY;
	                        }
	                    });
	
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(scope.scrollLeft, maxScrollTop);
	                }
	            };
	        },
	        controller: ['$scope', function connectScrollsCtrl($scope) {
	            var childNodes = $scope.childNodes = [];
	
	            this.addScrollArea = function (node) {
	                childNodes.push(node);
	            };
	        }]
	    };
	}
	
	ConnectScrolls.$inject = ['utils', 'kineticEngine'];
	
	module.exports = ConnectScrolls;

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	function KineticScroll(utils, kineticEngine) {
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
	
	            scope.defaultOptions = {
	                enableKinetics: false,
	                movingAverage: 0.1
	            };
	            scope.userOptions = angular.extend({}, scope.defaultOptions, scope.options);
	
	            kineticEngine.call(this, scope, utils);
	
	            // expose few methods to the parent controller
	            scope.$parent.kineticScroll = {
	                scrollToStart: function () {
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(0, 0);
	                },
	                scrollToStartLeft: function () {
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(0, scope.scrollTop);
	                },
	                scrollToStartTop: function () {
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(scope.scrollLeft, 0);
	                },
	                scrollToEnd: function () {
	                    var maxScrollLeft = 0;
	                    var maxScrollTop = 0;
	
	                    scope.childNodes.forEach(function (node) {
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
	
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(maxScrollLeft, maxScrollTop);
	                },
	                scrollToEndLeft: function () {
	                    var maxScrollLeft = 0;
	
	                    scope.childNodes.forEach(function (node) {
	                        var $el = node.children[0];
	                        var maxScrollX = $el.scrollWidth - $el.clientWidth;
	
	                        if (maxScrollX > maxScrollLeft) {
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
	
	                        if (maxScrollY > maxScrollTop) {
	                            maxScrollTop = maxScrollY;
	                        }
	                    });
	
	                    scope.cancelAutoScroll();
	                    scope.scrollTo(scope.scrollLeft, maxScrollTop);
	                }
	            };
	        }
	    };
	}
	
	KineticScroll.$inject = ['utils', 'kineticEngine'];
	
	module.exports = KineticScroll;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5NTA4MDhmNTZkMzFlNTdiMzA0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLmZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbmV0aWNFbmdpbmUudmFsdWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nvbm5lY3RTY3JvbGxzLmRpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nyb2xsQXJlYS5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbmV0aWNTY3JvbGwuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwicmVxdWlyZSIsInZhbHVlIiwiZGlyZWN0aXZlIiwiVXRpbHNGYWN0b3J5IiwiZmluZE1hdGNoaW5nVGFyZ2V0IiwidGFyZ2V0Iiwibm9kZXMiLCJmb3VuZCIsImxlbmd0aCIsInRhZ05hbWUiLCJmaW5kIiwibm9kZSIsImlkIiwicGFyZW50RWxlbWVudCIsImdldFBvaW50IiwiZSIsImhhc1RvdWNoIiwicG9pbnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsImdldFRpbWUiLCJEYXRlIiwibm93IiwidXRpbHMiLCJleHBvcnRzIiwiS2luZXRpY0VuZ2luZSIsImNvbnRleHQiLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsVG9wIiwibGFzdFNjcm9sbExlZnQiLCJsYXN0U2Nyb2xsVG9wIiwidGFyZ2V0VG9wIiwidGFyZ2V0TGVmdCIsInZlbG9jaXR5VG9wIiwidmVsb2NpdHlMZWZ0IiwiYW1wbGl0dWRlVG9wIiwiYW1wbGl0dWRlTGVmdCIsInRpbWVTdGFtcCIsInJlZmVyZW5jZVgiLCJyZWZlcmVuY2VZIiwicHJlc3NlZCIsImF1dG9TY3JvbGxUcmFja2VyIiwiaXNBdXRvU2Nyb2xsaW5nIiwibGVmdFRyYWNrZXIiLCJlbGFwc2VkIiwiZGVsdGEiLCJ1c2VyT3B0aW9ucyIsIm1vdmluZ0F2ZXJhZ2UiLCJ0b3BUcmFja2VyIiwic2Nyb2xsVG8iLCJsZWZ0IiwidG9wIiwiY29ycmVjdGVkTGVmdCIsIk1hdGgiLCJyb3VuZCIsImNvcnJlY3RlZFRvcCIsImNoaWxkTm9kZXMiLCJmb3JFYWNoIiwiJGVsIiwiY2hpbGRyZW4iLCJtYXhTY3JvbGxYIiwic2Nyb2xsV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1heFNjcm9sbFkiLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJhdXRvU2Nyb2xsIiwiZGVsdGFZIiwiZGVsdGFYIiwic2Nyb2xsWCIsInNjcm9sbFkiLCJ0aW1lQ29uc3RhbnQiLCJleHAiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBdXRvU2Nyb2xsIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ0YXAiLCJ4IiwieSIsIiRsaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzd2lwZSIsInJlbGVhc2UiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlbmFibGVLaW5ldGljcyIsIiRvbiIsIkNvbm5lY3RTY3JvbGxzIiwia2luZXRpY0VuZ2luZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJvcHRpb25zIiwidHJhbnNjbHVkZSIsInJlcGxhY2UiLCJ0ZW1wbGF0ZSIsImxpbmsiLCJlbGVtZW50Iiwid2luZG93IiwiREVURUNUX0VWVCIsImFjdGl2ZUlkIiwidW5kZWZpbmVkIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmQiLCJjYWxsIiwic2V0QWN0aXZlTm9kZSIsIm9uU2Nyb2xsIiwidmFsWCIsInZhbFkiLCIkcGFyZW50IiwiY29ubmVjdGVkU2Nyb2xscyIsInNjcm9sbFRvU3RhcnQiLCJzY3JvbGxUb1N0YXJ0TGVmdCIsInNjcm9sbFRvU3RhcnRUb3AiLCJzY3JvbGxUb0VuZCIsIm1heFNjcm9sbExlZnQiLCJtYXhTY3JvbGxUb3AiLCJzY3JvbGxUb0VuZExlZnQiLCJzY3JvbGxUb0VuZFRvcCIsImNvbnRyb2xsZXIiLCJjb25uZWN0U2Nyb2xsc0N0cmwiLCIkc2NvcGUiLCJhZGRTY3JvbGxBcmVhIiwicHVzaCIsIiRpbmplY3QiLCJTY3JvbGxBcmVhIiwiYXR0cnMiLCJhdHRyIiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciLCJLaW5ldGljU2Nyb2xsIiwia2luZXRpY1Njcm9sbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBQSxTQUFRQyxNQUFSLENBQWUsdUJBQWYsRUFBd0MsRUFBeEMsRUFDS0MsT0FETCxDQUNhLE9BRGIsRUFDc0IsbUJBQUFDLENBQVEsQ0FBUixDQUR0QixFQUVLQyxLQUZMLENBRVcsZUFGWCxFQUU0QixtQkFBQUQsQ0FBUSxDQUFSLENBRjVCLEVBR0tFLFNBSEwsQ0FHZSxnQkFIZixFQUdpQyxtQkFBQUYsQ0FBUSxDQUFSLENBSGpDLEVBSUtFLFNBSkwsQ0FJZSxZQUpmLEVBSTZCLG1CQUFBRixDQUFRLENBQVIsQ0FKN0IsRUFLS0UsU0FMTCxDQUtlLGVBTGYsRUFLZ0MsbUJBQUFGLENBQVEsQ0FBUixDQUxoQyxFOzs7Ozs7QUNGQSxVQUFTRyxZQUFULEdBQXlCO0FBQ3JCLFlBQU87QUFDSEMsNkJBQW9CLFVBQVVDLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3pDLGlCQUFJQyxLQUFKOztBQUVBLGlC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eUIsVUFBVWhELElBQVYsRUFBZ0I7QUFDckMsNkJBQUlpRCxNQUFNakQsS0FBS2tELFFBQUwsQ0FBYyxDQUFkLENBQVY7QUFDQSw2QkFBSUksYUFBYUwsSUFBSU0sWUFBSixHQUFtQk4sSUFBSU8sWUFBeEM7O0FBRUEsNkJBQUtGLGFBQWFxRCxZQUFsQixFQUFpQztBQUM3QkEsNENBQWVyRCxVQUFmO0FBQ0g7QUFDSixzQkFQRDs7QUFTQTRCLDJCQUFNakIsZ0JBQU47QUFDQWlCLDJCQUFNMUMsUUFBTixDQUFlMEMsTUFBTWhFLFVBQXJCLEVBQWlDeUYsWUFBakM7QUFDSDtBQTlEeUIsY0FBOUI7QUFnRUg7QUF2RkUsTUFBUDtBQXlGSDs7QUFFRGUsZUFBY1AsT0FBZCxHQUF3QixDQUFDLE9BQUQsRUFBVSxlQUFWLENBQXhCOztBQUVBaEksUUFBTzRCLE9BQVAsR0FBaUIyRyxhQUFqQixDIiwiZmlsZSI6IkQ6XFxXb3JrXFxuZy1hdWdtZW50LW5hdGl2ZS1zY3JvbGwvZGlzdC9uZ0F1Z21lbnROYXRpdmVTY3JvbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJuZ0F1Z21lbnROYXRpdmVTY3JvbGxcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibmdBdWdtZW50TmF0aXZlU2Nyb2xsXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk1MDgwOGY1NmQzMWU1N2IzMDRmIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdBdWdtZW50TmF0aXZlU2Nyb2xsJywgW10pXG4gICAgLmZhY3RvcnkoJ3V0aWxzJywgcmVxdWlyZSgnLi91dGlscy5mYWN0b3J5LmpzJykpXG4gICAgLnZhbHVlKCdraW5ldGljRW5naW5lJywgcmVxdWlyZSgnLi9raW5ldGljRW5naW5lLnZhbHVlLmpzJykpXG4gICAgLmRpcmVjdGl2ZSgnY29ubmVjdFNjcm9sbHMnLCByZXF1aXJlKCcuL2Nvbm5lY3RTY3JvbGxzLmRpcmVjdGl2ZS5qcycpKVxuICAgIC5kaXJlY3RpdmUoJ3Njcm9sbEFyZWEnLCByZXF1aXJlKCcuL3Njcm9sbEFyZWEuZGlyZWN0aXZlLmpzJykpXG4gICAgLmRpcmVjdGl2ZSgna2luZXRpY1Njcm9sbCcsIHJlcXVpcmUoJy4va2luZXRpY1Njcm9sbC5kaXJlY3RpdmUuanMnKSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJmdW5jdGlvbiBVdGlsc0ZhY3RvcnkgKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmRNYXRjaGluZ1RhcmdldDogZnVuY3Rpb24gKHRhcmdldCwgbm9kZXMpIHtcbiAgICAgICAgICAgIHZhciBmb3VuZDtcblxuICAgICAgICAgICAgaWYgKCAhIG5vZGVzLmxlbmd0aCB8fCB0YXJnZXQudGFnTmFtZSA9PT0gJ0JPRFknICkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnQk9EWSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvdW5kID0gbm9kZXMuZmluZChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmlkID09PSB0YXJnZXQuaWRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGZvdW5kICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuaWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1RhcmdldCh0YXJnZXQucGFyZW50RWxlbWVudCwgbm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRQb2ludDogZnVuY3Rpb24gKGUsIGhhc1RvdWNoKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQ7XG5cbiAgICAgICAgICAgIGlmKCBoYXNUb3VjaCAmJiBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICBwb2ludCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gnIDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICAneScgOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvaW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAneCcgOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICAneScgOiBldmVudC5jbGllbnRZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFRpbWU6IERhdGUubm93IHx8IGZ1bmN0aW9uIGdldFRpbWUgKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkudXRpbHMuZ2V0VGltZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxzRmFjdG9yeVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzLmZhY3RvcnkuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEtpbmV0aWNFbmdpbmUgKGNvbnRleHQsIHV0aWxzKSB7XG4gICAgY29udGV4dC5zY3JvbGxMZWZ0ID0gMDtcbiAgICBjb250ZXh0LnNjcm9sbFRvcCA9IDA7XG4gICAgY29udGV4dC5sYXN0U2Nyb2xsTGVmdCA9IDA7XG4gICAgY29udGV4dC5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICBjb250ZXh0LnRhcmdldFRvcCA9IDA7XG4gICAgY29udGV4dC50YXJnZXRMZWZ0ID0gMDtcblxuICAgIGNvbnRleHQudmVsb2NpdHlUb3AgPSAwO1xuICAgIGNvbnRleHQudmVsb2NpdHlMZWZ0ID0gMDtcbiAgICBjb250ZXh0LmFtcGxpdHVkZVRvcCA9IDA7XG4gICAgY29udGV4dC5hbXBsaXR1ZGVMZWZ0ID0gMDtcblxuICAgIGNvbnRleHQudGltZVN0YW1wID0gMDtcbiAgICBjb250ZXh0LnJlZmVyZW5jZVggPSAwO1xuICAgIGNvbnRleHQucmVmZXJlbmNlWSA9IDA7XG4gICAgY29udGV4dC5wcmVzc2VkID0gZmFsc2U7XG4gICAgY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlciA9IG51bGw7XG4gICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgIGNvbnRleHQubGVmdFRyYWNrZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub3csIGVsYXBzZWQsIGRlbHRhO1xuXG4gICAgICAgIG5vdyA9IHV0aWxzLmdldFRpbWUoKTtcbiAgICAgICAgZWxhcHNlZCA9IG5vdyAtIGNvbnRleHQudGltZVN0YW1wO1xuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IG5vdztcbiAgICAgICAgZGVsdGEgPSBjb250ZXh0LnNjcm9sbExlZnQgLSBjb250ZXh0Lmxhc3RTY3JvbGxMZWZ0O1xuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xuXG4gICAgICAgIGNvbnRleHQudmVsb2NpdHlMZWZ0ID0gY29udGV4dC51c2VyT3B0aW9ucy5tb3ZpbmdBdmVyYWdlICogKDEwMDAgKiBkZWx0YSAvICgxICsgZWxhcHNlZCkpICsgMC4yICogY29udGV4dC52ZWxvY2l0eUxlZnQ7XG4gICAgfVxuXG4gICAgY29udGV4dC50b3BUcmFja2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm93LCBlbGFwc2VkLCBkZWx0YTtcblxuICAgICAgICBub3cgPSB1dGlscy5nZXRUaW1lKCk7XG4gICAgICAgIGVsYXBzZWQgPSBub3cgLSBjb250ZXh0LnRpbWVTdGFtcDtcbiAgICAgICAgY29udGV4dC50aW1lU3RhbXAgPSBub3c7XG4gICAgICAgIGRlbHRhID0gY29udGV4dC5zY3JvbGxUb3AgLSBjb250ZXh0Lmxhc3RTY3JvbGxUb3A7XG4gICAgICAgIGNvbnRleHQubGFzdFNjcm9sbFRvcCA9IGNvbnRleHQuc2Nyb2xsVG9wO1xuXG4gICAgICAgIGNvbnRleHQudmVsb2NpdHlUb3AgPSBjb250ZXh0LnVzZXJPcHRpb25zLm1vdmluZ0F2ZXJhZ2UgKiAoMTAwMCAqIGRlbHRhIC8gKDEgKyBlbGFwc2VkKSkgKyAwLjIgKiBjb250ZXh0LnZlbG9jaXR5VG9wO1xuICAgIH1cblxuICAgIGNvbnRleHQuc2Nyb2xsVG8gPSBmdW5jdGlvbihsZWZ0LCB0b3ApIHtcbiAgICAgICAgdmFyIGNvcnJlY3RlZExlZnQgPSBNYXRoLnJvdW5kKGxlZnQpO1xuICAgICAgICB2YXIgY29ycmVjdGVkVG9wID0gTWF0aC5yb3VuZCh0b3ApO1xuXG4gICAgICAgIGNvbnRleHQuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWSA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwuY2xpZW50SGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiAwICYmIGNvcnJlY3RlZExlZnQgPj0gMCAmJiBjb3JyZWN0ZWRMZWZ0IDw9IG1heFNjcm9sbFggKSB7XG4gICAgICAgICAgICAgICAgJGVsLnNjcm9sbExlZnQgPSBjb3JyZWN0ZWRMZWZ0O1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc2Nyb2xsTGVmdCA9IGNvcnJlY3RlZExlZnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIG1heFNjcm9sbFkgPiAwICYmIGNvcnJlY3RlZFRvcCA+PSAwICYmIGNvcnJlY3RlZFRvcCA8PSBtYXhTY3JvbGxZICkge1xuICAgICAgICAgICAgICAgICRlbC5zY3JvbGxUb3AgPSBjb3JyZWN0ZWRUb3A7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zY3JvbGxUb3AgPSBjb3JyZWN0ZWRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29udGV4dC5hdXRvU2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGFwc2VkO1xuICAgICAgICB2YXIgZGVsdGFZID0gMCwgZGVsdGFYID0gMCwgc2Nyb2xsWCA9IDAsIHNjcm9sbFkgPSAwO1xuICAgICAgICB2YXIgdGltZUNvbnN0YW50ID0gMzI1O1xuXG4gICAgICAgIGVsYXBzZWQgPSB1dGlscy5nZXRUaW1lKCkgLSBjb250ZXh0LnRpbWVTdGFtcDtcblxuICAgICAgICBpZiAoIGNvbnRleHQuYW1wbGl0dWRlVG9wICkge1xuICAgICAgICAgICAgZGVsdGFZID0gLWNvbnRleHQuYW1wbGl0dWRlVG9wICogTWF0aC5leHAoLWVsYXBzZWQgLyB0aW1lQ29uc3RhbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICggY29udGV4dC5hbXBsaXR1ZGVMZWZ0ICkge1xuICAgICAgICAgICAgZGVsdGFYID0gLWNvbnRleHQuYW1wbGl0dWRlTGVmdCAqIE1hdGguZXhwKC1lbGFwc2VkIC8gdGltZUNvbnN0YW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZGVsdGFYID4gMC41IHx8IGRlbHRhWCA8IC0wLjUgKSB7XG4gICAgICAgICAgICBzY3JvbGxYID0gZGVsdGFYO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsWCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGRlbHRhWSA+IDAuNSB8fCBkZWx0YVkgPCAtMC41ICkge1xuICAgICAgICAgICAgc2Nyb2xsWSA9IGRlbHRhWTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbFkgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5zY3JvbGxUbyhjb250ZXh0LnRhcmdldExlZnQgKyBzY3JvbGxYLCBjb250ZXh0LnRhcmdldFRvcCArIHNjcm9sbFkpO1xuXG4gICAgICAgIGlmICggc2Nyb2xsWCAhPT0gMCB8fCBzY3JvbGxZICE9PSAwICkge1xuICAgICAgICAgICAgY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShjb250ZXh0LmF1dG9TY3JvbGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29udGV4dC5jYW5jZWxBdXRvU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIGNvbnRleHQuaXNBdXRvU2Nyb2xsaW5nICkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlcik7XG4gICAgICAgICAgICBjb250ZXh0LmlzQXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb250ZXh0LnRhcCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRleHQucHJlc3NlZCA9IHRydWU7XG4gICAgICAgIGNvbnRleHQucmVmZXJlbmNlWCA9IHV0aWxzLmdldFBvaW50KGUsIGNvbnRleHQuaGFzVG91Y2gpLng7XG4gICAgICAgIGNvbnRleHQucmVmZXJlbmNlWSA9IHV0aWxzLmdldFBvaW50KGUsIGNvbnRleHQuaGFzVG91Y2gpLnk7XG5cbiAgICAgICAgY29udGV4dC52ZWxvY2l0eVRvcCA9IGNvbnRleHQuYW1wbGl0dWRlVG9wID0gMDtcbiAgICAgICAgY29udGV4dC52ZWxvY2l0eUxlZnQgPSBjb250ZXh0LmFtcGxpdHVkZUxlZnQgPSAwO1xuXG4gICAgICAgIGNvbnRleHQubGFzdFNjcm9sbFRvcCA9IGNvbnRleHQuc2Nyb2xsVG9wO1xuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xuXG4gICAgICAgIGNvbnRleHQudGltZVN0YW1wID0gdXRpbHMuZ2V0VGltZSgpO1xuXG4gICAgICAgIGNvbnRleHQuY2FuY2VsQXV0b1Njcm9sbCgpO1xuXG4gICAgICAgIGNvbnRleHQuJGxpc3RlbmVyLmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBjb250ZXh0LnN3aXBlLCB0cnVlICk7XG4gICAgICAgIGNvbnRleHQuJGxpc3RlbmVyLmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgY29udGV4dC5yZWxlYXNlLCB0cnVlICk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29udGV4dC5zd2lwZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB4LCB5LCBkZWx0YVgsIGRlbHRhWTtcblxuICAgICAgICBpZiAoY29udGV4dC5wcmVzc2VkKSB7XG4gICAgICAgICAgICB4ID0gdXRpbHMuZ2V0UG9pbnQoZSwgY29udGV4dC5oYXNUb3VjaCkueDtcbiAgICAgICAgICAgIHkgPSB1dGlscy5nZXRQb2ludChlLCBjb250ZXh0Lmhhc1RvdWNoKS55O1xuXG4gICAgICAgICAgICBkZWx0YVggPSBjb250ZXh0LnJlZmVyZW5jZVggLSB4O1xuICAgICAgICAgICAgZGVsdGFZID0gY29udGV4dC5yZWZlcmVuY2VZIC0geTtcblxuICAgICAgICAgICAgaWYgKGRlbHRhWCA+IDIgfHwgZGVsdGFYIDwgLTIpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVggPSB4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWx0YVggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDIgfHwgZGVsdGFZIDwgLTIpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVkgPSB5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWx0YVkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZXh0LnRvcFRyYWNrZXIoKTtcbiAgICAgICAgICAgIGNvbnRleHQubGVmdFRyYWNrZXIoKTtcblxuICAgICAgICAgICAgY29udGV4dC5zY3JvbGxUbyggY29udGV4dC5zY3JvbGxMZWZ0ICsgZGVsdGFYLCBjb250ZXh0LnNjcm9sbFRvcCArIGRlbHRhWSApO1xuICAgICAgICB9XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29udGV4dC5yZWxlYXNlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb250ZXh0LnByZXNzZWQgPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IHV0aWxzLmdldFRpbWUoKTtcbiAgICAgICAgY29udGV4dC50b3BUcmFja2VyKCk7XG4gICAgICAgIGNvbnRleHQubGVmdFRyYWNrZXIoKTtcblxuICAgICAgICBpZiAoY29udGV4dC52ZWxvY2l0eVRvcCA+IDEwIHx8IGNvbnRleHQudmVsb2NpdHlUb3AgPCAtMTApIHtcbiAgICAgICAgICAgIGNvbnRleHQuYW1wbGl0dWRlVG9wID0gMC44ICogY29udGV4dC52ZWxvY2l0eVRvcDtcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0VG9wID0gTWF0aC5yb3VuZChjb250ZXh0LnNjcm9sbFRvcCArIGNvbnRleHQuYW1wbGl0dWRlVG9wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0VG9wID0gY29udGV4dC5zY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRleHQudmVsb2NpdHlMZWZ0ID4gMTAgfHwgY29udGV4dC52ZWxvY2l0eUxlZnQgPCAtMTApIHtcbiAgICAgICAgICAgIGNvbnRleHQuYW1wbGl0dWRlTGVmdCA9IDAuOCAqIGNvbnRleHQudmVsb2NpdHlMZWZ0O1xuICAgICAgICAgICAgY29udGV4dC50YXJnZXRMZWZ0ID0gTWF0aC5yb3VuZChjb250ZXh0LnNjcm9sbExlZnQgKyBjb250ZXh0LmFtcGxpdHVkZUxlZnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dC50YXJnZXRMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICBjb250ZXh0LmF1dG9TY3JvbGxUcmFja2VyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNvbnRleHQuYXV0b1Njcm9sbCk7XG5cbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGNvbnRleHQuc3dpcGUgKTtcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBjb250ZXh0LnJlbGVhc2UgKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoICEgY29udGV4dC5oYXNUb3VjaCAmJiBjb250ZXh0LnVzZXJPcHRpb25zLmVuYWJsZUtpbmV0aWNzICkge1xuICAgICAgICBjb250ZXh0LiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgY29udGV4dC50YXAsIHRydWUgKTtcbiAgICB9XG5cbiAgICBjb250ZXh0LiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGNvbnRleHQudGFwICk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2luZXRpY0VuZ2luZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9raW5ldGljRW5naW5lLnZhbHVlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBDb25uZWN0U2Nyb2xscyAodXRpbHMsIGtpbmV0aWNFbmdpbmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgb3B0aW9uczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRlbXBsYXRlOiAnPHNwYW4gZGF0YS1uYW1lPVwiY29ubnRlY3Qtc2Nyb2xsXCIgbmctdHJhbnNjbHVkZT48L3NwYW4+JyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBzY29wZS5oYXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcbiAgICAgICAgICAgIHNjb3BlLkRFVEVDVF9FVlQgPSBzY29wZS5oYXNUb3VjaCA/ICd0b3VjaHN0YXJ0JyA6ICdtb3VzZW92ZXInO1xuICAgICAgICAgICAgc2NvcGUuYWN0aXZlSWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIgPSBlbGVtZW50WzBdO1xuXG4gICAgICAgICAgICBzY29wZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBlbmFibGVLaW5ldGljczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbW92aW5nQXZlcmFnZTogMC4xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2NvcGUudXNlck9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgc2NvcGUuZGVmYXVsdE9wdGlvbnMsIHNjb3BlLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICBraW5ldGljRW5naW5lLmNhbGwodGhpcywgc2NvcGUsIHV0aWxzKTtcblxuICAgICAgICAgICAgc2NvcGUuc2V0QWN0aXZlTm9kZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuYWN0aXZlSWQgPSB1dGlscy5maW5kTWF0Y2hpbmdUYXJnZXQoZS50YXJnZXQsIHNjb3BlLmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5vblNjcm9sbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzY29wZS5wcmVzc2VkIHx8IHNjb3BlLmlzQXV0b1Njcm9sbGluZyApIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB2YWxYID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciB2YWxZID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0YXJnZXQuY2xpZW50V2lkdGggIT09IHRhcmdldC5zY3JvbGxXaWR0aCApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsWCA9IHRhcmdldC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5sYXN0U2Nyb2xsTGVmdCA9IHNjb3BlLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbExlZnQgPSB2YWxYO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbFggPSBzY29wZS5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIHRhcmdldC5jbGllbnRIZWlnaHQgIT09IHRhcmdldC5zY3JvbGxIZWlnaHQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbFkgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5sYXN0U2Nyb2xsVG9wID0gc2NvcGUuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUb3AgPSB2YWxZO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbFkgPSBzY29wZS5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBub2RlLmlkICE9PSBzY29wZS5hY3RpdmVJZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2hpbGRyZW5bMF0uc2Nyb2xsTGVmdCA9IHZhbFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuWzBdLnNjcm9sbFRvcCA9IHZhbFk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyLmFkZEV2ZW50TGlzdGVuZXIoIHNjb3BlLkRFVEVDVF9FVlQsIHNjb3BlLnNldEFjdGl2ZU5vZGUsIHRydWUgKTtcbiAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgc2NvcGUub25TY3JvbGwsIHRydWUgKTtcblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCBzY29wZS5ERVRFQ1RfRVZULCBzY29wZS5zZXRBY3RpdmVOb2RlICk7XG4gICAgICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBzY29wZS5vblNjcm9sbCApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGV4cG9zZSBmZXcgbWV0aG9kcyB0byB0aGUgcGFyZW50IGNvbnRyb2xsZXJcbiAgICAgICAgICAgIHNjb3BlLiRwYXJlbnQuY29ubmVjdGVkU2Nyb2xscyA9IHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1N0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRhcmdldExlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS50YXJnZXRUb3AgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5hbXBsaXR1ZGVMZWZ0ID0gLXNjb3BlLnNjcm9sbExlZnRcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYW1wbGl0dWRlVG9wID0gLXNjb3BlLnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5hdXRvU2Nyb2xsVHJhY2tlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzY29wZS5hdXRvU2Nyb2xsKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRMZWZ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRhcmdldExlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS50YXJnZXRUb3AgPSBzY29wZS5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmFtcGxpdHVkZUxlZnQgPSAtc2NvcGUuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYW1wbGl0dWRlVG9wID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5hdXRvU2Nyb2xsVHJhY2tlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzY29wZS5hdXRvU2Nyb2xsKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRUb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRpbWVTdGFtcCA9IHV0aWxzLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudGFyZ2V0TGVmdCA9IHNjb3BlLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRhcmdldFRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmFtcGxpdHVkZUxlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5hbXBsaXR1ZGVUb3AgPSAtc2NvcGUuc2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmlzQXV0b1Njcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmF1dG9TY3JvbGxUcmFja2VyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNjb3BlLmF1dG9TY3JvbGwpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWSA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwuY2xpZW50SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbExlZnQgPSBtYXhTY3JvbGxYO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbFRvcCA9IG1heFNjcm9sbFk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8obWF4U2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvRW5kTGVmdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxYID0gJGVsLnNjcm9sbFdpZHRoIC0gJGVsLmNsaWVudFdpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbExlZnQgPSBtYXhTY3JvbGxYO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvKG1heFNjcm9sbExlZnQsIHNjb3BlLnNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb0VuZFRvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFkgPSAkZWwuc2Nyb2xsSGVpZ2h0IC0gJGVsLmNsaWVudEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbFRvcCA9IG1heFNjcm9sbFk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8oc2NvcGUuc2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgZnVuY3Rpb24gY29ubmVjdFNjcm9sbHNDdHJsKCRzY29wZSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSAkc2NvcGUuY2hpbGROb2RlcyA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLmFkZFNjcm9sbEFyZWEgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGNoaWxkTm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9XG59XG5cbkNvbm5lY3RTY3JvbGxzLiRpbmplY3QgPSBbJ3V0aWxzJywgJ2tpbmV0aWNFbmdpbmUnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25uZWN0U2Nyb2xscztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb25uZWN0U2Nyb2xscy5kaXJlY3RpdmUuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFNjcm9sbEFyZWEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVpcmU6ICdeXmNvbm5lY3RTY3JvbGxzJyxcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGU6ICc8c3BhbiAgZGF0YS1uYW1lPVwic2Nyb2xsLWFyZWFcIiBuZy10cmFuc2NsdWRlPjwvc3Bhbj4nLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb25uZWN0U2Nyb2xsc0N0cmwpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0ciggJ2lkJywgJ1BBUlRJQ0lQQVRJTkdfTk9ERV8nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cmluZygyLCAxNSkgKTtcbiAgICAgICAgICAgIGNvbm5lY3RTY3JvbGxzQ3RybC5hZGRTY3JvbGxBcmVhKGVsZW1lbnRbMF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbEFyZWE7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2Nyb2xsQXJlYS5kaXJlY3RpdmUuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEtpbmV0aWNTY3JvbGwgKHV0aWxzLCBraW5ldGljRW5naW5lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG9wdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuIGRhdGEtbmFtZT1cImtpbmV0aWMtc2Nyb2xsXCIgbmctdHJhbnNjbHVkZT48L3NwYW4+JyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBzY29wZS5oYXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcbiAgICAgICAgICAgIHNjb3BlLkRFVEVDVF9FVlQgPSBzY29wZS5oYXNUb3VjaCA/ICd0b3VjaHN0YXJ0JyA6ICdtb3VzZW92ZXInO1xuICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyID0gZWxlbWVudFswXTtcbiAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMgPSBbIHNjb3BlLiRsaXN0ZW5lciBdO1xuXG4gICAgICAgICAgICBzY29wZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBlbmFibGVLaW5ldGljczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbW92aW5nQXZlcmFnZTogMC4xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2NvcGUudXNlck9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgc2NvcGUuZGVmYXVsdE9wdGlvbnMsIHNjb3BlLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICBraW5ldGljRW5naW5lLmNhbGwodGhpcywgc2NvcGUsIHV0aWxzKTtcblxuICAgICAgICAgICAgLy8gZXhwb3NlIGZldyBtZXRob2RzIHRvIHRoZSBwYXJlbnQgY29udHJvbGxlclxuICAgICAgICAgICAgc2NvcGUuJHBhcmVudC5raW5ldGljU2Nyb2xsID0ge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRMZWZ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8oMCwgc2NvcGUuc2Nyb2xsVG9wKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRUb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUbyhzY29wZS5zY3JvbGxMZWZ0LCAwKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxYID0gJGVsLnNjcm9sbFdpZHRoIC0gJGVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFkgPSAkZWwuc2Nyb2xsSGVpZ2h0IC0gJGVsLmNsaWVudEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxYID4gbWF4U2Nyb2xsTGVmdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsWDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbWF4U2Nyb2xsWSA+IG1heFNjcm9sbFRvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGxUb3AgPSBtYXhTY3JvbGxZO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvKG1heFNjcm9sbExlZnQsIG1heFNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb0VuZExlZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRlbCA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWCA9ICRlbC5zY3JvbGxXaWR0aCAtICRlbC5jbGllbnRXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxYID4gbWF4U2Nyb2xsTGVmdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsWDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUbyhtYXhTY3JvbGxMZWZ0LCBzY29wZS5zY3JvbGxUb3ApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmRUb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxZID0gJGVsLnNjcm9sbEhlaWdodCAtICRlbC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbWF4U2Nyb2xsWSA+IG1heFNjcm9sbFRvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGxUb3AgPSBtYXhTY3JvbGxZO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvKHNjb3BlLnNjcm9sbExlZnQsIG1heFNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5LaW5ldGljU2Nyb2xsLiRpbmplY3QgPSBbJ3V0aWxzJywgJ2tpbmV0aWNFbmdpbmUnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBLaW5ldGljU2Nyb2xsO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2tpbmV0aWNTY3JvbGwuZGlyZWN0aXZlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==