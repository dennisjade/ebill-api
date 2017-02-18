'use strict';

var customer = require('../models/customer');
var moment = require('moment');

module.exports = {
  getCustomerChillerSchedule: getCustomerChillerSchedule
};

function getCustomerChillerSchedule(req, res){
  var params = {
    year : req.swagger.params.year.value || moment().format('YYYY'),
    month : req.swagger.params.month.value || moment().format('MM'),
    customerNo : req.swagger.params.month.customerNo || ''
  };

  customer.getCustomerChillerSchedule(params)
    .then(function(response){
      console.log(response);
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