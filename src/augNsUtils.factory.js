function augNsUtils () {
     /*eslint-disable angular/window-service, angular/timeout-service */
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if ( ! window.requestAnimationFrame ) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if ( ! window.cancelAnimationFrame ) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            }
        }
    }());

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
                    x : event.touches[0].clientX,
                    y : event.touches[0].clientY
                }
            } else {
                point = {
                    x : event.clientX,
                    y : event.clientY
                }
            }

            return point;
        },
        getTime: Date.now || function getTime () {
            return new Date().utils.getTime();
        }
    }
}

module.exports = augNsUtils;
