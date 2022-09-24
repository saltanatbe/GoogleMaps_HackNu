// var XLSX = require('xlsx');
// var workbook = XLSX.readFile('hacknu-dev-data.xlsx');
// var sheet_name_list = workbook.SheetNames;
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
var XLSX = require('xlsx');
var workbook = XLSX.readFile('hacknu-dev-data.xlsx');
var sheet_name_list = workbook.SheetNames;
var data = [];

 var fs = require('fs');
sheet_name_list.forEach(function (y) {
    var list = [];
    var worksheet = workbook.Sheets[y];
    var headers = {};
    for(z in worksheet) {
        if (z[0] === '!') continue;
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
    //list.push(data[row]);

    data.push(list);
});
//console.log("list: " , data);

var fs = require('fs');
//     //console.log(data);

var file = fs.createWriteStream('array.txt');
file.on('error', function(err) { /* error handling */ });

// file.write(data.join(","));
file.write("[");
// for (var i = 0; i < a.length; i++)
    for (var d = 0; d < data.length; d++) {
    // file.write(String(d)+",");
    file.write("[");
    for (var v = 0; v < data[d].length; v++ ){
        file.write(JSON.stringify(data[d][v]) +"" );
        console.log("this is d:" + JSON.stringify(data[d][v]))
        if (v < data[d].length - 1) {
            file.write(",");
        }
    }
        file.write("]")
        if (d < data.length - 1) {
            file.write(",");
        }
    }
    file.write("]")
    
file.end();

 module.exports = {data};
