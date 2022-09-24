// var XLSX = require('xlsx');
// var workbook = XLSX.readFile('hacknu-dev-list.xlsx');
// var sheet_name_list = workbook.SheetNames;
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
var XLSX = require('xlsx');
//import * as XLSX from 'xlsx';
var workbook = XLSX.readFile('hacknu-dev-data.xlsx');
var sheet_name_list = workbook.SheetNames;
var list = [];
sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if(!list[row]) list[row]={};
        list[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    list.shift();
    list.shift();
    console.log(list);
});

