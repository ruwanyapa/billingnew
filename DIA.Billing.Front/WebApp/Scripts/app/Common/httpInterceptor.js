angular.module("DialogBilling").config(["$provide", "$httpProvider", function ($provide, $httpProvider) {

    // Intercept http calls.
    var MyHttpInterceptor = ["$q", "$cookies", function ($q, $cookieStore) {
        return {
            // On request success
            request: function (config) {
                //Set Token to header
                
                if (config.headers['Content-Type'] == "FILEUPLOAD") {
                    config.headers = {
                        'Auth-Token': $cookieStore.get('token') || "NULL",
                        'Accept': "*/*",
                        'Content-Type': undefined
                    };
                } else {
                    config.headers = {
                        'Auth-Token': $cookieStore.get('token') || "NULL",
                        'Accept': "application/json, text/plain, */*",
                        'Content-Type': "application/json;charset=utf-8"
                    };
                }

                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
 
                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {

                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    localStorage.removeItem("profile");
                    $cookieStore.remove("token");
                }

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }];

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push(MyHttpInterceptor);

}]);