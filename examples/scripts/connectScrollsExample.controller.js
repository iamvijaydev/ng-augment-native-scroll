'use strict';

function connectScrollsExample ($scope, factory, $timeout, $log) {
    $scope.data = factory.generateData();

    $scope.options = {
        name: 'myAugNs',
        enableKinetics: true,
        movingAverage: 0.2
    }

    $timeout(function () {
        console.log( 'The exposed methods:' );
        console.log( $scope.myAugNs );
    }, 10);

    $scope.interact = false;
    $scope.toggle = function () {
        $scope.interact = !$scope.interact;
    }
}

connectScrollsExample.$inject = ['$scope', 'exampleAppUtils', '$timeout', '$log'];

module.exports = connectScrollsExample;
