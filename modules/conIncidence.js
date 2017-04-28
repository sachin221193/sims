var express = require("express");
var simsConnection = require('./simsConnection.js');
var bodyParser = require("body-parser");
var multer  =   require('multer');
var router = express.Router();
var mySql = require('mysql');
var url=require('url');
var path = require('path');

/*
 * Multer Configuration.
 */
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './modules/uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now()+"-"+path.extname(file.originalname));
	}
});

var upload = multer({ storage : storage})


router.get("/createUpdate",function(req,res){
	var id = req.query.id;
	console.log(id+"onload");
	if(!req.session.user)
		res.render('login',{layout:'portal',session:'false'});
	else {
		res.render('createIncidence', {layout: 'main',username:req.session.user,id:id});
	}
});

router.post("/createUpdateData",function(request,response){
	if(!request.session.user)
		response.render('login',{layout:'portal',session:'false'});
	else {
		//var url_parts=url.parse(request.url,true);
		var INCid=request.body.INCid;
		//console.log(INCid);
		/*
		 set the dropDown
		 */
		var dropDown_statement = 'select key1,KeyCode,LkUpCode from codelkup where LkUpCode="INCIDENCE_AGNT" OR LkUpCode="INCIDENCE_LOC" OR LkUpCode="INCIDENCE_PRIORITY" OR LkUpCode="INCIDENCE_STATUS" OR LkUpCode="INCIDENCE_TYP";';
		simsConnection.query(dropDown_statement,function dataReterive(err,rows){
			console.log(rows);
			if(err){
				console.log("unable to fetch the data from codelkup table of database.");
			}else{

				var result_statement = 'select inc.INCUser,inc.Status,inc.INCFixedBy,inc.Description,inc.INCModuleName,inc.INCPriority,inc.INCSubject,inc.INCTags,loc.LocName from incidence inc join location loc on inc.INCLocation=loc.LocCode where INCId=?';
				result_statement=mySql.format(result_statement,INCid);
				console.log(result_statement);
				simsConnection.query(result_statement,function dataReterive(err,data){
					if(err){
						console.log("unable to fetch the data from incidence table of database.");
					}else{
						console.log(data);
						response.send({data:data,rows:rows});
					}
				});
			}
		});
	}
});

router.post('/ticketForm',upload.array('file'), function(request,response){


	/*
	 data save from json
	 */
	var obj = JSON.parse(request.body.inputData);
	var  requesterName = obj.txtRequesterName;
	var  subjectName = obj.txtSubjectName;
	var  type = obj.txtType;
	var  status = obj.CDOstatus;
	var  priority = obj.CDOpriority;
	//var  location = obj.txtLocation;
	var  agent = obj.CDOagent;
	var  message = obj.txtmessage;
	var tags = obj.txtTags;
	var tagsData = ""+tags[0].text;
		for(var i=1;i<tags.length;i++){
			tagsData = tagsData+","+tags[i].text;
		}


    var INCid = request.body.INCid;
    console.log(INCid);
    if(requesterName==""||requesterName==null){
		console.log("fill Requester Name.");

	}else if(subjectName==""||subjectName==null){
		console.log("fill Subject Name.");

	}else if(message==""||message==null){
		console.log("fill message.");

	}else{

    var ticketFormData_Statement;

    if (!request.body.INCid){
        ticketFormData_Statement = "insert into incidence (INCUser,crtby,INCPriority,INCSubject,INCModuleName,INCFixedBy,Status,INCLocation,Description,INCTags,INCDateTime,crtdate) values (?,?,?,?,?,?,?,?,?,now(),now());"
        var ticketFromValues = [requesterName,requesterName,priority,subjectName,type,agent,status,location,message,tagsData];
        ticketFormData_Statement = mySql.format(ticketFormData_Statement,ticketFromValues);
        console.log(ticketFormData_Statement);
          simsConnection.query(ticketFormData_Statement);
          console.log('data enter'); }
    else {
        ticketFormData_Statement = "update incidence SET INCUser=?,crtby=?,INCPriority=?,INCSubject=?,INCModuleName=?,INCFixedBy=?,Status=?,Description=?,INCTags=?,INCDateTime=now(),crtdate=now() where INCid=?;"
        var ticketFromValues = [requesterName,requesterName,priority,subjectName,type,agent,status,message,tagsData,request.body.INCid];
        ticketFormData_Statement = mySql.format(ticketFormData_Statement,ticketFromValues);
        console.log(ticketFormData_Statement);
          simsConnection.query(ticketFormData_Statement);
          console.log('data update'); }

	}
	response.send("result Updated succesfully.");
});


module.exports = router;
