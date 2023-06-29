angular.module("DialogBilling").service("ReceiptPrintingService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetBulkReceiptPrintingDetails: function (batchId, printUserId) {
            return $http.get(appConfig.Billing_URL + "ReportPrintingController/BulkReceiptPrinting/" + batchId + "/" + printUserId);
        },
        GetBulkPaymentPrintingByBatchNo: function (batchId, printUserId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBulkPaymentPrintingByBatchNo/" + batchId + "/" + printUserId);
            }
            else {
            return $http.get(appConfig.Billing_URL + "ReportPrintingController/BulkPaymentPrinting/" + batchId + "/" + printUserId);
        }
    }
    }
}]);