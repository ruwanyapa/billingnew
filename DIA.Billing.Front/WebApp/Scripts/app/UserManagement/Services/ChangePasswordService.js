angular.module("UserManagement").service("ChangePasswordService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        //Update User
        Update: function (credentials) {
            return $http.post(appConfig.API_URL + "Users/ChangePassword", credentials);
        },
        ValidateUserType: function () {
            return $http.get(appConfig.API_URL + "Users/ValidateResetAndCangePassword");
        }
    };

}]);