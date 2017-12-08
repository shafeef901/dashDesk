angular.module('classesApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('classesController', function($scope, $http, $interval, $cookies, $timeout) {
  
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
      $scope.classSelect = "";
      
        $scope.initializeContent = function(){
          $scope.newContentSaveError = "";
          $scope.newClassContent = {};
          $scope.newClassContent.class = "";
          $scope.newClassContent.division = "";
          $scope.newClassContent.stream = "";
          $scope.newClassContent.teacherId = "";

    }
    $scope.initializeContent();
     
            //Fetch Content
  $scope.fetchContent = function(){
   var co_data = {};
   co_data.classSelect = $scope.classSelect;
   co_data.token = $cookies.get("dashManager");
   console.log("going data", co_data);


   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchclasses.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
         
               $scope.isContentFound = true;             
               $scope.active_content = response.data.response;
                                                                  
          }
         
           else{ 
              $scope.isContentFound = false;      
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

   $scope.showClassOptions = function(content){
        $('#classModal').modal('show'); 
        $scope.classInfo = content;     
    }

    $scope.askForDelete = function(){
      $('#confirmationModal').modal('show');
    }

    $scope.addClassModal = function() {
    $('#addClassModal').modal('show');  
  }

  $scope.createClass = function(){

    if($scope.newClassContent.class === ""){
                  $scope.newContentSaveError = "Select the Class";
                }
                 
    else if($scope.newClassContent.division === ""){
                  $scope.newContentSaveError = "Mention the Division";
                }
    else if(!/[A-Za-z]/.test($scope.newClassContent.division)){
                  $scope.newContentSaveError = "Make sure that the class division is an Alphabet";
                }
    else if($scope.newClassContent.stream === "" && $scope.newClassContent.class > 10){
                  $scope.newContentSaveError = "Select the Stream";
                }
    else if($scope.newClassContent.teacherId === ""){
                  $scope.newContentSaveError = "Enter the Teacher's Mobile Number";
                }
    else if(!/^[789]\d{9}$/.test($scope.newClassContent.teacherId)){
                  $scope.newContentSaveError = "Enter a valid Mobile Number";
                }
    else{

                  $scope.newContentSaveError = "";
                  
                  $('#loading').show(); $("body").css("cursor", "progress");
            
               var data = {};
               data.token = $cookies.get("dashManager");
               data.class = $scope.newClassContent.class;
               data.division = $scope.newClassContent.division;
               if(data.class > 10){ 
               	data.stream = $scope.newClassContent.stream;
               }
               data.teacherId = $scope.newClassContent.teacherId;    

               console.log('GOes to Server');  
               console.log(data);
               
                 $http({
                   method  : 'POST',
                   url     : 'http://www.schooldash.xyz/services/createclass.php',
                   data    : data,
                   headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                  })
                  .then(function(response) {
                       $('#loading').hide(); $("body").css("cursor", "default");
                       if(response.data.status){
                           console.log('COmes from Server')
                            console.log(response); 
                            $timeout(function() {
                              $scope.fetchContent();
                      }, 300);
                            $('#addClassModal').modal('hide');
                            $scope.initializeContent();
                       }
                       else{
                        $scope.newContentSaveError = response.data.error;
                       }
                  });
               }
  }

    $scope.deleteClass = function(){ 
      var data = {};
        
        data.token = $cookies.get("dashManager");
        data.class = $scope.classInfo.class;
        data.division = $scope.classInfo.division;

        console.log("going Data for delete class", data);
        
        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/deleteclass.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {

        console.log(response);
        if(response.data.status){
          $('#classModal').modal('hide');
          $('#confirmationModal').modal('hide');
          $scope.fetchContent();
        }
        else{
          alert('Error: '+response.data.error);
        }

         }); 



    }  

    $scope.viewTeachers = function(){
    $timeout(function () {
      $('#teacherModal').modal('show');
    }, 200);

      var co_data = {};
      co_data.class = $scope.classInfo.class;
        co_data.division = $scope.classInfo.division;
        console.log("Going data for teachers' list", co_data);
      co_data.token = $cookies.get("dashManager");


   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchteacherlistforclass.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
         
               $scope.isContentFound = true;             
               $scope.active_content1 = response.data.response;             
                                                                  
          }
         
           else{ 

              $scope.isContentFound = false;      
              $scope.active_content = {};

           }
              }); 

    }

    $scope.viewStudents = function(){
    $timeout(function () {
      $('#studentModal').modal('show');
    }, 200);

      var co_data = {};
      co_data.key = $scope.classInfo.class + "-" + $scope.classInfo.division;
        console.log("Going data for students' list", co_data);
      co_data.token = $cookies.get("dashManager");


   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchstudents.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
         
               $scope.isContentFound = true;             
               $scope.active_content2 = response.data.response;             
                                                                  
          }
         
           else{ 

              $scope.isContentFound = false;      
              $scope.active_content = {};

           }
              }); 
    }     
    
  


  });