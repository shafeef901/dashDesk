angular.module('TeacherProfileApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


.controller('TeacherProfileController', function($scope, $http) {

})
   

;