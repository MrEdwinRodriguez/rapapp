var orm = require('../config/orm.js')


var rap = {

    select: function(table, col, val, cb) {
        orm.all('users', function(res) {
            cb(res);
        });
    },

    selectFrom: function(table, col, val, cb) {
        console.log(col)
        console.log(val)
        orm.allFrom(table, col, val, function(res) {
            cb(res);
        });
    },


    insertInto: function(table, col, val, cb) {

        orm.create(table, col, val, cb);
    },

    update: function(objColVals, condition, cb) {
        orm.update('users', objColVals, condition, function(res) {
            cb(res);
        });
    }



}

module.exports = rap;
