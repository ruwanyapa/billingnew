//

angular.module("DialogBilling").service("FinderService", ["$http", "appConfig", function ($http, appConfig) {

    return {
        getFields: function (credentials) {
            debugger;
            if (appConfig.IsPostpaidCloud == "1" && (credentials.uiId == "BILLING-PAYMENTMETHOD"
                || credentials.uiId == "BILLING-PAYMENTTYPE" || credentials.uiId == "BILLING-PRODUCTCATEGORY"
                || credentials.uiId == "BILLING-CANCELLATIONREASON" || credentials.uiId == "BILLING-PAYMENTSOURCE"
                || credentials.uiId == "BILLING-PRODUCTTYPE" || credentials.uiId == "BILLING-TRANSFERLOGIC"
                || credentials.uiId == "BILLING-SUSPENSEACCOUNTCONFIG" || credentials.uiId == "BILLING-TRANSFERPRODUCT"
                || credentials.uiId == "BILLING-CHEQUERETURNREASON" || credentials.uiId == "POS-UPDATE-CHEQUEFR-Transaction-Id"
                || credentials.uiId == "BILLING-BULK-PAYMENT-001" || credentials.uiId == "BILLING-TRANSFER-BATCH"
                || credentials.uiId == "POS-BILLING-RECEIPTBATCH" || credentials.uiId == "POS-BILLING-RECEIPTBATCH-CANCEL"
                || credentials.uiId == "BILLING-BULKRECEIPTPRINTING" || credentials.uiId == "BILLING-TRANSFER-BATCH"
                || credentials.uiId == "POS-BILLING-BILLCANCELLATION" || credentials.uiId == "BATCH-PROCESS"
                || credentials.uiId == "BILLING-CHQ-RETURN")) {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/GetInterfaceFinders", credentials);
            }
            else if (appConfig.IsPrepaidCloud == "1" &&
            (credentials.uiId == "POS-EAI-Billing")) {
                return $http.post(appConfig.PREPAID_MODULE_URL + "/GetInterfaceFinders", credentials);
            }
            else {
                return $http.post(appConfig.API_URL + "Finders/GetInterfaceFinders", credentials);
            }
        },
        searchQuery: function (credentials) {
            if (appConfig.IsPostpaidCloud == "1" && (credentials.uiId == "BILLING-PAYMENTMETHOD"
                || credentials.uiId == "BILLING-PAYMENTTYPE" || credentials.uiId == "BILLING-PRODUCTCATEGORY"
                || credentials.uiId == "BILLING-CANCELLATIONREASON" || credentials.uiId == "BILLING-PAYMENTSOURCE"
                || credentials.uiId == "BILLING-PRODUCTTYPE" || credentials.uiId == "BILLING-TRANSFERLOGIC"
                || credentials.uiId == "BILLING-SUSPENSEACCOUNTCONFIG" || credentials.uiId == "BILLING-TRANSFERPRODUCT"
                || credentials.uiId == "BILLING-CHEQUERETURNREASON" || credentials.uiId == "POS-UPDATE-CHEQUEFR-Transaction-Id"
                || credentials.uiId == "BILLING-BULK-PAYMENT-001" || credentials.uiId == "BILLING-TRANSFER-BATCH"
                || credentials.uiId == "POS-BILLING-RECEIPTBATCH" || credentials.uiId == "POS-BILLING-RECEIPTBATCH-CANCEL"
                || credentials.uiId == "BILLING-BULKRECEIPTPRINTING" || credentials.uiId == "BILLING-TRANSFER-BATCH"
                || credentials.uiId == "POS-BILLING-BILLCANCELLATION" || credentials.uiId == "BATCH-PROCESS"
                || credentials.uiId == "BILLING-CHQ-RETURN")) {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostSearchFinderGrid", credentials);
            }
            else if (appConfig.IsPrepaidCloud == "1" &&
                (credentials.uiId == "POS-EAI-Billing")) {
                return $http.post(appConfig.PREPAID_MODULE_URL + "/PostSearchFinderGrid", credentials);
            }
            else {
                return $http.post(appConfig.API_URL + "Finders/PostSearchFinderGrid", credentials);
            }
        }
    };

}]);
