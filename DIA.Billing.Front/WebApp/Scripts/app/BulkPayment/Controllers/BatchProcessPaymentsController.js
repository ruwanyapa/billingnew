angular.module("DialogBilling").controller('BatchProcessPaymentsController', ["$scope", "Page", "$cookies", "BatchProcessPaymentsService", "$filter", "toaster", "fileUploadService", "PrintService", "appConfig", function ($scope, Page, $cookieStore, BatchProcessPaymentsService, $filter, toaster, fileUploadService, PrintService, appConfig) {
    //Set Page Title
    Page.setTitle("Batch Process Payments");
    $scope.Batch = {};
    $scope.PaymentSourceCollection = [];
    $scope.uploadedData = [];
    $scope.Batch.totalAmount = "";
    $scope.Batch.records = "";
    $scope.Batch.transferToSuspense = "";
    $scope.Batch.transferToSuspenseAmount = "";
    $scope.GridData = [];
    $scope.IsGridDisable = false;
    $scope.ISaveBtnDisable = true;
    $scope.IsVerifyBtnDisable = true;
    $scope.outletType = "";
    $scope.attachmentRef = "";

    $scope.paymentModeCollections = [
        { "Id": "CA", "Description": "CASH" },
        { "Id": "CHE", "Description": "CHEQUES" },
    ];


    // Get Master data from API
    $scope.PageLoad = function () {

        $scope.outletType = $scope.userInfo().outletType;

        BatchProcessPaymentsService.GetBatchProcessData().then(function (response) {
            if (response.data.Code == "0") {
                $scope.PaymentTypeCollection = response.data.Result.paymentTypes;
                $scope.PaymentSourceCollection = response.data.Result.paymentSources;
                $scope.PaymentSources = $scope.PaymentSourceCollection;
                $scope.PaymentMethodCollection = response.data.Result.paymentMethods;
                $scope.SbuCollection = response.data.Result.sbus;
                $scope.ProductCatCollection = response.data.Result.ProdCategories;
                $scope.SuspenceAccounts = response.data.Result.SuspenceAccounts;

                if ($scope.outletType == 1) {
                    $scope.Batch.PaymentType = 1;
                } else {
                    $scope.Batch.PaymentType = 2;
                }

                $scope.Batch.Sbu = 3;
                $scope.Batch.PaymentMethod = 10;
                $scope.Batch.ProdCat = 1;
                $scope.Batch.PaymentMode = 'CA';
                $scope.GetPaymentSourceByPaymentType();

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }

    //var receiptSample = [
    //    { Correction: '002', ConnectionReference: '001', Amount: '002', LineStatus: '002', Remarks: '002' }
    //];

    // Sorting payment source by payment type.
    $scope.GetPaymentSourceByPaymentType = function () {

        var payType = 0;
        payType = $scope.Batch.PaymentType;
        if (payType != null) {
            $scope.tempPaymentSource = [];
            angular.forEach($scope.PaymentSourceCollection, function (item) {
                if (payType == 0) {
                    $scope.tempPaymentSource.push({ "Id": item.Id, "Description": item.Description });
                }
                else if (item.PaymentType == payType) {
                    $scope.tempPaymentSource.push({ "Id": item.Id, "Description": item.Description });
                }
            });

            $scope.PaymentSources = $scope.tempPaymentSource;
        }

    };


    $scope.ChangeToSuspence = function () {
        $scope.IsGridDisable = true;
        $scope.IsVerifyBtnDisable = true;
        var TransferToSuspenseAmount = 0;
        var sucObj = $filter('filter')($scope.SuspenceAccounts,
                                    {
                                        Sbu: $scope.Batch.Sbu,
                                        PaySource: $scope.Batch.PaymentSource,
                                        PayType: $scope.Batch.PaymentType
                                    });

        if (sucObj.length == 0) {
            toaster.error({ type: 'error', title: 'Error', body: 'Suspense Account not found! Contact administrator.', showCloseButton: true });
        }
        else {
            var SusAccount = sucObj[0].AccountNo;
            if ($scope.GridData.length > 0) {
                $scope.Batch.transferToSuspense = 0;
                $scope.Batch.transferToSuspenseAmount = Number(0).toFixed(2);


                $scope.request = {
                    BatchId: $scope.Batch.BatchId,
                    Sbu: $scope.Batch.Sbu,
                    ProdCat: $scope.Batch.ProdCat,
                    SusAccount: SusAccount,
                    Data: $scope.GridData,
                    NoOfTransfers: $scope.Batch.transferToSuspense,
                    TotalTransfers: $scope.Batch.transferToSuspenseAmount
                };

                BatchProcessPaymentsService.PostChangeToSuspence($scope.request).then(function (response) {
                    if (response.data.Code == "0") {

                        angular.forEach($scope.GridData, function (item) {
                            item.Remarks = item.ConnectionReference;
                            item.ConnectionReference = SusAccount;
                            item.LineStatus = 'SUCCESS';
                            TransferToSuspenseAmount = TransferToSuspenseAmount + parseFloat(item.Amount);
                        });

                        $scope.Batch.transferToSuspenseAmount = Number(TransferToSuspenseAmount).toFixed(2);
                        $scope.dgGridBatchProcess.dataSource.data($scope.GridData);
                        $scope.Batch.transferToSuspense = $scope.GridData.length;
                        $scope.ISaveBtnDisable = false;


                        toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
                    } else {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        $scope.IsGridDisable = false;
                        $scope.IsVerifyBtnDisable = false;
                    }
                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });


            }
        }

    };

    $scope.ReVerify = function () {
        $scope.IsVerifyBtnDisable = true;
        if ($scope.GridData.length > 0) {
            var BatchId = $scope.Batch.BatchId;

            BatchProcessPaymentsService.ReVerify(BatchId).then(function (response) {
                if (response.data.Code == "0") {
                    $scope.GetBatchProcessDetails();
                    toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    $scope.IsVerifyBtnDisable = false;
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });


        }

    };

    // ------------------------ Grid --------------------

    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };


    var configBatchProcess = {};
    var configBatchProcess = {
        columns: [
                     {
                         field: "Correction",
                         headerTemplate: 'Correction',
                         headerAttributes: {
                             "class": "table-header",
                         },
                         template: '<button ng-click="CheckConnectionReference(this)" ng-disabled="IsGridDisable" class="btn btn-primary" type="button">Apply</button>',
                         width: "30px"
                     },
                     {
                         field: "ConnectionReference",
                         headerTemplate: 'Connection Reference',
                         template: '<input type ="text" ng-model="dataItem.ConnectionReference" ng-disabled="IsGridDisable" class="k-fill text-right conn-ref2 kk" />',
                         width: "50px"
                     },
                     { field: "Amount", title: "Amount", width: "30px" },
                     { field: "LineStatus", title: "Status", width: "50px" },
                     { field: "Remarks", title: "Remarks", width: "50px" }
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: false,
        scrollable: true
    };

    configBatchProcess.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'Correction': { editable: false, type: "string" },
                    'ConnectionReference': { editable: true, type: "string" },
                    'Amount': { editable: false, type: "string" },
                    'LineStatus': { editable: false, type: "string" },
                    'Remarks': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGridBatchProcess = new DataGrid();
    $scope.dgGridBatchProcess.options(configBatchProcess);

    $scope.InitA = function (arg) {
        $scope.dgGridBatchProcess.Init(arg);
    };

    // -------------------------------------------------------------

    $scope.CheckConnectionReference = function (e) {
        if (e.dataItem == undefined) {
            toaster.error({ type: 'error', title: 'Error', body: "Invalid Connection Reference", showCloseButton: true });
            return;
        }

        if (e.dataItem.ConnectionReference) {
            $scope.request = {
                Id: e.dataItem.Id,
                Sbu: $scope.Batch.Sbu,
                ProdCat: $scope.Batch.ProdCat,
                ConnectionReference: e.dataItem.ConnectionReference
            };

            BatchProcessPaymentsService.CheckConnectionReference($scope.request).then(function (response) {
                if (response.data.Code == "0") {

                    //var index = $scope.GridData.findIndex(x => x.Id === $scope.request.Id);
                    //$scope.GridData.splice(index, 1);
                    //$scope.dgGridBatchProcess.dataSource.data($scope.GridData);

                    //if($scope.GridData.length = 0)
                    //{
                    //    $scope.ISaveBtnDisable = false;
                    //}
                    $scope.GetBatchProcessDetails();
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    $scope.GetBatchProcessDetails();
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }

    }

    // --------------------------- Attachemnt ----------------------

    $scope.IsAttach = "NO";

    $scope.GenerateGuid = function () {
        var timestamp = +new Date;

        var ts = timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < 5; ++i) {
            var index = $scope.GenGuid(0, parts.length - 1);
            id += parts[index];
        }

        $scope.attachmentRef = id;
        return id;

    }

    $scope.GenGuid = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    $scope.$watch("referenceParams.TransactionId", function (newValue) {
        $scope.referenceParams = {
            moduleId: "BILLING-BATCH-PAYMENT-001",
            TransactionId: ($scope.Batch.BatchId == null || $scope.Batch.BatchId == "") ? $scope.tempRef : $scope.Batch.BatchId,
            isAttachedDoc: true,
            IsDisabled: true
        };
    });

    $scope.TransRef = [];
    $scope.referenceCallback = function (data) {
        console.log(data, 'call back');
        $scope.TransRef = data.TransactionReference;
        $scope.IsAttach = "YES";

    };

    // -------------------------------------------------------------------

    // -----------------------------------payment mode -----------------

    //Existing Reference Details
    $scope.findExistingRef = {
        title: "Existing Reference Finder",
        info: {
            appId: "ZBC-DCPOS",
            uiId: "POS-SRF-RBE-ER",
            mapId: "SRF-RBE-ER",
            modalId: "findExistingRef", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.Batch.ExistingReference = data.selectedItem.ReferenceNo;
        },
        open: function () {
            window._focuse(this.info.modalId);
            objTemp = [];
            objTemp.push($scope.userInfo().userId);
            objTemp.push("");
            objTemp.push($scope.Batch.PaymentMode);
            objTemp.push($scope.userInfo().outletCode);
            this.params = objTemp;


            this.info.onLoad = true;
            $("#" + this.info.modalId).modal('show');
        }
    };

    //Payment Mode set
    $scope.SetPaymentMode = function () {
        var objTemp = new PaymentModeOptions();

        objTemp.Params = {};

        if (angular.isUndefined($scope.Batch.PaymentMode)) {
            return;
        }
        if ($scope.Batch.PaymentMode == PaymentModesTypes.Cash) {
            $scope.formdata = {
                PaymentMode: PaymentModesTypes.Cash,
                AppliedAmount: $scope.Batch.Amount,
                PaymentModeDescription: "Cash"
            };
            $scope.paymentModeCallBack($scope.formdata);
        }
        else {
            $scope.SelectedPaymentMode = $scope.Batch.PaymentMode;
            objTemp.PaymentMode = $scope.SelectedPaymentMode;
            objTemp.Callback = $scope.paymentModeCallBack;
            objTemp.Amount = $scope.Batch.Amount;

            $scope.Options = objTemp;
            $scope.alertMessagePaymode = new Message(MessageTypes.Empty);
        }

    };

    //Payment model call back
    $scope.paymentModeCallBack = function (data) {
        if ($scope.Batch.PaymentMode == PaymentModesTypes.eZCash) {
            $scope.Batch.ExistingReference = data.Request.EzcReference;
        } else {
            $scope.Batch.ExistingReference = data.ReferenceNo;
        }

        var objTemp = new PaymentModeOptions();

        $scope.SelectedPaymentMode = "50";
        objTemp.PaymentMode = "50";
        objTemp.MobileNo = new Date().getTime().toString();
        objTemp.Callback = $scope.paymentModeCallBack;

        $scope.Options = objTemp;

    }

    //------------------------------------------------------------------

    // -------------------------- File load ---------------------------

    $scope.uploadDocuments = function () {

        if (angular.element("input[type='file']").val() == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Please select the upload file", showCloseButton: true });
            return;
        }

        $scope.uploadedData = [];
        var TotalAmount = 0;
        $scope.Batch.totalAmount = 0;
        $scope.Batch.records = 0;

        if ($scope.myFile != undefined) {
            if (fileUploadService.validateFile($scope.myFile.name)) {
                fileUploadService.BillingBatchProcessUpload($scope.myFile).then(function (response) {
                    if (response.data.Code == MessageTypes.Success) {
                        $scope.uploadedData = response.data.Result;

                        angular.forEach(response.data.Result, function (item) {
                            TotalAmount = TotalAmount + parseFloat(item.Amount);
                        });

                        $scope.Batch.totalAmount = Number(TotalAmount).toFixed(2);;;
                        $scope.Batch.records = $scope.uploadedData.length;
                    } else {
                        toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    }
                },
                    function (response) {
                        $scope.alertMessage = new Message(response.data.Code, response.data.Message);
                    });
            }
            else {
                toaster.error({ type: 'error', title: 'Error', body: "Invalide document type", showCloseButton: true });
            }



        } else {
            toaster.error({ type: 'error', title: 'Error', body: "Please select the upload file", showCloseButton: true });
        }

    };

    // ----------------------------------------------------------------

    // ---------------- Update and Verify ---------------------------


    $scope.PostUploadAndVerify = function () {

        if ($scope.Batch.PaymentMode == 'CHE') {
            if (!$scope.Batch.ExistingReference) {
                toaster.error({ type: 'error', title: 'Error', body: "Payment mode data not found please try again!", showCloseButton: true });
                return;
            }
        }


        $scope.request = {
            BatchId: $scope.Batch.BatchId,
            PaymentType: $scope.Batch.PaymentType,
            PaymentSource: $scope.Batch.PaymentSource,
            PaymentMethod: $scope.Batch.PaymentMethod,
            Sbu: $scope.Batch.Sbu,
            ProdCat: $scope.Batch.ProdCat,
            NoOfRecords: $scope.Batch.records,
            TotalAmount: $scope.Batch.totalAmount,
            Remarks: $scope.Batch.remarks,
            PaymentModeRef: $scope.Batch.ExistingReference,
            PaymentMode: $scope.Batch.PaymentMode,
            Data: $scope.uploadedData,
            AttachmentRef: $scope.attachmentRef
        };

        BatchProcessPaymentsService.PostUploadAndVerify($scope.request).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                $scope.Batch.BatchId = response.data.Result;
                $scope.GetBatchProcessDetails();
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });

            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }

        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };


    // --------------------------------------------------------------


    $scope.saveBatchProcess = function () {

        $scope.request = {
            BatchId: $scope.Batch.BatchId,
        };

        BatchProcessPaymentsService.saveBatchProcess($scope.request).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                $scope.GetBatchProcessDetails();
                toaster.success({ type: 'success', title: 'Success', body: "Success, Receipt will generate and post sequentially.", showCloseButton: true });
                $scope.ISaveBtnDisable = true;
            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }

        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    // ------------------------ Batch Details ------------------------
    $scope.finderBatchProcessPayments = {
        title: "Batch Finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BATCH-PROCESS",
            mapId: "BATCH-PROCESS-01",
            modalId: "finderBatchProcessPayments", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.Batch.BatchId = data.selectedItem.BatchId;
            $scope.GetBatchProcessDetails();
        },
        open: function () {
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
        }
    };


    $scope.GetBatchProcessDetails = function () {
        var batchId = $scope.Batch.BatchId;

        if (batchId == undefined || batchId == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Please enter batchId...!", showCloseButton: true });
            return;
        }

        BatchProcessPaymentsService.GetBatchProcessDetails(batchId).success(function (response) {
            $scope.changePageState('NEW');
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                var result = response.Result;
                $scope.Batch.BatchId = result.BatchId;
                $scope.Batch.PaymentType = result.PaymentType;
                $scope.GetPaymentSourceByPaymentType()
                $scope.Batch.PaymentSource = result.PaymentSource;
                $scope.Batch.PaymentMethod = result.PaymentMethod;
                $scope.Batch.Sbu = result.Sbu;
                $scope.Batch.ProdCat = result.ProdCat;
                $scope.Batch.records = result.NoOfRecords;
                $scope.Batch.verifiedCount = result.VerifiedCount;
                $scope.Batch.totalAmount = Number(result.TotalAmount).toFixed(2);
                $scope.Batch.remarks = result.Remarks;
                $scope.Batch.PaymentMode = result.PaymentMode;
                $scope.Batch.uploadedDate = result.UploadedDate;
                $scope.Batch.uploadedUser = result.UploadedUser;
                $scope.Batch.savedDate = result.SavedDate;
                $scope.Batch.savedUser = result.SavedUser;
                $scope.Batch.status = result.Status;
                $scope.Batch.ExistingReference = result.PaymentModeRef;

                $scope.IsAttach = result.isAttach;
                if ($scope.IsAttach == "YES") {
                    $scope.referenceParams.TransactionId = result.BatchId;
                }

                $scope.Batch.transferToSuspense = result.NoOfTransfers;
                $scope.Batch.transferToSuspenseAmount = Number(result.TotalTransfers).toFixed(2);

                $scope.Batch.statusDes = ($scope.Batch.status == 1) ? "In-progress" : ($scope.Batch.status == 2) ? "Verified" : ($scope.Batch.status == 3) ? "Completed" : "";

                if ($scope.Batch.status != 1) {
                    $scope.GridData = response.Result.Data;
                    if ($scope.GridData != null && $scope.GridData.length > 0) {
                        $scope.dgGridBatchProcess.dataSource.data($scope.GridData);
                    }
                    else {
                        $scope.ISaveBtnDisable = false;
                    }
                }

                var dGrid = $scope.dgGridBatchProcess.dataSource.data();

                angular.forEach(dGrid, function (row) {
                    if (row.IsVerified == 3) {
                        $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //blue
                    }
                });

            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });

    }

    $scope.getVerifiedCount = function () {

        var batchId = $scope.Batch.BatchId;

        if (batchId == undefined || batchId == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Please enter batchId...!", showCloseButton: true });
            return;
        }

        BatchProcessPaymentsService.GetVerifiedCount(batchId).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                var result = response.Result;
                $scope.Batch.verifiedCount = result;
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
    };


    $scope.changePageState = function (state) {
        debugger;
        if (state == "SEARCH") {

        }
        else if (state == "NEW") {
            console.log("new")
            $scope.dgGridBatchProcess.dataSource.data([]);
            $scope.Batch = {};
            $scope.uploadedData = [];
            $scope.Batch.totalAmount = "";
            $scope.Batch.records = "";
            $scope.Batch.transferToSuspense = "";
            $scope.Batch.transferToSuspenseAmount = "";
            $scope.Batch.ExistingReference = "";

            if ($scope.outletType == 1) {
                $scope.Batch.PaymentType = 1;
            } else {
                $scope.Batch.PaymentType = 2;
            }

            $scope.Batch.Sbu = 3;
            $scope.Batch.PaymentMethod = 10;
            $scope.Batch.ProdCat = 1;
            $scope.GetPaymentSourceByPaymentType();

            $scope.GridData = [];
            $scope.IsGridDisable = false;
            debugger;
            $scope.IsVerifyBtnDisable = false;
            $scope.ISaveBtnDisable = true;
            $scope.tempRef = $scope.GenerateGuid();

            $scope.Batch.PaymentMode = 'CA';
            var objTemp = new PaymentModeOptions();
            $scope.Options = objTemp;
            $scope.IsAttach = "NO";
            $scope.referenceParams.TransactionId = '';

            angular.element("input[type='file']").val(null);
        }
    };

    $scope.downloadSuspense = function () {
        var BatchId = $scope.Batch.BatchId;
        BatchProcessPaymentsService.GetSuspenseDetails(BatchId).then(function (response) {
            if (response.data.Code == "0") {
                debugger;
                if (response.data.Result > 0) {
                    if (appConfig.IsPostpaidCloud == 1) {
                        window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingSuspenseReport/" + BatchId, "_blank", '');
                    }
                    else {
                        PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { type: "BillingSuspenseReport", batchId: BatchId, Token: $scope.userInfo().token }, '_blank');
                    }


                } else {
                    toaster.success({ type: 'success', title: 'Success', body: "No Suspence Records to print", showCloseButton: true });

                }
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                $scope.IsVerifyBtnDisable = false;
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };
    
    

    // ------------------------------------------------------------


    $scope.PageLoad();
    $scope.tempRef = $scope.GenerateGuid();

}]);
