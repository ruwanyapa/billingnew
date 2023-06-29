angular.module("DialogBilling").service("SuspenseAccountConfigService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetSbuCodes: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSbuCodes");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetSbuCodes");
            }
        },
        GetPaymentTypes: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentTypes");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentTypes");
            }
        },
        GetPaymentSourceByPaymentTypeId: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentSourceByPaymentTypeId/" + paymentTypeId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentSourceByPaymentTypeId/" + paymentTypeId);
            }
        },
        GetSuspenseAccConfigById: function (sbu, payType, paySource) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSuspenseAccConfigById/" + sbu + "/" + payType + "/" + paySource);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetSuspenseAccConfigById/" + sbu + "/" + payType + "/" + paySource);
            }
        },
        GetSuspenseAccConfigData: function (payType, paySource) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSuspenseAccConfigData/" + payType + "/" + paySource);
            } else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetSuspenseAccConfigData/" + payType + "/" + paySource);
            }
        },
        PostSuspenseAccConfig: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostSuspenseAccConfig", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostSuspenseAccConfig", objReqest);
            }
        }

    }
}]);