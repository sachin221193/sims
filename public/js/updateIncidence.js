debugger;
var app =  angular.module('App',[]);

  app.controller('Ctrl', function($scope,$http) {


    $scope.btnupdateIncidence = function(){
      var INCid = $scope.INCid;
      console.log(INCid);

        $.ajax({
          url : 'http://localhost:3000/INCIDENCE/a',
          method : "POST",
          data : {INCid}
      }).then (function successCallback(data){
            debugger;
            window.location = data.redirect;
            console.log(response);
      });

    }
});
