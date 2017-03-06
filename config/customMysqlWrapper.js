var mysql = require('mysql');
var mysqlConfig = {
  host     : '127.0.0.1',
  user     : 'root',
  password : 'sigma101',
  database : 'rapapp_db',
  port:3306,
  multipleStatements: true
};

// var mysqlConfig = {
//   host     : 'qbct6vwi8q648mrn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user     : 'zefd9rz63767u018',
//   password : 'q8yeje6n52t9ztvb',
//   database : 'vgfb1y972emkcwu0',
//   port:3306,
//   multipleStatements: true
// };

console.log('mysql wrapper')
exports.getConnection = function(done){
	var connection = mysql.createConnection(mysqlConfig);
	connection.connect(function(err) {
  	if (err) {
    	console.error('error connecting: ' + err.stack);
    	callback('err');
        return done(err,null);;
  	}

  console.log('connected as id ' + connection.threadId);
		});
        done(null,connection);

}