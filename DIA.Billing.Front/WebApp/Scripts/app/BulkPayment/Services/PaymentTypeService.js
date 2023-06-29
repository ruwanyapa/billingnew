angular.module("DialogBilling").service("PaymentTypeService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetPaymentTypeById: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentTypeById/" + paymentTypeId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentTypeById/" + paymentTypeId);
            }
        },
        PostPaymentTypes: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostPaymentType", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostPaymentType", objReqest);
            }
        }

    }
}]);