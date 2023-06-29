angular.module("DialogBilling").service("BulkPaymentService", ["$http", "appConfig", function ($http, appConfig) {
    
    return {
        GetDefaultData: function (payType, isBacKOffice) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetMasterDetails/" + payType + "/" + isBacKOffice);
            }
            else {
            return $http.get(appConfig.Billing_URL + "BillingController/GetMasterDetails/" + payType + "/" + isBacKOffice);
            }
        },
        GetPaymentSource: function (payType) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetPaymentSource/" + payType);
            } else {
                return $http.get(appConfig.Billing_URL + "BillingController/GetPaymentSource/" + payType);
            }
        },
        FindCustomerByNIC: function (NicType) {
            return $http.get(appConfig.Billing_URL + "BillingController/FindCustomerByNIC/" + NicType);
        },
        LoadPaymentSourseByPaymentType: function (paymentTypeId) {
            return $http.get(appConfig.Billing_URL + "BillingController/LoadPaymentSourseByPaymentType/" + paymentTypeId);
        },
        ValidateRecordsFromCRM: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetCcbsCustDetails", paymentTypeId);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/GetCcbsCustDetails", paymentTypeId);
            }
        },
        ValidateRecordsFromPE: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetPeCustDetails", paymentTypeId);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/GetPeCustDetails", paymentTypeId);
            }
        },
        ValidateRecordsFromRBM: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetRbmCustDetails", paymentTypeId);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/GetRbmCustDetails", paymentTypeId);
            }
        },
        ValidateRecordsFromOCS: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetOcsCustDetails", paymentTypeId);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/GetOcsCustDetails", paymentTypeId); 
            }
        }, 
        ValidateRecordsFromADF: function (paymentTypeId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetADFCustDetails", paymentTypeId);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/GetADFCustDetails", paymentTypeId);
            }
        },
        PostBatchDetails: function (values) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostBatchDetails", values);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/PostBatchDetails", values);
            }
        },
        GetBatchDetails: function (batchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBatchDetails/" + batchId);
            }
            else {
            return $http.get(appConfig.Billing_URL + "BillingController/GetBatchDetails/" + batchId);
            }
        },
        PrintReceipts: function (batchId) {
            return $http.get(appConfig.Billing_URL + "BillingController/PrintReceipts/" + batchId);
        },
        GetSendEmail: function (id, type, user) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSendEmail/" + id + "/" + type + "/" + user);
            }
            else {
            return $http.get(appConfig.Billing_URL + "BillingController/GetSendEmail/" + id + "/" + type + "/" + user);
            }
        },
        GetBIPaymentModes: function () {
            return $http.get(appConfig.Billing_URL + "BillingController/BIPaymentModes");
        },
        PostForGetCxInvoiceDetails: function (CxInvoice) {
            return $http.post(appConfig.Billing_URL + "BillingController/GetCxInvoiceDetails", CxInvoice);
        },
        Get3GConnectionDetails: function (msisdn) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/Get3GConnectionDetails", msisdn);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/Get3GConnectionDetails", msisdn);
            }
        },
        Get3GConnectionDetailbyBatchID: function (BatchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/Get3GConnectionDetailbyBatchID/" + BatchId);
            }
            else {
            return $http.get(appConfig.Billing_URL + "BillingController/Get3GConnectionDetailbyBatchID/" + BatchId);
            }
        },
        Update3GSIMDetails: function (objReqest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/Update3GSIMDetails", objReqest);
            }
            else {
            return $http.post(appConfig.Billing_URL + "BillingController/Update3GSIMDetails", objReqest);
    }
        }

    }
}]);