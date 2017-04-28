/**
 * Created by Abhay on 18-04-2017.
 */
var express = require('express');
var simsConnection = require('./simsConnection.js');
var router = express.Router();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var url = require('url');


router.post('/', function(req, res) {
    var checkQuery = 'SELECT * FROM usermaster WHERE UserName = ? AND Password = ?';

    var values = [req.session.user,req.body.oldPass];
    checkQuery = mysql.format(checkQuery, values);
    simsConnection.query(checkQuery, function (err, rows) {
        if (rows.length > 0) {
            var updateQuery = 'update usermaster set Password=? where userid=? ';
            var values2 = [req.body.newPass,rows[0].userid];
            console.log(values2);
            updateQuery = mysql.format(updateQuery, values2);
            simsConnection.query(updateQuery,function (err, rows) {
                if (err)
                    res.send({status: '0'});
                else
                    res.send({status: '1'});
            });
        }
        else {
                res.send({status:'2'});
        }
    });
});

module.exports = router;