'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');
var _ = require('underscore');

module.exports = {
  getFormat: getFormat
};


function getFormat(isActive){
  return new Promise(function(resolve, reject){
    var isActive = isActive?isActive:1;
    var sql = 'select * from chillerReportFormat where active='+isActive+' order by fromTIme, toTime';

    config.ebillConnection().query(sql,
      function(err, rows, fields){
        if (err){
          return reject(err);
        }
        resolve(_.groupBy(rows,'fromTime'));
      }, function(err){
        reject(err);
      });
  });
}