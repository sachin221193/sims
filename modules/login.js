var express = require('express');
var simsConnection = require('./simsConnection.js');
var router = express.Router();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var url = require('url');


router.post('/', function(req, res) {
		var checkQuery = 'select um.userid,um.username,um.password,lm.locName,lm.locCode from usermaster um inner join location lm on um.userid=lm.owner where um.username=? and password=?';
		var values = [req.body.username, req.body.password];
		checkQuery = mysql.format(checkQuery, values);
	simsConnection.query(checkQuery, function (err, rows) {
			if (rows.length > 0) {
				req.session.user = req.body.username;
				req.session.userid = rows[0].userid;
				req.session.locName = rows[0].locName;
				req.session.locCode = rows[0].locCode;
				res.redirect('/home');

			}
			else {
				  res.render('login',{layout:'portal',session:'',validate:'true'});
			}
		});
 });

module.exports = router;
