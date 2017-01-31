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

    context.scrollTo = function(left, top) {
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

        context.scrollTo(context.targetLeft + scrollX, context.targetTop + scrollY);

        if ( scrollX !== 0 || scrollY !== 0 ) {
            context.autoScrollTracker = requestAnimationFrame(context.autoScroll);
        } else {
            context.isAutoScrolling = false;
            context.autoScrollTracker = null;
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

            context.scrollTo( context.scrollLeft + deltaX, context.scrollTop + deltaY );
        }
    }

    context.release = function() {
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

            if ( toStart ) {
                targetLeft = applyLeft ? 0 : context.scrollLeft;
                targetTop = applyTop ? 0 : context.scrollTop;
                amplitudeLeft = applyLeft ? -context.scrollLeft : 0;
                amplitudeTop = applyTop ? -context.scrollTop : 0;
            } else {
                context.childNodes.forEach(function (node) {
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

                targetLeft = applyLeft ? maxScrollLeft : context.scrollLeft;
                targetTop = applyTop ? maxScrollTop : context.scrollTop;
                amplitudeLeft = applyLeft ? 1 + context.scrollLeft : 0;
                amplitudeTop = applyTop ? 1 + context.scrollTop : 0;
            }

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
    }

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
    }
}

module.exports = KineticEngine;
