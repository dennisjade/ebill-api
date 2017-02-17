var mysql      = require('mysql');

var poolCluster = mysql.createPoolCluster();

var tblemdataConfig = {
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'egl'
};

var infinite_em1Config = {
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'infinite_em1'
};

var ebillConfig = {
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'ebill'
};

poolCluster.add('RAW', tblemdataConfig);
// poolCluster.add('SYSTEM', infinite_em1Config);
poolCluster.add('EBILL', ebillConfig);

var rawConn;
var systemConn;
var ebillConn;

poolCluster.getConnection('RAW', function (err, connection) {
  if (err){
    console.log('Error connecting to RAW...', err);
  }
  console.log('Connection successful to RAW');
  rawConn = connection;
});

// poolCluster.getConnection('SYSTEM', function (err, connection) {
//   if (err){
//     console.log('Error connecting to SYSTEM...', err);
//   }
//   console.log('Connection successful to SYSTEM');
//   systemConn = connection;
// });

poolCluster.getConnection('EBILL', function (err, connection) {
  if (err){
    console.log('Error connecting to EBILL...', err);
  }
  console.log('Connection successful to EBILL');
  ebillConn = connection;
});

module.exports = {
  rawConnection: rawConnection,
  systemConnection: systemConnection,
  ebillConnection: ebillConnection
};

function rawConnection(){
  return rawConn;
}

function systemConnection(){
  return systemConn;
}

function ebillConnection(){
  return ebillConn;
}