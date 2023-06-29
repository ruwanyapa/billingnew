angular.module("DialogBilling").service("TransferLogicService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        PostTransferDetails: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostTransferDetails", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/PostTransferDetails", objReqest);
            }
        },
        GetTransferDetails: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetTransferLogicDetails/" + objReqest);
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetTransferLogicDetails/" + objReqest);
            }
        },
        LoadDefaultTransferLogicData: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/LoadDefaultTransferLogicData");
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/LoadDefaultTransferLogicData");
            }
        }
    }
}]);