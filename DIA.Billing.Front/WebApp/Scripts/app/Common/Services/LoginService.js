
//

angular.module("DialogBilling").service("LoginService", ["$http", "appConfig", function ($http, appConfig) {

    //USE appConfig.API_URL

    return {

        attemptLogin: function (Outlet, credintials) {
            if (appConfig.IsUserCloud == "1") {
                return $http.post(appConfig.USER_MODULE_URL + '/UserLogin/' + Outlet, credintials);
            }
            else {
                return $http.post(appConfig.API_URL + 'Login/UserLogin/' + Outlet, credintials);
            }
        },

        getOutlet: function (userID) {
            if (appConfig.IsUserCloud == "1") {
                return $http.get(appConfig.USER_MODULE_URL + '/outlet/' + userID);
            }
            else {
                return $http.get(appConfig.API_URL + 'Login/outlet/' + userID);
            }
        },

        getDomainUser: function () {

            return $http.get(appConfig.BASE_URL + 'WebForm1.aspx');
        },

        checkDomainUser: function (domainUsername) {
            if (appConfig.IsUserCloud == "1") {
                return $http.get(appConfig.USER_MODULE_URL + '/FindUserType/' + domainUsername);
            }
            else {
                return $http.get(appConfig.API_URL + 'Login/FindUserType/' + domainUsername);
            }
        },
        logOutUser: function (tocken) {

            var a = String(tocken);

            if (appConfig.IsUserCloud == "1") {
                return $http.get(appConfig.USER_MODULE_URL + '/logOutUser/' + a);
            }
            else {
                return $http.get(appConfig.API_URL + 'Login/logOutUser/' + a);
            }
        },

        whoImI: function (tocken) {
            var a = String(tocken);
            console.log('from method');
            if (appConfig.IsUserCloud == "1") {
                return $http.get(appConfig.USER_MODULE_URL + '/whoImI/' + a);
            }
            else {
                return $http.get(appConfig.API_URL + 'Login/whoImI/' + a);
            }
        },

    };

}]);