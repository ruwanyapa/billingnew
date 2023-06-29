angular.module("DialogBilling").service("AllowedPaymentModesService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetAllowedPayModesByDapOutletData: function (payType) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetAllowedPayModesByDapOutletData/" + payType);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetAllowedPayModesByDapOutletData/" + payType);
            }
        },
        PostAllowedPaymentModes: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostAllowedPaymentModes", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostAllowedPaymentModes", objReqest);
            }
        }

    }
}]);