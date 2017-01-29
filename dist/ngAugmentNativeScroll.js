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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5NTA4MDhmNTZkMzFlNTdiMzA0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLmZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbmV0aWNFbmdpbmUudmFsdWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nvbm5lY3RTY3JvbGxzLmRpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nyb2xsQXJlYS5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tpbmV0aWNTY3JvbGwuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwicmVxdWlyZSIsInZhbHVlIiwiZGlyZWN0aXZlIiwiVXRpbHNGYWN0b3J5IiwiZmluZE1hdGNoaW5nVGFyZ2V0IiwidGFyZ2V0Iiwibm9kZXMiLCJmb3VuZCIsImxlbmd0aCIsInRhZ05hbWUiLCJmaW5kIiwibm9kZSIsImlkIiwicGFyZW50RWxlbWVudCIsImdldFBvaW50IiwiZSIsImhhc1RvdWNoIiwicG9pbnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsImdldFRpbWUiLCJEYXRlIiwibm93IiwidXRpbHMiLCJleHBvcnRzIiwiS2luZXRpY0VuZ2luZSIsImNvbnRleHQiLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsVG9wIiwibGFzdFNjcm9sbExlZnQiLCJsYXN0U2Nyb2xsVG9wIiwidGFyZ2V0VG9wIiwidGFyZ2V0TGVmdCIsInZlbG9jaXR5VG9wIiwidmVsb2NpdHlMZWZ0IiwiYW1wbGl0dWRlVG9wIiwiYW1wbGl0dWRlTGVmdCIsInRpbWVTdGFtcCIsInJlZmVyZW5jZVgiLCJyZWZlcmVuY2VZIiwicHJlc3NlZCIsImF1dG9TY3JvbGxUcmFja2VyIiwiaXNBdXRvU2Nyb2xsaW5nIiwibGVmdFRyYWNrZXIiLCJlbGFwc2VkIiwiZGVsdGEiLCJ1c2VyT3B0aW9ucyIsIm1vdmluZ0F2ZXJhZ2UiLCJ0b3BUcmFja2VyIiwic2Nyb2xsVG8iLCJsZWZ0IiwidG9wIiwiY29ycmVjdGVkTGVmdCIsIk1hdGgiLCJyb3VuZCIsImNvcnJlY3RlZFRvcCIsImNoaWxkTm9kZXMiLCJmb3JFYWNoIiwiJGVsIiwiY2hpbGRyZW4iLCJtYXhTY3JvbGxYIiwic2Nyb2xsV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1heFNjcm9sbFkiLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJhdXRvU2Nyb2xsIiwiZGVsdGFZIiwiZGVsdGFYIiwic2Nyb2xsWCIsInNjcm9sbFkiLCJ0aW1lQ29uc3RhbnQiLCJleHAiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBdXRvU2Nyb2xsIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ0YXAiLCJ4IiwieSIsIiRsaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzd2lwZSIsInJlbGVhc2UiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlbmFibGVLaW5ldGljcyIsIiRvbiIsIkNvbm5lY3RTY3JvbGxzIiwia2luZXRpY0VuZ2luZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJvcHRpb25zIiwidHJhbnNjbHVkZSIsInJlcGxhY2UiLCJ0ZW1wbGF0ZSIsImxpbmsiLCJlbGVtZW50Iiwid2luZG93IiwiREVURUNUX0VWVCIsImFjdGl2ZUlkIiwidW5kZWZpbmVkIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmQiLCJjYWxsIiwic2V0QWN0aXZlTm9kZSIsIm9uU2Nyb2xsIiwidmFsWCIsInZhbFkiLCIkcGFyZW50IiwiY29ubmVjdGVkU2Nyb2xscyIsInNjcm9sbFRvU3RhcnQiLCJzY3JvbGxUb1N0YXJ0TGVmdCIsInNjcm9sbFRvU3RhcnRUb3AiLCJzY3JvbGxUb0VuZCIsIm1heFNjcm9sbExlZnQiLCJtYXhTY3JvbGxUb3AiLCJzY3JvbGxUb0VuZExlZnQiLCJzY3JvbGxUb0VuZFRvcCIsImNvbnRyb2xsZXIiLCJjb25uZWN0U2Nyb2xsc0N0cmwiLCIkc2NvcGUiLCJhZGRTY3JvbGxBcmVhIiwicHVzaCIsIiRpbmplY3QiLCJTY3JvbGxBcmVhIiwiYXR0cnMiLCJhdHRyIiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciLCJLaW5ldGljU2Nyb2xsIiwia2luZXRpY1Njcm9sbCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBQSxTQUFRQyxNQUFSLENBQWUsdUJBQWYsRUFBd0MsRUFBeEMsRUFDS0MsT0FETCxDQUNhLE9BRGIsRUFDc0IsbUJBQUFDLENBQVEsQ0FBUixDQUR0QixFQUVLQyxLQUZMLENBRVcsZUFGWCxFQUU0QixtQkFBQUQsQ0FBUSxDQUFSLENBRjVCLEVBR0tFLFNBSEwsQ0FHZSxnQkFIZixFQUdpQyxtQkFBQUYsQ0FBUSxDQUFSLENBSGpDLEVBSUtFLFNBSkwsQ0FJZSxZQUpmLEVBSTZCLG1CQUFBRixDQUFRLENBQVIsQ0FKN0IsRUFLS0UsU0FMTCxDQUtlLGVBTGYsRUFLZ0MsbUJBQUFGLENBQVEsQ0FBUixDQUxoQyxFOzs7Ozs7QUNGQSxVQUFTRyxZQUFULEdBQXlCO0FBQ3JCLFlBQU87QUFDSEMsNkJBQW9CLFVBQVVDLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3pDLGlCQUFJQyxLQUFKOztBQUVBLGlCQUFLLENBQUVELE1BQU1FLE1BQVIsSUFB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ckMsNkJBQUlpRCxNQUFNakQsS0FBS2tELFFBQUwsQ0FBYyxDQUFkLENBQVY7QUFDQSw2QkFBSUksYUFBYUwsSUFBSU0sWUFBSixHQUFtQk4sSUFBSU8sWUFBeEM7O0FBRUEsNkJBQUtGLGFBQWFxRCxZQUFsQixFQUFpQztBQUM3QkEsNENBQWVyRCxVQUFmO0FBQ0g7QUFDSixzQkFQRDs7QUFTQTRCLDJCQUFNakIsZ0JBQU47QUFDQWlCLDJCQUFNMUMsUUFBTixDQUFlMEMsTUFBTWhFLFVBQXJCLEVBQWlDeUYsWUFBakM7QUFDSDtBQTlEeUIsY0FBOUI7QUFnRUg7QUF2RkUsTUFBUDtBQXlGSDs7QUFFRGUsZUFBY1AsT0FBZCxHQUF3QixDQUFDLE9BQUQsRUFBVSxlQUFWLENBQXhCOztBQUVBaEksUUFBTzRCLE9BQVAsR0FBaUIyRyxhQUFqQixDIiwiZmlsZSI6IkQ6XFxXb3JrXFxuZy1hdWdtZW50LW5hdGl2ZS1zY3JvbGwvZGlzdC9uZ0F1Z21lbnROYXRpdmVTY3JvbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJuZ0F1Z21lbnROYXRpdmVTY3JvbGxcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibmdBdWdtZW50TmF0aXZlU2Nyb2xsXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk1MDgwOGY1NmQzMWU1N2IzMDRmIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nQXVnbWVudE5hdGl2ZVNjcm9sbCcsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ3V0aWxzJywgcmVxdWlyZSgnLi91dGlscy5mYWN0b3J5LmpzJykpXHJcbiAgICAudmFsdWUoJ2tpbmV0aWNFbmdpbmUnLCByZXF1aXJlKCcuL2tpbmV0aWNFbmdpbmUudmFsdWUuanMnKSlcclxuICAgIC5kaXJlY3RpdmUoJ2Nvbm5lY3RTY3JvbGxzJywgcmVxdWlyZSgnLi9jb25uZWN0U2Nyb2xscy5kaXJlY3RpdmUuanMnKSlcclxuICAgIC5kaXJlY3RpdmUoJ3Njcm9sbEFyZWEnLCByZXF1aXJlKCcuL3Njcm9sbEFyZWEuZGlyZWN0aXZlLmpzJykpXHJcbiAgICAuZGlyZWN0aXZlKCdraW5ldGljU2Nyb2xsJywgcmVxdWlyZSgnLi9raW5ldGljU2Nyb2xsLmRpcmVjdGl2ZS5qcycpKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiZnVuY3Rpb24gVXRpbHNGYWN0b3J5ICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZmluZE1hdGNoaW5nVGFyZ2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBub2Rlcykge1xyXG4gICAgICAgICAgICB2YXIgZm91bmQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEgbm9kZXMubGVuZ3RoIHx8IHRhcmdldC50YWdOYW1lID09PSAnQk9EWScgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0JPRFknO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3VuZCA9IG5vZGVzLmZpbmQoZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmlkID09PSB0YXJnZXQuaWRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGZvdW5kICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5pZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1RhcmdldCh0YXJnZXQucGFyZW50RWxlbWVudCwgbm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRQb2ludDogZnVuY3Rpb24gKGUsIGhhc1RvdWNoKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmKCBoYXNUb3VjaCAmJiBldmVudC50b3VjaGVzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgIHBvaW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICd4JyA6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCxcclxuICAgICAgICAgICAgICAgICAgICAneScgOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBvaW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICd4JyA6IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3knIDogZXZlbnQuY2xpZW50WVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUaW1lOiBEYXRlLm5vdyB8fCBmdW5jdGlvbiBnZXRUaW1lICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkudXRpbHMuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVdGlsc0ZhY3RvcnlcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzLmZhY3RvcnkuanMiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBLaW5ldGljRW5naW5lIChjb250ZXh0LCB1dGlscykge1xyXG4gICAgY29udGV4dC5zY3JvbGxMZWZ0ID0gMDtcclxuICAgIGNvbnRleHQuc2Nyb2xsVG9wID0gMDtcclxuICAgIGNvbnRleHQubGFzdFNjcm9sbExlZnQgPSAwO1xyXG4gICAgY29udGV4dC5sYXN0U2Nyb2xsVG9wID0gMDtcclxuICAgIGNvbnRleHQudGFyZ2V0VG9wID0gMDtcclxuICAgIGNvbnRleHQudGFyZ2V0TGVmdCA9IDA7XHJcblxyXG4gICAgY29udGV4dC52ZWxvY2l0eVRvcCA9IDA7XHJcbiAgICBjb250ZXh0LnZlbG9jaXR5TGVmdCA9IDA7XHJcbiAgICBjb250ZXh0LmFtcGxpdHVkZVRvcCA9IDA7XHJcbiAgICBjb250ZXh0LmFtcGxpdHVkZUxlZnQgPSAwO1xyXG5cclxuICAgIGNvbnRleHQudGltZVN0YW1wID0gMDtcclxuICAgIGNvbnRleHQucmVmZXJlbmNlWCA9IDA7XHJcbiAgICBjb250ZXh0LnJlZmVyZW5jZVkgPSAwO1xyXG4gICAgY29udGV4dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICBjb250ZXh0LmF1dG9TY3JvbGxUcmFja2VyID0gbnVsbDtcclxuICAgIGNvbnRleHQuaXNBdXRvU2Nyb2xsaW5nID0gZmFsc2U7XHJcblxyXG4gICAgY29udGV4dC5sZWZ0VHJhY2tlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbm93LCBlbGFwc2VkLCBkZWx0YTtcclxuXHJcbiAgICAgICAgbm93ID0gdXRpbHMuZ2V0VGltZSgpO1xyXG4gICAgICAgIGVsYXBzZWQgPSBub3cgLSBjb250ZXh0LnRpbWVTdGFtcDtcclxuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IG5vdztcclxuICAgICAgICBkZWx0YSA9IGNvbnRleHQuc2Nyb2xsTGVmdCAtIGNvbnRleHQubGFzdFNjcm9sbExlZnQ7XHJcbiAgICAgICAgY29udGV4dC5sYXN0U2Nyb2xsTGVmdCA9IGNvbnRleHQuc2Nyb2xsTGVmdDtcclxuXHJcbiAgICAgICAgY29udGV4dC52ZWxvY2l0eUxlZnQgPSBjb250ZXh0LnVzZXJPcHRpb25zLm1vdmluZ0F2ZXJhZ2UgKiAoMTAwMCAqIGRlbHRhIC8gKDEgKyBlbGFwc2VkKSkgKyAwLjIgKiBjb250ZXh0LnZlbG9jaXR5TGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnRvcFRyYWNrZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG5vdywgZWxhcHNlZCwgZGVsdGE7XHJcblxyXG4gICAgICAgIG5vdyA9IHV0aWxzLmdldFRpbWUoKTtcclxuICAgICAgICBlbGFwc2VkID0gbm93IC0gY29udGV4dC50aW1lU3RhbXA7XHJcbiAgICAgICAgY29udGV4dC50aW1lU3RhbXAgPSBub3c7XHJcbiAgICAgICAgZGVsdGEgPSBjb250ZXh0LnNjcm9sbFRvcCAtIGNvbnRleHQubGFzdFNjcm9sbFRvcDtcclxuICAgICAgICBjb250ZXh0Lmxhc3RTY3JvbGxUb3AgPSBjb250ZXh0LnNjcm9sbFRvcDtcclxuXHJcbiAgICAgICAgY29udGV4dC52ZWxvY2l0eVRvcCA9IGNvbnRleHQudXNlck9wdGlvbnMubW92aW5nQXZlcmFnZSAqICgxMDAwICogZGVsdGEgLyAoMSArIGVsYXBzZWQpKSArIDAuMiAqIGNvbnRleHQudmVsb2NpdHlUb3A7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5zY3JvbGxUbyA9IGZ1bmN0aW9uKGxlZnQsIHRvcCkge1xyXG4gICAgICAgIHZhciBjb3JyZWN0ZWRMZWZ0ID0gTWF0aC5yb3VuZChsZWZ0KTtcclxuICAgICAgICB2YXIgY29ycmVjdGVkVG9wID0gTWF0aC5yb3VuZCh0b3ApO1xyXG5cclxuICAgICAgICBjb250ZXh0LmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWCA9ICRlbC5zY3JvbGxXaWR0aCAtICRlbC5jbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgdmFyIG1heFNjcm9sbFkgPSAkZWwuc2Nyb2xsSGVpZ2h0IC0gJGVsLmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICggbWF4U2Nyb2xsWCA+IDAgJiYgY29ycmVjdGVkTGVmdCA+PSAwICYmIGNvcnJlY3RlZExlZnQgPD0gbWF4U2Nyb2xsWCApIHtcclxuICAgICAgICAgICAgICAgICRlbC5zY3JvbGxMZWZ0ID0gY29ycmVjdGVkTGVmdDtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2Nyb2xsTGVmdCA9IGNvcnJlY3RlZExlZnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gMCAmJiBjb3JyZWN0ZWRUb3AgPj0gMCAmJiBjb3JyZWN0ZWRUb3AgPD0gbWF4U2Nyb2xsWSApIHtcclxuICAgICAgICAgICAgICAgICRlbC5zY3JvbGxUb3AgPSBjb3JyZWN0ZWRUb3A7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNjcm9sbFRvcCA9IGNvcnJlY3RlZFRvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5hdXRvU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGVsYXBzZWQ7XHJcbiAgICAgICAgdmFyIGRlbHRhWSA9IDAsIGRlbHRhWCA9IDAsIHNjcm9sbFggPSAwLCBzY3JvbGxZID0gMDtcclxuICAgICAgICB2YXIgdGltZUNvbnN0YW50ID0gMzI1O1xyXG5cclxuICAgICAgICBlbGFwc2VkID0gdXRpbHMuZ2V0VGltZSgpIC0gY29udGV4dC50aW1lU3RhbXA7XHJcblxyXG4gICAgICAgIGlmICggY29udGV4dC5hbXBsaXR1ZGVUb3AgKSB7XHJcbiAgICAgICAgICAgIGRlbHRhWSA9IC1jb250ZXh0LmFtcGxpdHVkZVRvcCAqIE1hdGguZXhwKC1lbGFwc2VkIC8gdGltZUNvbnN0YW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBjb250ZXh0LmFtcGxpdHVkZUxlZnQgKSB7XHJcbiAgICAgICAgICAgIGRlbHRhWCA9IC1jb250ZXh0LmFtcGxpdHVkZUxlZnQgKiBNYXRoLmV4cCgtZWxhcHNlZCAvIHRpbWVDb25zdGFudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGRlbHRhWCA+IDAuNSB8fCBkZWx0YVggPCAtMC41ICkge1xyXG4gICAgICAgICAgICBzY3JvbGxYID0gZGVsdGFYO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFggPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBkZWx0YVkgPiAwLjUgfHwgZGVsdGFZIDwgLTAuNSApIHtcclxuICAgICAgICAgICAgc2Nyb2xsWSA9IGRlbHRhWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzY3JvbGxZID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuc2Nyb2xsVG8oY29udGV4dC50YXJnZXRMZWZ0ICsgc2Nyb2xsWCwgY29udGV4dC50YXJnZXRUb3AgKyBzY3JvbGxZKTtcclxuXHJcbiAgICAgICAgaWYgKCBzY3JvbGxYICE9PSAwIHx8IHNjcm9sbFkgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY29udGV4dC5hdXRvU2Nyb2xsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250ZXh0LmlzQXV0b1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmF1dG9TY3JvbGxUcmFja2VyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5jYW5jZWxBdXRvU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICggY29udGV4dC5pc0F1dG9TY3JvbGxpbmcgKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGNvbnRleHQuYXV0b1Njcm9sbFRyYWNrZXIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmlzQXV0b1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmF1dG9TY3JvbGxUcmFja2VyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC50YXAgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGNvbnRleHQucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgY29udGV4dC5yZWZlcmVuY2VYID0gdXRpbHMuZ2V0UG9pbnQoZSwgY29udGV4dC5oYXNUb3VjaCkueDtcclxuICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVkgPSB1dGlscy5nZXRQb2ludChlLCBjb250ZXh0Lmhhc1RvdWNoKS55O1xyXG5cclxuICAgICAgICBjb250ZXh0LnZlbG9jaXR5VG9wID0gY29udGV4dC5hbXBsaXR1ZGVUb3AgPSAwO1xyXG4gICAgICAgIGNvbnRleHQudmVsb2NpdHlMZWZ0ID0gY29udGV4dC5hbXBsaXR1ZGVMZWZ0ID0gMDtcclxuXHJcbiAgICAgICAgY29udGV4dC5sYXN0U2Nyb2xsVG9wID0gY29udGV4dC5zY3JvbGxUb3A7XHJcbiAgICAgICAgY29udGV4dC5sYXN0U2Nyb2xsTGVmdCA9IGNvbnRleHQuc2Nyb2xsTGVmdDtcclxuXHJcbiAgICAgICAgY29udGV4dC50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuY2FuY2VsQXV0b1Njcm9sbCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgY29udGV4dC5zd2lwZSwgdHJ1ZSApO1xyXG4gICAgICAgIGNvbnRleHQuJGxpc3RlbmVyLmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgY29udGV4dC5yZWxlYXNlLCB0cnVlICk7XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnN3aXBlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgeCwgeSwgZGVsdGFYLCBkZWx0YVk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LnByZXNzZWQpIHtcclxuICAgICAgICAgICAgeCA9IHV0aWxzLmdldFBvaW50KGUsIGNvbnRleHQuaGFzVG91Y2gpLng7XHJcbiAgICAgICAgICAgIHkgPSB1dGlscy5nZXRQb2ludChlLCBjb250ZXh0Lmhhc1RvdWNoKS55O1xyXG5cclxuICAgICAgICAgICAgZGVsdGFYID0gY29udGV4dC5yZWZlcmVuY2VYIC0geDtcclxuICAgICAgICAgICAgZGVsdGFZID0gY29udGV4dC5yZWZlcmVuY2VZIC0geTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZWx0YVggPiAyIHx8IGRlbHRhWCA8IC0yKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlZmVyZW5jZVggPSB4O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFYID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGVsdGFZID4gMiB8fCBkZWx0YVkgPCAtMikge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5yZWZlcmVuY2VZID0geTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbHRhWSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQudG9wVHJhY2tlcigpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxlZnRUcmFja2VyKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LnNjcm9sbFRvKCBjb250ZXh0LnNjcm9sbExlZnQgKyBkZWx0YVgsIGNvbnRleHQuc2Nyb2xsVG9wICsgZGVsdGFZICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yZWxlYXNlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGNvbnRleHQucHJlc3NlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb250ZXh0LnRpbWVTdGFtcCA9IHV0aWxzLmdldFRpbWUoKTtcclxuICAgICAgICBjb250ZXh0LnRvcFRyYWNrZXIoKTtcclxuICAgICAgICBjb250ZXh0LmxlZnRUcmFja2VyKCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LnZlbG9jaXR5VG9wID4gMTAgfHwgY29udGV4dC52ZWxvY2l0eVRvcCA8IC0xMCkge1xyXG4gICAgICAgICAgICBjb250ZXh0LmFtcGxpdHVkZVRvcCA9IDAuOCAqIGNvbnRleHQudmVsb2NpdHlUb3A7XHJcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0VG9wID0gTWF0aC5yb3VuZChjb250ZXh0LnNjcm9sbFRvcCArIGNvbnRleHQuYW1wbGl0dWRlVG9wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250ZXh0LnRhcmdldFRvcCA9IGNvbnRleHQuc2Nyb2xsVG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udGV4dC52ZWxvY2l0eUxlZnQgPiAxMCB8fCBjb250ZXh0LnZlbG9jaXR5TGVmdCA8IC0xMCkge1xyXG4gICAgICAgICAgICBjb250ZXh0LmFtcGxpdHVkZUxlZnQgPSAwLjggKiBjb250ZXh0LnZlbG9jaXR5TGVmdDtcclxuICAgICAgICAgICAgY29udGV4dC50YXJnZXRMZWZ0ID0gTWF0aC5yb3VuZChjb250ZXh0LnNjcm9sbExlZnQgKyBjb250ZXh0LmFtcGxpdHVkZUxlZnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0TGVmdCA9IGNvbnRleHQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuaXNBdXRvU2Nyb2xsaW5nID0gdHJ1ZTtcclxuICAgICAgICBjb250ZXh0LmF1dG9TY3JvbGxUcmFja2VyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNvbnRleHQuYXV0b1Njcm9sbCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuJGxpc3RlbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBjb250ZXh0LnN3aXBlICk7XHJcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBjb250ZXh0LnJlbGVhc2UgKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggISBjb250ZXh0Lmhhc1RvdWNoICYmIGNvbnRleHQudXNlck9wdGlvbnMuZW5hYmxlS2luZXRpY3MgKSB7XHJcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGNvbnRleHQudGFwLCB0cnVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udGV4dC4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGNvbnRleHQudGFwICk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLaW5ldGljRW5naW5lO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2luZXRpY0VuZ2luZS52YWx1ZS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIENvbm5lY3RTY3JvbGxzICh1dGlscywga2luZXRpY0VuZ2luZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6ICc9J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPHNwYW4gZGF0YS1uYW1lPVwiY29ubnRlY3Qtc2Nyb2xsXCIgbmctdHJhbnNjbHVkZT48L3NwYW4+JyxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgc2NvcGUuaGFzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3c7XHJcbiAgICAgICAgICAgIHNjb3BlLkRFVEVDVF9FVlQgPSBzY29wZS5oYXNUb3VjaCA/ICd0b3VjaHN0YXJ0JyA6ICdtb3VzZW92ZXInO1xyXG4gICAgICAgICAgICBzY29wZS5hY3RpdmVJZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyID0gZWxlbWVudFswXTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlS2luZXRpY3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbW92aW5nQXZlcmFnZTogMC4xXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjb3BlLnVzZXJPcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIHNjb3BlLmRlZmF1bHRPcHRpb25zLCBzY29wZS5vcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGtpbmV0aWNFbmdpbmUuY2FsbCh0aGlzLCBzY29wZSwgdXRpbHMpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuc2V0QWN0aXZlTm9kZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5hY3RpdmVJZCA9IHV0aWxzLmZpbmRNYXRjaGluZ1RhcmdldChlLnRhcmdldCwgc2NvcGUuY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3BlLm9uU2Nyb2xsID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUucHJlc3NlZCB8fCBzY29wZS5pc0F1dG9TY3JvbGxpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxYID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbFkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0YXJnZXQuY2xpZW50V2lkdGggIT09IHRhcmdldC5zY3JvbGxXaWR0aCApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxYID0gdGFyZ2V0LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubGFzdFNjcm9sbExlZnQgPSBzY29wZS5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbExlZnQgPSB2YWxYO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxYID0gc2NvcGUuc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0LmNsaWVudEhlaWdodCAhPT0gdGFyZ2V0LnNjcm9sbEhlaWdodCApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxZID0gdGFyZ2V0LnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5sYXN0U2Nyb2xsVG9wID0gc2NvcGUuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvcCA9IHZhbFk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbFkgPSBzY29wZS5zY3JvbGxUb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIG5vZGUuaWQgIT09IHNjb3BlLmFjdGl2ZUlkICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuWzBdLnNjcm9sbExlZnQgPSB2YWxYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuWzBdLnNjcm9sbFRvcCA9IHZhbFk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCBzY29wZS5ERVRFQ1RfRVZULCBzY29wZS5zZXRBY3RpdmVOb2RlLCB0cnVlICk7XHJcbiAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgc2NvcGUub25TY3JvbGwsIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRsaXN0ZW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCBzY29wZS5ERVRFQ1RfRVZULCBzY29wZS5zZXRBY3RpdmVOb2RlICk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kbGlzdGVuZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIHNjb3BlLm9uU2Nyb2xsICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gZXhwb3NlIGZldyBtZXRob2RzIHRvIHRoZSBwYXJlbnQgY29udHJvbGxlclxyXG4gICAgICAgICAgICBzY29wZS4kcGFyZW50LmNvbm5lY3RlZFNjcm9sbHMgPSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1N0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudGFyZ2V0TGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudGFyZ2V0VG9wID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5hbXBsaXR1ZGVMZWZ0ID0gLXNjb3BlLnNjcm9sbExlZnRcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5hbXBsaXR1ZGVUb3AgPSAtc2NvcGUuc2Nyb2xsVG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmF1dG9TY3JvbGxUcmFja2VyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNjb3BlLmF1dG9TY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRMZWZ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50aW1lU3RhbXAgPSB1dGlscy5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudGFyZ2V0TGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudGFyZ2V0VG9wID0gc2NvcGUuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmFtcGxpdHVkZUxlZnQgPSAtc2NvcGUuc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5hbXBsaXR1ZGVUb3AgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5pc0F1dG9TY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmF1dG9TY3JvbGxUcmFja2VyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNjb3BlLmF1dG9TY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRUb3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRpbWVTdGFtcCA9IHV0aWxzLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50YXJnZXRMZWZ0ID0gc2NvcGUuc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50YXJnZXRUb3AgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmFtcGxpdHVkZUxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmFtcGxpdHVkZVRvcCA9IC1zY29wZS5zY3JvbGxUb3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmlzQXV0b1Njcm9sbGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYXV0b1Njcm9sbFRyYWNrZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2NvcGUuYXV0b1Njcm9sbCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxZID0gJGVsLnNjcm9sbEhlaWdodCAtICRlbC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsTGVmdCA9IG1heFNjcm9sbFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsVG9wID0gbWF4U2Nyb2xsWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8obWF4U2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb0VuZExlZnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsTGVmdCA9IG1heFNjcm9sbFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvKG1heFNjcm9sbExlZnQsIHNjb3BlLnNjcm9sbFRvcCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmRUb3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWSA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsVG9wID0gbWF4U2Nyb2xsWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8oc2NvcGUuc2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCBmdW5jdGlvbiBjb25uZWN0U2Nyb2xsc0N0cmwoJHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGVzID0gJHNjb3BlLmNoaWxkTm9kZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkU2Nyb2xsQXJlYSA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XVxyXG4gICAgfVxyXG59XHJcblxyXG5Db25uZWN0U2Nyb2xscy4kaW5qZWN0ID0gWyd1dGlscycsICdraW5ldGljRW5naW5lJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbm5lY3RTY3JvbGxzO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29ubmVjdFNjcm9sbHMuZGlyZWN0aXZlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gU2Nyb2xsQXJlYSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcXVpcmU6ICdeXmNvbm5lY3RTY3JvbGxzJyxcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuICBkYXRhLW5hbWU9XCJzY3JvbGwtYXJlYVwiIG5nLXRyYW5zY2x1ZGU+PC9zcGFuPicsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29ubmVjdFNjcm9sbHNDdHJsKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0ciggJ2lkJywgJ1BBUlRJQ0lQQVRJTkdfTk9ERV8nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cmluZygyLCAxNSkgKTtcclxuICAgICAgICAgICAgY29ubmVjdFNjcm9sbHNDdHJsLmFkZFNjcm9sbEFyZWEoZWxlbWVudFswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbEFyZWE7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JvbGxBcmVhLmRpcmVjdGl2ZS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIEtpbmV0aWNTY3JvbGwgKHV0aWxzLCBraW5ldGljRW5naW5lKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgb3B0aW9uczogJz0nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgdGVtcGxhdGU6ICc8c3BhbiBkYXRhLW5hbWU9XCJraW5ldGljLXNjcm9sbFwiIG5nLXRyYW5zY2x1ZGU+PC9zcGFuPicsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHNjb3BlLmhhc1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xyXG4gICAgICAgICAgICBzY29wZS5ERVRFQ1RfRVZUID0gc2NvcGUuaGFzVG91Y2ggPyAndG91Y2hzdGFydCcgOiAnbW91c2VvdmVyJztcclxuICAgICAgICAgICAgc2NvcGUuJGxpc3RlbmVyID0gZWxlbWVudFswXTtcclxuICAgICAgICAgICAgc2NvcGUuY2hpbGROb2RlcyA9IFsgc2NvcGUuJGxpc3RlbmVyIF07XHJcblxyXG4gICAgICAgICAgICBzY29wZS5kZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGVuYWJsZUtpbmV0aWNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vdmluZ0F2ZXJhZ2U6IDAuMVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzY29wZS51c2VyT3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBzY29wZS5kZWZhdWx0T3B0aW9ucywgc2NvcGUub3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBraW5ldGljRW5naW5lLmNhbGwodGhpcywgc2NvcGUsIHV0aWxzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGV4cG9zZSBmZXcgbWV0aG9kcyB0byB0aGUgcGFyZW50IGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgc2NvcGUuJHBhcmVudC5raW5ldGljU2Nyb2xsID0ge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9TdGFydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1N0YXJ0TGVmdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEF1dG9TY3JvbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zY3JvbGxUbygwLCBzY29wZS5zY3JvbGxUb3ApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RhcnRUb3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8oc2NvcGUuc2Nyb2xsTGVmdCwgMCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxZID0gJGVsLnNjcm9sbEhlaWdodCAtICRlbC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsTGVmdCA9IG1heFNjcm9sbFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsVG9wID0gbWF4U2Nyb2xsWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8obWF4U2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb0VuZExlZnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFggPSAkZWwuc2Nyb2xsV2lkdGggLSAkZWwuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1heFNjcm9sbFggPiBtYXhTY3JvbGxMZWZ0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsTGVmdCA9IG1heFNjcm9sbFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsQXV0b1Njcm9sbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjcm9sbFRvKG1heFNjcm9sbExlZnQsIHNjb3BlLnNjcm9sbFRvcCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9FbmRUb3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hpbGROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSBub2RlLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsWSA9ICRlbC5zY3JvbGxIZWlnaHQgLSAkZWwuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBtYXhTY3JvbGxZID4gbWF4U2Nyb2xsVG9wICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsVG9wID0gbWF4U2Nyb2xsWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxBdXRvU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nyb2xsVG8oc2NvcGUuc2Nyb2xsTGVmdCwgbWF4U2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuS2luZXRpY1Njcm9sbC4kaW5qZWN0ID0gWyd1dGlscycsICdraW5ldGljRW5naW5lJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtpbmV0aWNTY3JvbGw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9raW5ldGljU2Nyb2xsLmRpcmVjdGl2ZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=