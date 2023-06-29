angular.module("DialogBilling").service("PaymentTransferService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        SearchByConRef: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                debugger;
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetByConRef", objReqest);
            } else {
            return $http.post(appConfig.Billing_URL + "PaymentInqueryController/GetByConRef", objReqest);
            }
        },
        SearchByContactNo: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetByContactNo/" + objReqest);
            } else {
            return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetByContactNo/" + objReqest);
            }

        },
        SubmitPaymentTransfer: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/SubmitPaymentTransfer", objReqest);
            } else {
            return $http.post(appConfig.Billing_URL + "PaymentInqueryController/SubmitPaymentTransfer", objReqest);
            }
        },
        GetTransferBatchDetails: function (batchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetTransferBatchDetails/" + batchId);
            } else {
            return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetTransferBatchDetails/" + batchId);
        }
        }
       
    }
}]);