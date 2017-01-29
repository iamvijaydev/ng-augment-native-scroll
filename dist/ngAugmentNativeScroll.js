/*!
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
	
	angular.module('ngAugmentNativeScroll', []).factory('augNsUtils', __webpack_require__(1)).value('augNsOptions', __webpack_require__(2)).value('kineticEngine', __webpack_require__(3)).directive('connectScrolls', __webpack_require__(4)).directive('scrollArea', __webpack_require__(5)).directive('kineticScroll', __webpack_require__(6));

/***/ },
/* 1 */
/***/ function(module, exports) {

	function augNsUtils() {
	    (function () {
	        var lastTime = 0;
	        var vendors = ['ms', 'moz', 'webkit', 'o'];
	        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	        }
	
	        if (!window.requestAnimationFrame) {
	            window.requestAnimationFrame = function (callback, element) {
	                var currTime = new Date().getTime();
	                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	                var id = window.setTimeout(function () {
	                    callback(currTime + timeToCall);
	                }, timeToCall);
	                lastTime = currTime + timeToCall;
	                return id;
	            };
	        }
	
	        if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
	            clearTimeout(id);
	        };
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
	        }
	    };
	}
	
	module.exports = augNsUtils;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var augNsOptions = {
	    enableKinetics: true,
	    movingAverage: 0.1
	};
	
	module.exports = augNsOptions;

/***/ },
/* 3 */
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
	
	    var scrollGen = function (start, left, top) {
	        var toStart = start ? true : false;
	        var applyLeft = left ? true : false;
	        var applyTop = top ? true : false;
	
	        return function () {
	            var targetLeft = 0,
	                targetTop = 0,
	                amplitudeLeft = 0,
	                amplitudeTop = 0,
	                maxScrollLeft = 0,
	                maxScrollTop = 0;
	
	            if (toStart) {
	                targetLeft = applyLeft ? 0 : context.scrollLeft;
	                targetTop = applyTop ? 0 : context.scrollTop;
	                amplitudeLeft = applyLeft ? -context.scrollLeft : 0;
	                amplitudeTop = applyTop ? -context.scrollTop : 0;
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
	
	                targetLeft = applyLeft ? maxScrollLeft : context.scrollLeft;
	                targetTop = applyTop ? maxScrollTop : context.scrollTop;
	                amplitudeLeft = applyLeft ? 1 + context.scrollLeft : 0;
	                amplitudeTop = applyTop ? 1 + context.scrollTop : 0;
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
	        notTop = true;
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
/* 4 */
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
/* 5 */
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
/* 6 */
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
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4NGI4MTAxZGRjYThiODExYmFhYSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2F1Z05zVXRpbHMuZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXVnTnNPcHRpb25zLnZhbHVlLmpzIiwid2VicGFjazovLy8uL3NyYy9raW5ldGljRW5naW5lLnZhbHVlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb25uZWN0U2Nyb2xscy5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njcm9sbEFyZWEuZGlyZWN0aXZlLmpzIiwid2VicGFjazovLy8uL3NyYy9raW5ldGljU2Nyb2xsLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6WyJhbmd1bGFyIiwibW9kdWxlIiwiZmFjdG9yeSIsInJlcXVpcmUiLCJ2YWx1ZSIsImRpcmVjdGl2ZSIsImF1Z05zVXRpbHMiLCJsYXN0VGltZSIsInZlbmRvcnMiLCJ4IiwibGVuZ3RoIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImVsZW1lbnQiLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIk1hdGgiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJmaW5kTWF0Y2hpbmdUYXJnZXQiLCJ0YXJnZXQiLCJub2RlcyIsImZvdW5kIiwidGFnTmFtZSIsImZpbmQiLCJub2RlIiwicGFyZW50RWxlbWVudCIsImdldFBvaW50IiwiZSIsImhhc1RvdWNoIiwicG9pbnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwieSIsImNsaWVudFkiLCJub3ciLCJ1dGlscyIsImV4cG9ydHMiLCJhdWdOc09wdGlvbnMiLCJlbmFibGVLaW5ldGljcyIsIm1vdmluZ0F2ZXJhZ2UiLCJLaW5ldGljRW5naW5lIiwiY29udGV4dCIsInNjcm9sbExlZnQiLCJzY3JvbGxUb3AiLCJsYXN0U2Nyb2xsTGVmdCIsImxhc3RTY3JvbGxUb3AiLCJ0YXJnZXRUb3AiLCJ0YXJnZXRMZWZ0IiwidmVsb2NpdHlUb3AiLCJ2ZWxvY2l0eUxlZnQiLCJhbXBsaXR1ZGVUb3AiLCJhbXBsaXR1ZGVMZWZ0IiwidGltZVN0YW1wIiwicmVmZXJlbmNlWCIsInJlZmVyZW5jZVkiLCJwcmVzc2VkIiwiYXV0b1Njcm9sbFRyYWNrZXIiLCJpc0F1dG9TY3JvbGxpbmciLCJsZWZ0VHJhY2tlciIsImVsYXBzZWQiLCJkZWx0YSIsInVzZXJPcHRpb25zIiwidG9wVHJhY2tlciIsInNjcm9sbFRvIiwibGVmdCIsInRvcCIsImNvcnJlY3RlZExlZnQiLCJyb3VuZCIsImNvcnJlY3RlZFRvcCIsImNoaWxkTm9kZXMiLCJmb3JFYWNoIiwiJGVsIiwiY2hpbGRyZW4iLCJtYXhTY3JvbGxYIiwic2Nyb2xsV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1heFNjcm9sbFkiLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJhdXRvU2Nyb2xsIiwiZGVsdGFZIiwiZGVsdGFYIiwic2Nyb2xsWCIsInNjcm9sbFkiLCJ0aW1lQ29uc3RhbnQiLCJleHAiLCJjYW5jZWxBdXRvU2Nyb2xsIiwidGFwIiwiJGxpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN3aXBlIiwicmVsZWFzZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIiRvbiIsInNjcm9sbEdlbiIsInN0YXJ0IiwidG9TdGFydCIsImFwcGx5TGVmdCIsImFwcGx5VG9wIiwibWF4U2Nyb2xsTGVmdCIsIm1heFNjcm9sbFRvcCIsIm5vdFN0YXJ0Iiwibm90TGVmdCIsIm5vdFRvcCIsImV4cG9zZWRNZXRob2RzIiwic2Nyb2xsVG9TdGFydCIsInNjcm9sbFRvU3RhcnRMZWZ0Iiwic2Nyb2xsVG9TdGFydFRvcCIsInNjcm9sbFRvRW5kIiwic2Nyb2xsVG9FbmRMZWZ0Iiwic2Nyb2xsVG9FbmRUb3AiLCJDb25uZWN0U2Nyb2xscyIsImtpbmV0aWNFbmdpbmUiLCJyZXN0cmljdCIsInNjb3BlIiwib3B0aW9ucyIsInRyYW5zY2x1ZGUiLCJyZXBsYWNlIiwidGVtcGxhdGUiLCJsaW5rIiwiREVURUNUX0VWVCIsImFjdGl2ZUlkIiwidW5kZWZpbmVkIiwiZXh0ZW5kIiwiY2FsbCIsInNldEFjdGl2ZU5vZGUiLCJvblNjcm9sbCIsInZhbFgiLCJ2YWxZIiwiJHBhcmVudCIsImF1Z05zIiwiY29udHJvbGxlciIsImNvbm5lY3RTY3JvbGxzQ3RybCIsIiRzY29wZSIsImFkZFNjcm9sbEFyZWEiLCJwdXNoIiwiJGluamVjdCIsIlNjcm9sbEFyZWEiLCJhdHRycyIsImF0dHIiLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsIktpbmV0aWNTY3JvbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQUEsU0FBUUMsTUFBUixDQUFlLHVCQUFmLEVBQXdDLEVBQXhDLEVBQ0tDLE9BREwsQ0FDYSxZQURiLEVBQzJCLG1CQUFBQyxDQUFRLENBQVIsQ0FEM0IsRUFFS0MsS0FGTCxDQUVXLGNBRlgsRUFFMkIsbUJBQUFELENBQVEsQ0FBUixDQUYzQixFQUdLQyxLQUhMLENBR1csZUFIWCxFQUc0QixtQkFBQUQsQ0FBUSxDQUFSLENBSDVCLEVBSUtF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QW9DdUMsWUFBcEMsRUFBa0Q2RSxhQUFsRCxFQUFpRTtBQUM3RCxZQUFPO0FBQ0hDLG1CQUFVLEdBRFA7QUFFSEMsZ0JBQU87QUFDSEMsc0JBQVM7QUFETixVQUZKO0FBS0hDLHFCQUFZLElBTFQ7QUFNSEMsa0JBQVMsSUFOTjtBQU9IQyxtQkFBVSx3REFQUDtBQVFIQyxlQUFNLFVBQVVMLEtBQVYsRUFBaUI3RyxPQUFqQixFQUEwQjtBQUM1QjZHLG1CQUFNekYsUUFBTixHQUFpQixrQkFBa0J4QixNQUFuQztBQUNBaUgsbUJBQU1NLFVBQU4sR0FBbUJOLE1BQU16RixRQUFOLEdBQWlCLFlBQWpCLEdBQWdDLFdBQW5EO0FBQ0F5RixtQkFBTTVCLFNBQU4sR0FBa0JqRixRQUFRLENBQVIsQ0FBbEI7QUFDQTZHLG1CQUFNL0MsVUFBTixHQUFtQixDQUFFK0MsTUFBTTVCLFNBQVIsQ0FBbkI7O0FBRUE0QixtQkFBTXZELFdBQU4sR0FBb0JyRSxRQUFRcUksTUFBUixDQUFlLEVBQWYsRUFBbUJ4RixZQUFuQixFQUFpQytFLE1BQU1DLE9BQXZDLENBQXBCOztBQUVBSCwyQkFBY1ksSUFBZCxDQUFtQixJQUFuQixFQUF5QlYsS0FBekIsRUFBZ0N0SCxVQUFoQzs7QUFFQTtBQUNBc0gsbUJBQU1lLE9BQU4sQ0FBY0MsS0FBZCxHQUFzQmhCLE1BQU1WLGNBQTVCO0FBQ0g7QUFwQkUsTUFBUDtBQXNCSDs7QUFFRHVDLGVBQWNQLE9BQWQsR0FBd0IsQ0FBQyxZQUFELEVBQWUsY0FBZixFQUErQixlQUEvQixDQUF4Qjs7QUFFQWpKLFFBQU8yQyxPQUFQLEdBQWlCNkcsYUFBakIsQyIsImZpbGUiOiJEOlxcV29ya1xcbmctYXVnbWVudC1uYXRpdmUtc2Nyb2xsL2Rpc3QvbmdBdWdtZW50TmF0aXZlU2Nyb2xsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibmdBdWdtZW50TmF0aXZlU2Nyb2xsXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm5nQXVnbWVudE5hdGl2ZVNjcm9sbFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4NGI4MTAxZGRjYThiODExYmFhYSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ0F1Z21lbnROYXRpdmVTY3JvbGwnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdhdWdOc1V0aWxzJywgcmVxdWlyZSgnLi9hdWdOc1V0aWxzLmZhY3RvcnkuanMnKSlcclxuICAgIC52YWx1ZSgnYXVnTnNPcHRpb25zJywgcmVxdWlyZSgnLi9hdWdOc09wdGlvbnMudmFsdWUuanMnKSlcclxuICAgIC52YWx1ZSgna2luZXRpY0VuZ2luZScsIHJlcXVpcmUoJy4va2luZXRpY0VuZ2luZS52YWx1ZS5qcycpKVxyXG4gICAgLmRpcmVjdGl2ZSgnY29ubmVjdFNjcm9sbHMnLCByZXF1aXJlKCcuL2Nvbm5lY3RTY3JvbGxzLmRpcmVjdGl2ZS5qcycpKVxyXG4gICAgLmRpcmVjdGl2ZSgnc2Nyb2xsQXJlYScsIHJlcXVpcmUoJy4vc2Nyb2xsQXJlYS5kaXJlY3RpdmUuanMnKSlcclxuICAgIC5kaXJlY3RpdmUoJ2tpbmV0aWNTY3JvbGwnLCByZXF1aXJlKCcuL2tpbmV0aWNTY3JvbGwuZGlyZWN0aXZlLmpzJykpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJmdW5jdGlvbiBhdWdOc1V0aWxzICgpIHtcclxuICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbGFzdFRpbWUgPSAwO1xyXG4gICAgICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcclxuICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xyXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoICEgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcclxuICAgICAgICAgICAgICAgIH0sIHRpbWVUb0NhbGwpO1xyXG4gICAgICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoICEgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIClcclxuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9KCkpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZmluZE1hdGNoaW5nVGFyZ2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBub2Rlcykge1xyXG4gICAgICAgICAgICB2YXIgZm91bmQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEgbm9kZXMubGVuZ3RoIHx8IHRhcmdldC50YWdOYW1lID09PSAnQk9EWScgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0JPRFknO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3VuZCA9IG5vZGVzLmZpbmQoZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmlkID09PSB0YXJnZXQuaWRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGZvdW5kICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5pZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1RhcmdldCh0YXJnZXQucGFyZW50RWxlbWVudCwgbm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb2ludDogZnVuY3Rpb24gKGUsIGhhc1RvdWNoKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmKCBoYXNUb3VjaCAmJiBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgIHBvaW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHggOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSA6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA6IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSA6IGV2ZW50LmNsaWVudFlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0VGltZTogRGF0ZS5ub3cgfHwgZnVuY3Rpb24gZ2V0VGltZSAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnV0aWxzLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXVnTnNVdGlscztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2F1Z05zVXRpbHMuZmFjdG9yeS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhdWdOc09wdGlvbnMgPSB7XHJcbiAgICBlbmFibGVLaW5ldGljczogdHJ1ZSxcclxuICAgIG1vdmluZ0F2ZXJhZ2U6IDAuMVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGF1Z05zT3B0aW9ucztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2F1Z05zT3B0aW9ucy52YWx1ZS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIEtpbmV0aWNFbmdpbmUgKGNvbnRleHQsIHV0aWxzKSB7XHJcbiAgICBjb250ZXh0LnNjcm9sbExlZnQgPSAwO1xyXG4gICAgY29udGV4dC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgY29udGV4dC5sYXN0U2Nyb2xsTGVmdCA9IDA7XHJcbiAgICBjb250ZXh0Lmxhc3RTY3JvbGxUb3AgPSAwO1xyXG4gICAgY29udGV4dC50YXJnZXRUb3AgPSAwO1xyXG4gICAgY29udGV4dC50YXJnZXRMZWZ0ID0gMDtcclxuXHJcbiAgICBjb250ZXh0LnZlbG9jaXR5VG9wID0gMDtcclxuICAgIGNvbnRleHQudmVsb2NpdHlMZWZ0ID0gMDtcclxuICAgIGNvbnRleHQuYW1wbGl0dWRlVG9wID0gMDtcclxuICAgIGNvbnRleHQuYW1wbGl0dWRlTGVmdCA9IDA7XHJcblxyXG4gICAgY29udGV4dC50aW1lU3RhbXAgPSAwO1xyXG4gICAgY29udGV4dC5yZWZlcmVuY2VYID0gMDtcclxuICAgIGNvbnRleHQucmVmZXJlbmNlWSA9IDA7XHJcbiAgICBjb250ZXh0LnByZXNzZWQgPSBmYWxzZTtcclxuICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSBudWxsO1xyXG4gICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBjb250ZXh0LmxlZnRUcmFja2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBub3csIGVsYXBzZWQsIGRlbHRhO1xyXG5cclxuICAgICAgICBub3cgPSB1dGlscy5nZXRUaW1lKCk7XHJcbiAgICAgICAgZWxhcHNlZCA9IG5vdyAtIGNvbnRleHQudGltZVN0YW1wO1xyXG4gICAgICAgIGNvbnRleHQudGltZVN0YW1wID0gbm93O1xyXG4gICAgICAgIGRlbHRhID0gY29udGV4dC5zY3JvbGxMZWZ0IC0gY29udGV4dC5sYXN0U2Nyb2xsTGVmdDtcclxuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xyXG5cclxuICAgICAgICBjb250ZXh0LnZlbG9jaXR5TGVmdCA9IGNvbnRleHQudXNlck9wdGlvbnMubW92aW5nQXZlcmFnZSAqICgxMDAwICogZGVsdGEgLyAoMSArIGVsYXBzZWQpKSArIDAuMiAqIGNvbnRleHQudmVsb2NpdHlMZWZ0O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQudG9wVHJhY2tlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbm93LCBlbGFwc2VkLCBkZWx0YTtcclxuXHJcbiAgICAgICAgbm93ID0gdXRpbHMuZ2V0VGltZSgpO1xyXG4gICAgICAgIGVsYXBzZWQgPSBub3cgLSBjb250ZXh0LnRpbWVTdGFtcDtcclxuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IG5vdztcclxuICAgICAgICBkZWx0YSA9IGNvbnRleHQuc2Nyb2xsVG9wIC0gY29udGV4dC5sYXN0U2Nyb2xsVG9wO1xyXG4gICAgICAgIGNvbnRleHQubGFzdFNjcm9sbFRvcCA9IGNvbnRleHQuc2Nyb2xsVG9wO1xyXG5cclxuICAgICAgICBjb250ZXh0LnZlbG9jaXR5VG9wID0gY29udGV4dC51c2VyT3B0aW9ucy5tb3ZpbmdBdmVyYWdlICogKDEwMDAgKiBkZWx0YSAvICgxICsgZWxhcHNlZCkpICsgMC4yICogY29udGV4dC52ZWxvY2l0eVRvcDtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnNjcm9sbFRvID0gZnVuY3Rpb24obGVmdCwgdG9wKSB7XHJcbiAgICAgICAgdmFyIGNvcnJlY3RlZExlZnQgPSBNYXRoLnJvdW5kKGxlZnQpO1xyXG4gICAgICAgIHZhciBjb3JyZWN0ZWRUb3AgPSBNYXRoLnJvdW5kKHRvcCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgdmFyICRlbCA9IG5vZGUuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgIHZhciBtYXhTY3JvbGxYID0gJGVsLnNjcm9sbFdpZHRoIC0gJGVsLmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWSA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxYID4gMCAmJiBjb3JyZWN0ZWRMZWZ0ID49IDAgJiYgY29ycmVjdGVkTGVmdCA8PSBtYXhTY3JvbGxYICkge1xyXG4gICAgICAgICAgICAgICAgJGVsLnNjcm9sbExlZnQgPSBjb3JyZWN0ZWRMZWZ0O1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zY3JvbGxMZWZ0ID0gY29ycmVjdGVkTGVmdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIG1heFNjcm9sbFkgPiAwICYmIGNvcnJlY3RlZFRvcCA+PSAwICYmIGNvcnJlY3RlZFRvcCA8PSBtYXhTY3JvbGxZICkge1xyXG4gICAgICAgICAgICAgICAgJGVsLnNjcm9sbFRvcCA9IGNvcnJlY3RlZFRvcDtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2Nyb2xsVG9wID0gY29ycmVjdGVkVG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmF1dG9TY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZWxhcHNlZDtcclxuICAgICAgICB2YXIgZGVsdGFZID0gMCwgZGVsdGFYID0gMCwgc2Nyb2xsWCA9IDAsIHNjcm9sbFkgPSAwO1xyXG4gICAgICAgIHZhciB0aW1lQ29uc3RhbnQgPSAzMjU7XHJcblxyXG4gICAgICAgIGVsYXBzZWQgPSB1dGlscy5nZXRUaW1lKCkgLSBjb250ZXh0LnRpbWVTdGFtcDtcclxuXHJcbiAgICAgICAgaWYgKCBjb250ZXh0LmFtcGxpdHVkZVRvcCApIHtcclxuICAgICAgICAgICAgZGVsdGFZID0gLWNvbnRleHQuYW1wbGl0dWRlVG9wICogTWF0aC5leHAoLWVsYXBzZWQgLyB0aW1lQ29uc3RhbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGNvbnRleHQuYW1wbGl0dWRlTGVmdCApIHtcclxuICAgICAgICAgICAgZGVsdGFYID0gLWNvbnRleHQuYW1wbGl0dWRlTGVmdCAqIE1hdGguZXhwKC1lbGFwc2VkIC8gdGltZUNvbnN0YW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggZGVsdGFYID4gMC41IHx8IGRlbHRhWCA8IC0wLjUgKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFggPSBkZWx0YVg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Nyb2xsWCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGRlbHRhWSA+IDAuNSB8fCBkZWx0YVkgPCAtMC41ICkge1xyXG4gICAgICAgICAgICBzY3JvbGxZID0gZGVsdGFZO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dC5zY3JvbGxUbyhjb250ZXh0LnRhcmdldExlZnQgKyBzY3JvbGxYLCBjb250ZXh0LnRhcmdldFRvcCArIHNjcm9sbFkpO1xyXG5cclxuICAgICAgICBpZiAoIHNjcm9sbFggIT09IDAgfHwgc2Nyb2xsWSAhPT0gMCApIHtcclxuICAgICAgICAgICAgY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShjb250ZXh0LmF1dG9TY3JvbGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuaXNBdXRvU2Nyb2xsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmNhbmNlbEF1dG9TY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCBjb250ZXh0LmlzQXV0b1Njcm9sbGluZyApIHtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlcik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuaXNBdXRvU2Nyb2xsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnRhcCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVggPSB1dGlscy5nZXRQb2ludChlLCBjb250ZXh0Lmhhc1RvdWNoKS54O1xyXG4gICAgICAgIGNvbnRleHQucmVmZXJlbmNlWSA9IHV0aWxzLmdldFBvaW50KGUsIGNvbnRleHQuaGFzVG91Y2gpLnk7XHJcblxyXG4gICAgICAgIGNvbnRleHQudmVsb2NpdHlUb3AgPSBjb250ZXh0LmFtcGxpdHVkZVRvcCA9IDA7XHJcbiAgICAgICAgY29udGV4dC52ZWxvY2l0eUxlZnQgPSBjb250ZXh0LmFtcGxpdHVkZUxlZnQgPSAwO1xyXG5cclxuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxUb3AgPSBjb250ZXh0LnNjcm9sbFRvcDtcclxuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xyXG5cclxuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IHV0aWxzLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuJGxpc3RlbmVyLmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBjb250ZXh0LnN3aXBlLCB0cnVlICk7XHJcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBjb250ZXh0LnJlbGVhc2UsIHRydWUgKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuc3dpcGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB4LCB5LCBkZWx0YVgsIGRlbHRhWTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQucHJlc3NlZCkge1xyXG4gICAgICAgICAgICB4ID0gdXRpbHMuZ2V0UG9pbnQoZSwgY29udGV4dC5oYXNUb3VjaCkueDtcclxuICAgICAgICAgICAgeSA9IHV0aWxzLmdldFBvaW50KGUsIGNvbnRleHQuaGFzVG91Y2gpLnk7XHJcblxyXG4gICAgICAgICAgICBkZWx0YVggPSBjb250ZXh0LnJlZmVyZW5jZVggLSB4O1xyXG4gICAgICAgICAgICBkZWx0YVkgPSBjb250ZXh0LnJlZmVyZW5jZVkgLSB5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlbHRhWCA+IDIgfHwgZGVsdGFYIDwgLTIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQucmVmZXJlbmNlWCA9IHg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWx0YVggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkZWx0YVkgPiAyIHx8IGRlbHRhWSA8IC0yKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVkgPSB5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udGV4dC50b3BUcmFja2VyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGVmdFRyYWNrZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuc2Nyb2xsVG8oIGNvbnRleHQuc2Nyb2xsTGVmdCArIGRlbHRhWCwgY29udGV4dC5zY3JvbGxUb3AgKyBkZWx0YVkgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnJlbGVhc2UgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgY29udGV4dC5wcmVzc2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnRleHQudGltZVN0YW1wID0gdXRpbHMuZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnRleHQudG9wVHJhY2tlcigpO1xyXG4gICAgICAgIGNvbnRleHQubGVmdFRyYWNrZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQudmVsb2NpdHlUb3AgPiAxMCB8fCBjb250ZXh0LnZlbG9jaXR5VG9wIDwgLTEwKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYW1wbGl0dWRlVG9wID0gMC44ICogY29udGV4dC52ZWxvY2l0eVRvcDtcclxuICAgICAgICAgICAgY29udGV4dC50YXJnZXRUb3AgPSBNYXRoLnJvdW5kKGNvbnRleHQuc2Nyb2xsVG9wICsgY29udGV4dC5hbXBsaXR1ZGVUb3ApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0VG9wID0gY29udGV4dC5zY3JvbGxUb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250ZXh0LnZlbG9jaXR5TGVmdCA+IDEwIHx8IGNvbnRleHQudmVsb2NpdHlMZWZ0IDwgLTEwKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYW1wbGl0dWRlTGVmdCA9IDAuOCAqIGNvbnRleHQudmVsb2NpdHlMZWZ0O1xyXG4gICAgICAgICAgICBjb250ZXh0LnRhcmdldExlZnQgPSBNYXRoLnJvdW5kKGNvbnRleHQuc2Nyb2xsTGVmdCArIGNvbnRleHQuYW1wbGl0dWRlTGVmdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29udGV4dC50YXJnZXRMZWZ0ID0gY29udGV4dC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY29udGV4dC5hdXRvU2Nyb2xsKTtcclxuXHJcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGNvbnRleHQuc3dpcGUgKTtcclxuICAgICAgICBjb250ZXh0LiRsaXN0ZW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIGNvbnRleHQucmVsZWFzZSApO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCAhIGNvbnRleHQuaGFzVG91Y2ggJiYgY29udGV4dC51c2VyT3B0aW9ucy5lbmFibGVLaW5ldGljcyApIHtcclxuICAgICAgICBjb250ZXh0LiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgY29udGV4dC50YXAsIHRydWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250ZXh0LiRsaXN0ZW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgY29udGV4dC50YXAgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB2YXIgc2Nyb2xsR2VuID0gZnVuY3Rpb24gKHN0YXJ0LCBsZWZ0LCB0b3ApIHtcclxuICAgICAgICB2YXIgdG9TdGFydCA9IHN0YXJ0ID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHZhciBhcHBseUxlZnQgPSBsZWZ0ID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHZhciBhcHBseVRvcCA9IHRvcCA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldExlZnQgPSAwLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VG9wID0gMCxcclxuICAgICAgICAgICAgICAgIGFtcGxpdHVkZUxlZnQgPSAwLFxyXG4gICAgICAgICAgICAgICAgYW1wbGl0dWRlVG9wID0gMCxcclxuICAgICAgICAgICAgICAgIG1heFNjcm9sbExlZnQgPSAwLFxyXG4gICAgICAgICAgICAgICAgbWF4U2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICggdG9TdGFydCApIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSBhcHBseUxlZnQgPyAwIDogY29udGV4dC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VG9wID0gYXBwbHlUb3AgPyAwIDogY29udGV4dC5zY3JvbGxUb3A7XHJcbiAgICAgICAgICAgICAgICBhbXBsaXR1ZGVMZWZ0ID0gYXBwbHlMZWZ0ID8gLWNvbnRleHQuc2Nyb2xsTGVmdCA6IDA7XHJcbiAgICAgICAgICAgICAgICBhbXBsaXR1ZGVUb3AgPSBhcHBseVRvcCA/IC1jb250ZXh0LnNjcm9sbFRvcCA6IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxYID0gJGVsLnNjcm9sbFdpZHRoIC0gJGVsLmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxZID0gJGVsLnNjcm9sbEhlaWdodCAtICRlbC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggbWF4U2Nyb2xsWCA+IG1heFNjcm9sbExlZnQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbExlZnQgPSBtYXhTY3JvbGxYO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFkgPiBtYXhTY3JvbGxUb3AgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbFRvcCA9IG1heFNjcm9sbFk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IGFwcGx5TGVmdCA/IG1heFNjcm9sbExlZnQgOiBjb250ZXh0LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRUb3AgPSBhcHBseVRvcCA/IG1heFNjcm9sbFRvcCA6IGNvbnRleHQuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgYW1wbGl0dWRlTGVmdCA9IGFwcGx5TGVmdCA/IDEgKyBjb250ZXh0LnNjcm9sbExlZnQgOiAwO1xyXG4gICAgICAgICAgICAgICAgYW1wbGl0dWRlVG9wID0gYXBwbHlUb3AgPyAxICsgY29udGV4dC5zY3JvbGxUb3AgOiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGFtcGxpdHVkZUxlZnQgIT09IDAgfHwgYW1wbGl0dWRlVG9wICE9PSAwICkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRhcmdldExlZnQgPSB0YXJnZXRMZWZ0O1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC50YXJnZXRUb3AgPSB0YXJnZXRUb3A7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmFtcGxpdHVkZUxlZnQgPSBhbXBsaXR1ZGVMZWZ0O1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5hbXBsaXR1ZGVUb3AgPSBhbXBsaXR1ZGVUb3A7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5hdXRvU2Nyb2xsVHJhY2tlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShjb250ZXh0LmF1dG9TY3JvbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBzdGFydCA9IHRydWUsXHJcbiAgICAgICAgbm90U3RhcnQgPSBmYWxzZSxcclxuICAgICAgICBsZWZ0ID0gdHJ1ZSxcclxuICAgICAgICBub3RMZWZ0ID0gZmFsc2UsXHJcbiAgICAgICAgdG9wID0gdHJ1ZSxcclxuICAgICAgICBub3RUb3AgPSB0cnVlO1xyXG4gICAgY29udGV4dC5leHBvc2VkTWV0aG9kcyA9IHtcclxuICAgICAgICBzY3JvbGxUb1N0YXJ0OiBzY3JvbGxHZW4oc3RhcnQsIGxlZnQsIHRvcCksXHJcbiAgICAgICAgc2Nyb2xsVG9TdGFydExlZnQ6IHNjcm9sbEdlbihzdGFydCwgbGVmdCwgbm90VG9wKSxcclxuICAgICAgICBzY3JvbGxUb1N0YXJ0VG9wOiBzY3JvbGxHZW4oc3RhcnQsIG5vdExlZnQsIHRvcCksXHJcbiAgICAgICAgc2Nyb2xsVG9FbmQ6IHNjcm9sbEdlbihub3RTdGFydCwgbGVmdCwgdG9wKSxcclxuICAgICAgICBzY3JvbGxUb0VuZExlZnQ6IHNjcm9sbEdlbihub3RTdGFydCwgbGVmdCwgbm90VG9wKSxcclxuICAgICAgICBzY3JvbGxUb0VuZFRvcDogc2Nyb2xsR2VuKG5vdFN0YXJ0LCBub3RMZWZ0LCB0b3ApXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2luZXRpY0VuZ2luZTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2tpbmV0aWNFbmdpbmUudmFsdWUuanMiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBDb25uZWN0U2Nyb2xscyAoYXVnTnNVdGlscywgYXVnTnNPcHRpb25zLCBraW5ldGljRW5naW5lKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgb3B0aW9uczogJz0nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgdGVtcGxhdGU6ICc8c3BhbiBkYXRhLW5hbWU9XCJjb25udGVjdC1zY3JvbGxcIiBuZy10cmFuc2NsdWRlPjwvc3Bhbj4nLFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBzY29wZS5oYXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcclxuICAgICAgICAgICAgc2NvcGUuREVURUNUX0VWVCA9IHNjb3BlLmhhc1RvdWNoID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlb3Zlcic7XHJcbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZUlkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIgPSBlbGVtZW50WzBdO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUudXNlck9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgYXVnTnNPcHRpb25zLCBzY29wZS5vcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGtpbmV0aWNFbmdpbmUuY2FsbCh0aGlzLCBzY29wZSwgYXVnTnNVdGlscyk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5zZXRBY3RpdmVOb2RlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmFjdGl2ZUlkID0gYXVnTnNVdGlscy5maW5kTWF0Y2hpbmdUYXJnZXQoZS50YXJnZXQsIHNjb3BlLmNoaWxkTm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY29wZS5vblNjcm9sbCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHNjb3BlLnByZXNzZWQgfHwgc2NvcGUuaXNBdXRvU2Nyb2xsaW5nICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsWCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxZID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0LmNsaWVudFdpZHRoICE9PSB0YXJnZXQuc2Nyb2xsV2lkdGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsWCA9IHRhcmdldC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmxhc3RTY3JvbGxMZWZ0ID0gc2NvcGUuc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxMZWZ0ID0gdmFsWDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsWCA9IHNjb3BlLnNjcm9sbExlZnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRhcmdldC5jbGllbnRIZWlnaHQgIT09IHRhcmdldC5zY3JvbGxIZWlnaHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsWSA9IHRhcmdldC5zY3JvbGxUb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubGFzdFNjcm9sbFRvcCA9IHNjb3BlLnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUb3AgPSB2YWxZO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxZID0gc2NvcGUuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBub2RlLmlkICE9PSBzY29wZS5hY3RpdmVJZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jaGlsZHJlblswXS5zY3JvbGxMZWZ0ID0gdmFsWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jaGlsZHJlblswXS5zY3JvbGxUb3AgPSB2YWxZO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIuYWRkRXZlbnRMaXN0ZW5lciggc2NvcGUuREVURUNUX0VWVCwgc2NvcGUuc2V0QWN0aXZlTm9kZSwgdHJ1ZSApO1xyXG4gICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIHNjb3BlLm9uU2Nyb2xsLCB0cnVlICk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggc2NvcGUuREVURUNUX0VWVCwgc2NvcGUuc2V0QWN0aXZlTm9kZSApO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBzY29wZS5vblNjcm9sbCApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGV4cG9zZSBmZXcgbWV0aG9kcyB0byB0aGUgcGFyZW50IGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgc2NvcGUuJHBhcmVudC5hdWdOcyA9IHNjb3BlLmV4cG9zZWRNZXRob2RzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCBmdW5jdGlvbiBjb25uZWN0U2Nyb2xsc0N0cmwoJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGVzID0gJHNjb3BlLmNoaWxkTm9kZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkU2Nyb2xsQXJlYSA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XVxyXG4gICAgfVxyXG59XHJcblxyXG5Db25uZWN0U2Nyb2xscy4kaW5qZWN0ID0gWydhdWdOc1V0aWxzJywgJ2F1Z05zT3B0aW9ucycsICdraW5ldGljRW5naW5lJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbm5lY3RTY3JvbGxzO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29ubmVjdFNjcm9sbHMuZGlyZWN0aXZlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gU2Nyb2xsQXJlYSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcXVpcmU6ICdeXmNvbm5lY3RTY3JvbGxzJyxcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuICBkYXRhLW5hbWU9XCJzY3JvbGwtYXJlYVwiIG5nLXRyYW5zY2x1ZGU+PC9zcGFuPicsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29ubmVjdFNjcm9sbHNDdHJsKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0ciggJ2lkJywgJ1BBUlRJQ0lQQVRJTkdfTk9ERV8nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cmluZygyLCAxNSkgKTtcclxuICAgICAgICAgICAgY29ubmVjdFNjcm9sbHNDdHJsLmFkZFNjcm9sbEFyZWEoZWxlbWVudFswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbEFyZWE7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JvbGxBcmVhLmRpcmVjdGl2ZS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIEtpbmV0aWNTY3JvbGwgKGF1Z05zVXRpbHMsIGF1Z05zT3B0aW9ucywga2luZXRpY0VuZ2luZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6ICc9J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPHNwYW4gZGF0YS1uYW1lPVwia2luZXRpYy1zY3JvbGxcIiBuZy10cmFuc2NsdWRlPjwvc3Bhbj4nLFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBzY29wZS5oYXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcclxuICAgICAgICAgICAgc2NvcGUuREVURUNUX0VWVCA9IHNjb3BlLmhhc1RvdWNoID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlb3Zlcic7XHJcbiAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lciA9IGVsZW1lbnRbMF07XHJcbiAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMgPSBbIHNjb3BlLiRsaXN0ZW5lciBdO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUudXNlck9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgYXVnTnNPcHRpb25zLCBzY29wZS5vcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGtpbmV0aWNFbmdpbmUuY2FsbCh0aGlzLCBzY29wZSwgYXVnTnNVdGlscyk7XHJcblxyXG4gICAgICAgICAgICAvLyBleHBvc2UgZmV3IG1ldGhvZHMgdG8gdGhlIHBhcmVudCBjb250cm9sbGVyXHJcbiAgICAgICAgICAgIHNjb3BlLiRwYXJlbnQuYXVnTnMgPSBzY29wZS5leHBvc2VkTWV0aG9kcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbktpbmV0aWNTY3JvbGwuJGluamVjdCA9IFsnYXVnTnNVdGlscycsICdhdWdOc09wdGlvbnMnLCAna2luZXRpY0VuZ2luZSddO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLaW5ldGljU2Nyb2xsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2luZXRpY1Njcm9sbC5kaXJlY3RpdmUuanMiXSwic291cmNlUm9vdCI6IiJ9