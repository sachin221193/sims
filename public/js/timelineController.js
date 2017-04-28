app2.controller("myCtrl2",["$http","$scope","$window", function($http,$scope,$window){

    var INCid = $scope.id;
    debugger;


    loadIntiData();
    function loadIntiData(){

        console.log(INCid);
        $http.post("/timeline/data",{
              "INCid": INCid,
              headers: {
       "Content-Type": "application/json"
   }



        }).success(function (response){

            $scope.type = [];
            $scope.status= [];
            $scope.agent  = [];
            $scope.priority = [];
            var rows = response.rows;
            var data = response.data;

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

            $scope.CDOpriority=ticketPriority.toString();
            $scope.CDOstatus= ticketStatus.toString();
            $scope.CDOagent=data[0].INCFixedBy;
            $scope.txtModule=data[0].INCModuleName;
            $scope.txtTags=tagResult;
            var KeyCode = parseInt($scope.CDOstatus)-1;
            var statusKeyCode = KeyCode.toString();
            $scope.ticketStatus=$scope.status[statusKeyCode].name;


        });
    }

    $scope.btnUpdateTicket=function(){
        debugger;
        var inputData = {};
        inputData.priority = $scope.CDOpriority;
        inputData.status = $scope.CDOstatus;
        inputData.agent = $scope.CDOagent;
        inputData.Module = $scope.txtModule;
        inputData.txtTags = $scope.txtTags;
        var id = $scope.id;
        console.log(id);

        $.ajax({
            method : "POST",
            url : '/timeline/update',
            data : {inputData :JSON.stringify(inputData),id}

        }).then (function successCallback(response){
            $scope.$apply(function(){
                console.log(response);
                var KeyCode = parseInt(response)-1;
                var statusKeyCode = KeyCode.toString();
                $scope.ticketStatus=$scope.status[statusKeyCode].name;
              })
            $window.alert("result updated succesfully");
        });

    }
    $scope.btnCreateNote=function(){
        var editorData = angular.element( document.querySelector( '.Editor-editor' ) );
        var timeLine = angular.element( document.querySelector( '.timeline' ) );

        var notedata = editorData.html();
        console.log(notedata);

        timeLine.prepend( '<li class="timeline-item"><div class="timeline-date"><span>September 16, 2016</span></div><div class="timeline-content"><div class="timeline-avatar"><img src="/a/img/avatar2.jpg" alt="Avatar" class="circle"></div><div class="timeline-header"><span class="timeline-time">4:34 PM</span><span class="timeline-autor">Penelope Thornton</span> <p class="timeline-activity">' + notedata + '<a href="#"> Amet nisl sed mattis</a>.</p></div></div></li> ');
    }
}]);
