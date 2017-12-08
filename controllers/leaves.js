angular.module('leavesApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('leavesController', function($scope, $http, $interval, $cookies) {
  
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
      
      $scope.currentDisplayPage = 1;
      $scope.totalDisplayPages = 1;
      $scope.isContentFound = false;
      $scope.comments = "";
      
      
        $scope.initializeContent = function(req_pageid){
          $scope.currentDisplayPage = req_pageid;
          $scope.fetchContent();

    }
     
            //Fetch Content
  $scope.fetchContent = function(){
   var co_data = {};

   co_data.page = $scope.currentDisplayPage - 1;
   co_data.token = $cookies.get("dashManager");


   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchleaves.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
         
               $scope.isContentFound = true;             
               $scope.active_content = response.data.response;
         
               /* Customize */
               $scope.total_count = response.data.totalLeaves;               

               //Update Total Pages
                     $scope.totalDisplayPages = Math.ceil($scope.total_count/10);
                     if($scope.total_count == 0){$scope.isContentFound = false;}
                                                                  
          }
         
           else{ 
              $scope.isContentFound = false;      
              $scope.currentDisplayPage = 1;
              $scope.totalDisplayPages = 1; 
              $scope.active_content = {};
           }
              }); 
          }
        $scope.fetchContent();

       //View Content

   $scope.viewMyContent = function(content){
      $scope.viewContent = content;
      $('#viewModal').modal('show');      
   }

   $scope.approveLeave = function(id){
      
      var data = {};
       data.id = id;
       data.comments = $scope.comments;
       data.token = $cookies.get("dashManager");

          console.log("GOing Data");
          console.log(data);
   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/approveleave.php',
             data    : data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
              console.log("Leave Approved");
              $scope.fetchContent();
          }
         else{
            console.log("Not found");
         }
              }); 
   }

   $scope.rejectLeave = function(id){
      
      var data = {};
       data.id = id;
       data.comments = $scope.comments;
       data.token = $cookies.get("dashManager");
   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/rejectleave.php',
             data    : data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
              console.log("Leave Rejected");
              $scope.fetchContent();
          }
         else{
            console.log("Not found");
         }
              }); 
   }

  });