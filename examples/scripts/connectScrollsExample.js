'use strict';

angular.module('app', ['ngAugmentNativeScroll'])
    .factory('ExampleApp.Factory', function () {
        return {
            generateData: function () {
                var list = [];
                var table = [];
                var row;
                var i, j;

                for( i = 0; i < 70; i++ ) {
                    list.push( Math.random().toString(36).substring(7) );

                    row = [];
                    for( j = 0; j < 100; j++ ){
                        row.push( Math.floor(Math.random() * 16) + 5 );
                    }

                    table.push(row);
                }

                return {
                    list: list,
                    table: table
                }
            }
        }
    })
    .controller('ExampleApp.Controller', [
        '$scope',
        'ExampleApp.Factory',
        '$timeout',
        '$log',
        function ($scope, factory, $timeout, $log) {
            $scope.data = factory.generateData();

            $scope.options = {
                enableKinetics: true,
                movingAverage: 0.2
            }

            $timeout(function () {
                // the exposed methods are now ready to use
                console.log( $scope.augNs )
            }, 10);

            $scope.interact = false;
            $scope.toggle = function () {
                $scope.interact = !$scope.interact;
            }
        }
    ])
