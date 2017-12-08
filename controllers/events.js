angular.module('eventsApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('eventsController', function($scope, $http, $interval, $cookies, $timeout) {
  
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
      
      
      
       //either event or notification
       $scope.contentType = "event";
      
      $scope.first_tagline = '';
      $scope.second_tagline = '';
      
      $scope.deleteError = "";
      
      //Default Flags
      $scope.defaultFlagSet = function(){
         $scope.newFirstWindowFlag = false;
         $scope.newSecondWindowFlag = false;
         
         $scope.editFirstWindowFlag = false;
         $scope.editSecondWindowFlag = false;
         
       $scope.isPhotoAttached = false;
      }      
      $scope.defaultFlagSet();
      
        $scope.initializeContent = function(type, req_pageid, option){
          var pageid = req_pageid;
          $scope.defaultFlagSet();  
          
          //Update Current page
            $scope.currentDisplayPage = pageid;
            
            //Special Corner Cases (Adding New Page (10 entries to 11) and Deleting a Page (11 entries to 10))
    if(option != '') //Check if its a corner case
    {
      var current_entries = 0;
      switch(type){
               case 'event':{
                     current_entries = $scope.total_count_first;
                     break;
                  }        
                  case 'notification':{
                     current_entries = $scope.total_count_second;
                     break;
                  }
      }   
      
      if(option == 'delete'){
        if((current_entries-1)%10 == 0){
          if($scope.currentDisplayPage == $scope.totalDisplayPages){ //I am on the last page
            $scope.currentDisplayPage--;
            pageid--;
          }         
        }
      }
      else if(option == 'save'){
        if((current_entries+1)%10 == 1){
          if($scope.currentDisplayPage == $scope.totalDisplayPages && $scope.currentDisplayPage != 1){ //I am on the last page
            $scope.currentDisplayPage++;
            pageid++; 
          } 
                
        }     
      }
    }
     
            //Fetch Content
     

  $timeout( function(){
   var co_data = {};
   co_data.type = type;
   co_data.page = pageid - 1;
   co_data.token = $cookies.get("dashManager");
   
   if(type == "event"){
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetcheventsadmin.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
            console.log(response);
         if(response.data.status){
         
               $scope.isContentFound = true;             
               $scope.active_content = response.data.response;
         
               /* Customize */
               $scope.total_count_first = response.data.totalEvents;               
               $scope.first_tagline = response.data.eventToday;     
               //Update Total Pages
                     $scope.totalDisplayPages = Math.ceil($scope.total_count_first/10);
                     if($scope.total_count_first == 0){$scope.isContentFound = false;}
                                                                  
          }
         
           else{ 
              $scope.isContentFound = false;      
              $scope.newContentSet(); 
              $scope.active_content = {};
           }
              }); 
        }  
   
   else if(type == "notification"){
             $http({
               method  : 'POST',
               url     : 'http://www.schooldash.xyz/services/fetchnotificationadmin.php',
               data    : co_data,
               headers : {'Content-Type': 'application/x-www-form-urlencoded'}
              })
              .then(function(response) {
              console.log(response);
           if(response.data.status){
           
                 $scope.isContentFound = true;             
                 $scope.active_content = response.data.response;
           
                 /* Customize */ 
                 $scope.total_count_second = response.data.totalPush;                  
                    $scope.second_tagline = response.data.pushLast;   //should be changed
                 
                 //Update Total Pages

                       $scope.totalDisplayPages = Math.ceil($scope.total_count_second/10);
                       if($scope.total_count_second == 0){$scope.isContentFound = false;}
                                      
            }
           
             else{ 
                $scope.isContentFound = false;      
                $scope.newContentSet(); 
                $scope.active_content = {};
             }
                }); 
      }  

    }, 500);
      
 }




      //Date Time Picker
      
      setTimeout(function(){
        $('#myEventDate').datetimepicker({  
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
      
      setTimeout(function(){
        $('#endDate').datetimepicker({  
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


      $("#startTime").datetimepicker({
      format: "hh:ii",
      autoclose: 1,
      startView: 1,
      minView: 0,
      maxView: 1,
      forceParse: 0
      });
      
      $("#endTime").datetimepicker({
      format: "hh:ii",
      autoclose: 1,
      startView: 1,
      minView: 0,
      maxView: 1,
      forceParse: 0
      });
      
      setTimeout(function(){
        $('#myEventDate1').datetimepicker({  
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

      $("#startTime1").datetimepicker({
      format: "hh:ii",
      autoclose: 1,
      startView: 1,
      minView: 0,
      maxView: 1,
      forceParse: 0
      });
      
      $("#endTime1").datetimepicker({
      format: "hh:ii",
      autoclose: 1,
      startView: 1,
      minView: 0,
      maxView: 1,
      forceParse: 0
      });
      
  
  
  
      //Display Function
      $scope.currentDisplayPage = 1;
      $scope.totalDisplayPages = 1;
      $scope.isContentFound = false;
      
      
     
   
   $scope.initializeContent($scope.contentType, 1);
         
             //Default Styling
       document.getElementById("firstIcon").style.color = "#FFF";
       document.getElementById("firstTag").style.color = "#FFF";
       document.getElementById("firstCount").style.color = "#FFF";
       document.getElementById("firstTabButton").style.background="#2980b9";
   
       document.getElementById("secondTag").style.color = "#ABB2B9";
       document.getElementById("secondIcon").style.color = "#ABB2B9";
       document.getElementById("secondCount").style.color = "#ABB2B9";
       document.getElementById("secondTabButton").style.background="#F1F1F1";

       
   $scope.openType = function (type){
      $scope.active_content = {};
      $scope.contentType = type;
      
      $scope.initializeContent(type, 1);
      
      //Styling
      switch(type) {
          case 'event':
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
          case 'notification':
          {
             document.getElementById("secondIcon").style.color = "#FFF";
             document.getElementById("secondCount").style.color = "#FFF";
             document.getElementById("secondTag").style.color = "#FFF";
             document.getElementById("secondTabButton").style.background="#2980b9";
         
             document.getElementById("firstIcon").style.color = "#ABB2B9";
             document.getElementById("firstTag").style.color = "#ABB2B9";
             document.getElementById("firstCount").style.color = "#ABB2B9";
             document.getElementById("firstTabButton").style.background="#F1F1F1";
              
                  break;
          }
      } 
   }
   
   
   //New Content 
   $scope.showNewContentWindow = function(){
      switch($scope.contentType){
         case 'event':{
            $scope.newFirstWindowFlag  = true;
            $scope.newSecondWindowFlag  = false;
            $scope.editFirstWindowFlag  = false;
            $scope.editSecondWindowFlag  = false; 
                                      
            break;
         }
         case 'notification':{
            $scope.newFirstWindowFlag  = false;
            $scope.newSecondWindowFlag  = true;
            $scope.editFirstWindowFlag  = false;
            $scope.editSecondWindowFlag  = false;
                           
            break;         
         }
      
      }
   }
   
   
   
   
   $scope.editContentSaveError = "";
      
   //Edit Content 
   $scope.showEditContentWindow = function(content){
   
      $scope.editContentSaveError = "";    
      $scope.myEditContent = content;
      console.log($scope.myEditContent);
   
   
      switch($scope.contentType){
         case 'event':{
            $scope.newFirstWindowFlag  = false;
            $scope.newSecondWindowFlag  = false; 
            $scope.editFirstWindowFlag  = true;
            $scope.editSecondWindowFlag  = false; 
              
                           
            break;
         }
         case 'notification':{
            $scope.newFirstWindowFlag  = false;
            $scope.newSecondWindowFlag  = false; 
            $scope.editFirstWindowFlag  = false;
            $scope.editSecondWindowFlag  = true;
                           
            break;         
         }
      
      }
   }
   
   
   //Make changes (IN EDIT)
   
   $scope.saveEditChanges = function(){
   
         $scope.myEditContent.timeFrom = document.getElementById('startTime1').value;
         $scope.myEditContent.timeTo = document.getElementById('endTime1').value;
         $scope.myEditContent.eventDate = document.getElementById('myEventDate1').value;

         console.log($scope.myEditContent.eventDate);
   
    $scope.editContentSaveError = "";
    

  var today = new Date();
  var m = today.getMonth()+1;
  var d = today.getDate();
  var y = today.getFullYear();
  
  var tdt = m+"/"+d+"/"+y;

  
  var todate = new Date(tdt).getTime();
        
        var myDate=$scope.myEditContent.eventDate;
  myDate=myDate.split("-");
  var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];

  var eventDate = new Date(newDate).getTime();


        
    

    
                if($scope.myEditContent.title == ""){
                  $scope.editContentSaveError = "Add a title to the event";
               }
               
               else if($scope.myEditContent.brief == ""){
                  $scope.editContentSaveError = "Brief out the event";
               }

               else if($scope.myEditContent.eventDate == ""){
                  $scope.editContentSaveError = "Mention the Event Date";
               }
               
               else if(eventDate < todate){
                  $scope.editContentSaveError = "Enter a later date";
               }
               
               else if(!/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test($scope.myEditContent.eventDate)){
                  $scope.editContentSaveError = "Invalid Event Date format";
               }

               else if($scope.myEditContent.timeFrom == ""){
                  $scope.editContentSaveError = "Mention the Event Starting time";
               }

               else if(!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test($scope.myEditContent.timeFrom)){
                  $scope.editContentSaveError = "Invalid From Time format";
               }
               
               else if($scope.myEditContent.timeTo == ""){
                  $scope.editContentSaveError = "Mention the Event Ending time";
               }

               else if(!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test($scope.myEditContent.timeTo)){
                  $scope.editContentSaveError = "Invalid To Time format";
               }
               
               else if($scope.myEditContent.timeTo < $scope.myEditContent.timeFrom){
                  $scope.editContentSaveError = "Consider changing the timings";
               }

               else if($scope.myEditContent.venue == ""){
                  $scope.editContentSaveError = "Mention the event venue";
               }
               
            else{

                  
        $scope.myEditContent.eventDate = formatToStandardDate(document.getElementById('myEventDate1').value);
    
    var data = {};
    data.token = $cookies.get("dashManager");
    data.id = $scope.myEditContent.id;
    data.title = $scope.myEditContent.title;
    data.brief = $scope.myEditContent.brief; 
    data.eventDate = $scope.myEditContent.eventDate; 
    data.timeTo = $scope.myEditContent.timeTo; 
    data.timeFrom = $scope.myEditContent.timeFrom; 
    data.venue = $scope.myEditContent.venue;
    data.host = $scope.myEditContent.host;      
        
           console.log('GOes to Server')
               console.log(data) 
                 $http({
                   method  : 'POST',
                   url     : 'http://www.schooldash.xyz/services/editeventadmin.php',
                   data    : data,
                   headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                  })
                  .then(function(response) {
                  
                  console.log('COmes frm Server');
               console.log(response);
               
               
                       $('#loading').hide(); $("body").css("cursor", "default");
                       if(response.data.status){
                        alert('Success!');   
                        $scope.initializeContent(type, $scope.currentDisplayPage);  
                               
                       }
                       else{
                        $scope.editContentSaveError = response.data.error;
                       }
                  });
                  $scope.initializeContent($scope.contentType, $scope.currentDisplayPage);  
                  $scope.newContentSet();  
                  $scope.defaultFlagSet();
  
   }
   }
   
   
   
   $scope.hideEditContent = function(){
   $scope.myEditContent = {};  
   $scope.initializeContent($scope.contentType, $scope.currentDisplayPage);  
  
   $scope.defaultFlagSet();
   }
   
   

   
   
   
   
   /******************************************************************************* 
                HARD CODED 
    ******************************************************************************/
   
        //Characters Left in the Event
        $scope.alertCount = "";
        $scope.eventCharCount = function() {
            $scope.alertCount = 140-(($scope.addNewContent.brief).length)+ ' characters left.';
        }
        
  //List of Classes

  $scope.myClassList = "";
  
  $.get("https://www.zaitoon.online/services/fetchclassinfosimple.php", function(data){
          var temp = JSON.parse(data);
          if(0){
    $scope.myClassList = temp.response;
          }
          else{
            $scope.myClassList = [{value: '12-A'}, {value: '12-B'}, {value: '11-A'} , {value: '11-C'}, {value: '11-B'}];
          }
          
            var engine = new Bloodhound({
      local: $scope.myClassList,
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.value); 
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
  
    engine.initialize();
  
  
    $('#tokenfield-typeahead').tokenfield({
      typeahead: [null, { source: engine.ttAdapter() }]
    });
    $('#tokenfield-typeahead1').tokenfield({
      typeahead: [null, { source: engine.ttAdapter() }]
    });
    
        });   
        
    
        
             
   
   $scope.deleteContent = function(req_id){
      var co_data = {};
            co_data.type = $scope.contentType;
            co_data.id = req_id;
           co_data.token = $cookies.get("zaitoonAdmin");

           $http({
             method  : 'POST',
             url     : 'https://zaitoon.online/services/deletemarketingcontent.php',
             data    : co_data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {
         if(response.data.status){              
                  $scope.initializeContent($scope.contentType, $scope.currentDisplayPage, 'delete'); 
                  $('#deleteModal').modal('hide');
         }
         else{
            $scope.deleteError = response.data.error;
         }
            });                           
   }
   
   /******************************************************************************/
   
   
   
   
   
   
   
   
   //View Content
   $scope.viewMyContent = function(content){
      $scope.viewContent = content;
      $('#viewModal').modal('show');      
   }
   
   //New Content

   
   $scope.addNewContent = {};
   $scope.newContentSet = function(){
   
      $scope.addNewContent.title = "";
      $scope.addNewContent.brief = "";
      $scope.addNewContent.venue = "";
      $scope.addNewContent.host = "";
      $scope.addNewContent.eventDate = "";
      $scope.addNewContent.timeFrom = "";
      $scope.addNewContent.timeTo = "";
      $scope.addNewContent.recurranceFrequency = 0;
      $scope.addNewContent.recursionEndDate = "";
      $scope.addNewContent.isRecurring = "";
      
      $scope.isPhotoAttached = false;
      $scope.myPhotoURL = "";
      
      
      $scope.addNewContent.code = "";
      $scope.addNewContent.name = "";
      $scope.addNewContent.price = "";
      
      $scope.addNewContent.expiry = new Date();
      $scope.addNewContent.offer = false;
      //document.getElementById("tokenfield-typeahead").value = "";

      

      
      $scope.currentDisplayPage = 1;
            $scope.totalDisplayPages = 1;
            $scope.isContentFound = false;
   }
   $scope.newContentSet();
   
   
   
      
       
         //Image eaopper
             $scope.myImage = '';
       $scope.myCroppedImage = '';
       
         var image = "";
         $scope.cropBoxData;
         $scope.canvasData;
         $scope.cropper;
   
       var handleFileSelect = function(evt) {
         var file = evt.currentTarget.files[0];
         var reader = new FileReader();
         reader.onload = function (evt) {
           $scope.$apply(function($scope){
             $scope.myImage = evt.target.result;
             setTimeout(function(){ 
               image = document.getElementById('image');
               $scope.cropper = new Cropper(image, {
                 aspectRatio: 16 / 9,
                autoCropArea: 0.8,
                scalable: false,
                ready: function () {
                  // Strict mode: set crop box data first
                  $scope.cropper.setCropBoxData($scope.cropBoxData).setCanvasData($scope.canvasData);
                }
              });            
        }, 1000);
        $scope.photoLoadedToFrame = true;
           });
         };
         reader.readAsDataURL(file);
       };
       angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
       
    $scope.attachPhoto = function(){
      $('#imageModal').modal('show');     
      $scope.photoLoadedToFrame = false;  
    }
       
    $scope.isPhotoAttached = false;
    $scope.saveAttachment = function(){
      $scope.isPhotoAttached = true;    
           $scope.canvasData = $scope.cropper.getCroppedCanvas({
              width: 853,
              height: 480,
              fillColor: '#fff',
              imageSmoothingEnabled: false,
              imageSmoothingQuality: 'high',
            });
            
      $scope.myPhotoURL = $scope.canvasData.toDataURL();
           $scope.cropper.destroy();
           $('#imageModal').modal('hide');      
    }
    
    
    
    
    $scope.saveNewContent = function(type){
      
      
      if(type == 'notification'){ 

         var todayDate = new Date();

         $scope.addNewContent.targetAudience = document.getElementById('tokenfield-typeahead1').value;
        
         if($scope.addNewContent.title == ""){
                  $scope.newContentSaveError = "Give a title to the notification";
                }
                 
         else if($scope.addNewContent.brief == ""){
                  $scope.newContentSaveError = "Add a description";
                }
              // else if(!$scope.addNewContent.offer && $scope.myPhotoURL == "" ){
               //  $scope.newContentSaveError = "Promotion must have a photo attachment";
              // }
         
               else{
                  //Add to server

                  $scope.newContentSaveError = "";
                  
                  $('#loading').show(); $("body").css("cursor", "progress");
                  

            if($scope.addNewContent.myPhotoURL != ""){
               $scope.addNewContent.photoFlag = 1;
            }
            
                  
               var data = {};
               data.token = $cookies.get("dashManager");
               data.title = $scope.addNewContent.title;
               data.brief = $scope.addNewContent.brief; 
               data.targetAudience = $scope.addNewContent.targetAudience;
               data.photoURL = $scope.addNewContent.myPhotoURL;      

               console.log('GOes to Server');  
               console.log(data);
               
                 $http({
                   method  : 'POST',
                   url     : 'http://www.schooldash.xyz/services/createnotificationadmin.php',
                   data    : data,
                   headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                  })
                  .then(function(response) {
                       $('#loading').hide(); $("body").css("cursor", "default");
                       if(response.data.status){
                       console.log('COmes to Server')
                        console.log(response); 
                        $scope.newContentSet();
                        $scope.initializeContent($scope.contentType, $scope.currentDisplayPage, 'save');
                       }
                       else{
                        $scope.newContentSaveError = response.data.error;
                       }
                  });
               }
               
               
      }
      else if(type == 'event'){
      
         $scope.addNewContent.timeFrom = document.getElementById('startTime').value;
         $scope.addNewContent.timeTo = document.getElementById('endTime').value;
         $scope.addNewContent.eventDate = document.getElementById('myEventDate').value;
         $scope.addNewContent.recursionEndDate = document.getElementById('endDate').value;
         $scope.addNewContent.targetAudience = document.getElementById('tokenfield-typeahead').value;
         
         
         
         
         if($scope.addNewContent.recurranceFrequency == 0){
          $scope.addNewContent.isRecurring = 0;
          $scope.addNewContent.recursionEndDate = "";
         }

         else{
          $scope.addNewContent.isRecurring = 1;
         }
         
         
         //Validations
         
    var timefrom = new Date();
    temp = $('#startTime').val().split(":");
    timefrom = temp[0]+temp[1];

    var timeto = new Date();
    temp1 = $('#endTime').val().split(":");
    timeto = temp1[0]+temp1[1];
    
  var today = new Date();
  var m = today.getMonth()+1;
  var d = today.getDate();
  var y = today.getFullYear();
  
  var tdt = m+"/"+d+"/"+y;

  
  var todate = new Date(tdt).getTime();
        
        var myDate=$scope.addNewContent.eventDate;
  myDate=myDate.split("-");
  var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];

  var eventDate = new Date(newDate).getTime();

        
    
  
         
               if($scope.addNewContent.title == ""){
                  $scope.newContentSaveError = "Add a title to the event";
               }
               
               else if($scope.addNewContent.brief == ""){
                  $scope.newContentSaveError = "Brief out the event";
               }

               else if($scope.addNewContent.eventDate == ""){
                  $scope.newContentSaveError = "Mention the Event Date";
               }
               
               else if(eventDate < todate){
                  $scope.newContentSaveError = "Enter a later date";
               }
               
               else if(!/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test($scope.addNewContent.eventDate)){
                  $scope.newContentSaveError = "Invalid Event Date format";
               }

               else if($scope.addNewContent.timeFrom == ""){
                  $scope.newContentSaveError = "Mention the Event Starting time";
               }

               else if(!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test($scope.addNewContent.timeFrom)){
                  $scope.newContentSaveError = "Invalid From Time format";
               }
               
               else if($scope.addNewContent.timeTo == ""){
                  $scope.newContentSaveError = "Mention the Event Ending time";
               }

               else if(!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test($scope.addNewContent.timeTo)){
                  $scope.newContentSaveError = "Invalid To Time format";
               }
               
               else if($scope.addNewContent.timeTo < $scope.addNewContent.timeFrom){
                  $scope.newContentSaveError = "Consider changing the timings";
               }

               else if($scope.addNewContent.venue == ""){
                  $scope.newContentSaveError = "Mention the event venue";
               }

              else if($scope.addNewContent.host == ""){
                  $scope.newContentSaveError = "Mention the event host";
               }

               else if($scope.addNewContent.recurranceFrequency != "0" && $scope.addNewContent.recursionEndDate == ""){
                  $scope.newContentSaveError = "Mention the recursion End Date";
               }
               
               else if($scope.addNewContent.recurranceFrequency != "0" && !/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test($scope.addNewContent.recursionEndDate)){
                  $scope.newContentSaveError = "Invalid Recursion End Date format";
               }
               
               else if($scope.addNewContent.recurranceFrequency != "0" && ($scope.addNewContent.recursionEndDate < $scope.addNewContent.eventDate) ){
                  $scope.newContentSaveError = "Reconsider the Event Recursion Ending Date";
               }

               else if(timeto < timefrom){
                  $scope.newContentSaveError = "Invalid Event Timings";
               }
               
             //  else if(timefrom < "0600" || timeto > "2200"){
             //     $scope.newContentSaveError = "Consider changing the Event Timings";
             //  }

               else if($scope.addNewContent.recurranceFrequency != "0" && $scope.addNewContent.recursionEndDate <= $scope.addNewContent.eventDate){
                  $scope.newContentSaveError = "Reconsider the Recursion End Date";
               }

               else{
                  //Add to server
                  $scope.newContentSaveError = "";
                  
                  $('#loading').show(); $("body").css("cursor", "progress");
                  
         $scope.addNewContent.eventDate = formatToStandardDate(document.getElementById('myEventDate').value);
         $scope.addNewContent.recursionEndDate = formatToStandardDate(document.getElementById('endDate').value);
                  
                  
                  var data = {};
               data.token = $cookies.get("dashManager");
               data.title = $scope.addNewContent.title;
               data.brief = $scope.addNewContent.brief;
               data.venue = $scope.addNewContent.venue;
               data.timeFrom = $scope.addNewContent.timeFrom;
               data.timeTo = $scope.addNewContent.timeTo;
               data.host = $scope.addNewContent.host;
               data.eventDate = $scope.addNewContent.eventDate;
               data.recurranceFrequency = $scope.addNewContent.recurranceFrequency;
               data.recursionEndDate = $scope.addNewContent.recursionEndDate;
               data.isRecurring = $scope.addNewContent.isRecurring;
               data.photoURL = $scope.addNewContent.myPhotoURL;
               data.targetAudience = $scope.addNewContent.targetAudience;

               
               
            console.log('GOes to Server')
               console.log(data) 
                 $http({
                   method  : 'POST',
                   url     : 'http://www.schooldash.xyz/services/createeventadmin.php',
                   data    : data,
                   headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                  })
                  .then(function(response) {
                  
                  console.log('COmes frm Server');
               console.log(response);
               
               
                       $('#loading').hide(); $("body").css("cursor", "default");
                       if(response.data.status){
                        alert('Success!');   
                        $scope.initializeContent(type, $scope.currentDisplayPage); 
                               $scope.newContentSet();  
                               $scope.defaultFlagSet();                    
                       }
                       else{
                        $scope.newContentSaveError = response.data.error;
                       }
                  });
               }
       }  
   }
   
   function formatToStandardDate(mydate){
    //Expects date in dd-mm-yyyy format and converts to yyyy-mm-dd
        
        var res = mydate.split("-");
        return res[2]+'-'+res[1]+'-'+res[0];
   }
   
   
   
   $scope.hideNewContent = function(){
      $scope.newContentSet();
      $scope.defaultFlagSet();
      $scope.initializeContent($scope.contentType, $scope.currentDisplayPage);
   }
   
   $scope.addTargetEvent = function(targetName){
      if(document.getElementById("tokenfield-typeahead").value == ""){
         $('#tokenfield-typeahead').val(targetName).trigger('change');
      }
      else{
         $('#tokenfield-typeahead').val(document.getElementById("tokenfield-typeahead").value+', '+targetName).trigger('change');
      }  
      
      document.getElementById('button_'+targetName).style.display = 'none';         
   }

   $scope.addTargetPush = function(targetName){
      if(document.getElementById("tokenfield-typeahead1").value == ""){
         $('#tokenfield-typeahead1').val(targetName).trigger('change');
      }
      else{
         $('#tokenfield-typeahead1').val(document.getElementById("tokenfield-typeahead1").value+', '+targetName).trigger('change');
      }  
      
      document.getElementById('button1_'+targetName).style.display = 'none';         
   }
   
        
  
    //Delete Event
    
    $scope.askForDelete = function(con, type){
        $scope.askContent = con;

        if(type == 'event'){
          $('#confirmationModal').modal('show');
        }

        else if(type == 'notification'){
          $('#confirmationModal3').modal('show'); 
        }
      }


      $scope.deleteEvent = function(id, isRecurring, deleteAll, recursionId){
        var data = {};
        
        data.token = $cookies.get("dashManager");
        data.id = id;
        data.isRecurring = isRecurring;
        data.recursionId = recursionId;
        data.deleteAll = deleteAll;
        
        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/deleteeventadmin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         console.log(response);
          $('#confirmationModal').modal('hide');
         });
         $scope.initializeContent('event', $scope.currentDisplayPage); 

      }

      $scope.deleteNotification = function(id){
        var data = {};
        
        data.token = $cookies.get("dashManager");
        data.id = id;
        
        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/deletenotificationadmin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         console.log(response);
          $('#confirmationModal3').modal('hide');
         });
         $scope.initializeContent('notification', $scope.currentDisplayPage); 

      }

      // Cancel Event

      $scope.cancelEvent = function(id) {

        var data = {};

        data.token = $cookies.get("dashManager");
        data.id = id;

        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/canceleventadmin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         console.log(response);
         $scope.defaultFlagSet(); 
         });

         $scope.initializeContent('event', $scope.currentDisplayPage);
         $scope.defaultFlagSet();

      }

      // Reschedule Event

      $scope.askForReschedule = function(con){
        console.log(con);
        $scope.askContent = con;
        $('#confirmationModal2').modal('show');
      }


      $scope.rescheduleEvent = function(id){
        var data = {};
        
        data.token = $cookies.get("dashManager");
        data.id = id;
        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/rescheduleeventadmin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         console.log(response);
          $('#confirmationModal2').modal('hide');
         });
         $scope.initializeContent('event', $scope.currentDisplayPage); 

      }
   

        //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("zaitoonAdmin");
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
          data    : admin_data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
            if(response.data.status){
                  $scope.reservations_length = response.data.reservationsCount;
                  $scope.pending_orders_length = response.data.ordersCount;
                  $scope.helprequests_length = response.data.helpCount;
               }
               else{
                  $scope.reservations_length = 0;
                  $scope.pending_orders_length = 0;
                  $scope.helprequests_length = 0;
               }
         });

        $scope.Timer = $interval(function () {
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
            data    : admin_data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
                if(response.data.status){
                  $scope.reservations_length = response.data.reservationsCount;
                  $scope.pending_orders_length = response.data.ordersCount;
                  $scope.helprequests_length = response.data.helpCount;
               }
               else{
                  $scope.reservations_length = 0;
                  $scope.pending_orders_length = 0;
                  $scope.helprequests_length = 0;
               }
           });
        }, 20000);
  });