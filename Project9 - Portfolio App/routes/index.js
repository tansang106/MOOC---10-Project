var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Connect toi mysql
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio'
});

connection.connect();

// Trang home
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM projects', function(err, rows, fields){
    if(err) throw err;
    res.render('index', {
      "rows": rows
    });
  });
});

module.exports = router;
