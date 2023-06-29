angular.module("DialogBilling").service("BulkReceiptPrintingService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        PostReceiptPrintingDetails: function (receiptPrintingDetails) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetReceiptInfomation", receiptPrintingDetails);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BulkReceiptPrintingController/GetReceiptInfomation", receiptPrintingDetails);
            }
        },
        SaveReceiptPrintingDetails: function (receiptPrintingDetails) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/BulkReceiptPrintingSave", receiptPrintingDetails);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BulkReceiptPrintingController/Save", receiptPrintingDetails);
            }
        },
        PrintReceiptPrintingDetails: function (receiptPrintingDetails) {
            return $http.post(appConfig.Billing_URL + "BulkReceiptPrintingController/Print", receiptPrintingDetails);
        },
        GetBulkRecePrintingByBatchNo: function (BatchNo) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBulkRecePrintingByBatchNo/" + BatchNo);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BulkReceiptPrintingController/GetBulkRecePrintingByBatchNo/" + BatchNo);
            }
        }
    }
}]);