var orm = require ('../config/orm.js')


var rap = {

	select: function(table, col, val, cb) {
		orm.all('users', function(res){
			cb(res);
		});
	},

	selectUser: function(table, col, val,  cb) {
		console.log('hello')
		console.log( col)
		console.log(val)
		orm.allFrom(table, col, val, function(res){
			cb(res);
		});
	},	

	insertInto: function(table, col , val, cb) {
			
		orm.create(table, col, val, cb);	
	},



}

module.exports = rap;
