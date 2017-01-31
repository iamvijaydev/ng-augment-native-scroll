'use strict';

var augNsOptions = {
    enableKinetics: true,
    movingAverage: 0.1,
    preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
    }
}

module.exports = augNsOptions;
