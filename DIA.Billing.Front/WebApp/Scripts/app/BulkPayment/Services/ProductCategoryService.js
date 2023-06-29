angular.module("DialogBilling").service("ProductCategoryService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetProductCategoryById: function (productCategoryId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetProductCategoryById/" + productCategoryId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetProductCategoryById/" + productCategoryId);
            }
        },
        PostProductCategorys: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostProductCategory", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostProductCategory", objReqest);
            }
        } 
         
    }
}]);