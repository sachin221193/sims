/**
 * Created by Batman on 27-Feb-17.
 */

var express = require('express');
var router = express.Router();
var hbs=require('express-handlebars');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var mySqlClient=require('./mysql-connection.js');
var fs=require('fs');
var path=require('path');

router.get('/',function(req,res){
  res.render('home-template',{layout:'savetemplate.hbs', title:'Home'})
});

router.post('/save-template',function savaTemplate(req,res){
    var insertToTemplate='INSERT INTO templates(templateType,templateName,emailSubject,templateDescription,CRTBy,CRTDate,UPDBy,UPDDate) VALUES (?,?,?,?,?,now(),?,now())';
    var values=['1',req.body.name,req.body.subject,req.body.message,'2','2'];
    var template=req.body.message;
    insertToTemplate=mysql.format(insertToTemplate,values);
    mySqlClient.query(insertToTemplate,function (err,res) {
        if(err)
            console.log(err);
        else {
            console.log("Data Submitted Successfully!!");
            fs.writeFileSync(path.join((__dirname, 'views/partials'), 'template.hbs'), template, {'encoding': 'utf-8'});
        }
    });
});


module.exports=router;

