var mysql = require('mysql');
var mysqlConfig = {
  host     : '127.0.0.1',
  user     : 'root',
  password : 'sigma101',
  database : 'rapapp_db',
  port:3306,
  multipleStatements: true
};

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
			// connection.query(
			// 		queryString,function(err,result){
			// 		if(err)
			// 		{
			// 			//connection.release();
			// 			callback('err');
			// 			console.log(err);
			// 		}
			// 		else
			// 		{
			// 			//console.log('result: ',result);
			// 			callback(result);
			// 		}
			// });
			//terminating connection
		//	connection.end();
}