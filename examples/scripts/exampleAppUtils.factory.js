'use strict';

function exampleAppUtils () {
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
}

module.exports = exampleAppUtils;
