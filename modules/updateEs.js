/**
 * Created by Abhay on 24-03-2017.
 */

var bodyParser = require('body-parser');
var simsClient=require('./simsConnection.js');
var esClient = require('./elasticsearch-connection.js');
var url=require('url');
var async=require('async');


function createIndex() {
    esClient.indices.create({
        index: 'sims',
        body: {
            "mappings": {
                "incidence": {
                    "properties": {
                        "INCImgPathRef": {
                            "type": "text"
                        },
                        "INCLocation": {
                            "type": "geo_point"
                        },
                        "INCDateTime":{
                            "type":"date"
                        },
                        "INCModuleName":{
                            "type":"string"
                        },
                        "INCPriority": {
                            "type": "string",
                            "fielddata": "true"
                        },
                        "INCStatus": {
                            "type": "string",
                            "fielddata": "true"
                        },
                        "INCUpdBy": {
                            "type": "string",
                            "fielddata": "true"
                        },
                        "INCUserType": {
                            "type": "string",
                            "fielddata": "true"
                        },
                        "location": {
                            "properties": {
                                "lat": {
                                    "type": "float"
                                },
                                "lon": {
                                    "type": "float"
                                }
                            }
                        }
                    }
                }
            }
        }
    }, function (err, resp, status) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Index Created Successfully!!!");
        }

    });
}

function getStatus(cb) {

    simsClient.query('select inc.INCId,inc.INCLatitude,inc.INCLongitude,inc.INCImgPathRef,inc.INCDateTime,inc.INCModuleName,cl.Key1 from incidence inc join codelkup cl on inc.Status=cl.KeyCode where LkUpCode="INCIDENCE_STATUS" AND InsertToElastic="0"', function (err, rows) {
        if (err)
            console.log(err);
        else {
            for (var i = 0, len = rows.length; i < len; i++) {
                esClient.index({
                    index: 'sims',
                    type: 'incidence',
                    id: rows[i].INCId,
                    body: {
                        "INCLocation": {
                            "lat": rows[i].INCLatitude,
                            "lon": rows[i].INCLongitude
                        },
                        "INCImgPathRef": rows[i].INCImgPathRef,
                        "INCStatus": rows[i].Key1,
                        "INCDateTime":rows[i].INCDateTime,
                        "INCModuleName":rows[i].INCModuleName,
                        "INCPriority": "null",
                        "INCUserType": "null",
                        "INCUpdBy": "null"
                    }
                },function (err) {
                    if(err){
                        var status1='0';
                        console.log(err);
                      }
                    else{
                        var status1='1';
                        console.log("Status Created Successfully !!!");
                    }
                    cb(status1);
                });

            }
        }
    });

}

function getPriority(cb) {

    simsClient.query('select inc.INCId,cl.Key1 from incidence inc join codelkup cl on inc.INCPriority=cl.KeyCode where LkUpCode="INCIDENCE_PRIORITY" AND InsertToElastic="0"',function(err,rows) {
        if (err)
            console.log(err);
        else {console.log(rows);
            for (var i = 0, len = rows.length; i < len; i++) {
                esClient.update({
                    index: 'sims',
                    type: 'incidence',
                    id: rows[i].INCId,
                    body: {
                        "doc": {
                            "INCPriority": rows[i].Key1,
                        }
                    }
                },function (err) {
                    if(err){
                        var status2='0';
                        console.log(err);
                      }
                    else{
                        var status2='1';
                        console.log("Priority Created Successfully !!!");
                    }
                    cb(status2);
                });

            }
        }
    });

}

function getUserType(cb) {

    simsClient.query('select inc.INCId,cl.Key1 from incidence inc join codelkup cl on inc.INCUserType=cl.KeyCode where LkUpCode="INCIDENCE_USERTYPE" AND InsertToElastic="0"', function (err, rows) {
        if (err)
            console.log(err);
        else {
            for (var i = 0, len = rows.length; i < len; i++) {
                esClient.update({
                    index: 'sims',
                    type: 'incidence',
                    id: rows[i].INCId,
                    body: {
                        "doc": {
                            "INCUserType": rows[i].Key1,
                        }
                    }
                },function (err) {
                    if(err){
                        var status3='0';
                        console.log(err);
                      }
                    else{
                        var status3='1';
                        console.log("Usertype Created Successfully !!!");
                    }
                    cb(status3);
                });
            }

        }

    });

}

function getUpdBy(cb) {

    simsClient.query('select inc.INCId,um.FirstName from incidence inc join usermaster um on inc.updby=um.userid WHERE InsertToElastic="0"', function (err, rows) {
        if (err)
            console.log(err);
        else {
            for (var i = 0, len = rows.length; i < len; i++) {
                esClient.update({
                    index: 'sims',
                    type: 'incidence',
                    id: rows[i].INCId,
                    body: {
                        "doc": {
                            "INCUpdBy": rows[i].FirstName,
                        }
                    }
                },function (err) {
                    if(err){
                        var status4='0';
                        console.log(err);
                      }
                    else{
                        var status4='1';
                        console.log("UpdBy Created Successfully !!!");
                    }
                    cb(status4);
                });
            }

        }

    });

}

function updateFlag(){
    simsClient.query('update incidence set InsertToElastic="1"',function (err,res) {
        if(err)
            console.log(err);
        else {
            console.log("Table Flags updated Successfully");

        }
    });

}

var updateEs = function (req,res) {
    /*async.series([
        function (callback) {
            getStatus();
            callback();
        },
        function (callback) {
            getPriority();
            callback();
        },
        function (callback) {
            getUserType();
            callback();
        },
        function (callback) {
            getUpdBy();
            callback();
        },
        function (callback) {
            updateFlag();
            callback();
        }
    ], function (err, res) {
        if (err)
            console.log("Error in importing data to ElasticSearch !!!!!");
        else {
            console.log("Data imported to ElasticSearch Successfully !!!!!");
        }
    });*/
    getStatus(function(a){
      if(a=='1'){
        getPriority(function (b) {
          if(b=="1"){
            getUserType(function (c) {
              if(c=="1"){
                getUpdBy(function (d) {
                  if(d=="1"){
                    updateFlag();
                  }
                });
              }
            });
            }
          });
        }
      });
    }

module.exports=updateEs;
