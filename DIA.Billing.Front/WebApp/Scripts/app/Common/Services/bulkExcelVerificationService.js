angular.module("DialogBilling").service('bulkExcelVerificationService', ['$http', 'appConfig', function ($http, appConfig) {
    return {
        getAttachedFiles: function (transferId, isAttachedDoc) { 
            return $http.get(appConfig.Billing_URL + 'AttachedFile/GetUploadDocuments/' + transferId + '/' + isAttachedDoc);
        },
        GetSuspenseAccountNo: function (sbu, payMethod, payType) {
            debugger;
            return $http.get(appConfig.Billing_URL + 'BillingController/GetSuspenseAccountNo/' + sbu + '/' + payMethod, + '/' + payType);
        },
        UploadExcelFiles: function (obj) { 
            //Bulk excel upload back office

            var validFileExtensions = [".xls", ".xlsx"];
            var blnValid = false;
            var fileName = obj.file.name;
            for (var j = 0; j < validFileExtensions.length; j++) {
                var sCurExtension = validFileExtensions[j];
                blnValid = fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase();
            }


            var fd = new FormData();
            fd.append('file', obj.file);
            fd.append('AttachWorkflow', false);
            fd.append('Remarks', "");
            fd.append('ModuleId', ""); 
            fd.append('TransactionId', "");

            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            } else {
                return $http.post(appConfig.Billing_URL + "BillingController/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }
        },


        ExcelVerifycation: function (objRequest) { 
            var s = "100";
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + '/GetCcbsCustDetails', objRequest);
            } else {
                return $http.post(appConfig.Billing_URL + 'BillingController/GetCcbsCustDetails', objRequest);
            }
        },

    };
}]);