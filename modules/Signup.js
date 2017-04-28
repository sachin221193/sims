
var express = require('express');
var simsConnection = require('./simsConnection.js');
var router = express.Router();
var app=express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var url = require('url');


router.post("/",function(req,res){
	
	var insertdata="INSERT INTO usermaster(FirstName,EmailId1,phone1,username,password,title,Address1,country,State,City,CRTBy,CRTDate,UPDBy,UPDdate) VALUES (?,?,?,?,?,'2','2','1','1','1','2',now(),'2',now())";

	var insertdata2="INSERT INTO location(LocName,Owner,LocationType,HierarchyCode,CRTBy,CRTDate,UPDBy,UPDdate) VALUES (?,?,1,1,2,now(),2,now())";

	var values=[req.body.txtFirstName,req.body.txtemail,req.body.txtmobile,req.body.txtusername,req.body.txtpassword];
	insertdata=mysql.format(insertdata,values);
	console.log(insertdata);
	console.log(insertdata2);

	simsConnection.query(insertdata,function (err,response) {
		if (err)
			console.log(err);
		else{
			console.log(response.insertId);
				values2=[req.body.txtwebsite,response.insertId];
				insertdata2=mysql.format(insertdata2,values2);
				console.log(insertdata2);
			simsConnection.query(insertdata2,function(err, response) {
					if (err)
						console.log(err);
					else
						res.render('login', {layout: 'portal', session: ''});
				});
		}
	});
});

module.exports = router;
