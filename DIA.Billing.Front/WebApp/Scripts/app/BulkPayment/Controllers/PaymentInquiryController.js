angular.module("DialogBilling").controller('PaymentInquiryController', ["$scope", "Page", "$routeParams", "$filter", "BulkPaymentService", "PaymentInqueryService", "toaster", "AuthService", "PrintService", "appConfig", function ($scope, Page, $routeParams, $filter, BulkPaymentService, PaymentInqueryService, toaster, AuthService, PrintService, appConfig) {
    //Set Page Title
    Page.setTitle("Payment Inquiry");

    var Initializer = {};
    $scope.payInquery = {};
    $scope.Initializer = Initializer;
    $scope.ReceiptList = [];
    localStorage.setItem('CancelReceipts', null);
    var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
    

    $scope.InitDatePickers = InitDatePickers;

    function InitDatePickers(idFromDP, idToDP) {

        var fromDP = new DatePicker(),
            toDP = new DatePicker();

        fromDP.Init(idFromDP, true);
        fromDP.setOptions({
            change: function (e) {
                toDP.setOptions({
                    min: fromDP.value()
                });
            }
        });

        toDP.Init(idToDP, true);
        toDP.setOptions({
            change: function (e) {
                fromDP.setOptions({
                    max: toDP.value()
                });
            }
        });
    };

    //####################################   Finder Payment Inquiry  #################

    $scope.PaymentInquiryID = {};

    $scope.CancelbuttonDisabled = false;


    var permissionCodes = AuthService.getProfile().permission;

    if (permissionCodes.indexOf("41001") == -1) {
        $scope.IsBackOfficeUser = false;
    } else {
        $scope.IsBackOfficeUser = true;
    }

    if (permissionCodes.indexOf("20004") != -1) {
        $scope.CancelbuttonDisabled = false;
    }

    // Search By ReceiptUser

    //$scope.PaymentInquiryID =
    //{

    //    title: "Search by Receipt User",
    //    info: {
    //        // appId: "ZBC-DCPOS",
    //        // uiId: "POS-FLOAT-FLOATMSTER",
    //        //  mapId: "FLOAT-TRANSFER-FLOATMSTER",
    //        modalId: "PaymentInquiryID",
    //        onLoad: false

    //    },
    //    params: [],
    //    callback: function (data) {

    //    },
    //    open: function () {
    //        this.info.onLoad = true;

    //        //$scope.alertMessage = new Message(MessageTypes.Empty, '');
    //        $("#" + this.info.modalId).modal('show');

    //    }
    //};


    //  #########################

    var BillingSystemSample = [];

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations

    //////////====================== Search In Billing System   ===================

    var configBillingSystem = {};
    var configBillingSystem = {
        columns: [      
                    {
                        field: "IsSelected",
                       
                        headerTemplate: '<input type="checkbox" title="Select all" ng-model="selectAll" ng-click="toggleSelect($event)" />',
                        template: '<input type="checkbox" ng-disabled="dataItem.CancelbuttonDisabled" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
                        width: "32px",

                    },
                    // permission-code="50202" 
                      {
                          field: "Cancel",
                          headerTemplate: 'Cancel',
                          template: '<div>' +
                          '<button type="button" ng-disabled="dataItem.CancelbuttonDisabled" class="btn btn-xs btn-danger" ng-click="cancelReceipt(this)" title="Cancel"><i class="glyphicon glyphicon-remove"></i></button> ' +
                          '</div>',
                          locked: false,
                          width: "60px"
                      },
                      //permission-code="50203"
                    {
                        field: "Transfer",
                        headerTemplate: 'Transfer',
                        template: '<div>' +
                        '<button   type="button" ng-disabled="dataItem.IsTransfer" class="btn btn-xs btn-info" ng-click="paymentTransfer(this)" title="Transfer"><i class="glyphicon glyphicon-arrow-right"></i></button> ' +
                        '</div>',
                        locked: false,
                        width: "65px"
                    },
                    //  permission-code="50200"
                    {
                        field: "Print",
                        headerTemplate: 'Print',
                        template: '<div>' +
                        '<button  type="button" class="btn btn-xs btn-primary" ng-click="printReceipt(this)" title="Print"><i class="icon icon_printer"></i></button> ' +
                        '</div>',
                        locked: false,
                         width: "50px"
                    },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "150px", locked: false },
                    { field: "ReceiptStatus", title: "Receipt Status", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                   
                    { field: "ReferenceNo", title: "Reference No", width: "100px" },
                    {
                        field: "ConnectionReference",
                        title: 'Contract No',
                       // template: '<input type ="text"    class="k-fill "/>',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount",
                        
                       // template: '<input type ="text"  kendo-numeric-text-box class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "100px"
                    },
                    { field: "PaymentMode", title: "Payment Mode", width: "100px" },
                    { field: "PaymentMethod", title: "Payment Method", width: "100px" },
                    { field: "PaymentSource", title: "Payment Source", width: "100px" },
                   
                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" },
                    { field: "CancellationReason", title: "Cancellation Reason", width: "100px" },
                    { field: "CancelledDate", title: "Cancelled Date", width: "100px" },
                    { field: "CancelledUser", title: "Cancelled User", width: "100px" },
                    
                    { field: "TransferredTo", title: "Transferred To", width: "100px" },
                    { field: "ReversalType", title: "Reversal Type", width: "100px" },
                   

        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configBillingSystem.dataSource = new kendo.data.DataSource({
        data: [BillingSystemSample],
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
                    'Amount': { editable: false, type: "number" },

                    'PaymentMode': { editable: false, type: "string" },
                    'PaymentMethod': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },
                    
                    'ReceiptGeneratedUser': { editable: false, type: "string" },
                    'CancellationReason': { editable: false, type: "string" },
                    'CancelledDate': { editable: false, type: "date" },
                    'CancelledUser': { editable: false, type: "string" },

                    'TransferredTo': { editable: false, type: "string" },
                    'ReversalType': { editable: false, type: "string" },

                    'Cancel': { editable: false, type: "string" },
                    'Transfer': { editable: false, type: "string" },
                    'Print': { editable: false, type: "string" },
                    'ProdCat': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10

    });

    $scope.printReceipt = function (obj) {
        if (appConfig.IsPostpaidCloud == "1") {
            var Cheque = "CHE";
            var CC = "CC";
            if( obj.dataItem.PaymentMode=="CHE"){
                Cheque = obj.dataItem.CcNo;
            }
            if( obj.dataItem.PaymentMode=="CC"){
                CC = obj.dataItem.ChequeNO;
            }
            var Cancel = 1;
            if (obj.dataItem.ReceiptStatus) {
                Cancel=0
            }
            $scope.formData = {

                ConnectionRef: obj.dataItem.ConnectionReference,
                CustmoerName: "",
                ReceiptNo: obj.dataItem.ReceiptNumber,
                ReceiptDate: obj.dataItem.ReceiptDate,
                Amount: obj.dataItem.Amount,
                PaymentMode: obj.dataItem.PaymentMode,
                UserId: $scope.userInfo().userId,
                Sbu: obj.dataItem.SbuCode,
                ChequeNO: obj.dataItem.ChequeNO,
                CC: obj.dataItem.CcNo,
                Cancel: obj.dataItem.ReceiptStatus
            };
            window.open(appConfig.POSTPAID_MODULE_URL + "/GetInquiryReceipt/" + obj.dataItem.ConnectionReference + "/" +
                obj.dataItem.ReceiptNumber + "/" + obj.dataItem.PaymentMode + "/" + $scope.userInfo().userId + "/" + obj.dataItem.SbuCode + "/" + Cheque + "/" + CC + "/" + Cancel
                + "/" + obj.dataItem.Amount + "/" + obj.dataItem.ReceiptDate);
        }
        else {
           

            PrintService.OpenPrint('POST',
                  appConfig.REPORT_URL + 'ReportViewer.aspx',
                  {
                      ConnectionRef: obj.dataItem.ConnectionReference,
                      CustmoerName: "",
                      ReceiptNo: obj.dataItem.ReceiptNumber,
                      ReceiptDate: obj.dataItem.ReceiptDate,
                      Amount: obj.dataItem.Amount,
                      PaymentMode: obj.dataItem.PaymentMode,
                      type: "PaymentInquiry",
                      PrintUserId: $scope.userInfo().userId,
                      SBU: obj.dataItem.SbuCode,
                      ChequeNO: obj.dataItem.ChequeNO,
                      CcNo: obj.dataItem.CcNo,
                      ReceiptStatus: obj.dataItem.ReceiptStatus
                  }, '_blank');
        }
   };


    //////////====================== Search In PE Grid   ===================

    var configPESearch = {};
    var configPESearch = {
        columns: [
                   
                    { field: "ReceiptStatus", title: "Receipt Status", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "100px", locked: true },
                    { field: "ReferenceNo", title: "Reference No", width: "100px" },
                    {
                        field: "ConnectionReference",
                        title: 'Contract No',
                        // template: '<input type ="text"    class="k-fill "/>',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount",
                      
                        // template: '<input type ="text"  kendo-numeric-text-box class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "100px"
                    },
                    { field: "PaymentMode", title: "Payment Mode", width: "100px" },
                    { field: "PaymentMethod", title: "Payment Method", width: "100px" },
                    { field: "PaymentSource", title: "Payment Source", width: "100px" },

                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" },
                    { field: "CancellationReason", title: "Cancellation Reason", width: "100px" },
                    { field: "CancelledDate", title: "Cancelled Date", width: "100px" },
                    { field: "CancelledUser", title: "Cancelled User", width: "100px" },
                    { field: "ErrorCode", title: "Error Code", width: "100px" },
                    { field: "ErrorDescription", title: "Error Description", width: "100px" },
                    { field: "LastAttemptedDateAndTime", title: "Last Attempted Date & Time", width: "130px" }
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configPESearch.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                   
                    'ReceiptStatus': { editable: false, type: "string" },
                    'PrePost': { editable: false, type: "string" },
                    'SBU': { editable: false, type: "string" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptNumber': { editable: false, type: "number" },
                    'ReferenceNo': { editable: false, type: "number" },
                    'ConnectionReference': { editable: true, type: "number" },
                    'Amount': { editable: false, type: "number" },

                    'PaymentMode': { editable: false, type: "string" },
                    'PaymentMethod': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },

                    'ReceiptGeneratedUser': { editable: false, type: "string" },
                    'CancellationReason': { editable: false, type: "string" },
                    'CancelledDate': { editable: false, type: "date" },
                    'CancelledUser': { editable: false, type: "string" },
                    'ErrorCode': { editable: false, type: "string" },
                    'ErrorDescription': { editable: false, type: "string" },
                    'LastAttemptedDateAndTime': { editable: false, type: "date" }

                }
            }
        },
        pageSize: 10

    });

    //////////====================== Search In CPOS Grid   ===================

    var configCPOSSearch = {};
    var configCPOSSearch = {
        columns: [

                    { field: "ReceiptStatus", title: "Receipt Status", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "150px", locked: true },
                    { field: "ReferenceNo", title: "Reference No", width: "100px" },
                    {
                        field: "ConnectionReference",
                        title: 'Contract No',
                        // template: '<input type ="text"    class="k-fill "/>',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount",
                   
                        // template: '<input type ="text"  kendo-numeric-text-box class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "100px"
                    },
                    { field: "PaymentMode", title: "Payment Mode", width: "100px" },
                    { field: "PaymentMethod", title: "Payment Method", width: "100px" },
                    { field: "PaymentSource", title: "Payment Source", width: "100px" },

                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" },
                    { field: "CancellationReason", title: "Cancellation Reason", width: "100px" },
                    { field: "CancelledDate", title: "Cancelled Date", width: "100px" },
                    { field: "CancelledUser", title: "Cancelled User", width: "100px" },
                    { field: "ErrorCode", title: "Error Code", width: "100px" },
                    { field: "ErrorDescription", title: "Error Description", width: "100px" },
                    { field: "LastAttemptedDateAndTime", title: "Last Attempted Date & Time", width: "130px" }
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configCPOSSearch.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {

                    'ReceiptStatus': { editable: false, type: "string" },
                    'PrePost': { editable: false, type: "string" },
                    'SBU': { editable: false, type: "string" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptNumber': { editable: false, type: "number" },
                    'ReferenceNo': { editable: false, type: "number" },
                    'ConnectionReference': { editable: true, type: "number" },
                    'Amount': { editable: false, type: "number" },

                    'PaymentMode': { editable: false, type: "string" },
                    'PaymentMethod': { editable: false, type: "string" },
                    'PaymentSource': { editable: false, type: "string" },

                    'ReceiptGeneratedUser': { editable: false, type: "string" },
                    'CancellationReason': { editable: false, type: "string" },
                    'CancelledDate': { editable: false, type: "date" },
                    'CancelledUser': { editable: false, type: "string" },
                    'ErrorCode': { editable: false, type: "string" },
                    'ErrorDescription': { editable: false, type: "string" },
                    'LastAttemptedDateAndTime': { editable: false, type: "date" }
                }
            }
        },
        pageSize: 10

    });



    /////////==================================================================
    $scope.dgGridBillingSystem = new DataGrid();
    $scope.dgGridBillingSystem.options(configBillingSystem);

    $scope.dgGridPESearch = new DataGrid();
    $scope.dgGridPESearch.options(configPESearch);

    $scope.dgGridCPOSSearch = new DataGrid();
    $scope.dgGridCPOSSearch.options(configCPOSSearch);


    $scope.Init1 = function (arg) {
        $scope.dgGridBillingSystem.Init(arg);
    };

    $scope.Init2 = function (arg) {
        $scope.dgGridPESearch.Init(arg);
    };

    $scope.Init3 = function (arg) {
        $scope.dgGridCPOSSearch.Init(arg);
    };

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


   

    $scope.toggleSelect = function (e) {
        var dataItems = $scope.dgGridBillingSystem.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        }
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

    // page load 

    $scope.PageLoad = function () {
        //var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        ////if (defaultDataCookieObj == null) {
        PaymentInqueryService.GetDefaultData($scope.userInfo().outletType).then(function (response) {
               
                if (response.data.Code == "0") {
                   

                    $scope.PaymentTypeCollection = response.data.Result.BillingPaymentType;
                    $scope.SbuCollection = response.data.Result.BillingSbu;
                    $scope.PaymentSourceCollection = response.data.Result.BillingPaymentSource;
                    $scope.PaymentMethodCollection = response.data.Result.BillingPaymentMethods;
                    $scope.PaymentModeCollection = response.data.Result.BillingPaymentMode;
                    $scope.ProductCatCollection = response.data.Result.BillingProdCat;
                    $scope.BillingSusAcc = response.data.Result.BillingSusAcc;

                    localStorage.setItem("BulkPaymentDefaultData", JSON.stringify(response.data.Result));


                } else {
                    //$scope.alertMessage = new Message(response.data.Code, response.data.Message);
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
               toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });


        ////} else {
        ////    $scope.BillingSusAcc = defaultDataCookieObj.BillingSusAcc;
        ////    $scope.PaymentTypeCollection = defaultDataCookieObj.BillingPaymentType;
        ////    $scope.SbuCollection = defaultDataCookieObj.BillingSbu;
        ////    $scope.PaymentSourceCollection = defaultDataCookieObj.BillingPaymentSource;
        ////    $scope.PaymentMethodCollection = defaultDataCookieObj.BillingPaymentMethods;
        ////    $scope.PaymentModeCollection = defaultDataCookieObj.BillingPaymentMode;
        ////    $scope.ProductCatCollection = defaultDataCookieObj.BillingProdCat;
        ////}

        //$scope.BillingSusAcc.unshift({ Id: "0", Description: "All" });
        //$scope.PaymentTypeCollection.unshift({ Id: "0", Description: "All" });
        //$scope.SbuCollection.unshift({ Id: "0", Description: "All" });
        //$scope.PaymentSourceCollection.unshift({ Id: "0", Description: "All" });
        //$scope.PaymentMethodCollection.unshift({ Id: "0", Description: "All" });
        //$scope.PaymentModeCollection.unshift({ Id: "0", Description: "All" });
        //$scope.ProductCatCollection.unshift({ Id: "0", Description: "All" });
    }

   
    $scope.PageLoad();

// Created by Charith 2018-05-02
       //$scope.SearchInBillingSys = function () {

       // var receiptNo = $scope.payInquery.receiptNo;
       // var ProdCat = $scope.payInquery.ProdCat;
       // var PaymentSource = $scope.payInquery.PaymentSource;
       // var PaymentMethod = $scope.payInquery.PaymentMethod;
       // var fromDate = $scope.payInquery.fromDate;
	   // var ChequeNO = $scope.payInquery.chequeNo;


       // if (receiptNo != null) {
       //     {
       //         $scope.SearchInBillingSystems();
       //     }
       // } else {
       //     if (PaymentMethod != 0) {
       //         $scope.SearchInBillingSystems();
       //     } else {
       //         if (fromDate != null) {
       //             $scope.SearchInBillingSystems();
       //         } else {
       //             if(ChequeNO != null){
       //                  $scope.SearchInBillingSystems();
       //             }else{
       //                   toaster.error({ type: 'error', title: 'Error', body: 'Please select correct search combination', showCloseButton: true });
       //             }
       //         }
       //     }
       // }

       //}

       $scope.SearchInBillingSys = function () {

           var receiptNo = $scope.payInquery.receiptNo;
           var ProdCat = $scope.payInquery.ProdCat;
           var PaymentSource = $scope.payInquery.PaymentSource;
           var PaymentMethod = $scope.payInquery.PaymentMethod;
           var fromDate = $scope.payInquery.fromDate;
           var ChequeNO = $scope.payInquery.chequeNo;


           if (receiptNo != null) {
               {
                   $scope.SearchInBillingSystems();
               }
           } else {
               if (PaymentMethod != 0) {
                   $scope.SearchInBillingSystems();
               } else {
                   if (fromDate != null) {
                       $scope.SearchInBillingSystems();
                   } else {
                       if (ChequeNO != null) {
                           $scope.SearchInBillingSystems();
                       } else {
                           toaster.error({ type: 'error', title: 'Error', body: 'Please select correct search combination', showCloseButton: true });
                       }
                   }
               }
           }

       }


    $scope.SearchInBillingSystems = function () {

            PaymentInqueryService.SearchInBillingSys($scope.payInquery).then(function (response) {
                var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

                console.log(response, MessageTypes.Success);

                if (response.data.Code == MessageTypes.Success) {

                    //angular.forEach(response.data.Result.gridData, function (item) {
                    //    item.PaymentMethodId = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Description: item.PaymentMethod })[0].Id : "";
                    //    item.PaymentSourceId = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Description: item.PaymentSource })[0].Id : "";
                    //});

                    $scope.dgGridBillingSystem.data(response.data.Result.gridData);

                    if (response.data.Result.gridData.length == 0) {
                        toaster.info({ type: 'info', title: 'info', body: response.data.Message, showCloseButton: true });
                    } else {
                        toaster.success({ type: 'Success', title: 'Success', body: response.data.Message, showCloseButton: true });
                    }

                    var dGrid = $scope.dgGridBillingSystem.data();

                    angular.forEach(dGrid, function (row) {
                        if ((row.ReceiptStatus == "Cancelled") || !$scope.IsBackOfficeUser) {
                            row.CancelbuttonDisabled = true;
                        } else {
                            row.CancelbuttonDisabled = false;
                        }

                        if (response.data.Result.IsSameDayTransfer < 1 || row.ReceiptStatus == "Cancelled") {
                            row.IsTransfer = true;
                        } else {
                            row.IsTransfer = false;
                        }

                    });

                } else {

                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });              
    };




    $scope.SearchInPE = function () {


        PaymentInqueryService.SearchInPE($scope.payInquery).then(function (response) {

            console.log(response, MessageTypes.Success);

            if (response.data.Code == MessageTypes.Success) {

                $scope.dgGridPESearch.data(response.data.Result.gridData);

                if (response.data.Result.gridData.length == 0) {
                    toaster.info({ type: 'info', title: 'info', body: response.data.Message, showCloseButton: true });
                } else {
                    toaster.success({ type: 'Success', title: 'Success', body: response.data.Message, showCloseButton: true });
                }

            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };




    $scope.SearchInCpos = function () {


        PaymentInqueryService.SearchInCpos($scope.payInquery).then(function (response) {
           
            if (response.data.Code == MessageTypes.Success) {

                $scope.dgGridCPOSSearch.data(response.data.Result.gridData);

                if (response.data.Result.gridData.length==0) {
                    toaster.info({ type: 'info', title: 'info', body: response.data.Message, showCloseButton: true });
                } else {
                    toaster.success({ type: 'Success', title: 'Success', body: response.data.Message, showCloseButton: true });
                }
                

            } else {

                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };



    $scope.cancelReceipt = function (e) {
        if (permissionCodes.indexOf("50202") == -1) {
            toaster.error({ type: 'error', title: 'Error', body: 'You have not enough permission to continue.!', showCloseButton: true });
            return;
        } else {
            
        }
        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridBillingSystem.findByGuid(guId);
        var dataItems = $scope.dgGridBillingSystem.data();
        var row = dataItems[selectRow];

        
        $scope.ReceiptList.push({
            IsSelected: true,
            ReceiptStatus: row.ReceiptStatus,
            PrePost: row.PrePost,
            SBU: row.SBU,
            SbuCode: row.SbuCode,
            ReceiptDate: row.ReceiptDate,
            ReceiptNumber: row.ReceiptNumber,
            ReferenceNo: row.ReferenceNo,
            ConnectionReference: '',//row.ConnectionReference,
            ContractNo: row.ConnectionReference,
            Amount: row.Amount,
            PaymentMode: row.PaymentMode,
            PaymentMethod: row.PaymentMethod,
            PaymentSource: row.PaymentSource,
            ReceiptGeneratedUser: row.ReceiptGeneratedUser,
            PaymentModeId: row.PaymentModeId == "" ? row.PaymentMode : row.PaymentModeId,
            PaymentMethodId: row.PaymentMethodId,
            PaymentSourceId: row.PaymentSourceId,
            PaymentSeq: row.PaymentSeq,
            ProdCat: row.ProdCat
        });

        $scope.recObj = {
            'BatchId': '',//$scope.BulkPayment.BatchId,
            'BatchDate': '',//$scope.BulkPayment.DateTime,
            'TotalAmt': 0,//row.Amount,
            'RecCollection': $scope.ReceiptList
        };
        
        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentCancellation";
      
    };
    


    $scope.BulkCanCellation = function () {
        var count = 0;
        var dataItems = $scope.dgGridBillingSystem.data();

        angular.forEach(dataItems, function (item) {

            if (item.IsSelected) {
                
                count = count + 1;
                $scope.ReceiptList.push({
                    IsSelected: true,
                    ReceiptStatus: item.ReceiptStatus,
                    PrePost: item.PrePost,
                    SBU: item.SBU,
                    SbuCode: item.SbuCode,
                    ReceiptDate: item.ReceiptDate,
                    ReceiptNumber: item.ReceiptNumber,
                    ReferenceNo: item.ReferenceNo,
                    ConnectionReference: item.ConnectionReference,
                    ContractNo: item.ConnectionReference,
                    Amount: item.Amount,
                    PaymentMode: item.PaymentMode,
                    PaymentMethod: item.PaymentMethod,
                    PaymentSource: item.PaymentSource,
                    ReceiptGeneratedUser: item.ReceiptGeneratedUser,
                    PaymentModeId: item.PaymentMode,
                    PaymentMethodId: item.PaymentMethodId,
                    PaymentSourceId: item.PaymentSourceId,
                    PaymentSeq: item.PaymentSeq,
                    ProdCat: item.ProdCat
                });

            }
        });

        if (count == 0) {
            toaster.error({ type: 'error', title: 'Error', body: 'Please select receipts to proceed', showCloseButton: true });
            return;
        }

        $scope.recObj = {
            'BatchId': '',//$scope.BulkPayment.BatchId,
            'BatchDate': '',//$scope.BulkPayment.DateTime,
            'TotalAmt': 0,//row.Amount,
            'RecCollection': $scope.ReceiptList
        };

        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentCancellation";
       
    };


    $scope.paymentTransfer = function (e) {
        if (permissionCodes.indexOf("50203") == -1) {
            toaster.error({ type: 'error', title: 'Error', body: 'You have not enough permission to continue.!', showCloseButton: true });
            return;
        } else {
            
        }
        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridBillingSystem.findByGuid(guId);
        var dataItems = $scope.dgGridBillingSystem.data();
        var row = dataItems[selectRow];

        $scope.paymentSourceId = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource,
                { CcbsPaymentSource: row.PaymentSourceId })[0].Id : "";

        $scope.paymentMethodId = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods,
            { SapCode: row.PaymentMethodId })[0].Id : "";


        //$scope.paymentTypeId =
            //defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType,
            //   { Id: a })[0].Description : "";


        $scope.paymentSourceDescription = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource,
            { CcbsPaymentSource: row.PaymentSourceId })[0].Description : "";

        $scope.paymentMethodDescription = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods,
            { SapCode: row.PaymentMethodId })[0].Description : "";
      

        for (var i = 0; i < defaultDataCookieObj.BillingPaymentType.length; i++) {

            if (defaultDataCookieObj.BillingPaymentType[i].Id == row.PaymentTypeId) {
                $scope.paymentTypeDescription = defaultDataCookieObj.BillingPaymentType[i].Description;
                break;
            }
        }

        //$scope.paymentTypeDescription = defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType,
        //        { Id: row.PaymentTypeId })[0].Description : "";


        $scope.ReceiptList.push({
            IsSelected: true,
            ReceiptStatus: row.ReceiptStatus,
            PrePost: row.PrePost,
            SBU: row.SBU,
            SbuCode: row.SbuCode,
            ReceiptDate: row.ReceiptDate,
            ReceiptNumber: row.ReceiptNumber,
            ReferenceNo: row.ReferenceNo,
            ConnectionReference: '',//row.ConnectionReference,
            ContractNo: row.ConnectionReference,
            Amount: row.Amount,
            PaymentMode: row.PaymentMode,
            PaymentMethod: $scope.paymentMethodDescription,
            PaymentSource: $scope.paymentSourceDescription,
            ReceiptGeneratedUser: row.ReceiptGeneratedUser,
            PaymentModeId: row.PaymentModeId == "" ? row.PaymentMode : row.PaymentModeId,
            PaymentMethodId: $scope.paymentMethodId,
            PaymentSourceId: $scope.paymentSourceId,
            PaymentSeq: row.PaymentSeq,
            PaymentTypeId: row.PaymentTypeId,
            PaymentType: $scope.paymentTypeDescription,
            ProductTypeId: row.ProductTypeId,
            ProdCat: row.ProdCat
        });

        $scope.recObj = {
            'BatchId': '',//$scope.BulkPayment.BatchId,
            'BatchDate': '',//$scope.BulkPayment.DateTime,
            'TotalAmt': 0,//row.Amount,
            'RecCollection': $scope.ReceiptList
        };

        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentTransfer";

    };
}]);