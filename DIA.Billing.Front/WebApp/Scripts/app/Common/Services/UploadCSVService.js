angular.module("DialogBilling").service('UploadCSVService', ['$http', 'appConfig', function ($http, appConfig) {
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
            }
            return blnValid;
        },

        attachedFiles: function (obj) {

            var fd = new FormData();
            fd.append('file', obj.file);
            fd.append('AttachWorkflow', obj.form.AttachWorkflow);
            fd.append('Remarks', obj.form.Remarks);
            fd.append('ModuleId', obj.ModuleId);
            fd.append('TransactionId', obj.TransactionId);

            return $http.post(appConfig.API_URL + "AttachedFile/PostUploadDocuments", fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': "FILEUPLOAD" }
            });
        },
        getAttachedFiles: function (transferId, isAttachedDoc) {
            return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocuments/' + transferId + '/' + isAttachedDoc);
        },
        getAttachedFile: function (transRef) {
            return $http.get(appConfig.API_URL + 'AttachedFile/GetUploadDocument/' + transRef);
        },
        postRemoveAttachedFile: function (transRef) {
            return $http.post(appConfig.API_URL + 'AttachedFile/PostRemoveAttachedFile/' + transRef);
        }
    };
}]);