angular.module("DialogBilling").service("BatchProcessPaymentsService", ["$http", "appConfig", function ($http, appConfig) {
    return {

        GetBatchProcessData: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBatchProcessData");
            }
            else {
                return $http.get(appConfig.Billing_URL + "BatchProcessController/GetBatchProcessData");
            }
        },
        PostUploadAndVerify: function (request) {  
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostUploadAndVerify", request);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BatchProcessController/PostUploadAndVerify", request);
            }
        },
        GetBatchProcessDetails: function (BatchId) { 
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetBatchProcessDetails/" + BatchId);
            }
            else {
                return $http.get(appConfig.Billing_URL + "BatchProcessController/GetBatchProcessDetails/" + BatchId);
            }
        },
        CheckConnectionReference: function (req) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/CheckConnectionReference", req);
            }
            else {
                return $http.post(appConfig.Billing_URL + "BatchProcessController/CheckConnectionReference", req);
            }
        },
        PostChangeToSuspence: function (request) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostChangeToSuspence", request);
            }
            else
            {
                return $http.post(appConfig.Billing_URL + "BatchProcessController/PostChangeToSuspence", request);
            }
        },
        saveBatchProcess: function (request) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/saveBatchProcess", request);
            }
            else
            {
                return $http.post(appConfig.Billing_URL + "BatchProcessController/saveBatchProcess", request);
            }
        },
        ReVerify: function (BatchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/ReVerify/" + BatchId);
            }
            else
            {
                return $http.get(appConfig.Billing_URL + "BatchProcessController/ReVerify/" + BatchId);
            }
        },
        GetVerifiedCount: function (BatchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetVerifiedCount/" + BatchId);
            }
            else
            {
                return $http.get(appConfig.Billing_URL + "BatchProcessController/GetVerifiedCount/" + BatchId);
            }
        },
        GetSuspenseDetails: function (BatchId) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/GetSuspenseDetails/" + BatchId);
            }
            else
            {
                return $http.get(appConfig.Billing_URL + "BatchProcessController/GetSuspenseDetails/" + BatchId);
            }
        }
    }
}]);