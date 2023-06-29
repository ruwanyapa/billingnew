angular.module("DialogBilling").service("PaymentInqueryService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        SearchInBillingSys: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/SearchInBillingSys/", objReqest);
            } else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/SearchInBillingSys", objReqest);
            }
        },
        SearchInPE: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/SearchInPE/", objReqest);
            } else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/SearchInPE", objReqest);
            }
        },
        SearchInCpos: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/SearchInCpos", objReqest);
            } else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/SearchInCpos", objReqest);
            }
        },
        GetDefaultData: function (payType) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetMasterDetails/" + payType);
            } else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetMasterDetails/" + payType);
            }
        }
        
    }
}]);