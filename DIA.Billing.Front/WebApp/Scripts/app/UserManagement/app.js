/*
*   USER MANAGEMENT APP
*/

//

angular.module("UserManagement", []);

//User Management App Route Config
angular.module("UserManagement").config(["$routeProvider", function ($routeProvider) {

    var _basepath = "./Views/UserManagement/";

    //Route Navigation
    $routeProvider
        .when("/UserManagement", {
            templateUrl: _basepath + "Index.html",
            controller: "IndexController",
            permissionCode: "1001"
        })
        .when("/UserManagement/CreateUsers", {
            templateUrl: _basepath + "CreateUsers.html",
            controller: "CreateUsersController",
            permissionCode: "1002"
        })
        .when("/UserManagement/ChangePassword", {
            templateUrl: _basepath + "ChangePassword.html",
            controller: "ChangePasswordController",
            permissionCode: "1003"
        })
        .when("/UserManagement/ResetPassword", {
            templateUrl: _basepath + "ResetPassword.html",
            controller: "ResetPasswordController",
            permissionCode: "1004"
        })
        .when("/UserManagement/CreateUsersGroups", {
            templateUrl: _basepath + "CreateUsersGroups.html",
            controller: "CreateUsersGroupsController",
            permissionCode: "1005"
        });


}]);