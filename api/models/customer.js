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

function formatMapping(data){
  var formatted = {};
  var item;

  for (var x=0; x<data.length; x++){
    item = data[x];
    if (!formatted[item.chiller]){
      formatted[item.chiller] = {};
    }
    if (!formatted[item.chiller][item.skedDay]){
      formatted[item.chiller][item.skedDay] = {};
    }
    if (!formatted[item.chiller][item.skedDay][item.name]){
      formatted[item.chiller][item.skedDay][item.name] = [];
    }

    formatted[item.chiller][item.skedDay][item.name].push(item);

  }
  return formatted;
}

function getCustomerChillerSchedule(params){
  return new Promise(function(resolve, reject){
    var criteria='';

    if (params.customerNumber) {
      criteria = ' customerInfo.customerNo=' + params.customerNumber + ' and';
    }
    if (params.month) {
      criteria += ' MONTH(chillerSchedule.activeDate)=' + params.month + ' and' +
        ' YEAR(chillerSchedule.activeDate)=' + params.year + ' and';
    }

    criteria = criteria.slice(0, -3);

    var sql = 'select chillerSchedule.fromTime,chillerSchedule.toTime,chillerSchedule.activeDate, ' +
      'customerInfo.customerNo, customerInfo.name, customerInfo.squareFt,  ' +
      'DAY(chillerSchedule.activeDate) as skedDay, mapCustomerChiller.chiller ' +
      'from chillerSchedule ' +
      'inner join customerInfo on customerInfo.customerNo=chillerSchedule.customerNo ' +
      'inner join mapCustomerChiller on mapCustomerChiller.customerNo=chillerSchedule.customerNo ' +
      (criteria?('where' + criteria):'') +
      'order by chillerSchedule.activeDate,customerInfo.customerNo';

    // console.log('getCustomerChillerSchedule', sql);
    config.ebillConnection().query(sql,
      function(err, rows, fields){
        if (err){
          return reject(err);
        }
        resolve(formatMapping(rows));
      }, function(err){
        reject(err);
      });
  })
}