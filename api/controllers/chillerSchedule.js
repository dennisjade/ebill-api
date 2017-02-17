'use strict';

var customer = require('../models/customer');
var moment = require('moment');

module.exports = {
  getCustomerChillerSchedule: getCustomerChillerSchedule
};

function getCustomerChillerSchedule(){
  var year = req.swagger.params.year.value || moment().format('YYYY');
  var month = req.swagger.params.month.value || moment().format('MM');
  var customerNo = req.swagger.params.month.customerNo || '';
  var scheduleDate = new Date(year+'-'+month+'-1');

  customer.getCustomerChillerSchedule(customerNo, scheduleDate)
    .then(function(response){
      console.log(response.raw[0].rows);
      res.json({
        status:200,
        data: response
      });
    }).catch(function(err){
    res.json({
      status: 500,
      data: err
    })
  });
}