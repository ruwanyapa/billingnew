angular.module("DialogBilling").service("TransferProductService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetSbuCodes: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSbuCodes");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetSbuCodes");
            }
        },
        GetProductTypes: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetProductTypes");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetProductTypes");
            }
        },
        GetTransferProductBySbuAndProdType: function (sbuCode, productType) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetTransferProductBySbuAndProdType/" + sbuCode + "/" + productType);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetTransferProductBySbuAndProdType/" + sbuCode + "/" + productType);
            }
        },
        GetTransferProductById: function (id) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetTransferProductById/" + id);
            } else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetTransferProductById/" + id);
            }
        },
        PostTransferProduct: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostTransferProduct", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostTransferProduct", objReqest);
            }
        }

    }
}]);