'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');
var _ = require('underscore');

module.exports = {
  getCustomer: getCustomer,
  getAllCustomers: getAllCustomers,
  getCustomerChillerSchedule: getCustomerChillerSchedule
};

function getCustomer(id){
  return new Promise(function(resolve, reject){
    resolve();
  })
}

function getAllCustomers(){
  return new Promise(function(resolve, reject){
    var sql = 'select * from customerInfo';

    config.ebillConnection().query(sql,
      function(err, rows, fields){
        if (err){
          return reject(err);
        }
        resolve(rows);
      }, function(err){
        reject(err);
      });
  });
}


function getCustomerChillerSchedule(customerNumber, scheduleDate){
  return new Promise(function(resolve, reject){
    var criteria;

    if (customerNumber) {
      criteria = ' customerInfo.customerNo=' + customerNumber + ' and';
    }
    if (scheduleDate) {
      criteria += ' MONTH(chillerSchedule.activeDate)=' + scheduleDate.getMonth() + ' and' +
        ' YEAR(chillerSchedule.activeDate)=' + scheduleDate.getFullYear() + ' and';
    }

    criteria = criteria.slice(0, -4);

    var sql = 'select chillerSchedule.fromTime,chillerSchedule.toTime,chillerSchedule.activeDate, ' +
      'customerInfo.customerNo, customerInfo.squareFt from chillerSchedule ' +
      'inner join customerInfo on customerInfo.customerNo=chillerSchedule.customerNo ' +
      criteria?(' and ' + criteria):'' +
      'order by chillerSchedule.activeDate,customerInfo.customerNo';

    config.ebillConnection().query(sql,
      function(err, rows, fields){
        if (err){
          return reject(err);
        }
        resolve(_.groupBy(rows,'customerNo'));
      }, function(err){
        reject(err);
      });
  })
}