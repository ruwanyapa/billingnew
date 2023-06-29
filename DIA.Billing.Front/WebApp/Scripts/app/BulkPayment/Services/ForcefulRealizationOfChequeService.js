angular.module("DialogBilling").service("ForcefulRealizationOfChequeService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        getData: function () {
            return $http.get(appConfig.Billing_URL + 'EEEE/-----/');
        },
        PageLoad: function () {
            return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/PageLoad");
        },

        GetReceiptDetailsByChequeNo: function (chequeNo, bankcode, branchCode) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetReceiptDetailsByChequeNo_BankNo_BranchCodeFillGridData/" + chequeNo + "/" + bankcode + "/" + branchCode);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/GetReceiptDetailsByChequeNo_BankNo_BranchCodeFillGridData/" + chequeNo + "/" + bankcode + "/" + branchCode);
            }
        },

        GetBankName: function (bankcode) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBankName/" + bankcode);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/GetBankName/" + bankcode);
            }
        },

        getBranchNameAndValidateCheckNo: function (chequeNo, bankcode, branchCode) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/getBranchNameAndValidateCheckNo/" + chequeNo + "/" + bankcode + "/" + branchCode);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/getBranchNameAndValidateCheckNo/" + chequeNo + "/" + bankcode + "/" + branchCode);
            }
        },

        getBranchNameFromBranchcode: function (branchCode) {
        return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/getBranchNameFromBranchcode/" + branchCode);
        },

        PostForcefulRealizationOfCheque: function (formdata) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostForcefulRealizationOfCheque", formdata);
            }
            else {
                return $http.post(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/PostForcefulRealizationOfCheque", formdata);
            }
        },

        GetFindbytransationId: function (transationId, finderReciptNo) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetFindbytransationId/" + transationId + "/" + finderReciptNo);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ForcefulRealizationOfChequeController/GetFindbytransationId/" + transationId + "/" + finderReciptNo);
            }
        }

    }
}]);