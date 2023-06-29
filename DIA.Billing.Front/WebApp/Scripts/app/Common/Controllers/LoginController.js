
'use strict';

angular.module("DialogBilling").controller("LoginController", ["$scope", "LoginService", "AuthService", "$location", "appConfig", function ($scope, LoginService, AuthService, $location, appConfig) {

    $scope.hasOutlet = false;                   //false: don't have outlets yet
    $scope.checkedDomainUserDetails = false;    //false: domain user not checked yet
    var domainUserName = null;
    $scope.needDomainUser = true;                //false: need to enter username
    $scope.needDomainPassword = true;           //true : need to enter password

    $scope.user = {
        UserId: "",
        Password: "",
        Outlet: ""
    };

    AuthService.setAuthentication(false);

    function getDomainUser() {
        console.log("domain1");
        if ($location.hash()) {

            if ($location.hash() != "canceled") {
                console.log($location.hash(), "$location.hash()");
                checkDomainUser($location.hash());
            } else {
                enableDefaultLogin();
            }

        }
        else {
            window.location.href = appConfig.DOMAIN_URL + "?r=" + $location.absUrl();
            console.log("domain1_else", window.location.href);
        }

    }
    //getDomainUser();

    //Check Domain user
    function checkDomainUser(DomainUser) {


        if (DomainUser) {
            LoginService.checkDomainUser(DomainUser).then(function (response) {

                console.log(response.data.Result.userName, "sadasdasdasd");

                if (response.data.Code == 0) {
                    $scope.needDomainUser = false;
                    $scope.needDomainPassword = response.data.Result.passWordRec;
                    $scope.user.UserId = response.data.Result.userName;
                    domainUserName = response.data.Result.userName;
                    $scope.user.Password = response.data.Result.passWordRec ? "" : response.data.Result.userName; //just for validation
                    $scope.checkedDomainUserDetails = true;
                    $scope.getOutlet();
                } else {
                    enableDefaultLogin();
                }
            }, function () {
                enableDefaultLogin();
            });
        } else {
            enableDefaultLogin();
        }

    }

    //this function will enable the default login form
    function enableDefaultLogin() {
        $scope.checkedDomainUserDetails = true;
        $scope.needDomainUser = true;
        $scope.needDomainPassword = true;
    }
      
    //FOR TEMPERORY SOLUTION [DOMAIN NAME ISSUE]
    enableDefaultLogin();

   

    //Get Outlet for User ID
    $scope.getOutlet = function () {

       

        if ($scope.user.UserId) {
            LoginService.getOutlet($scope.user.UserId).then(function (response) {

                if (response.Code != "0") {

                    $scope.outLetList = [];
                    var _oList = response.data.Result;

                    if (_oList.length > 1)
                        _oList.unshift({ OutletCode: "", OutletDesc: "Select" });

                    $scope.outLetList = _oList;
                    $scope.hasOutlet = true;
                    $scope.user.Outlet = _oList[0];

                } else {
                    //Empty the outlet list
                    $scope.outLetList = angular.copy([]);
                    $scope.hasOutlet = false;
                }

            }, function (response) {
                //Empty the outlet list
                $scope.outLetList = angular.copy([]);
                $scope.hasOutlet = false;
            });

        } else {
            $scope.outLetList = angular.copy([]);
        }

    };

    //Login Submit
    $scope.attemptLogin = function (isValid) {
        if (!$scope.user.Outlet.OutletCode) {
            $scope.alertMessage = new Message(3, "Please select outlet");
            return;
        }
        if (isValid) {

            var UserId = window.btoa($scope.user.UserId);
            var Password = window.btoa($scope.user.Password);

            LoginService.attemptLogin($scope.user.Outlet.OutletCode, { NetworkStatus1: UserId, NetworkStatus2: Password, DomainUser: domainUserName }).then(function (response) {

                console.log(response.data.Result, "response.data.Result from login");

                if (response.data.Result.permissionDetails.loginstatus == "Success") {

                    if (response.data.Result.permissionDetails.changePassword) {

                        var profile_ = {
                            outletCode: response.data.Result.permissionDetails.profile.outletCode,
                            outletDescription: response.data.Result.permissionDetails.profile.outletDescription,
                            permission: ["1003"],
                            token: response.data.Result.permissionDetails.profile.token,
                            userId: response.data.Result.permissionDetails.profile.userId,
                            userName: response.data.Result.permissionDetails.profile.userName,
                            redirectTo: "#/UserManagement/ChangePassword"
                        };
                           
                        AuthService.setProfile(profile_, response.data.Result.permissionDetails.profile.token);

                    } else {

                        AuthService.setProfile(response.data.Result.permissionDetails.profile, response.data.Result.permissionDetails.profile.token);
                    }

                } else {

                    $scope.alertMessage = new Message(response.data.Code, response.data.Message);

                }

            }, function (response) {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);

            });
        }
        else {
            $scope.alertMessage = {
                title: "Required!",
                message: "Username & Password are required...",
                type: "E"
            };
        }

    };

    //outlet
    // $scope.LogintypeTypecode = [];
    //  $scope.LogintypeTypecode.unshift({ sbucodelist: "", sbucodelistcode: "Select" });

}]);

