angular.module("DialogBilling").controller('BulkReceiptPrintingController', ["$scope", "Page", "$routeParams", "$filter", "PaymentInqueryService", "BulkPaymentService", "fileUploadService", "BulkReceiptPrintingService", "toaster", "appConfig", "PrintService", "ReceiptPrintingService", "DirectPrintService", "$timeout", function ($scope, Page, $routeParams, $filter, PaymentInqueryService, BulkPaymentService, fileUploadService, BulkReceiptPrintingService, toaster, appConfig, PrintService, ReceiptPrintingService, DirectPrintService, $timeout) {
    //Set Page Title
    Page.setTitle("Bulk Receipt Printing");

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations

    //////////====================== Bulk Receipt Printing Grid  ===================

    var configBulkReceiptPrinting = {};
    var configBulkReceiptPrinting = {
        columns: [
                     {
                         field: "IsSelected",
                         headerTemplate: '',
                         template: '<input type="checkbox"  ng-click="selectThis1($event)" ng-model="dataItem.IsSelected" ng-disabled = "dataItem.IsSelectedRowDisabled" />',
                         width: "32px"
                     },

                     { field: "ReceiptNo", title: "Receipt Number", width: "120px" },
                     { field: "Description", title: "Receipt Status", width: "70px" },
                     { field: "SBUSName", title: "SBU", width: "70px" },
                     { field: "ReceiptDate", title: "Receipt Date", width: "90px" },
                     { field: "ContractId", title: "Contract ID", width: "90px" },
                     { field: "ConnectionRef", title: "Connection Reference", width: "90px" },
                     { field: "CustmoerName", title: "Customer Name", width: "140px" },
                    {
                        field: "Amount", title: "Amount",
                        width: "50px"
                    },
                    { field: "PaymentModeName", title: "Payment Mode", width: "90px" }
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true,
        dataBound: function () {
            var dGrid = $scope.dgGridBulkRecePrinting.data();
            angular.forEach(dGrid, function (row) {
                if (row.IsSelectedRowDisabled == true) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                } else if (row.Description == "Cancelled") {
                     $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //red
                     if ($scope.IsUploads) {
                         row.IsSelected = false;
                     } else {
                         row.IsSelected = true;
                     }
                }

                if (!$scope.IsUploads) {
                    row.IsSelectedRowDisabled = true;
                }
            });
        }
    };

    configBulkReceiptPrinting.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'IsSelected': { editable: false, type: "boolean" },
                    'Description': { editable: false, type: "string" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptNo': { editable: false, type: "number" },
                    'ReferenceNo': { editable: false, type: "number" },
                    'ConnectionRef': { editable: false, type: "number" },
                    'CustmoerName': { editable: false, type: "string" },
                    'Amount': { editable: false, type: "number" },
                    'PaymentMode': { editable: false, type: "string" },
                    'PaymentType': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },
                    'PaymentModeName': { editable: false, type: "string" },
                    'SBUSName': { editable: false, type: "string" },
                    'SBUSCODE': { editable: false, type: "string" },
                    'ContractId': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10

    });

    $scope.selectThis1 = function (e) {
        var dataItems1 = $scope.dgGridBulkRecePrinting.data();
        var isSelected = true;
        for (var i = 0; i < dataItems1.length; i++) {
            var sss = dataItems1[i].IsSelected;
            if (!dataItems1[i].IsSelected) {
                isSelected = false;
            }
        }
        $scope.IsSelectedAll = isSelected;

    };


    $scope.dgGridBulkRecePrinting = new DataGrid();
    $scope.dgGridBulkRecePrinting.options(configBulkReceiptPrinting);

    $scope.InitA = function (arg) {
        $scope.dgGridBulkRecePrinting.Init(arg);
    };

    $scope.LoadPaymentSourseByPaymentType = function () {
        BulkPaymentService.GetPaymentSource($scope.payInquery.PaymentType).then(function (response) {
            if (response.data.Code == "0") {
                $scope.PaymentSourceCollection = response.data.Result;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    }

    //===========================================================================================================



    //####################################      Finder Payment Source Code       ########################################

    $scope.finderBulkRecePrinting = {

        title: "Search by Bulk Receipt Printing",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-BULKRECEIPTPRINTING",
            mapId: "BILLING-BULKRECEIPTPRINTING-MAP",
            modalId: "finderBulkRecePrinting",
            dataLoad: false,
            onLoad: false
        },

        params: [],

        callback: function (data) {
            $scope.GetBulkRecePrintingByBatchNo(data.selectedItem.BatchNo);
            $scope.Receipt.OutletId = data.selectedItem.OutletId;
            $scope.Receipt.BatchNo = data.selectedItem.BatchNo;
            $scope.Receipt.UserId = data.selectedItem.PrintedUser;
            $scope.Receipt.PrintedDateTime = data.selectedItem.DateTime;
            $scope.IsUploads = false;
        },
        open: function () {
            this.info.onLoad = true;
            $("#" + this.info.modalId).modal('show');
        }
    };

    //  #########################################################




    $scope.hasListbtnValidation = true;

    $scope.uploadDocuments = function () {
        $scope.PrintBtnValidation = true;
        $scope.IsUploads = true;
        if ($scope.RequestStatusChange()) {
            return;
        }
        if ($scope.myFile != undefined) {
            var objAttached = {
                file: $scope.myFile,
                ModuleId: '1',
                TransactionId: '12',
                ProductCategory: '5',
                PaymentSource: '8'
            };

            $scope.Receipt.BatchNo = ""; 
            $scope.Receipt.PrintedDateTime = "";
            $scope.Receipt.NoofRecords = "";
            $scope.Receipt.UserId = "";


            fileUploadService.UploadExcelBulkReceiptPrintingFiles(objAttached).then(
                function (result) {
                    if (result.data.Code == 0 && result.data.Result.length > 0) {
                        $scope.dgGridBulkRecePrinting.data(result.data.Result);
                        $scope.hasListbtnValidation = true;
                        BulkReceiptPrintingService.PostReceiptPrintingDetails({ ReceiptNo: result.data.Result, ValiedNoofRecords: 0, AllNoofRecords: 0 }).then(function (result) {
                            $scope.dgGridBulkRecePrinting.data(result.data.Result);
                            toaster.success({ type: 'Success', title: 'Success', body: 'Excel data successfully added!', showCloseButton: true });
                            $scope.hasListbtnValidation = false;
                        });
                    } else {
                        toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                    }
                }, function (result) {
                    toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                });
        } else {
            toaster.error({ type: 'error', title: 'Error', body: 'Please select the upload file!', showCloseButton: true });
        }
    };

    $scope.Receipt = {}
    $scope.Receipt.BatchNo = "";
    $scope.Receipt.UserName = "";
    $scope.Receipt.PrintedDateTime = "";
    $scope.Receipt.NoofRecords = "";
    $scope.Receipt.UserId = "";
    $scope.Receipt.OutletId = "";

    $scope.PrintBtnValidation = true;
    $scope.IsUploads = false;
    $scope.save = function () {
        $scope.Receipt.BatchNo = "";
        var allReceipts = $scope.dgGridBulkRecePrinting.data();
        var valiedReceipts = [];
        $scope.totalNoOfRecords = allReceipts.length;
        for (var i = 0; i < allReceipts.length; i++) {
            if (allReceipts[i].IsSelectedRowDisabled == false) {
                if (allReceipts[i].IsSelected == true) {
                    valiedReceipts.push(allReceipts[i]);
                }
                allReceipts[i].SaveRecorde = true;
            }
        }

        $scope.Receipt.NoofRecords = valiedReceipts.length;

        if ($scope.Receipt.NoofRecords == 0) {
            toaster.error({ type: 'error', title: 'Error', body: 'No recodes selected', showCloseButton: true });
            return;
        }

        valiedReceipts.ValiedNoofRecords = $scope.Receipt.NoofRecords;
        valiedReceipts.AllNoofRecords = $scope.totalNoOfRecords;
        BulkReceiptPrintingService.SaveReceiptPrintingDetails({ ReceiptNo: valiedReceipts, ValiedNoofRecords: valiedReceipts.ValiedNoofRecords, AllNoofRecords: valiedReceipts.AllNoofRecords }).then(function (result) {
            if (result.data.Result) {
                $scope.IsUploads = false;
                $scope.PrintBtnValidation = false;
                $scope.hasListbtnValidation = true;
                $scope.Receipt.BatchNo = result.data.Result.BatchNo;
                $scope.Receipt.UserName = result.data.Result.UserName;
                $scope.Receipt.OutletId = result.data.Result.OutletId;
                $scope.Receipt.PrintedDateTime = result.data.Result.PrintedDateTime;
                $scope.Receipt.UserId = result.data.Result.UserId;
                $scope.Receipt.TokenId = result.data.Result.TokenId;

                $scope.dgGridBulkRecePrinting.data([]);
                $scope.dgGridBulkRecePrinting.data(valiedReceipts);
                toaster.success({ type: 'Success', title: 'Success', body: 'Excel data ready to Printing', showCloseButton: true });
            } else {
                toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
            }
        });
    };

    DirectPrintService.start();
    $scope.PrintReceipts = function () {
        if (appConfig.IsPostpaidCloud == 1) {
            debugger;
            window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingRandomReceiptBatchPrint/" + $scope.Receipt.BatchNo + "/" + $scope.Receipt.UserId);
        }
        else {
            PrintService.OpenPrint('POST',
                  appConfig.REPORT_URL + 'ReportViewer.aspx',
                  {
                      PrintType: "2",
                      Outlet: $scope.Receipt.OutletId,
                      type: "BillingRandomBulkReceipts",
                      batchId: $scope.Receipt.BatchNo,
                      userId: $scope.Receipt.UserId,
                      WithSerial: false,
                      Token: $scope.Receipt.TokenId
                  }, '_blank');
        }

        //if ($scope.dgGridBulkRecePrinting.data().length>5) {
        //} else {
        //    $scope.AutoPrint();
        //}
    };

    //$scope.AutoPrint = function () {
    //    ReceiptPrintingService.GetBulkReceiptPrintingDetails($scope.Receipt.BatchNo, $scope.Receipt.UserId).then(function (response) {
    //        if (response.data.Code == "0") {
    //            for (var i = 0; i < response.data.Result.length; i++) {
    //                 DirectPrintService.print(function () {
    //                     $scope.$apply(function () {
    //                         console.log('Print Completed');
    //                         //vm.printCompleted = true;
    //                         $timeout(function () {
    //                             //vm.printCompleted = false;
    //                         }, 3000);
    //                     });
    //                 },
    //                response.data.Result[i].ReportHtml);
    //             };
    //         } else {
    //             toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
    //         }
    //     }, function (response) {
    //         toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
    //     });
    //};
    

    $scope.changePageState = function () {
        $scope.PrintBtnValidation = true;
        $scope.IsUploads = false;
        $scope.Receipt = {}
        $scope.dgGridBulkRecePrinting.data([]);
        //$scope.file = null;
    }

    $scope.RequestStatusChange = function () {
        if ($scope.isSendRequest) {
            toaster.error({ type: 'error', title: 'Error', body: 'Procedding...!', showCloseButton: true });
            return true;
        } else {
            return false;
        }
    }

    $scope.GetBulkRecePrintingByBatchNo = function (BatchNo) {
        BulkReceiptPrintingService.GetBulkRecePrintingByBatchNo(BatchNo).then(function (result) {

            $scope.dgGridBulkRecePrinting.data(result.data.Result);
            $scope.hasListbtnValidation = false;
            BulkReceiptPrintingService.PostReceiptPrintingDetails({ ReceiptNo: result.data.Result, ValiedNoofRecords: 0, AllNoofRecords: 0 }).then(function (result) {
                $scope.dgGridBulkRecePrinting.data(result.data.Result);
                toaster.success({ type: 'Success', title: 'Success', body: 'Excel data successfully added!', showCloseButton: true });
                $scope.PrintBtnValidation = false;
                $scope.IsUploads = false;
                $scope.hasListbtnValidation = true;
                $scope.Receipt.NoofRecords = result.data.Result.length;
            });
        }, function (result) {
            toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
        });

    }
}]);