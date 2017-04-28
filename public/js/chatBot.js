/**
 * http://usejsdoc.org/
 */

var app = angular.module('IBMBot', []);
app.controller('mycontroller', function($scope) {


	$scope.callIBMApi=function(){

		debugger;

		var inputData=$scope.chatMsg;
		$scope.chatMsg='';
	      $('#container').append(

	    		  '<div class="row">'
					+'<div class="col-md-12 text-right">'
						+'<div style="background-color:rgba(0,200,20,.5);display: inline-block;border-radius:2px;margin-top:3px;">'
						+inputData
						+'</div>'
					+'</div>'
				+'</div>');
		$.ajax({

	         type: "POST",
	         url: 'chatbot/botCall',
	         data: {inputData}
	        }).then(function successCallback(response) {
				var parameter=response.parameter;
				var outMsg=response.msg;
				if(outMsg!=null) {
					if (parameter == "Screenshot") {
						$('#container').append(
							'<div class="row">'
							+ '<div class="col-md-12 text-left">'
							+ '<div style="background-color:rgba(166, 200, 200, 0.21);display: inline-block;border-radius:2px;margin-top:3px;">'
							+ '<img src=' +outMsg +' style="height:150px;weight:150px"> '
							+ '</div>'
							+ '</div>'
							+ '</div>');
					}
					else {
						$('#container').append(
							'<div class="row">'
							+ '<div class="col-md-12 text-left">'
							+ '<div style="background-color:rgba(166, 200, 200, 0.5);display: inline-block;border-radius:2px;margin-top:3px;">'
							+ outMsg
							+ '</div>'
							+ '</div>'
							+ '</div>');
					}
				}

	        /*  if(intents!=null){
	     		  for(var intentItrtr=0 ;intentItrtr<intents.length;intentItrtr++){
	     			 $('#intents').append(

	     		    		  '<div class="row">'
	     						+'<div class="col-md-12 text-left">'
	     							+'<div style="display: inline-block;border-radius:2px;margin-top:3px;">'
	     							+ "Intent :"+ intents[intentItrtr].intent
	     							+"<br/>"
	     							+"Confidence : "+intents[intentItrtr].confidence
	     							+'</div>'
	     						+'</div>'
	     					+'</div>');

	     		  }
	     	  }
	        */
	        }, function errorCallback(response) {
	         // called asynchronously if an error occurs
	         // or server returns response with an error status.

	        });


	}
});
