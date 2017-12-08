angular.module('StudentProfileApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


.controller('studentProfileController', function($scope, $http, $interval, $cookies) {
//1. Check if the user is logged in?

//2. If the logged in user has the previliage to view?

//3.Otther data to be displayed on the screeen ('badges', 'messages', 'notificaitons')

      //Check if logged in
      if($cookies.get("dashManager")){
        $scope.isLoggedIn = true;
      }
      else{
        $scope.isLoggedIn = false;
        window.location = "adminlogin.html";
      }
      
      //Logout function
      $scope.logoutNow = function(){
        if($cookies.get("dashManager")){
          $cookies.remove("dashManager");
          window.location = "adminlogin.html";
        }
      }
      
      //Schools basic info
      $scope.schoolCode = localStorage.getItem("schoolCode");
      $scope.schoolFancyName = localStorage.getItem("schoolCity");

      $scope.isSearched = false;
      $scope.isFound = false;
      $scope.singleStudent = false;
      $scope.studentData = "";

      $scope.searchKey = "";

      $scope.search = function(search_key){

            var data = {};
            data.token = $cookies.get("dashManager");
            data.key = search_key;
            console.log("Goes to server");
            console.log(data);

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchstudents.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                console.log("Comes from server");
                console.log(response);

            if(response.data.status){
              $scope.isSearched = true;
              $scope.isFound = true;
              $scope.studentData = response.data.response;

              if($scope.studentData.length == 1){
                $scope.singleStudent = true;
                $scope.studentData = $scope.studentData[0];
                console.log($scope.studentData);
              }

              else{
                $scope.singleStudent = false;
              }
            }
            
            else{
              $scope.isSearched = true;
              $scope.isFound = false;
              $scope.studentData = {};
            }

            });
              
      }

      $scope.goToStudentProfile = function(search_key){
            
            var data = {};
            data.token = $cookies.get("dashManager");
            data.key = search_key;
            console.log("Goes to server");
            console.log(data);

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchstudents.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                console.log("Comes from server");
                console.log(response);

            if(response.data.status){
              $scope.singleStudent = true;
              $scope.isSearched = true;
              $scope.isFound = true;

              $scope.studentData = response.data.response[0];   
            }

            else{
              $scope.isSearched = true;
              $scope.isFound = false;
              $scope.studentData = {}
            }
      });
    }


      //Edit Student Info

         setTimeout(function(){
        $('#dob').datetimepicker({  
            format: "dd-mm-yyyy",
            weekStart: 1,
              todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
        })  
      }, 200);

  $scope.studentEditInfo = $scope.studentData;
      console.log($scope.studentData)
        console.log($scope.studentEditInfo);

      $scope.saveEditChanges = function(){

      }

});