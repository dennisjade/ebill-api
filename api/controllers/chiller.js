'use strict';

var rawDataModel = require('../models/rawData');
var moment = require('moment');

module.exports = {
  getChillerRawData: getChillerRawData
};

function getChillerRawData(req, res){
    var year = req.swagger.params.year.value || moment().format('YYYY');
    var month = req.swagger.params.month.value || moment().format('MM');

    rawDataModel.getChillerByDate(year, month)
      .then(function(response){
        // console.log(response.raw[0].rows);
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
};