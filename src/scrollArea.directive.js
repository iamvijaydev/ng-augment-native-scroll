'use strict';

function ScrollArea () {
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
}

module.exports = ScrollArea;
