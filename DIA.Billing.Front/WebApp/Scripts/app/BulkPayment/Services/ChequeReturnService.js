angular.module("DialogBilling").service("ChequeReturnService", ["$http", "appConfig", function ($http, appConfig) {
    return {
        GetMasterDetails: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetChequeReturnMasterDetails");
            }
            else {
                return $http.get(appConfig.Billing_URL + "ChequeReturnController/GetMasterDetails");
            }           
        },
        GetChequeDetails: function (chNo, chBank, chBranch) { 

            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetChequeDetails/" + chNo + "/" + chBank + "/" + chBranch);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ChequeReturnController/GetChequeDetails/" + chNo + "/" + chBank + "/" + chBranch);
            }            
        },
        ValidateChequeDetails: function (chNo, chBank, chBranch) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/ValidateCheque/" + chNo + "/" + chBank + "/" + chBranch);
            }
            else {
                return $http.get(appConfig.Billing_URL + "ChequeReturnController/ValidateCheque/" + chNo + "/" + chBank + "/" + chBranch);
            }

            
        },
        PostChequeReturn: function (values) {

            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostChequeReturn", values);
            }
            else {
                return $http.post(appConfig.Billing_URL + "ChequeReturnController/PostChequeReturn", values);
            }
            
        }

    }

}]);