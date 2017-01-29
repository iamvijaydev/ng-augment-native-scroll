function UtilsFactory () {
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
        getTime: Date.now || function getTime () {
            return new Date().utils.getTime();
        }
    }
}

module.exports = UtilsFactory
