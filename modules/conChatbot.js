const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router();
var fs=require('file-system');
var esClient = require('./elasticsearch-connection');
var apiai = require('apiai');
var app=express();
var apiApp = apiai("5becf403a3ed4111ae0beb73b4905096");


//////////////////////////////Facebook Messenger/////////////////////

const Botly = require("botly");
const botly = new Botly({
    accessToken: 'EAAK2hAmkY0UBACZBdcNavZCqyvUfVBySUe334ypZBqWIAGcKIHHuvqekr6tRzH3ofAk0bIrF4sSG3zN', //page access token provided by facebook
    verifyToken: 'sims123456', //needed when using express - the verification token you provided when defining the webhook in facebook
    webHookPath: '/', //defaults to "/",
    notificationType: Botly.CONST.REGULAR //already the default (optional),
});

function searchEs(incId,cb){
		esClient.get({
			index:'sims',
			type:'incidence',
			id:incId
		},function(err,response){
			if(err)
				result="notFound";
			else
				result=response._source;
			cb(result);
		});
}

function filterEs(a,query,cb){
	console.log(a);
	var filter="";
	if(a=="Status")
		filter={"term": {"INCStatus": query}}
	if(a=="Priority")
		filter={"term": {"INCPriority": query}}
	if(a=="Module Name")
		filter={"term": {"INCModuleName": query}}
	if(a=="Updater")
		filter={"term": {"INCUpdBy": query}}
	esClient.search({
		index:'sims',
		type:'incidence',
		body:{  "query": {
                    "bool": {
                        "must": {
                            "match_all": {}
                        },
							filter
                    }
                }
		}
	},function(err,response){
			if(err)
				result="error";
			else {
				console.log(a);
				var hits=[];
				for(var i=0 ; i<response.hits.hits.length ; i++ )
					hits.push(response.hits.hits[i]._id);
				result=hits;
			}
			cb(result);
			}
	);
}

botly.on("message", (senderId, message, data) => {
	/////////////////////////////
	console.log(data.text);
	var request = apiApp.textRequest(data.text, {
    sessionId: Math.random().toString(36).substring(7)
	});

	jsonObject = JSON.stringify({
				"inputData" : "I am happy"
		});

		 var postheaders = {
				 'Content-Type' : 'application/json',
				 'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
		 };
		 var optionspost = {
				 host : 'http://localhost:3000',

				 path : '/home',
				 method : 'POST',
				 headers : postheaders
		 };

	 // do the POST call
		 var reqPost = http.request(optionspost, function(res) {
				 console.log("statusCode: ", res.statusCode);
				 // uncomment it for header details
		 //  console.log("headers: ", res.headers);

				 res.on('data', function(d) {
						 console.info('POST result:\n');
						 process.stdout.write(d);
						 console.info('\n\nPOST completed');
				 });
		 });

		 // write the json data
		 reqPost.write(jsonObject);
		 reqPost.end();
		 reqPost.on('error', function(e) {
				 console.error(e);
		 });


	/////////////////////////////////////////////////////////////
	 request.on('response', function(response) {
	 console.log(response);
	 botly.sendText({
			 id: senderId,
			 text: response.result.fulfillment.speech
		 });
	 });

	 request.on('error', function(error) {
		 console.log(error);
	 });

	 request.end();

	});

app.use("/webhook", botly.router());


/*
router.get('/',function(req,res){
	res.render('chatBot',{layout:'mainamit',username:req.session.user});
});

router.post('/botCall',function (req,res) {

				var request = apiApp.textRequest(req.body.inputData, {
				sessionId: Math.random().toString(36).substring(7)
				});

				request.on('response', function(response) {
					var intent=response.result.metadata.intentName;
					console.log(intent)
					switch(intent){
						case "single_incidence":
							var inc=response.result.parameters.incidence;
							var parameter=response.result.parameters.single_parameter;
							var field;
							searchEs(inc,function(result){
								if(result=="notFound")
									api.sendMessage("Incidence not found",event.threadID);
								else{
									switch(parameter){
										case "Status":
											field=result.INCStatus;
											break;
										case "Priority":
											field=result.INCPriority;
											break;
										case "Creation Date":
											field=result.INCDateTime;
											break;
										case "Module Name":
											field=result.INCModuleName;
											break;
										case "Creation Date":
											field=result.INCDateTime;
											break;
										case "Details":
											field="Incidence ID : " + inc + "<br>" + "Module Name : " + result.INCModuleName + "<br>" + "Status : " + result.INCStatus + "<br>" + "Priority : " + result.INCPriority + "<br>" + "Updated By : " + result.INCUpdBy ;
											break;
										case "Updater":
											field=result.INCUpdBy;
											break;
										case "Screenshot":
											field = result.INCImgPathRef;
											break;
										}


									if(parameter=="Screenshot"||parameter=="Details") {
										console.log(field);
										res.send({msg: field, parameter: parameter});
									}
									else
										res.send({msg:response.result.fulfillment.speech +" "+ field,parameter:parameter});
								}
							});
							break;
						case "multi_incidence":
							var filterTerm=response.result.parameters.filter_term;
							var filterQuery=response.result.parameters.filter_query;
							console.log(response.result.parameters);
							filterEs(filterTerm,filterQuery,function(result){
								console.log(result);
								if(result=="error")
									res.send({msg:"Please check your question , i couldnt find anything related to that.",parameter:parameter});
								else
									res.send({msg:"Found " + result.length + " incidences with " + filterTerm + ": " + filterQuery + ". \n" + "Incidence: " + result,parameter:parameter});
							});
							break;
						default:
							res.send({msg:response.result.fulfillment.speech,parameter:parameter});
							break;
		 			}
				});

				request.on('error', function(error) {
				});


				request.end();

    });
*/

module.exports=router;
