angular.module("DialogBilling").service("BillInvoicePaymentService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetBIPaymentModes: function () {
            return $http.get(appConfig.Billing_URL + "BillingController/BIPaymentModes");
        },
        PostForGetCxInvoiceDetails: function (CxInvoice) {
            return $http.post(appConfig.Billing_URL + "BillInvoicePayment/GetCxInvoiceDetails", CxInvoice);
        },
        PostBatchDetails: function (batchDetails) {
            return $http.post(appConfig.Billing_URL + "BillInvoicePayment/PostBatchDetails", batchDetails);
        },
        GetBatchDetailsById: function (batchId) {
            return $http.get(appConfig.Billing_URL + "BillInvoicePayment/GetBatchDetails/"+batchId);
        }
    }
}]);