angular.module('attendanceApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('attendanceController', function($scope, $http, $interval, $cookies) {
  
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

      //Parameters definition

      $scope.attendance = {};
      $scope.newContentSet = function(){
   
      $scope.attendance.class = "";
      $scope.attendance.division = "";
      $scope.attendance.date = "";
      
     }
     $scope.newContentSet();

      $scope.fetchAttendanceList = function(attendance){

      var co_data = {};

           co_data.token = $cookies.get("dashManager");
           co_data.class = attendance.class;
           co_data.division = attendance.division;
           co_data.date = document.getElementById('attendanceDate').value;

           console.log(co_data);


           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchattendancelist.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {

         if(response.data.status){          

         }
         else{
            $scope.deleteError = response.data.error;
         }
            });       

      }
      
      //Schools basic info
      $scope.schoolCode = localStorage.getItem("schoolCode");
      $scope.schoolFancyName = localStorage.getItem("schoolCity");
      
      	setTimeout(function(){
        $('#attendanceDate').datetimepicker({  
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

      $scope.openType = function (type){

      //Styling
      switch(type) {
          case 'upload':
          {          
             document.getElementById("firstIcon").style.color = "#FFF";
             document.getElementById("firstTag").style.color = "#FFF";
             document.getElementById("firstCount").style.color = "#FFF";
             document.getElementById("firstTabButton").style.background="#2980b9";
         
             document.getElementById("secondIcon").style.color = "#ABB2B9";
             document.getElementById("secondTag").style.color = "#ABB2B9";
             document.getElementById("secondCount").style.color = "#ABB2B9";
             document.getElementById("secondTabButton").style.background="#F1F1F1";
              
                  break;
          }
          case 'select':
          {
             document.getElementById("secondIcon").style.color = "#FFF";
             document.getElementById("secondTag").style.color = "#FFF";
             document.getElementById("secondCount").style.color = "#FFF";
             document.getElementById("secondTabButton").style.background="#2980b9";
         
             document.getElementById("firstIcon").style.color = "#ABB2B9";
             document.getElementById("firstTag").style.color = "#ABB2B9";
             document.getElementById("firstCount").style.color = "#ABB2B9";
             document.getElementById("firstTabButton").style.background="#F1F1F1";
              
                  break;
          }
      } 
   }
      
     
  });