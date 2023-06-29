//

angular.module("DialogBilling").service("SerialNumberService", ["$http", "appConfig", function ($http, appConfig) {

    return {
        getSerialNumbers: function (itemCode) {
            return $http.get(appConfig.API_URL + "SerialNumber/get/" + itemCode);
        },
        validateSerialNumbers: function (data) {
            return $http.post(appConfig.API_URL + "GoodIssurance/PostValidatedSerialNumbers", data);
        },
        saveSerialNumbers: function (data) {
            var resp = $http.post(appConfig.API_URL + "SerialNumber/save", data);
            return resp;
        },
        ValidatedReturnSerialNumbers: function (data) {
            var resp = $http.post(appConfig.API_URL + "Warehouse/ValidatedReturnSerialNumbers", data);
            return resp;
        }
    };
}]);
