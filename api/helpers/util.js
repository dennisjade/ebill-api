'use strict';


module.exports = {
  format2Digit: format2Digit
};

function format2Digit(number){
  return ("0" + number).slice(-2);
}

