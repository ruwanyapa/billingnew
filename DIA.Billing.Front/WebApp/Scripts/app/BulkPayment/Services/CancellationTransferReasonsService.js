angular.module("DialogBilling").service("CancellationTransferReasonsService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetCanTransReasonsByReasonCode: function (id) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetCanTransReasonsByReasonCode/" + id);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetCanTransReasonsByReasonCode/" + id);
            }
        },
        PostCanTransReasons: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostCanTransReasons", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostCanTransReasons", objReqest);
            }
        }

    }
}]);