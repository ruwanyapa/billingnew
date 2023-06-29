angular.module("DialogBilling").service("ProductTypeService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetProductTypeById: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetProductTypeById/" + paymentTypeId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetProductTypeById/" + paymentTypeId);
            }
        },
        PostProductTypes: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostProductType", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostProductType", objReqest);
            }
        }

    }
}]);