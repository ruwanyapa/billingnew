angular.module("DialogBilling").directive("reference", ['fileUploadService', "toaster", 'appConfig', function (fileUploadService, toaster, appConfig) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            options: "=",
            callback: "&"
        },
        templateUrl: 'Views/Common/Reference.html',
        controller: ["$scope", "$attrs", function ($scope, $attrs) {

            $scope.gridId = $scope.options.moduleId + "_grid";

            $scope.objTrans = [];
            $scope.Reference = [];
            $scope.TransReference = [];
            $scope.Reference.AttachWorkflow = true;
            $scope.Reference.Remarks = "";
            $scope.alertMessagePopup = new Message(MessageTypes.Empty); 

            $scope.clearAttachedFile = function () {
                $scope.Reference.Remarks = "";
                $scope.Reference.AttachWorkflow = false;
                $scope.TransReference.TrasnsactionReference = "";
                $scope.alertMessagePopup = new Message(MessageTypes.Empty);
            };

             

            $scope.$watchCollection("options", function (newValue) {
                $scope.options = newValue;
                if ($scope.options.TransactionId != undefined) {
                    $scope.GetAttchedFiles($scope.options.TransactionId, $scope.options.isAttachedDoc);
                }

            });



            $scope.uploadProgress = function (e) {
            };

            $scope.getFileDetails = function (e) {
                debugger;
                $scope.files = [];
                $scope.$apply(function () {

                    // STORE THE FILE OBJECT IN AN ARRAY.
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.files.push(e.files[i])
                    }

                });
            };

            $scope.uploadDocuments = function () {
                $scope.files2 = [];
                console.log($scope.files, "$scope.myFileaaaaaaabbb");
                if ($scope.myFile != undefined) {


                    for (var i = 0; i < $scope.files.length; i++) {
                        var objAttached = {
                            form: $scope.Reference,
                            file: $scope.files[i],
                            ModuleId: $scope.options.moduleId,
                            TransactionId: $scope.options.TransactionId
                        };
                        $scope.files2.push(objAttached);

                    }

                    fileUploadService.attachedFiles($scope.files2).then(
                        function (result) {
                            console.log(result, 'result');
                            $scope.TransReference = {
                                TrasnsactionReference: result.data.Result.TrasnsRef.TrasnsactionReference
                            };

                            $scope.objTrans.push($scope.TransReference.TrasnsactionReference);

                            toaster.success({ type: 'success', title: 'Success', body: result.data.Message, showCloseButton: true });


                            $scope.finalCallBack();

                            //reload attached file gird view
                            $scope.GetAttchedFiles($scope.options.TransactionId, $scope.options.isAttachedDoc);


                        }, function (result) {
                            toaster.error({ type: 'Error', title: 'Error', body: result.data.Message, showCloseButton: true });

                        });
                } else {

                    toaster.error({ type: 'Error', title: 'Error', body: "Please select the upload file", showCloseButton: true });
                }

            };


            $scope.downloadFile = function (e) {
            };

            //-> Grid Start
            var config = {};

            config.pageable = {
                input: true,
                numeric: false
            };

            config.columns = [
                { field: "TransRef", title: "Transaction Ref" },
                { field: "FileName", title: "File Name" },
                { field: "Date", title: "Date" },
                { field: "Remark", title: "Remark" },
                {
                    field: "Download",
                    headerTemplate: 'Download',
                    template: '<button type="button" ng-click="gridDownload($event);" class="btn btn-sm btn-info">Download</button>',
                    width: "100px",
                    sortable: false
                },
                {
                    field: "Remove",
                    headerTemplate: 'Remove',
                    template: '<button type="button" ng-click="gridRemove($event);" ng-disabled = "dataItem.RemoveBtn" class="btn btn-sm btn-info">Remove</button>',
                    width: "100px",
                    sortable: false
                }
            ];

            config.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        //id: "TransRef",
                        fields: {
                            'TransRef': { editable: false, type: "string" },
                            'FileName': { editable: false, type: "string" },
                            'Date': { editable: false, type: "string" },
                            'Remark': { editable: false, type: "string" }
                        }
                    }
                },
                pageSize: 8
            });

            //Create a datagrid object
            $scope.dgGrid = new DataGrid();
            $scope.dgGrid.options(config);

            //Init
            $scope.Init = function (arg) {
                $scope.dgGrid.Init(arg);

            };

            $scope.finalCallBack = function () {
                var func = $scope.callback();
                console.log(func, 'in call back');
                func({ "TransactionReference": $scope.objTrans });
            };

            $scope.gridDownload = function (e) {
                var row = $(e.currentTarget).closest("tr");
                var dataItem = $scope.dgGrid.dataItem(row);
                if (appConfig.IsGeneralCloud == "1") {
                    window.open(appConfig.GENERAL_MODULE_URL + '/GetUploadDocument/' + dataItem.TransRef + '/' + dataItem.FileId);

                } else {
                    fileUploadService.getAttachedFile(dataItem.TransRef, dataItem.FileId).then(
                       function (result) {
                           //window.open(result.config.url, '_blank' + Math.floor(Math.random() * 999999));
                           window.open(result.config.url);

                       }, function (result) {
                           $scope.alertMessagePopup = new Message(result.data.Code, result.data.Message);
                       });
                }
            };

            $scope.gridRemove = function (e) {
                var row = $(e.currentTarget).closest("tr");
                var dataItem = $scope.dgGrid.dataItem(row);

                var z = "tr:eq(" + row.index() + ")";
                var grid = $("#dgAttachedFile").data("kendoGrid");

                fileUploadService.postRemoveAttachedFile(dataItem.TransRef).then(
                   function (result) {
                       grid.removeRow(grid.tbody.find(z));

                   }, function (result) {
                       $scope.alertMessagePopup = new Message(result.data.Code, result.data.Message);
                   });
            };

            $scope.GetAttchedFiles = function (transferId, isAttachedDoc) {

                console.log(transferId, isAttachedDoc, 'transferId, isAttachedDoc');

                if (transferId) {
                    fileUploadService.getAttachedFiles(transferId, isAttachedDoc).then(function (result) {
                        $scope.dgGrid.data([]);
                        $scope.dgGrid.data(result.data.Result.FileGird);//disabled.RemoveBtn

                        angular.forEach($scope.dgGrid.data(), function (row) {
                            if ($scope.options.IsDisabled) {
                                row.RemoveBtn = true;
                            } else {
                                row.RemoveBtn = false;
                            }
                        });

                    }, function (result) {
                        console.log("error", result);
                        $scope.alertMessagePopup = new Message(result.data.Code, result.data.Message);
                    });
                }

            };

        }]
    }
}]);