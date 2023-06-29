

angular.module("DiaBillingNav", []);

angular.module("DiaBillingNav").config(["$routeProvider", function ($routeProvider) {

    var _basepath = "./Views/AppNavigation/";

    //Route Navigatio
    $routeProvider
        .when("/CPOS/DashBord", {
            templateUrl: _basepath + "DashBoard.html",
            controller: "DiaBillingControllerNav",
            permissionCode: "50000"
        });

}]);