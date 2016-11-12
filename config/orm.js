var connection = require('./connection.js');


function printQuestionMarks(num){
  var arr = [];

  for (var i=0; i<num; i++){
    arr.push('?')
  }

  return arr.toString();
}

var orm = {
    all: function(tableInput, cb) {
        var queryString = 'SELECT * FROM ' + tableInput + ';';
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },

    allFrom: function(tableInput, colName, colVal, cb) {
      console.log(tableInput);
      console.log(colName);
      console.log(colVal);
        var queryString = 'SELECT * FROM ' + tableInput + ' WHERE ' + colName + ' = ' +  "'" + colVal + "';";
        console.log(queryString)
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },
    //vals is an array of values that we want to save to cols
    //cols are the columns we want to insert the values into
    create: function(table, cols, vals, cb) {
      var queryString = 'INSERT INTO ' + table;

      queryString = queryString + ' (';
      queryString = queryString + cols.toString();
      queryString = queryString + ') ';
      queryString = queryString + 'VALUES (';
      queryString = queryString + printQuestionMarks(cols.length);
      queryString = queryString + '); ';

      console.log(queryString)

      connection.query(queryString, vals, function(err, result) {
        if (err) throw err;
        cb(result);
      });
    },
    //objColVals would be the columns and values that you want to update
    //an example of objColVals would be {name: panther, sleepy: true}
    update: function(table, ColVals, condition, cb) {
      var queryString = 'UPDATE ' + table;

      queryString = queryString + ' SET ';
      queryString = queryString + objToSql(objColVals);
      queryString = queryString + ' WHERE ';
      queryString = queryString + condition;

      console.log(queryString)
      connection.query(queryString, function(err, result) {
        if (err) throw err;
        cb(result);
      });
    }
};

module.exports = orm;
