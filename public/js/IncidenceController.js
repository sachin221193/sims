app.controller('myCtrl',['$scope','$http',"$window",'$compile', function($scope,$http,$window,$compile) {

    var INCid = $scope.INCid;

    debugger;
    loadIntiData();
    function loadIntiData(){
        $.ajax({
            method : "POST",
            url : '/incidence/createUpdateData',
            data : {INCid}
        }).then (function successCallback(response){
        $scope.$apply(function(){
            debugger;
            var rows = response.rows;
            var data = response.data;

            $scope.status= [];
            $scope.agent  = [];
            $scope.priority = [];

            for(var i=0;i<rows.length;i++){
                if(rows[i].LkUpCode=='INCIDENCE_PRIORITY'){
                    var input = {};
                    input["name"] = rows[i].key1;
                    input["id"] = rows[i].KeyCode;
                    $scope.priority.push(input);
                }
                if(rows[i].LkUpCode=='INCIDENCE_STATUS'){

                    var input = {};
                    input["name"] = rows[i].key1;
                    input["id"] = rows[i].KeyCode;
                    $scope.status.push(input);

                }

                if(rows[i].LkUpCode=='INCIDENCE_AGNT'){
                    var input = {};
                    input["name"] = rows[i].key1;
                    input["id"] = rows[i].KeyCode;
                    $scope.agent.push(input);
                }
            }
            debugger;
            var ticketPriority = data[0].INCPriority;
            var ticketStatus= data[0].Status;

            var tagData = data[0].INCTags;
            var text = '[';
            var tagArr = tagData.split(",");
            text = text +'{"text":"'+tagArr[0]+'" }';
            for(var i=1;i<tagArr.length;i++){
                text = text +',{"text":"'+tagArr[i]+'" }';

            }
            text = text + ']';

            var tagResult = JSON.parse(text);
            console.log(tagResult);
            /*
             Setting the data for field.
             */
            $scope.CDOpriority=ticketPriority.toString();
            $scope.CDOstatus= ticketStatus.toString();
            $scope.CDOagent=data[0].INCFixedBy;
            $scope.txtType=data[0].INCModuleName;
            $scope.txtRequesterName = data[0].INCUser;
            $scope.txtSubjectName = data[0].INCSubject;
            $scope.txtLocation = data[0].LocName;
            //$scope.txtmessage = data[0].Description;
            CKEDITOR.instances.txtmessage.setData(data[0].Description);
            $scope.txtTags=tagResult;
            })
        });
    }
/*
    $scope.btnUpdateTicket=function(){
        debugger;
        var inputData = {};
        inputData.priority = $scope.CDOpriority;
        inputData.status = $scope.CDOstatus;
        inputData.agent = $scope.CDOagent;
        inputData.Module = $scope.txtModule;
        var id = $scope.id;

        $.ajax({
            method : "POST",
            url : '/timelineUpdate',
            data : {inputData :JSON.stringify(inputData),id}

        }).then (function successCallback(response){
            console.log(response);
            var KeyCode = parseInt(response)-1;
            var statusKeyCode = KeyCode.toString();
            $scope.ticketStatus=$scope.status[statusKeyCode].name;
        });

    }
*/

    $scope.btnTicketSubmission = function(){
        debugger;
        var INCid = $scope.INCid;
        console.log(INCid);
        var txtMessage = CKEDITOR.instances.txtmessage.getData();

        /*
         Store the data in object for JSON format
         */
        var inputData = {};
        debugger;
        inputData.txtRequesterName = $scope.txtRequesterName
        inputData.txtSubjectName = $scope.txtSubjectName;
        inputData.txtType = $scope.txtType;
        inputData.CDOstatus = $scope.CDOstatus;
        inputData.CDOpriority = $scope.CDOpriority;
        //inputData.txtLocation = $scope.txtLocation;
        inputData.CDOagent = $scope.CDOagent;

            inputData.txtTags = $scope.txtTags;

        inputData.txtmessage = txtMessage;
        var file = $scope.myFile;

        var url = 'http://localhost:3000/INCIDENCE/ticketForm';
        var formData = new FormData();
        formData.append('file', file);
        formData.append("inputData",JSON.stringify(inputData));
        formData.append('INCid', INCid);

        $http.post( url,formData, {

            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(response){
                console.log(response);
            })
            .error(function(response){
                console.log(response);
            });

        /*    $.ajax({
         url : 'http://localhost:3000/INCIDENCE/ticketForm',
         method : "POST",
         data :  { fd },  //{requestData : JSON.stringify(inputData)}
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
         }).then (function successCallback(response){
         debugger;

         //    console.log(response);

         });
         */


        $scope.txtRequesterName=null;
        $scope.txtSubjectName=null;
        $scope.txtTags = null;
        $scope.txtType=null;
        $scope.CDOstatus=null;
        $scope.CDOpriority=null;
        $scope.CDOlocation=null;
        $scope.CDOagent=null;
        $scope.txtLocation=null;
        CKEDITOR.instances.txtmessage.setData('');
        $window.alert("response is receive");
    }

    $scope.btnopenUrl = function(){
        var locUrl = $scope.txtLocation;
        console.log(locUrl);
        $window.open(locUrl,"C Simplify iT",'width=500,height=400');
    }

}]);
