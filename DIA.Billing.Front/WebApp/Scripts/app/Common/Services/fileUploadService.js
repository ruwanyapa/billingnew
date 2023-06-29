angular.module("DialogBilling").service('fileUploadService', ['$http', 'appConfig', function ($http, appConfig) {
    return {
        spCreditBulk: function (file) {
                var fd = new FormData();
                fd.append('file', file);

                return $http.post(appConfig.API_URL + "SpCreditAdjusmentBulk/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
        },
        CreOutMain: function (file) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post(appConfig.API_URL + "CreditOutstandingMaintenance/PostUploadDocuments", fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': "FILEUPLOAD" }
            });
        },
        
        validateFile: function (fileName) {
            var validFileExtensions = [".xls", ".xlsx"];
            var blnValid = false;
            for (var j = 0; j < validFileExtensions.length; j++) {
                var sCurExtension = validFileExtensions[j];
                blnValid = fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase();

                if (blnValid==true) {
                    return blnValid;
                }
            }
            return blnValid;
        },

        validateFileCSV: function (fileName) {
            var validFileExtensions = [".txt"];
            var blnValid = false;
            for (var j = 0; j < validFileExtensions.length; j++) {
                var sCurExtension = validFileExtensions[j];
                blnValid = fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase();
            }
            return blnValid;
        },

        PreOrderSerialsUpload: function (file) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post(appConfig.API_URL + "PreOrderVoucher/PostUploadDocuments", fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': "FILEUPLOAD" }
            });
        },  

        BillingReceiptUpload: function (file) {
            debugger;
            var fd = new FormData();
            fd.append('file', file);

            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            } else {
                return $http.post(appConfig.Billing_URL + "PaymentInqueryController/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }
           
        },

        BillingBatchProcessUpload: function (file) {
            debugger;
            var fd = new FormData();
            fd.append('file', file);

            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/UploadBatchProcessDocument", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            } else {
                return $http.post(appConfig.Billing_URL + "BatchProcessController/UploadBatchProcessDocument", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }
            
        },

        attachedFiles: function (obj) {
            debugger;
            var fd = new FormData();
            //fd.append('file', obj.file);
            //fd.append('AttachWorkflow', obj.form.AttachWorkflow);
            //fd.append('Remarks', obj.form.Remarks);
            //fd.append('ModuleId', obj.ModuleId);
            //fd.append('TransactionId', obj.TransactionId);
            for (var i in obj) {
                fd.append('file', obj[i].file);
                fd.append('AttachWorkflow', obj[i].form.AttachWorkflow);
                fd.append('Remarks', obj[i].form.Remarks);
                fd.append('ModuleId', obj[i].ModuleId);
                fd.append('TransactionId', obj[i].TransactionId);
            }
            if (appConfig.IsGeneralCloud == "1") {
                return $http.post(appConfig.GENERAL_MODULE_URL + "/PostUploadAttachedDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            } else {
                return $http.post(appConfig.API_URL + "AttachedFile/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }
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
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/PostUploadDocumentsBulk", fd, {
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



        UploadExcelBulkReceiptPrintingFiles: function (obj) {
            var validFileExtensions = [".xls", ".xlsx"];
            var blnValid = false;
            var fileName = obj.file.name;
            for (var j = 0; j < validFileExtensions.length; j++) {
                var sCurExtension = validFileExtensions[j];
                blnValid = fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase();
            }

            var fd = new FormData();
            fd.append('file', obj.file);
            fd.append('ModuleId', obj.ModuleId);
            fd.append('TransactionId', obj.TransactionId);
            fd.append('ProductCategory', obj.ProductCategory);
            fd.append('PaymentSource', obj.PaymentSource);
            
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/BulkReceiptPrintingUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }
            else {
                return $http.post(appConfig.Billing_URL + "BulkReceiptPrintingController/PostUploadDocuments", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': "FILEUPLOAD" }
                });
            }

            
        },
        getAttachedFiles: function (transferId, isAttachedDoc) {
            if (appConfig.IsGeneralCloud == "1") {
                return $http.get(appConfig.GENERAL_MODULE_URL + '/GetUploadDocuments/' + transferId + '/' + isAttachedDoc);

            } else {
                return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocuments/' + transferId + '/' + isAttachedDoc);
            }
        },
        getAttachedFile: function (transRef, FileId) {
            if (appConfig.IsGeneralCloud == "1") {
                return $http.get(appConfig.GENERAL_MODULE_URL + '/GetUploadDocument/' + transRef + '/' + FileId);

            } else {
                return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocument/' + transRef + '/' + FileId);
            }
        },
        postRemoveAttachedFile: function (transRef) {
            if (appConfig.IsGeneralCloud == "1") {
                return $http.get(appConfig.GENERAL_MODULE_URL + '/PostRemoveAttachedFile/' + transRef);

            } else {
                return $http.post(appConfig.API_URL + 'AttachedFile/PostRemoveAttachedFile/' + transRef);
            }
        },
        //getAttachedFiles: function (transferId, isAttachedDoc) {
        //    return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocuments/' + transferId + '/' + isAttachedDoc);
        //},
        //getAttachedFile: function (transRef, FileId) {
        //    return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocument/' + transRef + '/' + FileId);
        //},
        //postRemoveAttachedFile: function (transRef) {
        //    return $http.post(appConfig.API_URL + 'AttachedFile/PostRemoveAttachedFile/' + transRef);
        //}
    };
}]);