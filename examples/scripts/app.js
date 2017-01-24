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

            $setTimeout(function () {
                $log( $scope.connectedScrolls )
            }, 10);
        }
    ])
