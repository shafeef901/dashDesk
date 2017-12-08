angular.module('calendarApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('calendarController', function($scope, $http, $interval, $cookies, $timeout) {
  
  		
  	
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
      
      $scope.events = {};
      $scope.holidayContent = {};

   $scope.fetchCalendarEvents = function(){
      
      var data = {};

       data.token = $cookies.get("dashManager");
   
           $http({
             method  : 'POST',
             url     : 'http://www.schooldash.xyz/services/fetchcalendarevents.php',
             data    : data,
             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(response) {

         if(response.data.status){
         	 
            $scope.events = response.data.response;
            angular.forEach($scope.events, function(value, key){
			      if(value.type == "event"){
			         value.backgroundColor = Utility.getBrandColor('info');
			         value.end = value.start + " " + value.timeTo;
			         value.start = value.start + " " + value.timeFrom;
			         
			      }
			      else if(value.type == "holiday"){
			         value.backgroundColor = Utility.getBrandColor('purple');
			         var myDate=value.start;
					  myDate=myDate.split("-");
					  value.start=myDate[2]+"-"+myDate[1]+"-"+myDate[0];

					  var myDate1=value.end;
					  myDate1=myDate1.split("-");
					  value.end=myDate1[2]+"-"+myDate1[1]+"-"+myDate1[0];
					  
			      }
			   });
            console.log($scope.events);

	/* initialize the calendar
	-----------------------------------------------------------------*/

	$('#calendar-external').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultView: 'month',
		editable: false,
		droppable: false, // this allows things to be dropped onto the calendar
		drop: function() {
			// is the "remove after drop" checkbox checked?
			if ($('#drop-remove').is(':checked')) {
				// if so, remove the element from the "Draggable Events" list
				$(this).remove();
			}
		},
		
		
		events: $scope.events,
		
		buttonIcons: { //multiple fa class because it will then output .fc-icon-fa.fa.fa-...
		    prev: 'fa fa fa-angle-left',
		    next: 'fa fa fa-angle-right',
		    prevYear: 'fa fa fa-angle-double-left',
		    nextYear: 'fa fa fa-angle-double-left'
		},
		
		
	});

          }
         else{
            console.log("Not found");
         }
              }); 
   }
   $scope.fetchCalendarEvents();

   setTimeout(function(){
        $('#start').datetimepicker({  
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
        $('#end').datetimepicker({  
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

   $scope.addHolidayModal = function(){
   	$('#viewModal').modal('show');
   }

   $scope.addHoliday = function(){
   		var data = {};

   		$scope.holidayContent.start = document.getElementById('start').value;
   		$scope.holidayContent.end = document.getElementById('end').value;

   	var myDate1=$scope.holidayContent.start;
	  myDate1=myDate1.split("-");
	  var newDate1=myDate1[1]+"/"+myDate1[0]+"/"+myDate1[2];
	  var startDate = new Date(newDate1).getTime();

	  var myDate=$scope.holidayContent.end;
	  myDate=myDate.split("-");
	  var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
	  var endDate = new Date(newDate).getTime();

	  if($scope.holidayContent.title === ""){
	  	$scope.newContentSaveError = "Enter a suitable title";
	  }
   	  else if($scope.holidayContent.start === ""){
   	  	$scope.newContentSaveError = "Enter the Start Date";
   	  }
   	  else if($scope.holidayContent.end === ""){
   	  	$scope.newContentSaveError = "Enter the End Date";
   	  }
   	  else if(endDate < startDate){
	  	$scope.newContentSaveError = "Reconsider the Dates";
	  }
	  

	  else{
	       data.token = $cookies.get("dashManager");
	       data.title = $scope.holidayContent.title;
	       data.start = $scope.holidayContent.start;
	       data.end = $scope.holidayContent.end;
	       console.log(data);
	   
	           $http({
	             method  : 'POST',
	             url     : 'http://www.schooldash.xyz/services/createholiday.php',
	             data    : data,
	             headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	            })
	            .then(function(response) {

	        if(response.data.status){    	 
	            $scope.events = response.data.response;
	            console.log($scope.events);
	            $('#viewModal').modal('hide');
	            	$scope.fetchCalendarEvents();
	               
	        }
	        else{
	        	console.log("Not done");
	        }
	        	    
	        });

	     }

   }
	
  });