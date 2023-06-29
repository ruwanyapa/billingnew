angular.module("DialogBilling").service("PaymentSourceService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetPaymentTypes: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentTypes");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentTypes");
            }
        },
        GetPaymentSourceById: function (paymentId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentSourceById/" + paymentId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentSourceById/" + paymentId);
            }
        },
        PostPaymentSources: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostPaymentSource", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostPaymentSource", objReqest);
            }
        }

    }
}]);