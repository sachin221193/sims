/*
Import the require  depencies for the program.
*/
var express = require("express");
var simsConnection = require('./simsConnection.js');
var bodyParser = require("body-parser");
var router = express.Router();
var mysql = require('mysql');
var url=require('url');
var async=require('async');
var fs=require('fs');
var updateEs=require('./updateEs');

router.post('/', function (req, res) {
console.log("Screenshot module");
var file=req.body.screen;
var data = file.replace(/^data:image\/\w+;base64,/, "");
var buf = new Buffer(data, 'base64');
var now = new Date();
var moduleName = url.parse(req.body.curUrl).pathname;
var  requesterName = req.session.userid;
var  subjectName = "problem";
var  type = moduleName;
var  status = "1";
var  priority = "1";
var  location = req.session.locCode;
var  agent = "3";
var  message = req.body.curUrl;
var  InsertToElastic = 0;
var path='/images/' + now.getFullYear() + "-"+ (now.getMonth()+1) + "-" + now.getDate() + "-" + now.getHours() + "." + now.getMinutes() + "." + now.getSeconds() + '.png';
fs.writeFile(__dirname+'/../public' + path,buf);

var getUserTypeQuery = "select userType from usermaster where userid=?;"
var values=[requesterName];
getUserTypeQuery = mysql.format(getUserTypeQuery,values);
console.log(getUserTypeQuery);
simsConnection.query(getUserTypeQuery,function(err,rows){
	if(err) {
    	console.log(err);
      }
	else
      {
				var userType = rows[0].userType;

			var updateQuery = "insert into incidence (INCUser,crtby,INCPriority,INCSubject,INCModuleName,INCFixedBy,Status,INCLocation,Description,INCImgPathRef,InsertToElastic,INCTags,updby,INCUserType,INCDateTime,crtdate,INCFixedOn) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),now(),'2017-04-09 13:01:29');"
			var values=[requesterName,requesterName,priority,subjectName,type,agent,status,location,message,path,InsertToElastic,type,requesterName,userType];
			updateQuery=mysql.format(updateQuery,values);
			simsConnection.query(updateQuery,function(err,rows){
				if(err) {
			    console.log(err);
			        console.log("error updating screenshot");
			        res.send({status:'0'});
			    }
				else
			        {
			            console.log("success updating screenshot");
			            async.series([
			                function (callback) {
			                    updateEs();
			                    callback();
			                },
			                function (callback) {
			                    res.send({status:'1'});
			                    callback();
			                },
			            ], function (err, res) {
			                if (err)
			                    console.log("erroe screenshot and es");
			                else {
			                    console.log("Screenshot and es completed");
			                }
			            });

			        }
    		});
			}
  });
});
module.exports = router;
	
