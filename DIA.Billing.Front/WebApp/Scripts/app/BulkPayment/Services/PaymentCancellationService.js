angular.module("DialogBilling").service("PaymentCancellationService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        pageLoad: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/pageLoadPayCancellation");
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/pageLoadPayCancellation");
            }
        },
        GetPrePaidReceipts: function (val) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPrePaidReceipt/" + val);
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetPrePaidReceipt/" + val);
            }
        },
        GetPostPaidReceipts: function (val) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPostPaidReceipt/" + val); 
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetPostPaidReceipt/" + val);
            }
        },
        GetReceiptsByBatch: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") { 
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetReciptsViaBatch/" + objReqest);
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetReciptsViaBatch/" + objReqest);
            }
        },
        SubmitCancellation: function (objReqest) { 
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/CancelReceipts", objReqest);
            }
            else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/CancelReceipts", objReqest);
            }
        },
        GetByBatchId: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBatchById/" + objReqest);
            }
            else {
                return $http.get(appConfig.Billing_URL + "PaymentInqueryController/GetBatchById/" + objReqest);
            }
        },
        SendWFPin: function (objreq) {
            if (appConfig.IsWFCloud == "1") {
                return $http.post(appConfig.WF_MODULE_URL + "/SendWFPin", objreq);
            }
            else {
                return $http.post(appConfig.API_URL + "WorkFlowApproval/SendWFPin", objreq);
            }
        },
        VerifyWFPin: function (objreq) {
            if (appConfig.IsWFCloud == "1") {
                return $http.post(appConfig.WF_MODULE_URL + "/VerifyWFPIN", objreq);
            }
            else {
                return $http.post(appConfig.API_URL + "WorkFlowApproval/VerifyWFPIN", objreq);
            }
        },
        DiscardPinRequest: function (UserId, OutletId, objreq) {
            if (appConfig.IsWFCloud == "1") {
                return $http.post(appConfig.WF_MODULE_URL + "/DiscardPinRequest/" + UserId + "/" + OutletId, objreq);
            }
            else {
                return $http.post(appConfig.API_URL + "WorkFlowApproval/DiscardPinRequest/" + UserId + "/" + OutletId, objreq);
            }
        }
    }
}]);