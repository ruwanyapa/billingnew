


//Route Provider
angular.module("DialogBilling").config(["$routeProvider", "$httpProvider", '$compileProvider', function ($routeProvider, $httpProvider, $compileProvider) {

    //Route Navigation
    $routeProvider
        .when("/", {
            templateUrl: "/dashboard"
            //controller: "DashboardController"
        })
        .when("/dashboard", {
            templateUrl: "./Views/Common/dashboard.html"
            //controller: "DashboardController"
        })
        .when("/error/page-not-found", {
            templateUrl: "./Views/Error/404.html",
            controller: "ErrorController"
        })
        .when("/error/no-permission", {
            templateUrl: "./Views/Error/no-permission.html",
            controller: "ErrorController"
        });
        //.otherwise({ redirectTo: "/" });

    //host confic
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

}]);

//Run
angular.module("DialogBilling").run(['$rootScope', 'AuthService', '$location', '$cookieStore', function ($rootScope, AuthService, $location, $cookieStore) {

    // Everytime the route in our app changes check auth status
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        var permisionCodes = AuthService.getProfile();

        // Check login & access permission
        if (next.permissionCode && permisionCodes){

            if (permisionCodes.permission.indexOf(next.permissionCode) < 0) {
                $location.path('/error/no-permission');
            }

        } else {

            var custompaths_ = ["/","/dashboard","/error/no-permission","/error/page-not-found"];

            if(custompaths_.indexOf($location.$$path) < 0){
                AuthService.setAuthentication(false);
            }
        }
    });

}]);
