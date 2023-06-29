//

angular.module("DialogBilling").service("KpiDetailsService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        
        //Update User
        update: function(credentials) {
            return $http.post(appConfig.API_URL + "Users/ResetPassword", credentials);
        },
        GetUserNameByuserId: function (userId) {
            return $http.get(appConfig.API_URL + "Users/GetUserByUserId/" + userId);
        }
    };

}]);