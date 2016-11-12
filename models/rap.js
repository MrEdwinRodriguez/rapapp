var orm = require ('../config/orm.js')


var rap = {

	select: function(table, col, val, cb) {
		orm.all('users', function(res){
			cb(res);
		});
	},

	selectUser: function(cb) {
		orm.allFrom('users', function(res){
			cb(res);
		});
	},	

	insertInto: function(table, col , val, cb) {
			
		orm.create(table, col, val, cb);	
	},



}

module.exports = rap;
