angular.module('AdminLoginApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])

  .controller('adminloginController', function($scope, $http, $cookies) {

    //Defaults
    $scope.username = "";
    $scope.password = "";

    $scope.isLoginError = false;
    $scope.warnMsg = "";
    
    
    //Attempt login
    $scope.loginadmin = function(){
        var data = {};
        data.mobile = $scope.username;
        data.password = $scope.password;
        $http({
          method  : 'POST',
          url     : 'http://schooldash.xyz/services/adminlogin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {	          
	          if(response.data.status){
	            $scope.isLoginError = false;
	            $scope.warnMsg = "";
	
	            //Set cookies
	            var now = new Date();
	            now.setDate(now.getDate() + 14);
	            $cookies.put("dashManager", response.data.response, {
	                expires: now
	            });
	
	            localStorage.setItem("schoolCode" , response.data.schoolCode);
	            localStorage.setItem("schoolName" , response.data.schoolName);
	            localStorage.setItem("schoolCity" , response.data.schoolCity);
	            
	            window.location = "index.html";
	          }else{
	            $scope.isLoginError = true;
	            $scope.warnMsg = response.data.error;
	          }

          });
    }

	})

  ;
