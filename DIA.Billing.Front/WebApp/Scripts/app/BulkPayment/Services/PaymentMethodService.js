angular.module("DialogBilling").service("PaymentMethodService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetPaymentMethodById: function (paymentMethodId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentMethodById/" + paymentMethodId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentMethodById/" + paymentMethodId);
            }
        }, 
        GetPaymentMethodBySapCode: function (sapCode) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentMethodBySapCode/" + sapCode);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentMethodBySapCode/" + sapCode);
            }
        },
        PostPaymentMethods: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostPaymentMethod", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostPaymentMethod", objReqest);
            }
        }

    }
}]);