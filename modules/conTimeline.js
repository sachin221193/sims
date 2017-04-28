/*
Import the require  depencies for the program.
*/
var express = require("express");
var simsConnection = require('./simsConnection.js');
//var bodyParser = require("body-parser");
var router = express.Router();
var mysql = require('mysql');
var url=require('url');

router.get('/',function (req,res) {
    var id = req.query.id;

    if(!req.session.user)
        res.render('login',{layout:'portal',session:'false'});
    else {
        res.render('timeline', {layout: 'mainamit',username:req.session.user,id:id});
    }
})
router.post('/data', function (request, response) {

        var INCid = request.body.INCid;


        var dropDown_statement = 'select key1,KeyCode,LkUpCode from codelkup where LkUpCode="INCIDENCE_PRIORITY" OR LkUpCode="INCIDENCE_STATUS" OR LkUpCode="INCIDENCE_AGNT";';
        simsConnection.query(dropDown_statement,function dataReterive(err,rows){
            if(err){
                console.log("unable to fetch the data from table of database.");
            }else{
                var result_statement = 'select * from incidence where INCid=?;';
                result_statement=mysql.format(result_statement,INCid);
                simsConnection.query(result_statement,function dataReterive(err,data){
                    if(err){
                        console.log("unable to fetch the data from incidence table of database.");
                    }else{

                        response.send({data:data,rows:rows});
                    }
                });
            }
        });

});

router.post('/update', function(request, response) {

    var obj = JSON.parse(request.body.inputData);

    var  type = obj.Module;
    var  status = obj.status;
    var  priority = obj.priority;
    var  agent = obj.agent;
    var tags = obj.txtTags;

  	var tagsData = ""+tags[0].text;
  		for(var i=1;i<tags.length;i++){
  			tagsData = tagsData+","+tags[i].text;
  		}

    var timlineUpdate_Statement = "update incidence SET INCPriority=?,INCModuleName=?,INCFixedBy=?,Status=?,INCTags=?,INCDateTime=now(),crtdate=now() where INCid=?;"
    var timlineUpdateValues = [priority,type,agent,status,tagsData,request.body.id];
    timlineUpdate_Statement = mysql.format(timlineUpdate_Statement,timlineUpdateValues);
    console.log(timlineUpdate_Statement);
    simsConnection.query(timlineUpdate_Statement);
    console.log('data update');
    response.send(status);


});

module.exports = router;
