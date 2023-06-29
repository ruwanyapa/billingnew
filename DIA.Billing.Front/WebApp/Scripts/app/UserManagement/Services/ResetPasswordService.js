//

angular.module("UserManagement").service("ResetPasswordService", ["$http", "appConfig", function($http, appConfig) {
    return {
        //Save User
        create: function(credentials) {
            return $http(appConfig.API_URL + "Users/ResetPassword", credentials);
        },
        //Update User
        update: function(credentials) {
            return $http.post(appConfig.API_URL + "Users/ResetPassword", credentials);
        },
        //Delete User
        remove: function(credentials) {
            return $http.delete(appConfig.API_URL + "Users/ResetPassword", { params: { userId: "002" } });//credentials.userId
        },
        //Get User
        read: function (credentials) {
            return $http(appConfig.API_URL + "Users/ResetPassword", { params: { userId: credentials.userId } });
        },

        isAvailable: function() {
            return !(!$scope.resetPasswordForm.userId || $scope.resetPasswordForm.userId.length === 0);
        },
        GetUserNameByuserId: function (userId) {
            return $http.get(appConfig.API_URL + "Users/GetUserByUserId/" + userId);
        }
        ,
        ValidateUserType: function () {
            return $http.get(appConfig.API_URL + "Users/ValidateResetAndCangePassword");
        }
    };

}]);