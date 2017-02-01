'use strict';

function KineticEngine (context, utils) {
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
    }

    context.topTracker = function () {
        var now, elapsed, delta;

        now = utils.getTime();
        elapsed = now - context.timeStamp;
        context.timeStamp = now;
        delta = context.scrollTop - context.lastScrollTop;
        context.lastScrollTop = context.scrollTop;

        context.velocityTop = context.userOptions.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * context.velocityTop;
    }

    context.scroll = function(left, top) {
        var correctedLeft = Math.round(left);
        var correctedTop = Math.round(top);

        context.childNodes.forEach(function(node) {
            var $el = node.children[0];
            var maxScrollX = $el.scrollWidth - $el.clientWidth;
            var maxScrollY = $el.scrollHeight - $el.clientHeight;

            if ( maxScrollX > 0 && correctedLeft >= 0 && correctedLeft <= maxScrollX ) {
                $el.scrollLeft = correctedLeft;
                context.scrollLeft = correctedLeft;
            }
            if ( maxScrollY > 0 && correctedTop >= 0 && correctedTop <= maxScrollY ) {
                $el.scrollTop = correctedTop;
                context.scrollTop = correctedTop;
            }
        })
    }

    context.autoScroll = function() {
        var elapsed;
        var deltaY = 0, deltaX = 0, scrollX = 0, scrollY = 0;
        var timeConstant = 325;

        elapsed = utils.getTime() - context.timeStamp;

        if ( context.amplitudeTop ) {
            deltaY = -context.amplitudeTop * Math.exp(-elapsed / timeConstant);
        }
        if ( context.amplitudeLeft ) {
            deltaX = -context.amplitudeLeft * Math.exp(-elapsed / timeConstant);
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

        context.scroll(context.targetLeft + scrollX, context.targetTop + scrollY);

        if ( scrollX !== 0 || scrollY !== 0 ) {
            context.autoScrollTracker = requestAnimationFrame(context.autoScroll);
        } else {
            context.isAutoScrolling = false;
            context.autoScrollTracker = null;
        }
    }

    context.triggerAutoScroll = function (targetLeft, targetTop, amplitudeLeft, amplitudeTop) {
        if ( amplitudeLeft !== 0 || amplitudeTop !== 0 ) {
            context.cancelAutoScroll();

            context.timeStamp = utils.getTime();
            context.targetLeft = targetLeft;
            context.targetTop = targetTop;
            context.amplitudeLeft = amplitudeLeft;
            context.amplitudeTop = amplitudeTop;

            context.isAutoScrolling = true;
            context.autoScrollTracker = requestAnimationFrame(context.autoScroll);
        }
    }

    context.cancelAutoScroll = function () {
        if ( context.isAutoScrolling ) {
            cancelAnimationFrame(context.autoScrollTracker);
            context.isAutoScrolling = false;
            context.autoScrollTracker = null;
        }
    }

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

        context.$listener.addEventListener( 'mousemove', context.swipe, true );
        context.$listener.addEventListener( 'mouseup', context.release, true );

        if ( utils.preventDefaultException(e.target, context.userOptions.preventDefaultException) ) {
            e.preventDefault();
        }
    }

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

            context.scroll( context.scrollLeft + deltaX, context.scrollTop + deltaY );
        }
    }

    context.release = function() {
        var targetLeft, targetTop, amplitudeLeft, amplitudeTop;

        context.pressed = false;

        context.topTracker();
        context.leftTracker();

        if (context.velocityLeft > 10 || context.velocityLeft < -10) {
            amplitudeLeft = 0.8 * context.velocityLeft;
            targetLeft = Math.round(context.scrollLeft + amplitudeLeft);
        } else {
            targetLeft = context.scrollLeft;
        }
        if (context.velocityTop > 10 || context.velocityTop < -10) {
            amplitudeTop = 0.8 * context.velocityTop;
            targetTop = Math.round(context.scrollTop + amplitudeTop);
        } else {
            targetTop = context.scrollTop;
        }

        context.triggerAutoScroll(targetLeft, targetTop, amplitudeLeft, amplitudeTop);

        context.$listener.removeEventListener( 'mousemove', context.swipe );
        context.$listener.removeEventListener( 'mouseup', context.release );
    }

    if ( ! context.hasTouch && context.userOptions.enableKinetics ) {
        context.$listener.addEventListener( 'mousedown', context.tap, true );
    }

    context.$on('$destroy', function() {
        context.$listener.removeEventListener( 'mousedown', context.tap );
    });

    var scrollGen = function (start, left, top) {
        return function () {
            var targetLeft = 0,
                targetTop = 0,
                amplitudeLeft = 0,
                amplitudeTop = 0,
                maxScroll = {};

            if ( start ) {
                targetLeft = left ? 0 : context.scrollLeft;
                targetTop = top ? 0 : context.scrollTop;
                amplitudeLeft = left ? -context.scrollLeft : 0;
                amplitudeTop = top ? -context.scrollTop : 0;
            } else {
                maxScroll = utils.getMaxScroll(context.childNodes);

                targetLeft = left ? maxScroll.left : context.scrollLeft;
                targetTop = top ? maxScroll.top : context.scrollTop;
                amplitudeLeft = left ? maxScroll.left - context.scrollLeft : 0;
                amplitudeTop = top ? maxScroll.top - context.scrollTop : 0;
            }

            context.triggerAutoScroll(targetLeft, targetTop, amplitudeLeft, amplitudeTop);
        }
    }

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
        scrollToEndTop: scrollGen(notStart, notLeft, top),
        scrollToValue: function (left, top) {
            var maxScroll = utils.getMaxScroll(context.childNodes),
                numLeft = isNaN( parseInt(left) ) ? context.scrollLeft : parseInt(left),
                numTop = isNaN( parseInt(top) ) ? context.scrollTop : parseInt(top),
                targetLeft = numLeft > maxScroll.left ? maxScroll.left : (numLeft < 0 ? 0 : numLeft),
                targetTop = numTop > maxScroll.top ? maxScroll.top : (numTop < 0 ? 0 : numTop),
                moveLeft = context.scrollLeft - targetLeft !== 0 ? true : false,
                moveTop = context.scrollTop - targetTop !== 0 ? true : false,
                amplitudeLeft = moveLeft ? targetLeft - context.scrollLeft : 0,
                amplitudeTop = moveTop ? targetTop - context.scrollTop : 0;

                console.log(numLeft, numTop);
                console.log(targetLeft, targetTop, amplitudeLeft, amplitudeTop);

            context.triggerAutoScroll(targetLeft, targetTop, amplitudeLeft, amplitudeTop);
        },
        scrollByValue: function (left, top) {
            var maxScroll = utils.getMaxScroll(context.childNodes),
                numLeft = isNaN( parseInt(left) ) ? context.scrollLeft : parseInt(left) + context.scrollLeft,
                numTop = isNaN( parseInt(top) ) ? context.scrollTop : parseInt(top) + context.scrollTop,
                targetLeft = numLeft > maxScroll.left ? maxScroll.left : (numLeft < 0 ? 0 : numLeft),
                targetTop = numTop > maxScroll.top ? maxScroll.top : (numTop < 0 ? 0 : numTop),
                moveLeft = context.scrollLeft - targetLeft !== 0 ? true : false,
                moveTop = context.scrollTop - targetTop !== 0 ? true : false,
                amplitudeLeft = moveLeft ? targetLeft - context.scrollLeft : 0,
                amplitudeTop = moveTop ? targetTop - context.scrollTop : 0;

            context.triggerAutoScroll(targetLeft, targetTop, amplitudeLeft, amplitudeTop);
        }
    }
}

module.exports = KineticEngine;
