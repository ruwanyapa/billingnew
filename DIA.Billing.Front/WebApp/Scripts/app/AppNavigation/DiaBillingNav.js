//

angular.module("DiaBillingNav").controller("DiaBillingControllerNav", ["$scope", "Page", "appConfig", function ($scope, Page, appConfig) {

    //Set Page Title
    Page.setTitle("Loading...");

  //  console.log('nav');
  //  window.location = appConfig.CPOS_FRONT_URL + "/app.html#/dashboard";
    window.location = "http://dev01.dialog.lk:48460/app.html#/dashboard";
    return;

}]);

