'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');
var _ = require('underscore');
var chillerReportFormat = require('./chillerReportFormat');
var util = require('../helpers/util');

module.exports = {
    getChillerByDate: getChillerByDate
};

function formatTimeQuery(rows){
  var cond;
  var condArr = [];

  for (var key in rows) {
    cond = 'time(emdt)="' + util.format2Digit(rows[key][0].fromTime) + ':00:00"';
    condArr.push(cond);
  }
  return condArr?' and (' + condArr.join(' OR ') + ')':'';
}

function groupBy(list, groupFld){

  return _.groupBy(list, groupFld);
  // return _
  //   .chain(list)
  //   .groupBy(groupFld)
  //   .map(function(value, key) {
  //     return {
  //       key: value
  //     }
  //   })
  //   .value();

}


function getChillerByDate(year, month){
  return new Promise(function(resolve, reject){

    chillerReportFormat.getFormat()
      .then(function(formatRows) {

        var sql = 'select emid, emdt, emebenergy, emdgenergy, day(emdt) as monthDay, hour(emdt) as dayHour '+
          ' from tblemdata ' +
          ' where (emid=7 or emid=12)' +
          ' and year(emdt)="' + year + '"' +
          ' and month(emdt)="' + month + '"' +
          formatTimeQuery(formatRows) +
          ' order by emid,emdt';
        // console.log(sql);

        config.rawConnection().query(sql,
          function (err, rows, fields) {
            // console.log(groupBy(rows, 'emid'));
            var data = {
              raw: groupBy(rows, 'emid'),
              format : formatRows
            };
            resolve(data);
          }, function (err) {
            reject(err);
          });

      });
    // query
    //   .on('error', function(err) {
    //     // Handle error, an 'end' event will be emitted after this as well
    //     console.log('error', err);
    //   })
    //   .on('fields', function(fields) {
    //     // the field packets for the rows to follow
    //   })
    //   .on('result', function(row) {
    //     console.log(row.RowDataPacket);
    //     // Pausing the connnection is useful if your processing involves I/O
    //     // connection.pause();
    //
    //     // processRow(row, function() {
    //     //   connection.resume();
    //     // });
    //   })
    //   .on('end', function() {
    //     // all rows have been received
    //     console.log('end');
    //   });

  });
};