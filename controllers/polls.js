angular.module('pollsApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('pollsController', function($scope, $http, $interval, $cookies, $timeout) {

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

    $scope.schoolCode = localStorage.getItem("schoolCode");
      $scope.schoolFancyName = localStorage.getItem("schoolCity");

      $scope.isPollsFound = false;
      $scope.isPollResponseFound = false;

      $scope.limiter = 0;
      $scope.isMoreLeft = true;
      $scope.pollSelect = false;
      $scope.targetList = "";
      $scope.errorMessage = "";

      $scope.initializeContent = function(){
        $scope.newPollContent = {};
        $scope.newPollContent.title = "";
        $scope.newPollContent.brief = "";
        $scope.newPollContent.target = "";
        $scope.newPollContent.targetAudience = "";
        $scope.newPollContent.targetSpecific = "";
        $scope.newPollContent.pollContent = {};
        $scope.newPollContent.option1 = "";
        $scope.newPollContent.option2 = "";
        $scope.newPollContent.option3 = "";
        $scope.newPollContent.option4 = "";
        $scope.newPollContent.option5 = "";
        $scope.newPollContent.option6 = "";
        $scope.newPollContent.option7 = "";
        $scope.newPollContent.option8 = "";
        $scope.newPollContent.option9 = "";
        $scope.newPollContent.option10 = "";
        $scope.newPollContent.endDate = "";
        $scope.pollOptions = [];
        $scope.pollResponses = [];
        $scope.counts = [];
        $scope.opts = {};
        $scope.opts.opt1 = "";
        $scope.opts.opt2 = "";
        $scope.opts.opt3 = "";
        $scope.opts.opt4 = "";
        $scope.opts.opt5 = "";
        $scope.opts.opt6 = "";
        $scope.opts.opt7 = "";
        $scope.opts.opt8 = "";
        $scope.opts.opt9 = "";
        $scope.opts.opt10 = "";


      }
      $scope.initializeContent();


  $scope.init = function(){
  
        var data = {};
        data.token = $cookies.get("dashManager");
                      
        $http({
          method  : 'POST',
          url     : 'http://www.schooldash.xyz/services/fetchpolls.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          console.log(response);
            if(response.data.status){

              $scope.isPollsFound = true;
              $scope.polls = response.data.response;
              if($scope.polls.length%5 != 0){
                $scope.isMoreLeft = false;
              }
            }
            else{
              $scope.isPollsFound = false;
            }
          });
  }
  
  $scope.init();     

  $scope.createPoll = function(){
    $scope.newPollContent.endDate = document.getElementById('pollEndDate').value;

  var today = new Date();
  var m = today.getMonth()+1;
  var d = today.getDate()+1;
  var y = today.getFullYear();
  
  var tdt = m+"/"+d+"/"+y;

  
  var todate = new Date(tdt).getTime();
        
  var myDate=$scope.newPollContent.endDate;
  myDate=myDate.split("-");
  var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];

  var eventDate = new Date(newDate).getTime();

    if($scope.newPollContent.title === ""){
                  $scope.newContentSaveError = "Give a title to the poll";
                }
                 
    else if($scope.newPollContent.brief === ""){
                  $scope.newContentSaveError = "Add a brief to your poll";
                }
    else if($scope.newPollContent.endDate === ""){
                  $scope.newContentSaveError = "Add an End Date for your poll";
                }
    else if(eventDate < todate){
                  $scope.newContentSaveError = "Enter a later date";
               }
    else if($scope.newPollContent.option1 === ""){
                  $scope.newContentSaveError = "Fill out at least two Poll Options";
                }
    else if($scope.newPollContent.option2 === ""){
                  $scope.newContentSaveError = "Fill out at least two Poll Options";
                }
              // else if(!$scope.addNewContent.offer && $scope.myPhotoURL == "" ){
               //  $scope.newContentSaveError = "Promotion must have a photo attachment";
              // }
         
    else{
                  //Add to server
                  if($scope.newPollContent.target == 0){
                    $scope.newPollContent.targetAudience = 0;

                  }
                  else{
                    $scope.newPollContent.targetAudience=document.getElementById('tokenfield-typeahead').value;

                  }

                  $scope.newPollContent.pollContent = [$scope.newPollContent.option1, $scope.newPollContent.option2];

                  if($scope.newPollContent.option3 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option3);
                  }
                  if($scope.newPollContent.option4 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option4);
                  }
                  if($scope.newPollContent.option5 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option5);
                  }
                  if($scope.newPollContent.option6 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option6);
                  }
                  if($scope.newPollContent.option7 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option7);
                  }
                  if($scope.newPollContent.option8 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option8);
                  }
                  if($scope.newPollContent.option9 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option9);
                  }
                  if($scope.newPollContent.option10 != ""){
                    $scope.newPollContent.pollContent.push($scope.newPollContent.option10);
                  }

                  console.log($scope.newPollContent.pollContent);
                  $scope.newContentSaveError = "";
                  
                  $('#loading').show(); $("body").css("cursor", "progress");
            
               var data = {};
               data.token = $cookies.get("dashManager");
               data.title = $scope.newPollContent.title;
               data.brief = $scope.newPollContent.brief; 
               data.target = $scope.newPollContent.targetAudience;
               data.pollContent = $scope.newPollContent.pollContent;
               data.endDate = $scope.newPollContent.endDate;      

               console.log('GOes to Server');  
               console.log(data);
               
                 $http({
                   method  : 'POST',
                   url     : 'http://www.schooldash.xyz/services/createpoll.php',
                   data    : data,
                   headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                  })
                  .then(function(response) {
                       $('#loading').hide(); $("body").css("cursor", "default");
                       if(response.data.status){
                           console.log('COmes to Server')
                            console.log(response); 
                            $timeout(function() {
                              $scope.init();
                      }, 300);
                            $('#pollModal').modal('hide');
                            $scope.initializeContent();
                       }
                       else{
                        $scope.newContentSaveError = response.data.error;
                       }
                  });
               }
  }

  $scope.showPollStats = function(poll){
        
        $scope.pollSelect = true;
        $scope.selectedPoll = poll;

        var data = {};
        data.token = $cookies.get("dashManager");
        data.pollId = poll.pollId;
        
        console.log("Going", data);

        $http({
          method  : 'POST',
          url     : 'http://www.schooldash.xyz/services/fetchpollresponses.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          
            if(response.data.status){
              console.log(response.data.pollOptions);
              $scope.responseCount = response.data.responseCount;

              $scope.pollOptions = response.data.pollOptions;
              var i=0;

              angular.forEach($scope.pollOptions, function(resp, key){
                  resp.count = String(response.data.counts[i]);
                  i++;

               });

              console.log("Poll Response Log", response);
              $scope.isPollResponseFound = true;
              $scope.pollResponses = response.data.response;
              $scope.commentsCount = response.data.commentsCount;

            }
            else{
              $scope.isPollResponseFound = false;
              $scope.errorMessage = response.data.error;
            }
          });
  }

  setTimeout(function(){
        $('#pollEndDate').datetimepicker({  
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

  $scope.newPoll = function() {
    $('#pollModal').modal('show');  
   
  }

  //List of Classes
$scope.$watch('newPollContent.targetSpecific', function() {
        if($scope.newPollContent.targetSpecific !== ""){

            var data = {};
            data.token = $cookies.get("dashManager");
            data.target = $scope.newPollContent.target;
            data.targetSpecific = $scope.newPollContent.targetSpecific;

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchtarget.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                if(response.data.status){

                  $scope.isFound = true;
                  $scope.targetList = response.data.response;
                  var temp = JSON.parse(response);
                }
                else{
                  $scope.isFound = false;
                  $scope.targetList = [{value: '12-A'}, {value: '12-B'}, {value: '11-A'} , {value: '11-C'}, {value: '11-B'}];
                }
      
              var temp = JSON.parse(data);

                var engine = new Bloodhound({
          local: $scope.targetList,
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.value); 
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace
        });
      
        engine.initialize();
      
      
        $('#tokenfield-typeahead').tokenfield({
          typeahead: [null, { source: engine.ttAdapter() }]
        });

        
            });
}
  
});


  $scope.addTarget = function(targetName){
      if(document.getElementById("tokenfield-typeahead").value == ""){
         $('#tokenfield-typeahead').val(targetName).trigger('change');
      }
      else{
         $('#tokenfield-typeahead').val(document.getElementById("tokenfield-typeahead").value+', '+targetName).trigger('change');
      }  
      
      document.getElementById('button1_'+targetName).style.display = 'none';         
   }   
       
       $scope.loadMore = function() {
          $scope.limiter = $scope.limiter + 5;
          var data = {};
          data.token = $cookies.get("dashManager");

          data.isActive = 1;
          
          data.filter = $scope.filterMode;
        data.isFilter = $scope.isFilterApplied? 1 : 0;
            
          $http({
            method  : 'POST',
            url     : 'http://www.schooldash.xyz/services/fetchpolls.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              console.log(response);
              if(response.data.status){
                $scope.feedbacks = $scope.feedbacks.concat(response.data.response);
                if($scope.feedbacks.length%5 != 0){
                  $scope.isMoreLeft = false;
                }
              }
              else{
                $scope.isMoreLeft = false;
              }
            });
        }
        
  })
  ;
