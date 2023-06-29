angular.module("DialogBilling").controller('PaymentCancellationController', ["$scope", "Page", "$routeParams", "$filter", "PaymentCancellationService", "toaster", "fileUploadService", "AuthService", function ($scope, Page, $routeParams, $filter, PaymentCancellationService, toaster, fileUploadService, AuthService) {
    //Set Page Title
    Page.setTitle("Payment Cancellation");

    //========================
    $scope.PaymentCancellation = [];
    $scope.payCancel = {};
    $scope.AjesmentReceipts = [];
    var CancelReceiptsdata = JSON.parse(localStorage.getItem('CancelReceipts'));
    $scope.payCancel.CancellationRadio = 3
    $scope.payCancel.Canceltotal = 0;
    $scope.payCancel.CorrectEntrytotal = 0;
    $scope.disableGrid = false;
    $scope.IsAttach = "No";
    $scope.IsBackOfficeUser = false;
    $scope.TempAttachmentRef = '';
    $scope.disabled = {};
    var PinRequestDetails = null;
    $scope.payCancel.WorkFlowId = "";
    debugger;
    $scope.PinMessage = new Message(0, "test");

    var permissionCodes = AuthService.getProfile().permission;
    var de = permissionCodes.indexOf("41001");
    if (permissionCodes.indexOf("41001") == -1) {
        $scope.IsBackOfficeUser = true;
    } else {
        $scope.IsBackOfficeUser = false;
    }

    $scope.GenGuid = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $scope.GenerateGuid = function () {
        this.length = 16;
        this.timestamp = +new Date;

        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < this.length; ++i) {
            var index = $scope.GenGuid(0, parts.length - 1);
            id += parts[index];
        }
        $scope.TempAttachmentRef = id;
        $scope.referenceParams = {
            moduleId: "BACK-OFFICE-CANCEL-RECEIPTS1",
            TransactionId: $scope.TempAttachmentRef,
            isAttachedDoc: true,
            aa: "aaaa"
        };
    }


    $scope.IsAttach = "NO";

    //// ------------------ Attachments -----------------------------------
    
 



    ////REFERENCE POPUP
    //$scope.referenceParams = {
    //    moduleId: "SRF-GENERATE-RECEIPT-005",
    //    TransactionId: $scope.TempAttachmentRef,
    //    isAttachedDoc: false
    //};

    
    ////Globle variable to Idetify the cliked attachement....

   
    //$scope.TransRef = [];
    //$scope.referenceCallback = function (data) {
    //    console.log(data,'call back');
    //    $scope.TransRef = data.TransactionReference;
       

    //};

    ////-------------------- End Attachment ----------------------------

    $scope.GetAttachType = function (arg) {
        attcahmentType = arg;
    };

    //============================
    // Mistake Done By dropdown
    $scope.OptionsMistakeDoneBy = [
      { text: "Customer", value: "1" },
      { text: "Cashier", value: "2" },
      { text: "Other", value: "3" }
    ];

    // Cancellation Type dropdown
    $scope.OptionsCancellationType = [    
    { text: "Cancel With Correct Entry", value: "1" },
    { text: "Cancel Only", value: "2" }
    ];
     
    //############################

    var BillingSystemSample = [];

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations

    //////////====================== Cancelling Receipt Details   ===================

    var configCancelReceiptDetails = {};
    var configCancelReceiptDetails = {
        columns: [
                     {
                         field: "IsSelected",
                         headerTemplate: '<input type="checkbox" ng-disabled="disableGrid" title="Select all" ng-model="selectAll" ng-click="toggleSelectCancel($event)" />',
                         template: '<input type="checkbox" ng-disabled="disableGrid" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
                         width: "32px",
                        
                        
                     },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "150px" },
                    { field: "ReceiptStatus", title: "Receipt Status", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                    
                    { field: "ReferenceNo", title: "Reference No", width: "100px" },
                    {
                        field: "ConnectionReference",
                        title: 'Connection Reference',
                        width: "110px"
                    }, {
                        field: "ContractNo",
                        title: 'Contract No',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount", width: "100px", template: "{{dataItem.Amount|currency:''}}"
                    },
                    { field: "PaymentMode", title: "Payment Mode", width: "100px" },
                    { field: "PaymentMethod", title: "Payment Method", width: "100px" },
                    { field: "PaymentSource", title: "Payment Source", width: "100px" },

                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" },
                    { field: "ProdCat", title: "Product Category", width: "100px" },
                    { field: "PaymentSeq", title: "Product Category", width: "100px" },
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configCancelReceiptDetails.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'IsSelected': { editable: false, type: "boolean" },
                    'ReceiptStatus': { editable: false, type: "string" },
                    'PrePost': { editable: false, type: "string" },
                    'SBU': { editable: false, type: "string" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptNumber': { editable: false, type: "number" },
                    'ReferenceNo': { editable: false, type: "number" },
                    'ConnectionReference': { editable: true, type: "number" },
                    'ContractNo': { editable: true, type: "number" },
                    'Amount': { editable: false, type: "number" },

                    'PaymentMode': { editable: false, type: "string" },
                    'PaymentMethod': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },

                    'ReceiptGeneratedUser': { editable: false, type: "string" },
                    'IsValied': { editable: false, type: "boolean" },
                    'TransferredType': { editable: false, type: "number" },
                    'Cancel': { editable: false, type: "number" },
                    'ProdCat': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGridCancelReceiptDetails = new DataGrid();
    $scope.dgGridCancelReceiptDetails.options(configCancelReceiptDetails);

    $scope.InitA = function (arg) {
        $scope.dgGridCancelReceiptDetails.Init(arg);
    };

    ///////////====================== Correct Entry Details   ===================

    var configCorrectEntryDetails = {};
    var configCorrectEntryDetails = {
        columns: [
                     {
                         field: "IsSelected",
                         headerTemplate: '<input type="checkbox" ng-disabled="disableGrid" title="Select all" ng-model="selectAllCREntry" ng-click="toggleSelectCREntry($event)" />',
                         template: '<input type="checkbox" ng-disabled="disableGrid" ng-model="dataItem.IsSelected" ng-click="selectThisCREntry($event)" />',
                         width: "32px",
                     },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "150px" },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" },
                    { field: "PaymentSource", title: "Payment Source", width: "100px" },
                   
                    {
                        field: "ConnectionReference",
                        title: 'Connection Reference',
                        // template: '<input type ="text"    class="k-fill "/>',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount",
                        width: "100px"
                        , template: "{{dataItem.Amount|currency:''}}"

                    }

        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configCorrectEntryDetails.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'IsSelected': { editable: false, type: "boolean" },
                    'SBU': { editable: false, type: "string" },
                    'PrePost': { editable: false, type: "string" },                   
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptGeneratedUser': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },
                    'ReceiptNumber': { editable: false, type: "number" },
                    'ConnectionReference': { editable: true, type: "number" },
                    'Amount': { editable: false, type: "number" },
                    'TransferredType': { editable: false, type: "number" },
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGridCorrectEntryDetails = new DataGrid();
    $scope.dgGridCorrectEntryDetails.options(configCorrectEntryDetails);

    $scope.InitB = function (arg) {
        $scope.dgGridCorrectEntryDetails.Init(arg);
    };

////=======================================
  
    //####################################   Finder Payment Cancellation #################

    $scope.PaymentCancellationID = {};
    $scope.CancelTypeDisabled = true;
  

    var permissionCodes = AuthService.getProfile().permission;

    var de = permissionCodes.indexOf("41001");
    if (permissionCodes.indexOf("41001") == -1) {
        $scope.CancelTypeDisabled = false;
        $scope.IsBackOfficeUser = true;
    } else {
        $scope.CancelTypeDisabled = true;
        $scope.IsBackOfficeUser = false;
    }


    // Cancel Batch Finder
    $scope.CancelBatchFinder =
   {

       title: "Cancel batch finder",
       info: {
           appId: "ZBC-DCPOS-BILLING",
           uiId: "POS-BILLING-RECEIPTBATCH-CANCEL",
           mapId: "POS-BILLING-BATCH-CANCEL",
           modalId: "CancelBatchFinder",
           dataLoad: false,
           onLoad: false

       },
       params: [],
       callback: function (data) {
           console.log(data.selectedItem, 'data.selectedItem');
           $scope.payCancel.BathId = data.selectedItem.BatchId;
           $scope.GetByBatchId();
       },
       open: function () {
           this.info.onLoad = true;
           $scope.GenerateGuid();
           //$scope.alertMessage = new Message(MessageTypes.Empty, '');
           $("#" + this.info.modalId).modal('show');

       }
   };


    // Receipt batch finder
    $scope.ReceiptBatchFinder =
    {

        title: "Receipt batch finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "POS-BILLING-RECEIPTBATCH",
            mapId: "POS-BILLING-BATCH",
            modalId: "ReceiptBatchFinder",
            dataLoad: true,
            onLoad: false

        },
        params: [],
        callback: function (data) {

            $scope.payCancel.CancellationBatch = data.selectedItem.BatchId;
            $scope.GetReceiptsByBatch();
        },
        open: function () {
            this.info.onLoad = true;

            //$scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };



    // Search By ReceiptUser

    $scope.PostPaidReceipts =
    {

        title: "Search Post Paid Receipts",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "POS-BILLING-BILLCANCELLATION",
            mapId: "POS-BILLING-POSPAID",
            modalId: "PostPaidReceipts",
            onLoad: true

        },
        params: [],
        callback: function (data) {

            $scope.GetPostPaidReceipts(data.selectedItem.ReceiptNo);
        },
        open: function () {
            this.info.onLoad = true;

            //$scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };



    $scope.ReceiptFinder = {

        title: "Receipt No finder",
        info: {
            appId: "ZBC-DCPOS",
            uiId: "POS-EAI-Billing",
            mapId: "EAI-Billing",
            modalId: "ReceiptFinder",
            onLoad: false
        },
        params: [],
        callback: function (data) {
            $scope.GetPrePaidReceipts(data.selectedItem.BillReceiptNo);
        },
        open: function () {
            this.info.onLoad = true;
            searchMode = true;

            var objTemp = new Array();

            objTemp.push("1");
            this.params = objTemp;

            $scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };

    //  #########################
    // ------------------ Attachments ------------------------------------

    $scope.receipt = [];
    // $scope.receipt.ReceiptId123 = "";
    $scope.IsAttach = "NO";

    //$scope.GenerateGuid();
    //REFERENCE POPUP
    $scope.referenceParams = {
        moduleId: "BACK-OFFICE-CANCEL-RECEIPTS1",
        TransactionId: $scope.TempAttachmentRef,
        isAttachedDoc: true,
        IsDisabled: false
    };

    //$scope.$watch("TempAttachmentRef", function (newValue) {
    //    $scope.referenceParams.TransactionId = $scope.TempAttachmentRef;
    //});

    $scope.$watch("payCancel.BathId", function (newValue) {
        //$scope.referenceParams.TransactionId = $scope.payCancel.BathId;
        $scope.referenceParams = {
            moduleId: "BACK-OFFICE-CANCEL-RECEIPTS1",
            TransactionId: $scope.payCancel.BathId,
            isAttachedDoc: true,
            IsDisabled: true
        };
    });


    //End REFERENCE POPUP
    $scope.TransRef = [];
    $scope.referenceCallback = function (data) {
        console.log(data,'call back');
        $scope.TransRef = data.TransactionReference;
        $scope.IsAttach = "YES";

    };

    //-------------------- End Attachment ----------------------------

   
   
    $scope.PassedReceipts = [];

    $scope.selectThis = function (e) {
        var sum = 0;

        var dataItems = $scope.dgGridCancelReceiptDetails.data();

        for (var i = 0; i < dataItems.length; i++) {

            if (dataItems[i].IsSelected === true) {
                sum = sum + dataItems[i].Amount;
            }


        }

        $scope.payCancel.Canceltotal = Number(sum).toFixed(2);
      //  $scope.payCancel.Canceltotal = $scope.payCancel.Canceltotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    $scope.toggleSelectCancel = function (e) {
        var dataItems = $scope.dgGridCancelReceiptDetails.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        }
        $scope.selectThis();
    };

    $scope.toggleSelect = function (e) {
        var dataItems = $scope.dgGridCancelReceiptDetails.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        }
        $scope.selectThis();
    };



    $scope.selectThisCREntry = function (e) {
        var sum = 0;

        var dataItems = $scope.dgGridCorrectEntryDetails.data();
        $scope.payCancel.ConrefTransfer = '';
        
        for (var i = 0; i < dataItems.length; i++) {

            if (dataItems[i].IsSelected === true) {
                if (sum == 0) {
                    $scope.payCancel.ConrefTransfer = dataItems[i].ConnectionReference;
                }
                sum = sum + dataItems[i].Amount;
                
                
            }


        }

        console.log($scope.payCancel.aa, '$scope.payCancel.TransferTo');

        $scope.payCancel.CorrectEntrytotal = Number(sum).toFixed(2);
        console.log($scope.payCancel.CorrectEntrytotal);
     //   $scope.payCancel.CorrectEntrytotal = $scope.payCancel.CorrectEntrytotals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    $scope.toggleSelectCREntry = function (e) {
        var dataItems = $scope.dgGridCorrectEntryDetails.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        }
        $scope.selectThisCREntry();
    };


    $scope.LoadReceiptFromStorage = function () {

        $scope.payCancel.CancellationRadio = "0";
        $scope.RadioChange();
        $scope.PassedReceiptsA = [];
        if (CancelReceiptsdata == null) {
            CancelReceiptsdata = JSON.parse(localStorage.getItem('CancelReceipts'));
        }
        if (CancelReceiptsdata != null) {

            $scope.payCancel.time = CancelReceiptsdata.BatchDate;
            $scope.payCancel.Canceltotal = Number(CancelReceiptsdata.TotalAmt).toFixed(2);
            //$scope.payCancel.BathId = CancelReceiptsdata.BatchId;

            var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
            //$scope.PaymentModeCollection = defaultDataCookieObj.BillingPaymentMode;
            try {
                var Pmode = defaultDataCookieObj.BillingPaymentMode.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMode, { Id: CancelReceiptsdata.RecCollection[0].PaymentModeId })[0].Description : "";

            } catch (e) {

            }

            angular.forEach(CancelReceiptsdata.RecCollection, function (item) {

                $scope.PassedReceiptsA.push({
                    IsSelected: true,
                    ReceiptStatus: item.ReceiptStatus,
                    PrePost: item.PrePost,
                    SBU: item.SBU,
                    ReceiptDate: item.ReceiptDate,
                    ReceiptNumber: item.ReceiptNumber,
                    ReferenceNo: item.ReferenceNo,
                    ConnectionReference: item.ConnectionReference,
                    ContractNo:item.ContractNo,
                    Amount: item.Amount,
                    PaymentMode: Pmode,
                    PaymentMethod: item.PaymentMethod,
                    PaymentSource: item.PaymentSource,
                    ReceiptGeneratedUser: item.ReceiptGeneratedUser,
                    PaymentModeId: item.PaymentModeId,
                    PaymentMethodId: item.PaymentMethodId,
                    PaymentSourceId: item.PaymentSourceId,
                    SbuCode: item.SbuCode,
                    ProdCat: item.ProdCat,
                    PaymentSeq: item.PaymentSeq
                });

            });


            $scope.dgGridCancelReceiptDetails.data($scope.PassedReceiptsA);
            if ($scope.PassedReceiptsA < 1) {
                toaster.error({ type: 'error', title: 'Error', body: "Cancel Receipt Not found!" + CancelReceiptsdata, showCloseButton: true });
            }

            $scope.selectAll = true;
            $scope.selectThis();
            localStorage.setItem('CancelReceipts', null);
            var de = permissionCodes.indexOf("41001");
            if (permissionCodes.indexOf("41001") == -1) {
                $scope.CancelTypeDisabled = false;
                $scope.IsBackOfficeUser = true;
            } else {
                $scope.CancelTypeDisabled = true;
                $scope.IsBackOfficeUser = false;
            }
        } else {

           // toaster.error({ type: 'error', title: 'Error', body: "Cancel Receipt Not found while page transfer.", showCloseButton: true });
        }

    }

    $scope.PageLoad = function () {

        PaymentCancellationService.pageLoad().then(function (response) {

            console.log(response,'sdsd');

                if (response.data.Code == "0") {
                   
                    $scope.cancellattonCode = response.data.Result.reasonCodes;
                    $scope.CancellationDesc = response.data.Result.reasonDesc;

                    $scope.cancellattonCode.unshift({ Id: "0", Description: "Select" });
                    $scope.CancellationDesc.unshift({ Id: "0", Description: "Select" });
                    $scope.LoadReceiptFromStorage();
                    

                } else {
                    toaster.success({ type: 'Success', title: 'Success', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.success({ type: 'Success', title: 'Success', body: response.data.Message, showCloseButton: true });
            });
  
    }

    $scope.PageLoad();


    $scope.$watch("payCancel.CancelDesc", function () {       
        $scope.ResonDescChange();
    });

    $scope.$watch("payCancel.cancelCode", function () {
        $scope.ResonCodeChange();
    });

    $scope.ResonCodeChange = function () {
        $scope.payCancel.CancelDesc = $scope.payCancel.cancelCode;
       
    }

    $scope.ResonDescChange = function () {
        $scope.payCancel.cancelCode = $scope.payCancel.CancelDesc;
  //      console.log($scope.payCancel.cancelCode, '$scope.payCancel.cancelCode', $scope.payCancel.CancelDesc);
    }


    $scope.GetPrePaidReceipts = function (val) {

        if (!val) {
            return;
        }

        PaymentCancellationService.GetPrePaidReceipts(val).then(function (response) {

            console.log(response, 'response');

            if (response.data.Code == "0") {

                $scope.dupFound = false;
                angular.forEach($scope.AjesmentReceipts, function (row) {
                    if (response.data.Result.ReceiptNumber == row.ReceiptNumber) {
                        toaster.error({ type: 'Error', title: 'Error', body: 'You can’t select same receipt number.', showCloseButton: true });
                        $scope.dupFound=true;
                    }
                });


                if ($scope.dupFound == false) {

                    $scope.AjesmentReceipts = $scope.dgGridCorrectEntryDetails.data();

                    $scope.AjesmentReceipts.push({
                        IsSelected: true,
                        ReceiptStatus: response.data.Result.ReceiptStatus,
                        PrePost: response.data.Result.PrePost,
                        SBU: response.data.Result.SBU,
                        ReceiptDate: response.data.Result.ReceiptDate,
                        ReceiptNumber: response.data.Result.ReceiptNumber,
                        ReferenceNo: response.data.Result.ReferenceNo,
                        ConnectionReference: response.data.Result.ConnectionReference,
                        Amount: response.data.Result.Amount,
                        PaymentMode: response.data.Result.PaymentMode,
                        PaymentMethod: response.data.Result.PaymentMethod,
                        PaymentSource: response.data.Result.PaymentSource,
                        ReceiptGeneratedUser: response.data.Result.ReceiptGeneratedUser,
                        SbuCode: response.data.Result.SbuCode,
                        TransferredType: 2
                    });


                    $scope.dgGridCorrectEntryDetails.data($scope.AjesmentReceipts);
                    //    $scope.selectAll = true;
                    $scope.selectThisCREntry();
                }
            } else {
                toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }




    $scope.GetPostPaidReceipts = function (val) {

        if (!val) {
            return;
        }

        PaymentCancellationService.GetPostPaidReceipts(val).then(function (response) {

            if (response.data.Code == "0") {

                $scope.dupFound = false;
                angular.forEach($scope.AjesmentReceipts, function (row) {
                    if (response.data.Result.ReceiptNumber == row.ReceiptNumber) {
                        toaster.error({ type: 'Error', title: 'Error', body: 'You can’t select same receipt number.', showCloseButton: true });
                        $scope.dupFound = true;
                    }
                });


                if ($scope.dupFound == false) {
                    $scope.AjesmentReceipts = $scope.dgGridCorrectEntryDetails.data();

                    $scope.AjesmentReceipts.push({
                        IsSelected: true,
                        ReceiptStatus: response.data.Result.ReceiptStatus,
                        PrePost: response.data.Result.PrePost,
                        SBU: response.data.Result.SBU,
                        ReceiptDate: response.data.Result.ReceiptDate,
                        ReceiptNumber: response.data.Result.ReceiptNumber,
                        ReferenceNo: response.data.Result.ReferenceNo,
                        ConnectionReference: response.data.Result.ConnectionReference,
                        Amount: response.data.Result.Amount,
                        PaymentMode: response.data.Result.PaymentMode,
                        PaymentMethod: response.data.Result.PaymentMethod,
                        PaymentSource: response.data.Result.PaymentSource,
                        ReceiptGeneratedUser: response.data.Result.ReceiptGeneratedUser,
                        SbuCode: response.data.Result.SbuCode,
                        TransferredType: 2
                    });
                }

                $scope.dgGridCorrectEntryDetails.data($scope.AjesmentReceipts);
                //    $scope.selectAll = true;
                $scope.selectThisCREntry();

            } else {
                toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }




    $scope.GetReceiptsByBatch = function () {

        if (!$scope.payCancel.CancellationBatch) {
            return;
        }

        PaymentCancellationService.GetReceiptsByBatch($scope.payCancel.CancellationBatch).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                console.log(response.data.Result.gridData,'response.data.Result.gridData');
                $scope.dgGridCancelReceiptDetails.data(response.data.Result.gridData);
                $scope.selectAll = true;
                $scope.selectThis();

            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }

        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }
    $scope.$watch("payCancel.cancelType", function () {
        if ($scope.payCancel.cancelType == 1) {
            $scope.CorrectEntryGridShow = true;
        } else {
            $scope.CorrectEntryGridShow = false;
        }
        
    });


    $scope.RadioChange = function () {
        //$scope.clearForm();

        if ($scope.payCancel.CancellationRadio == 1) {
            $scope.payCancel.CancellationBatch = '';
        }
        
        var permissionCodes = AuthService.getProfile().permission;

        if (permissionCodes.indexOf("20001") == -1) {
            $scope.CancelTypeDisabled = false;
            $scope.CorrectEntryGridShow = false;
        }
        if ($scope.payCancel.CancellationRadio == 0) {
            $scope.CancelTypeDisabled = false;
            $scope.payCancel.cancelType = 1;
        } else {
            $scope.CancelTypeDisabled = false;
            $scope.payCancel.cancelType = 2;
            $scope.CorrectEntryGridShow = false;
        }
        $scope.payCancel.Canceltotal = '';
        $scope.selectAll = false;
        $scope.dgGridCancelReceiptDetails.data([]);
    }


    $scope.CheckRowColor = function () {
        var dGrid = $scope.dgGridCancelReceiptDetails.data();

        angular.forEach(dGrid, function (row) {
            if (row.IsValied) {


            } else {
                if (row.IsValied != true) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                }
            }
        });

    }

    // Upload documents
    $scope.uploadDocuments = function () {

        
        if ($scope.myFile != undefined) {
            if (fileUploadService.validateFile($scope.myFile.name)) {
                fileUploadService.BillingReceiptUpload($scope.myFile).then(function (response) {
                    console.log(response, 'response');
                    $scope.dgGridCancelReceiptDetails.data(response.data.Result);

                    $scope.selectAll = true;
                    $scope.selectThis();
                    $scope.CheckRowColor();
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
    
 

    $scope.clearForm = function () {

        $scope.GenerateGuid();
        $scope.payCancel.WorkflowReference = "";
        $scope.payCancel.BathId = '';
        $scope.payCancel.cancelType = 1;
        $scope.payCancel.CancellationRadio = 3;
        $scope.payCancel.CancellationBatch = '';
        $scope.payCancel.cancelCode = 0;
        $scope.payCancel.CancelDesc = 0;
        $scope.payCancel.OptionsMistakeDoneBy = 1;
        $scope.payCancel.CancelRemark = '';
        $scope.payCancel.Canceltotal = 0;
        $scope.payCancel.time = '';
        $scope.payCancel.status = '';
        $scope.payCancel.CorrectEntrytotal = 0;
        $scope.payCancel.originalReceipt = false;
        $scope.payCancel.PayTransForm = false;
        $scope.payCancel.NicCopy = false;
        $scope.payCancel.ReqLetter = false;
        $scope.dgGridCancelReceiptDetails.data([]);
        $scope.dgGridCorrectEntryDetails.data([]);
        $scope.selectAll = false;
        $scope.selectAllCREntry = false;
        $scope.disableGrid = false;
        $scope.TransRef = [];
        $scope.IsAttach = 'NO';
        $scope.payCancel.ConrefTransfer = '';
        $scope.payCancel.CancellationRadio = '0';
        $scope.CorrectEntryGridShow = false;
        $scope.payCancel.Email = false;
            angular.element("input[type='file']").val(null);
    };

    $scope.loadReceipts = function () {
        $scope.dgGridCancelReceiptDetails.data($scope.PassedReceiptsA);
    }

    $scope.SubmitCancellation = function () {
    
        $scope.payCancel.IsDisabledSendPIN = false;
        $scope.payCancel.IsDisabledVerifyPIN = true;
        $scope.payCancel.IsDisabledResend = true;
        $scope.payCancel.PinNo = "";
        $scope.PinMessage = "";
        //if ($scope.payCancel.cancelCode == 0) {
        //    toaster.error({ type: 'Error', title: 'Error', body: 'Please select cancellation reason.', showCloseButton: true });
        //    return;
        //}
        if ($scope.payCancel.Canceltotal == 0) {
            toaster.error({ type: 'Error', title: 'Error', body: 'Please select receipts to cancel.', showCloseButton: true });
            return;
        }

        //if ($scope.payCancel.cancelType == 1  && ($scope.payCancel.Canceltotal != $scope.payCancel.CorrectEntrytotal)) {
        //    toaster.error({ type: 'Error', title: 'Error', body: 'Total amount of cancelling receipt and Total Amount of New Payments doesn’t tally !', showCloseButton: true });
        //    return;
        //}

        var valiedEntryCancelRec = [];

        //var cancellationRecPaySourse = "";
        //var newRecPaySourse = "";
        //var isPaymentSourseError = false;
        var isErrorRecordsExist = false;
        var isGenieRecordExist = false;

        var selectedRecToCancelCount = 0;
        
        var cancelReceiptDate = '';//$filter('date')($scope.currentDate, 'dd MMM yyyy');
        var newReceiptDate = '';//$filter('date')($scope.currentDate, 'dd MMM yyyy');
        var isReceiptDateError = false;

        angular.forEach($scope.dgGridCancelReceiptDetails.data(), function (item) {
            if (item.IsSelected == true) {
                item.PaymentSourceId = 0;
                if (item.ReceiptStatus == "Valid") {
                    valiedEntryCancelRec.push(item);
                } else {
                    isErrorRecordsExist = true;
                }
                selectedRecToCancelCount++;

                if (cancelReceiptDate == "") {
                    var dt = new Date(item.ReceiptDate);
                    cancelReceiptDate = $filter('date')(dt, 'dd MMM yyyy');
                } else {
                    var dt1 = new Date(item.ReceiptDate);
                    var oldReceiptDate = $filter('date')(dt1, 'dd MMM yyyy');

                    if (oldReceiptDate != cancelReceiptDate) { 
                        isReceiptDateError = true;
                    }
                } 
                if (item.PaymentMode == "Genie")  
                {
                    isGenieRecordExist = true;
                }

                if (typeof item.PaymentMethodId === 'number') {
                    
                } else {
                    item.PaymentMethodId = 0;
                }
                //if (cancellationRecPaySourse == "") {
                //    cancellationRecPaySourse = item.PaymentSource;
                //} else {
                //    if (item.PaymentSource != cancellationRecPaySourse) {
                //        isPaymentSourseError = true;
                //    }
                //}
            }
        });

        if (isGenieRecordExist)
        {
            toaster.error({ type: 'Error', title: 'Error', body: 'Cannot cancel Genie receipts.', showCloseButton: true });
            return;
        }

        angular.forEach($scope.dgGridCorrectEntryDetails.data(), function (item) {
            if (item.IsSelected == true) {
                if (newReceiptDate == "") {
                    var dt = new Date(item.ReceiptDate);
                    newReceiptDate = $filter('date')(dt, 'dd MMM yyyy');
                } else {
                    var dt1 = new Date(item.ReceiptDate);
                    var oldReceiptDate = $filter('date')(dt1, 'dd MMM yyyy');

                    if (oldReceiptDate != newReceiptDate) {
                        isReceiptDateError = true;
                    }
                }
                if (cancelReceiptDate != newReceiptDate) {
                    isReceiptDateError = true;
                }
            }
        });

        if ($scope.payCancel.cancelType == 1 && selectedRecToCancelCount > 1) {
            toaster.error({ type: 'Error', title: 'Error', body: 'Please select only one receipt to cancel!.', showCloseButton: true });
            return;
        }
  
        if ($scope.payCancel.cancelType == 1) {
            if (isReceiptDateError) {
                toaster.error({ type: 'Error', title: 'Error', body: 'Cancelling Receipt Date and New Receipt Date Should Be Same!.', showCloseButton: true });
                return;
            }
        }


        var selectedCorrRecCount = 0;
        angular.forEach($scope.dgGridCorrectEntryDetails.data(), function (item) {
            if (item.IsSelected == true) {
                selectedCorrRecCount++;
            }
        });


        if ($scope.payCancel.cancelType == 1) {
            if (selectedCorrRecCount==0) {
                toaster.error({ type: 'Error', title: 'Error', body: 'Correct entry details not found!.', showCloseButton: true });
                return;
            }
        }

        

        if (isErrorRecordsExist) {
            toaster.error({ type: 'Error', title: 'Error', body: 'Please uncheck invalied / already cancelled records!.', showCloseButton: true });
            return;
        }
        $scope.formData = {

            cancelType : $scope.payCancel.cancelType,
            cancelCode: $scope.payCancel.cancelCode,
            OptionsMistakeDoneBy: $scope.payCancel.OptionsMistakeDoneBy,
            CancelRemark: $scope.payCancel.CancelRemark,
            originalReceipt: $scope.payCancel.originalReceipt,
            PayTransForm: $scope.payCancel.PayTransForm,
            NicCopy: $scope.payCancel.NicCopy,
            ReqLettercancelType: $scope.payCancel.ReqLetter,
            Canceltotal: $scope.payCancel.Canceltotal,
            CorrectEntrytotal: $scope.payCancel.CorrectEntrytotal,
            ConrefTransfer: $scope.payCancel.ConrefTransfer,
            cancelReceipts: $scope.dgGridCancelReceiptDetails.data(),
            adjesmentreceipts: $scope.dgGridCorrectEntryDetails.data(),
            IsBackOfficeUser: $scope.IsBackOfficeUser == true ? false : true,
            AttachedList: $scope.TransRef,
            outletType: $scope.userInfo().outletType,
            Email: $scope.payCancel.Email,
            TempAttachmentRef : $scope.TempAttachmentRef
        };
       
        PaymentCancellationService.SubmitCancellation($scope.formData).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                console.log(response, 'response.data');

                if (response.data.Result.apiOutput.isSameDayAllow) {

                    PinRequestDetails = response.data.Result.apiOutput;
                    $scope.PinRequestUsers = response.data.Result.apiOutput.ApprovalUsers;
                    $scope.payCancel.PinRequestUsers = "";
                    $scope.payCancel.WorkFlowId = response.data.Result.apiOutput.WorkFlowRef;
                    $scope.PinMessage = "";
                    $('#PinVerificationDetails').modal('show');

                    var res = response.data.Result.Result;
                    $scope.payCancel.BathId = res.split('~')[0];
                    $scope.payCancel.WorkflowReference = res.split('~')[1];
                    $scope.payCancel.status = res.split('~')[1] == "" ? "" : "Pending";
                    $scope.dgGridCancelReceiptDetails.data(response.data.Result.Result.CanCelReceipts);
                    $scope.dgGridCorrectEntryDetails.data(response.data.Result.Result.CorrectEntry);
                    $scope.disableGrid = true;
                } else {
                    var res = response.data.Result.Result;
                    $scope.payCancel.BathId = res.split('~')[0];
                    $scope.payCancel.WorkflowReference = res.split('~')[1];
                    $scope.payCancel.status = res.split('~')[1] == "" ? "" : "Pending";
                    $scope.dgGridCancelReceiptDetails.data(response.data.Result.Result.CanCelReceipts);
                    $scope.dgGridCorrectEntryDetails.data(response.data.Result.Result.CorrectEntry);
                    $scope.disableGrid = true;
                    toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
                }
               
            } else {

                toaster.warning({ type: 'warning', title: 'warning', body: response.data.Message, showCloseButton: true });
            }

        }, function (response) {
            toaster.error({ type: 'error', title: 'error', body: response.data.Message, showCloseButton: true });
        });

    }


    $scope.SendPinRequest = function () {
        $scope.payCancel.IsDisabledSendPIN = true;
        $scope.formData = {
            PinUserId: $scope.payCancel.PinRequestUsers,
            OutletId: PinRequestDetails.OutletCode,
            WfId: PinRequestDetails.WorkFlowRef,
            PinType: "NEW",
            WfReqUserId: PinRequestDetails.UserId

        };

        PaymentCancellationService.SendWFPin($scope.formData).then(function (response) {
            if (response.data.Code == 0) {
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });

                $scope.payCancel.IsDisabledVerifyPIN = false;
                $scope.payCancel.IsDisabledResend = false;
                return;
            } else {
                $scope.payCancel.IsDisabledSendPIN = false;
                toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
                return;
            }
        }, function (response) {
            $scope.payCancel.IsDisabledSendPIN = false;
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
            $scope.CancelReceiptReset($scope.payCancel);
            return;
        });
    };

    $scope.ReSendPinRequest = function () {
        $scope.payCancel.PinNo = "";
        $scope.formData = {
            PinUserId: $scope.payCancel.PinRequestUsers,
            OutletId: PinRequestDetails.OutletCode,
            WfId: PinRequestDetails.WorkFlowRef,
            PinType: "RESEND",
            WfReqUserId: PinRequestDetails.UserId

        };

        PaymentCancellationService.SendWFPin($scope.formData).then(function (response) {
            if (response.data.Code == 0) {
                toaster.success({ type: 'success', title: 'Success', body: "Pin Resend Sucuess", showCloseButton: true });
                return;
            } else {
                toaster.error({ type: 'error', title: 'error', body: response.data.Message, showCloseButton: true });
                return;
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'error', body: response.data.Message, showCloseButton: true });
            $scope.CancelReceiptReset($scope.payCancel);
            return;
        });
    };


    $scope.VerifyPinRequest = function () {
        $scope.payCancel.IsDisabledVerifyPIN = true;
        $scope.formData = {
            PinUserId: $scope.payCancel.PinRequestUsers,
            OutletId: PinRequestDetails.OutletCode,
            WfId: PinRequestDetails.WorkFlowRef,
            PIN: $scope.payCancel.PinNo,
            WfReqUserId: PinRequestDetails.UserId,
            ApprovalReference: ""

        };

        PaymentCancellationService.VerifyWFPin($scope.formData).then(function (response) {
            if (response.data.Code == 0) {
                $("#PinVerificationDetails").modal("hide");
                $scope.payCancel.status = "Cancelled";
                $scope.GetByBatchId();
                toaster.success({ type: 'success', title: 'Success', body: "PIN verification success. Receipt now will be cancelled", showCloseButton: true });
                return;
            } else {
                if (response.data.Result == "Rejected") {
                    $("#PinVerificationDetails").modal("hide");
                    toaster.warning({ type: 'warning', title: 'warning', body: response.data.Message, showCloseButton: true });
                    return;
                } else {
                    $scope.payCancel.IsDisabledVerifyPIN = false;
                    $scope.payCancel.PinNo = "";
                    toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    return;
                }

            }
        }, function (response) {
            $scope.payCancel.IsDisabledVerifyPIN = false;
            $scope.payCancel.PinNo = "";
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
            $scope.CancelReceiptReset($scope.payCancel);
            return;
        });
    };

    $scope.DiscardPinRequest = function () {
        $scope.formData = {
            AppRejComment: "",
            ApprovedStatus: "Rejected",
            CposReference: PinRequestDetails.WorkFlowRef,
            ApprovalReference: ""

        };

        PaymentCancellationService.DiscardPinRequest(PinRequestDetails.UserId, PinRequestDetails.OutletCode, $scope.formData).then(function (response) {
            if (response.data.Code == 0) {
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
                $("#PinVerificationDetails").modal("hide");
                $scope.GetByBatchId();
                return;
            } else {
                $scope.payCancel.PinNo = "";
                toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
                return;
            }
        }, function (response) {
            $scope.payCancel.PinNo = "";
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
            $scope.CancelReceiptReset($scope.payCancel);
            return;
        });
    };



    $scope.GetByBatchId = function () {

        if (!$scope.payCancel.BathId) {
            return;
        }
       
        PaymentCancellationService.GetByBatchId($scope.payCancel.BathId).then(function (response) {
            if (response.data.Code == MessageTypes.Success) {
                console.log(response, 'response.data');
                $scope.payCancel = response.data.Result;
                $scope.dgGridCancelReceiptDetails.data(response.data.Result.CancelReceiptGridData);
                $scope.dgGridCorrectEntryDetails.data(response.data.Result.adjesmentGridData);
                $scope.disableGrid = true;
                $scope.selectAll = true;
                $scope.selectAllCREntry = true;
                $scope.IsAttach = response.data.Result.IsAttached;
                var dataItems = $scope.dgGridCorrectEntryDetails.data();
                if (dataItems.length > 0) {
                    $scope.payCancel.ConrefTransfer = dataItems[0].ConnectionReference;
                }
               
                setTimeout(stopTimer, 1000);
                var dataItems = $scope.dgGridCorrectEntryDetails.data();
                $scope.payCancel.ConrefTransfer = '';
                var sum = 0;
                for (var i = 0; i < dataItems.length; i++) {

                    if (dataItems[i].IsSelected === true) {
                        if (sum == 0) {
                            $scope.payCancel.ConrefTransfer = dataItems[i].ConnectionReference;
                        }
                        sum = sum + dataItems[i].Amount;


                    }


                }
                $scope.payCancel.CorrectEntrytotal = Number(sum).toFixed(2);
            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }



        }, function (response) {
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }


    function stopTimer() {       
        $scope.selectThis();
        $scope.selectThisCREntry();
    }

    $scope.UpdateDateTime = function () {
        if ($scope.payCancel.BathId == undefined || $scope.payCancel.BathId == '') {
            $scope.currentDate = new Date();
            $scope.payCancel.time = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss a'); 
        }
    }


}]);