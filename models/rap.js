var orm = require ('../config/orm.js')


var rap = {

	select: function(cb) {
		orm.all('users', function(res){
			cb(res);
		});
	},

	selectSubmission: function(cb) {
		orm.all('submission', function(res){
			cb(res);
		});
	},	

	insertInto: function(table, col , val, cb) {
		orm.create(table, col, val, cb);	
	},



}

module.exports = rap;
