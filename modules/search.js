/**
 * Created by Amit on 20-Feb-17.
 */

var express = require('express');
var router = express.Router();
//var hbs=require('express-handlebars');
var bodyParser = require('body-parser');
var simsClient=require('./simsConnection.js');
var esClient = require('./elasticsearch-connection.js');
var url=require('url');
var async=require('async');



function emptySearch(qsize,req,res){
var newSize=qsize + 12;
    esClient.search({
        index: 'sims',
        type:'incidence',
        body: {
            "from":qsize,
            "size": 12,
            "query": {
                "match_all": {}
            },
            "sort":{
               "INCDateTime" : {"order" : "desc"}
            },
            "aggs" : {
                "status" : {
                    "terms" : {
                        "field" : "INCStatus"
                    }
                },
                "priority" : {
                    "terms" : {
                        "field" : "INCPriority"
                    }
                },
                "usertype" : {
                    "terms" : {
                        "field" : "INCUserType"
                    }
                },
                "updby" : {
                    "terms" : {
                        "field" : "INCUpdBy"
                    }
                }
            }
        }
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error)
        }
        else {
            if (response.hits.total > 0) {
                var aggs=response.aggregations;
                res.render('search', {layout:'mainamit',title: 'Search Result',hits: response.hits.hits,status:aggs.status.buckets,priority:aggs.priority.buckets,usertype:aggs.usertype.buckets,updby:aggs.updby.buckets,totalResults: response.hits.total, searchTerm:'',username:req.session.user,newSize : newSize});
            }
            else {
                console.log("No Hits");
                res.render('search', {layout:'mainamit',title: 'Search Results', totalResults: response.hits.total,username:req.session.user,newSize : newSize});
            }
        }
    });
}

function querySearch(searchTerm,qsize,req,res) {
var newSize=qsize+12;

    esClient.search({
        index: 'sims',
        type:'incidence',
        q: searchTerm,
        body : {
          "from":qsize,
          "size": 12,
          "sort":{
           "INCDateTime" : {"order" : "desc"}
        }
      }
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error)
        }
        else {
            if (response.hits.total > 0) {
                res.render('search', {layout:'mainamit',title: 'Search Result',hits: response.hits.hits,newSize : newSize,totalResults: response.hits.total, searchTerm:searchTerm,username:req.session.user});
            }
            else {
                console.log("No Hits");
                res.render('search', {layout:'mainamit',title: 'Search Results', newSize : newSize,totalResults: response.hits.total,username:req.session.user});
            }
        }
    });

}

function filterSearch(qsize,checked,req,res){
  var newSize=qsize+12;
  filter = [];
  console.log(checked.distance[0]);


  if(checked.distance.length>0)
      filter.push({"geo_distance":{"distance":checked.distance[0],"INCLocation":{"lat":28.454624,"lon":77.050668}}});
  if (checked.status.length > 0)
      filter.push({"terms": {"INCStatus": checked.status}});
  if (checked.priority.length > 0)
      filter.push({"terms": {"INCPriority": checked.priority}});
  if (checked.updby.length > 0)
      filter.push({"terms": {"INCUpdBy": checked.updby}});
  if (checked.usertype.length > 0)
      filter.push({"terms": {"INCUserType": checked.usertype}});

  console.log(filter);

  if(req.body.searchTerm) {
      esClient.search({
          index: 'sims',
          type: 'incidence',

          size: '12',
          body: {
              "query": {
                  "bool": {
                      "must": {
                          "query_string": {
                              "query": req.body.searchTerm
                          }
                      },
                    filter
                  }
              },
              "from": qsize,
              "sort":{
                 "INCDateTime" : {"order" : "desc"}
              }
          }
      }, function (err, response) {
          if (err)
              console.log(err);
          else {
              res.render('search', {
                  layout:'mainamit',
                  title: 'Search Result',
                  hits: response.hits.hits,
                  totalResults: response.hits.total,
                  searchTerm: req.body.searchTerm,
                  username:req.session.user,
                  newSize : newSize
              });
          }
      });
  }
  else {

      esClient.search({
          index: 'sims',
          type: 'incidence',
          size: '12',
          body: {
              "query": {
                  "bool": {
                      "must": {
                          "match_all": {}
                      },
                      filter
                  }
              },
              "from" : qsize,
              "sort":{
                 "INCDateTime" : {"order" : "desc"}
              }
          }
      }, function (err, response) {
          if (err)
              console.log(err);
          else {
              res.render('search', {
                  layout:'mainamit',
                  title: 'Search Result',
                  hits: response.hits.hits,
                  totalResults: response.hits.total,
                  searchTerm: '',
                  username:req.session.user,
                  newSize : newSize
              });
          }
      });
  }
}

router.get('/', function(req, res) {
var s=0;
         emptySearch(s,req,res);

});

router.get('/search', function(req, res) {
var s=0;
            var searchTerm=req.query.query;
                if (searchTerm) {
                    querySearch(searchTerm,s,req,res);
                }
                else {
                    emptySearch(req,res);
                }

});

router.post('/load', function(req, res) {
var size=JSON.parse(req.body.size);
            var searchTerm=req.query.query;
                if (searchTerm) {
                    querySearch(searchTerm,size,req,res);
                }
                else {
                    emptySearch(size,req,res);
                }

});

/*
router.post('/previous', function(req, res) {
var size=JSON.parse(req.body.size);
            var searchTerm=req.query.query;
                if (searchTerm) {
                    querySearch(searchTerm,size,req,res);
                }
                else {
                    emptySearch(size,req,res);
                }

});
*/


router.post('/search/filter-aggs', function(req, res) {
    checked = JSON.parse(req.body.checked);
    var s = 0;
        filterSearch(s,checked,req,res);
    /*
    checked = JSON.parse(req.body.checked);
    filter = [];
    console.log(checked.distance[0]);


    if(checked.distance.length>0)
        filter.push({"geo_distance":{"distance":checked.distance[0],"INCLocation":{"lat":28.454624,"lon":77.050668}}});
    if (checked.status.length > 0)
        filter.push({"terms": {"INCStatus": checked.status}});
    if (checked.priority.length > 0)
        filter.push({"terms": {"INCPriority": checked.priority}});
    if (checked.updby.length > 0)
        filter.push({"terms": {"INCUpdBy": checked.updby}});
    if (checked.usertype.length > 0)
        filter.push({"terms": {"INCUserType": checked.usertype}});

    console.log(filter);

    if(req.body.searchTerm) {
        esClient.search({
            index: 'sims',
            type: 'incidence',
            size: '100',
            body: {
                "query": {
                    "bool": {
                        "must": {
                            "query_string": {
                                "query": req.body.searchTerm
                            }
                        },
                        filter
                    }
                },
                "sort":{
                   "INCDateTime" : {"order" : "desc"}
                }
            }
        }, function (err, response) {
            if (err)
                console.log(err);
            else {
                res.render('search', {
                    layout:'mainamit',
                    title: 'Search Result',
                    hits: response.hits.hits,
                    totalResults: response.hits.total,
                    searchTerm: req.body.searchTerm,
                    username:req.session.user
                });
            }
        });
    }
    else {

        esClient.search({
            index: 'sims',
            type: 'incidence',
            size: '100',
            body: {
                "query": {
                    "bool": {
                        "must": {
                            "match_all": {}
                        },
                        filter
                    }
                },
                "sort":{
                   "INCDateTime" : {"order" : "desc"}
                }
            }
        }, function (err, response) {
            if (err)
                console.log(err);
            else {
                res.render('search', {
                    layout:'mainamit',
                    title: 'Search Result',
                    hits: response.hits.hits,
                    totalResults: response.hits.total,
                    searchTerm: '',
                    username:req.session.user
                });
            }
        });
    } */

});

router.post('/incidence',function (req,res) {
    var id=req.body.id;
    res.send({redirect:"/incidence/createUpdate/?id=" + id});
});

module.exports=router;
