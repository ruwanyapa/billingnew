angular.module("DialogBilling").controller('BulkPaymentController', ["$scope", '$interval', "Page", "$cookies", "BulkPaymentService", "$routeParams", "$filter", "toaster", "AuthService", "PrintService", 'appConfig', '$window', 'ReceiptPrintingService', 'DirectPrintService', '$timeout', 'appPrintingConfig', function ($scope, $interval, Page, $cookieStore, BulkPaymentService, $routeParams, $filter, toaster, AuthService, PrintService, appConfig, $window, ReceiptPrintingService, DirectPrintService, $timeout, appPrintingConfig) {
    //Set Page Title
    Page.setTitle("Bulk Payment");

    //$scope.message = 'Displays the Bulk Payment forms here.';

    //@@@@@@@@@@@@@@@@@@@@@@@@@@


    //-> Grid Sample data for demo purposes
    $scope.BulkPayment = {};
    $scope.RandomBillPaymentObjectCollection = [];
    $scope.BulkExcelPaymentObjectCollection = [];
    $scope.AccountType = "";
    $scope.IsRetrivedCrmDetails = true;
    $scope.IsRetrivedCrmDetailsBulk = true;
    $scope.IsLoadingAtFirstTime = true;
    $scope.ReceiptList = [];
    $scope.PaymentMethodDrop = false;
    $scope.PaymentTypeDrop = false;
    $scope.PaymentSourceDrop = false;
    $scope.PaymentBu = false;
    $scope.PaymentProdCatDrop = false;
    $scope.PaymentGridSelectAll = false;
    $scope.IsSIMDisabled = false;

    $scope.disabled = {};
    //$scope.BulkPayment.UploadBtn = false;
    $scope.TransRef = "";
    $scope.result = {};
    $scope.LastRetrivedBatchId = "";
    var objTemp = new Array();
    $scope.RowsId = 0;
    var a = 0;
    var RandomBillPaymentObject = function () {
        this.ConnectionReference = '',
        this.ContractNumber = '',
        this.Amount = '',
        this.ReferenceNumber = ''
    }

    var billingData = function () {
        this.IsSelected = '';
        this.SBU = '';
        this.SBUId = '';
        this.PrePost = '';
        this.Hybrid = '';
        this.ProductType = '';
        this.ContactNo = '';
        this.ConnectionReference = '';
        this.ContractNumber = '';
        this.CustomerName = '';
        this.CustomerIDType = '';
        this.Amount = '';
        this.DisconnectedCode = '';
        this.SwitchStatus = false;
        this.OCSStatus = false;
        this.TotalOutstanding = 0;
        this.BalanceAsAt = '';
        this.LastMonthBillAmount = '';
        this.MinReconFee = '';
        this.DTVReconFee = '';
        this.DisconnectedReason = '';
        this.ReferenceNumber = '';
        this.Remarks = '';
        this.PaymentMethod = '';
        this.BillingCycle = '';
        this.PRCode = '';
        this.PREmail = '';
        this.ContractEmail = '';
        this.CustomerIDNumber = '';
        this.OldNIC = '';
        this.IsValiedAccount = '';
        this.AccountNo = '';
        this.IsSuspend = '';
        this.IsCancel = false;
        this.IsTransfer = false;
        this.IsValiedAccount = false;
        this.IsRetrivedCrmDetails = true;
        this.IsEmailExists = false;
    }
    var permissionCodes = AuthService.getProfile().permission;
    if (permissionCodes.indexOf("41001") == -1) {
        $scope.IsBackOfficeUser = false;
    } else {
        $scope.IsBackOfficeUser = true;
    }

    var receiptSample = [
      // { ID: '002', ReceiptNo: '001', CustomerName: '002', CustomerIDType: '002', CustomerIDNumber: '002', SBU: '002', Amount: '002', PreviewPrint: '002', Email: '002', ReceiptStatus: '001', PostingStatus: 'yes' }

    ];

    var bulkEntrySample = [
       {
           row: true
           //ID: '002', IsSelected: 'a', BillInvoiceNumber: '001', SBU: '001', AccountType: '002', ConnectionReference: '002', ContractNumber: '002', CustomerName: '002', Amount: '002', CustomerIDType: '002', DisconnectedCode: '002', DisconnectedReason: 'yes',
           //DisconnectedReason: 'yes', DisconnectedReason: 'yes', DisconnectedReason: 'yes', SwitchStatus: 'yes', OCSStatus: 'yes',
           //TotalOutstanding: 'yes', BalanceAsAt: 'yes', LastMonthBillAmount: 'yes',
           //ReconFee: 'yes', DTVReconFee: 'yes', ReferenceNumber: 'yes',
           //ReferenceNumber: 'yes', Remarks: 'yes', PRCode: 'yes',
           //PREmail: 'yes', ContractEmail: 'yes', PaymentMethod: 'yes',
           //PaymentMode: 'yes', RBM: 'yes', OCS: 'yes', CRM: 'yes', ADFRemarks: 'yes'
       }
    ];

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations
    var configReceiptDetails = {};
    var configReceiptDetails = {
        columns: [
                    { field: "ID", title: "No", width: "32px" },
                    {
                        field: "IsSelected", headerTemplate: '<input type="checkbox"  ng-disabled = "IsSelectedTempDisabled" title="Select all" ng-click="toggleSelect1($event)" ng-model="IsSelectedAll"/>', template: '<input type="checkbox" ng-click="selectThis1($event)" ng-model="dataItem.IsSelected" ng-disabled = "dataItem.IsSelectedRowDisabled"/>', width: "32px"
                    },
                      {
                          field: "PostingStatus",
                          headerTemplate: 'Posting Status',
                          template: '<button class="btn btn-warning btn-sm" type="button" ng-click="OpenPostingStatus(this)"><i class="glyphicon glyphicon-check"></i></button>',
                          width: "80px"
                      },
                      //permission-code="550104" 
                    {
                        field: "Cancel",
                        headerTemplate: 'Cancel',
                        template: '<button  class="btn btn-danger btn-sm" type="button" ng-disabled = "dataItem.IsCancel" ng-click="CancelSingleReceipt(this)"><i class="glyphicon glyphicon-remove"></i></button>',
                        width: "60px"
                    },
                    //permission-code=\'"550105\'" 
                    {
                        field: "Transfer",
                        headerTemplate: 'Transfer',
                        template: '<button class="btn btn-info btn-sm" type="button"  ng-disabled = "dataItem.IsTransfer" ng-click="Transfer(this)"><i class="glyphicon glyphicon-arrow-right"></i></button>',
                        width: "60px"
                    },
                    {
                        field: "PreviewPrint",
                        headerTemplate: 'Print',
                        template: '<button  class="btn btn-primary btn-sm" type="button"  ng-click="PrintReceipts(this,2)"><i class="icon icon_printer"></i></button>',
                        width: "60px"
                    },
                    {
                        field: "Email",
                        headerTemplate: 'Email',
                        template: '<button class="btn btn-success btn-sm" type="button"  ng-disabled="!dataItem.IsEmailExists"  ng-click="PrintReceipts(this,1)" ><i class="icon icon_mail"></i></button>',
                        width: "60px"
                    },
                    //{ field: "BatchId", title: "Batch Id" },
                    { field: "ReceiptNo", title: "Receipt No", width: "140px" },
                    { field: "ConnectionReference", title: "Connection Reference", width: "100px" },
                    { field: "ContactNo", title: "Contact No", width: "100px" },
                    { field: "PrePostDesc", title: "Pre/Post", width: "100px" },
                    { field: "SBUDesc", title: "BU", width: "90px" },
                    { field: "CustomerName", title: "Customer Name", width: "120px" },
                    { field: "Amount", title: "Paid Amount", template: "{{dataItem.Amount|currency:''}}", width: "80px" },
                    { field: "TotalOutstanding", title: "Tot Outs", width: "100px" },
                    { field: "BalanceAsAt", title: "Balance As At", width: "100px" },
                    { field: "ReconFee", title: "Min Recon Fee", width: "100px" },
                    { field: "ReceiptStatus", title: "Receipt Status", width: "100px" },
                    { field: "ReferenceNumber", title: "Reference Number", width: "100px" }
                    
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: false,
        scrollable: true

    };

    configReceiptDetails.dataSource = new kendo.data.DataSource({
        data: [receiptSample],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'ID': { editable: false, type: "string" },
                    'IsSelected': { editable: false, type: "boolean" },
                    'ReceiptNo': { editable: false, type: "string" },
                    'ReferenceNumber': { editable: false, type: "string" },
                    'ConnectionReference': { editable: false, type: "string" },
                    'ContactNo': { editable: false, type: "string" },
                    'PrePostDesc': { editable: false, type: "string" },
                    'SBUDesc': { editable: false, type: "string" },
                    'CustomerName': { editable: false, type: "string" },
                    'Amount': { editable: false, type: "number" },
                    'TotalOutstanding': { editable: false, type: "number" },
                    'BalanceAsAt': { editable: false, type: "string" },
                    'ReconFee': { editable: false, type: "string" },
                    'ReceiptStatus': { editable: false, type: "boolean" },
                    'SBU': { editable: false, type: "number" },
                    'PrePost': { editable: false, type: "string" },
                    'PREmail': { editable: false, type: "string" },
                    'ContractEmail': { editable: false, type: "string" },
                    'PaymentMethod': { editable: false, type: "number" },
                    'Cancel': { editable: false, type: "number" },
                    'ProductType': { editable: false, type: "number" },
                    'CustomerIDType': { editable: false, type: "string" },
                    'CustRef': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10

    });


    var configBulkPayment = {};
    var configBulkPayment = {
         columns: [
                    { field: "RowId", title: "No", width: "32px" },
                    {
                        field: "IsSelected", headerTemplate: '<input type="checkbox" ng-disabled="PaymentGridSelectAll" title="Select all" ng-click="toggleSelect($event)" ng-model="IsSelectedAll"/>', template: '<input type="checkbox" ng-click="selectThis($event)" ng-model="dataItem.IsSelected" ng-disabled="dataItem.row"/>', width: "32px"
                    },
                    
                      {
                          field: "Other",
                          headerTemplate: '',
                          headerAttributes: {
                              "class": "table-header",
                          },
                          template: '<button ng-click="CreatePEObjectToValidateSingle(this)" ng-disabled="dataItem.IsRetrivedCrmDetails" class="btn btn-warning btn-sm" type="button">Other</button>',
                          width: "65px"
                      },
                    {
                        field: "RBM",
                        headerTemplate: '',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<button ng-click="CreateRBMObjectToValidateSingle(this)" ng-disabled="dataItem.IsRetrivedCrmDetails" class="btn btn-danger btn-sm" type="button">RBM</button>',
                        width: "65px"
                    },
                    {
                        field: "OCS",
                        headerTemplate: '',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<button ng-click="CreateOCSObjectToValidateSingle(this)" ng-disabled="dataItem.IsRetrivedCrmDetails" class="btn btn-success btn-sm" type="button">OCS</button>',
                        width: "65px"
                    },
                    {
                        field: "SBUDesc",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "BU", width: "90px"
                    },
                    {
                        field: "ProductTypeDesc",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Product Type", width: "80px"
                    },
                    {
                        field: "PrePostDesc",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Pre/Post", width: "90px"
                    },
                    {
                        field: "Hybrid",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Hybrid (Y/N)", width: "50px"
                    },
                    {
                        field: "ConnectionReference",
                        headerTemplate: 'Conn Ref',
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        template: '<input type ="text"  ng-keydown="KK(this,$event)" ng-disabled="dataItem.ConnectionReferenceGridDisabled"  ng-change="dataItem.ContractNumber = null" ng-model="dataItem.ConnectionReference" class="k-fill text-right conn-ref2 kk" ng-disabled="dataItem.row"/>',
                        width: "100px"
                    },
                    {
                        field: "ContractNumber", title: "Contract Number",
                        headerTemplate: 'Contract No',
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        template: '<input type ="text"  ng-keydown="KK(this,$event)" ng-disabled="dataItem.ContractNumberGridDisabled"  ng-change="dataItem.ConnectionReference = null"  ng-model="dataItem.ContractNumber"class="k-fill text-right format-number contract-no kk" ng-disabled="dataItem.row"/>',
                        width: "100px"
                    },
                    {
                        field: "CustomerName",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Customer Name", width: "150px"
                    },
                    {
                        field: "CustomerIDType",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Cust ID Type", width: "60px"
                    },
                    {
                        field: "Amount", title: "Pay Amount",
                        headerTemplate: 'Pay Amount',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<input type ="text"  ng-keydown="KK(this,$event)" kendo-numeric-text-box ng-change="EditPaymentValue(this,$event)" ng-disabled="dataItem.AmountGridDisabled || dataItem.row" ng-model="dataItem.Amount" class="k-fill text-right amount kk"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "130px"
                    },
                    {
                        field: "DisconnectedCode",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Discon Code", width: "100px"
                    },
                    {
                        field: "SwitchStatusDesc",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Switch Status", width: "100px"
                    },
                    {
                        field: "OCSStatusDesc",
                        headerAttributes: {
                            "class": "table-header-OCS",
                        },
                        title: "OCS Status", width: "100px"
                    }, 
                    {
                        field: "TotalOutstanding",
                        headerAttributes: {
                            "class": "table-header-RBM",
                        },
                        title: "Total O/S", width: "100px",
                        template: "{{dataItem.TotalOutstanding|currency:''}}"
                    },
                    {
                        field: "BalanceAsAt",
                        headerAttributes: {
                            "class": "table-header-PE",
                        },
                        title: "Balance As At", width: "100px",
                        template: "{{dataItem.BalanceAsAt|currency:''}}"
                    },
                    {
                        field: "LastMonthBillAmount",
                        headerAttributes: {
                            "class": "table-header-RBM",
                        },
                        title: "Last Mon Bill Amt", width: "100px",
                        template: "{{dataItem.LastMonthBillAmount|currency:''}}"
                    },
                    {
                        field: "MinReconFee",
                        headerAttributes: {
                            "class": "table-header-PE", 
                        },
                        title: "Min Recon Fee", width: "100px"
                    },
                    {
                        field: "DTVReconFee",
                        headerAttributes: {
                            "class": "table-header-PE",
                        },
                        title: "DTV Recon Fee", width: "100px" 
                    },  
                    { 
                        field: "DisconnectedReason",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Disconnected Reason", width: "100px"  
                    },

                    {
                        field: "ReferenceNumber",
                        headerAttributes: {
                            "class": "table-header",
                        },
                        headerTemplate: 'Reference Number',
                        template: '<input type ="text" ng-keydown="KK(this,$event)" ng-model="dataItem.ReferenceNumber" ng-disabled="dataItem.ReferenceNumberGridDisabled" class="k-fill text-right ref-no kk"/>',
                        width: "120px"
                    },
                    {
                        field: "Remarks",
                        headerAttributes: {
                            "class": "table-header",
                        },
                        headerTemplate: 'Remarks',
                        template: '<input type ="text"  ng-keydown="KK(this,$event)" ng-model="dataItem.Remarks" ng-disabled="dataItem.RemarksGridDisabled" class="k-fill text-right remarks kk"/>',
                        width: "100px"
                    },
                    {
                        field: "PaymentMethod",
                        headerAttributes: {
                            "class": "table-header",
                        },
                        title: "Payment Method", width: "100px"
                    },
                    {
                        field: "BillingCycle",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Billing Cycle", width: "100px"
                    },
                    
                    {
                        field: "PRCode",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "PR Code", width: "100px"
                    },
                    {
                        field: "PREmail",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "PR Email", width: "100px"
                    },
                    {
                        field: "ContractEmail",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Contract Email", width: "100px"
                    },
                    {
                        field: "CustomerIDNumber",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Customer ID Number", width: "100px"
                    },
                    {
                        field: "OldNIC",
                        headerAttributes: {
                            "class": "table-header-CRM",
                        },
                        title: "Old NIC", width: "80px"
                    },
                    {
                        field: "CRM",
                        headerTemplate: '',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<button ng-click="CreateCRMObjectToValidateSingle(this)" class="btn btn-info btn-sm" type="button">CRM</button>',
                        width: "65px"
                    },
                    {
                        field: "ADFRemarks",
                        headerTemplate: '',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<button ng-click=" CreateADFObjectToValidateSingle(this) " class="btn btn-danger btn-sm" ng-disabled="dataItem.IsRetrivedCrmDetails" type="button" >ADF Remarks</button>',
                        width: "110px"
                    },
                    {
                        field: "ContractSummary",
                        headerTemplate: '',
                        headerAttributes: {
                            "class": "table-header",
                        },
                        template: '<button ng-click="GoToContractSummary(this)" class="btn btn-danger btn-sm" ng-disabled="dataItem.IsRetrivedCrmDetails" type="button" >Contract Summary</button>',
                        width: "110px"
                    },
                     
        ],
        pageable: commonGridConfig, 
        navigatable: true,
        editable: false, sortable: true,
        scrollable: true,
        dataBound: function () {
 
            var dGrid = $scope.dgGridBulkPayment.data();


            angular.forEach(dGrid, function (row) {
                if (row.PrePost == 1) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //red
                } else {
                    if (row.IsValiedAccount != true) {
                        $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                    }
                }
            });
        }

    };  

    configBulkPayment.dataSource = new kendo.data.DataSource({
        data: [bulkEntrySample],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'RowId': { editable: false, type: "number" },
                    'IsSelected': { editable: false, type: "boolean" },
                    'SBU': { editable: false, type: "number" },
                    'ProductTypeDesc': { editable: false, type: "number" },
                    'PrePost': { editable: false, type: "string" },
                    'Hybrid': { editable: false, type: "string" },
                    'ConnectionReference': { editable: true, type: "string" },
                    'ContractNumber': { editable: true, type: "number" },
                    'CustomerName': { editable: false, type: "string" },
                    'CustomerIDType': { editable: false, type: "number" },
                    'Amount': { editable: true, type: "number" },
                    'DisconnectedCode': { editable: false, type: "string" },
                    'SwitchStatus': { editable: false, type: "string" },
                    'OCSStatus': { editable: false, type: "string" },
                    'TotalOutstanding': { editable: false, type: "number" },
                    'BalanceAsAt': { editable: false, type: "string" },
                    'LastMonthBillAmount': { editable: false, type: "number" },
                    'MinReconFee': { editable: false, type: "number" },
                    'DTVReconFee': { editable: false, type: "number" },
                    'DisconnectedReason': { editable: false, type: "string" },
                    'ReferenceNumber': { editable: true, type: "number" },
                    'Remarks': { editable: true, type: "string" },
                    'PaymentMethod': { editable: false, type: "string" },
                    'BillingCycle': { editable: false, type: "number" },
                    'PRCode': { editable: false, type: "string" },
                    'PREmail': { editable: false, type: "string" },
                    'ContractEmail': { editable: false, type: "string" },
                    'CustomerIDNumber': { editable: false, type: "number" },
                    'OldNIC': { editable: false, type: "number" },
                    'IsValiedAccount': { editable: false, type: "boolean" },
                    'AccountNo': { editable: false, type: "number" },
                    'IsSuspend': { editable: false, type: "boolean" },

                    'ContactNo': { editable: false, type: "string" },
                    'SBUDesc': { editable: false, type: "string" },
                    'PrePostDesc': { editable: false, type: "string" },
                    'SwitchStatusDesc': { editable: false, type: "string" },
                    'OCSStatusDesc': { editable: false, type: "string" },
                    'ProductType': { editable: false, type: "number" },
                }
            }
        },
        pageSize: 10

    });



    $scope.dgGridBulkPayment = new DataGrid();
    $scope.dgGridBulkPayment.options(configBulkPayment);

    $scope.dgGridReceiptDetails = new DataGrid();
    $scope.dgGridReceiptDetails.options(configReceiptDetails);


    $scope.InitA = function (arg) {
        $scope.dgGridBulkPayment.Init(arg);
    };

    $scope.InitB = function (arg) {
        $scope.dgGridReceiptDetails.Init(arg);
    };


    $scope.PageLoad = function () {

        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        //if (defaultDataCookieObj == null)
        {
            var s = $scope.userInfo().outletType;
            console.log($scope.userInfo().outletType);

            BulkPaymentService.GetDefaultData($scope.userInfo().outletType, $scope.IsBackOfficeUser).then(function (response) {
                if (response.data.Code == "0") {


                    $scope.PaymentTypeCollection = response.data.Result.BillingPaymentType;
                    $scope.SbuCollection = response.data.Result.BillingSbu;
                    $scope.PaymentSourceCollection = response.data.Result.BillingPaymentSource;
                    $scope.PaymentMethodCollection = response.data.Result.BillingPaymentMethods;
                    $scope.PaymentModeCollection = response.data.Result.BillingPaymentMode;
                    $scope.ProductCatCollection = response.data.Result.BillingProdCat;
                    $scope.BillingSusAcc = response.data.Result.BillingSusAcc;
                    $scope.BulkPayment.Sbu = 0;
                    $scope.BulkPayment.PaymentMethod = PaymentMethod.Paymentreceived;
                    localStorage.setItem("BulkPaymentDefaultData", JSON.stringify(response.data.Result));
                    //var pof = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                    //console.log("Cookiefff1 : ", JSON.parse(localStorage.getItem("BulkPaymentDefaultData")));
                    $scope.changePageState('NEW');

                    $scope.as(1);
                    $scope.as(2);
                    $scope.as(3);
                    $scope.as(4);
                    $scope.as(5);
                    localStorage.setItem("CurrentProductCategory", $scope.BulkPayment.ProdCat);
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }
        //else {
        //    $scope.BillingSusAcc = defaultDataCookieObj.BillingSusAcc;
        //    $scope.PaymentTypeCollection = defaultDataCookieObj.BillingPaymentType;
        //    $scope.SbuCollection = defaultDataCookieObj.BillingSbu;
        //    $scope.PaymentSourceCollection = defaultDataCookieObj.BillingPaymentSource;
        //    $scope.PaymentMethodCollection = defaultDataCookieObj.BillingPaymentMethods;
        //    $scope.PaymentModeCollection = defaultDataCookieObj.BillingPaymentMode;
        //    $scope.ProductCatCollection = defaultDataCookieObj.BillingProdCat;
        //}
    }

    $scope.PageLoad();

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    changePageState     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    $scope.changeBtnStatus = function (print, save, email, contractSum) {
        $scope.disabled.PrintAllButton = print;
        $scope.disabled.SaveButton = save;
        $scope.disabled.BulkEmailButton = email;
        $scope.disabled.ContractSummaryButton = contractSum;
    };

    $scope.CheckDataExistswhenNEw = function (status) {
        if ($scope.dgGridBulkPayment.data().length > 1) {
            $scope.yesNoMessageParams = {
                Id: 3
            };
            $scope.customMessage = {
                Title: 'Message',
                Message: 'You will lost all the data in the current batch!. Do you want to continue?',
                Id: 3
            };
            $scope.YesNoMessageOpen();
            return;
        } else {
            $scope.changePageState(status);
        }

    }
    $scope.changePageState = function (status) {

        $scope.PaymentModeReset();
        $scope.IsReadyForSubmit = true;
        $scope.BulkPayment.ExistingReference = "";
        $scope.disabled.Remarks = false;
        $scope.disabled.Attachment = false;
        $scope.IsRequestSent = false;
        $scope.PaymentGridSelectAll = false;
        $scope.IsAttach = "NO";
        

        if (status = "NEW") {
            $scope.PrintAllButton12 = true;
            $scope.PrintAllButton12 = true;
            $scope.disabled.SaveButton = false;
            $scope.BulkPayment = {};
            $scope.dgGridBulkPayment.data([bulkEntrySample]);
            $scope.dgGridReceiptDetails.data([]);
            $scope.IsRetrivedCrmDetailsBulk = false;
            $scope.BulkPayment.BillPaymentType = 1;
            $scope.IsLoadingAtFirstTime = true;
            $scope.IsSIMDisabled = false;
            $scope.IsSelectedAll4G = false;
            //$scope.BulkPayment.UploadBtn = true;
            angular.element("input[type='file'].btn").val(null); 
        } else {
            $scope.disabled.SaveButton = true;
            $scope.BulkPayment = {};
            $scope.dgGridBulkPayment.data([bulkEntrySample]);
            $scope.dgGridReceiptDetails.data([]);
            $scope.IsRetrivedCrmDetailsBulk = false;
            $scope.BulkPayment.BillPaymentType = 1;
            //$scope.BulkPayment.UploadBtn = true;
        }
        
        $scope.aa();

        $scope.disabled.BulkEmailButton = true;
        $scope.disabled.BulkCancelButton = true;
        $scope.BulkPayment.User = "";
        $scope.BulkPayment.DateTime = "";
        $scope.BulkPayment.PaymentSourceRec = "";
        $scope.AddPaymentRadioBtnIsDisabled = false;
        $scope.CustIdRadioBtnIsDisabled = false;
        $scope.BillInvRadioBtnIsDisabled = false;
        $scope.UploadRadioBtnIsDisabled = false;
        //$scope.BulkPayment.User = $scope.userInfo().userName;
        //console.log($scope.BulkPayment.User);
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        $scope.BillingSusAcc = defaultDataCookieObj.BillingSusAcc;
        $scope.PaymentTypeCollection = defaultDataCookieObj.BillingPaymentType;
        $scope.SbuCollection = defaultDataCookieObj.BillingSbu;
        $scope.PaymentSourceCollection = defaultDataCookieObj.BillingPaymentSource;
        $scope.PaymentMethodCollection = defaultDataCookieObj.BillingPaymentMethods;
        $scope.PaymentModeCollection = defaultDataCookieObj.BillingPaymentMode;
        $scope.ProductCatCollection = defaultDataCookieObj.BillingProdCat;
        $scope.BulkPayment.Sbu = 0;
        $scope.BulkPayment.PaymentMethod = 10;
        $scope.BulkPayment.IdType = "NIC";
        $scope.BulkPayment.TotalPayAmount = 0;
        $scope.BulkPayment.PaymentMode = "CA";//"CA";
        $scope.BulkPayment.ProdCat = 1;
        $scope.PaymentBu = false;
        $scope.PaymentProdCatDrop = false;
        $scope.IsRetrivedCrmDetails = false;
        $scope.IsRetrivedCrmDetailsBulk = true;
        $scope.PaymentTypeDrop = false;
        var objTemp = new PaymentModeOptions();

        $scope.SelectedPaymentMode = "50";
        objTemp.PaymentMode = "50";
        objTemp.MobileNo = new Date().getTime().toString();
        objTemp.Callback = $scope.paymentModeCallBack;

        $scope.Options = objTemp;  

        $scope.SetPermissionToDefault();
        $scope.GenerateGuid();
        //$scope.BulkPayment.PaymentSourceRec = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Id: $scope.BulkPayment.PaymentSource })[0].Description : "";
    }
    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    changePageState     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    $scope.CheckRowColor = function () {
        if (!$scope.IsLoadingAtFirstTime) {
            var dGrid = $scope.dgGridBulkPayment.data();

            angular.forEach(dGrid, function (row) {
                $('tr[data-uid="' + row.uid + '"] ').removeClass("bg-highlightBlue");
                $('tr[data-uid="' + row.uid + '"] ').removeClass("bg-highlightRed");
                if ((angular.isUndefined(row.ConnectionReference) || row.ConnectionReference == null) &&
                    (angular.isUndefined(row.ContractNumber) || row.ContractNumber == null)) {

                    
                } 
                else if (row.PrePost == 1) {
                  
                    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //blue
                }
                else {
                    if (row.IsValiedAccount != true) {
                        $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                    }
                }
            });
        }
    }

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    //-> Modals

    //################      Finder      ###################
    $scope.finderBulkBillingBatchID = {
        title: "Batch Finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-BULK-PAYMENT-001",
            mapId: "BILLING-BULK-PAYMENT-001",
            modalId: "finderBulkBillingBatchID", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.BulkPayment.BatchId = data.selectedItem.BatchId;
            $scope.GetBatchDetails();
        },
        open: function () {
            if ($scope.dgGridBulkPayment.data().length > 1) {
                $scope.yesNoMessageParams = {
                    Id: 1
                };
                $scope.customMessage = {
                    Title: 'Message',
                    Message: 'You will lost all the data in the current batch!. Do you want to continue?',
                    Id: 1
                };
                $scope.YesNoMessageOpen();
                return;
            }
            
            $scope.GenerateGuid();
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
        }
    };



    ///////////////Add Payments Modal//////////////
    var qty = 0;

    $scope.addPaymentsDirectiveParams = {
        title: "Add Payments",
        disable: {
           
        },
        params: {
            Qty: qty++
        },
        callback: function (recCount, totAmount, rBPOCollection) {
            
            console.log(new Date().toLocaleString());
            console.log(recCount, totAmount, rBPOCollection);
            //console.log("Call back : " + qty);
            $scope.RandomBillPaymentObjectCollection = rBPOCollection;
            $scope.BulkPayment.NoOfRecords = recCount;
            $scope.BulkPayment.BatchTotal = totAmount;
            var obj = [];
            var rowId = 1;
            $scope.OldPaymentData = [];

            if ($scope.dgGridBulkPayment.data().length > 1) {
                $scope.OldPaymentData = $scope.dgGridBulkPayment.data();
                rowId = $scope.OldPaymentData.length;
            }
            
            if (rBPOCollection.length < 1) {
                return;
            }
            angular.forEach(rBPOCollection, function (row) {
                $scope.OldPaymentData.push({ 'IsSelected': true, 'RowId': rowId, 'ConnectionReference': row.ConnectionReference, 'Amount': row.Amount, 'ContractNumber': row.ContractNumber, 'ReferenceNumber': row.ReferenceNumber });
                rowId = rowId + 1;
            });
            $scope.dgGridBulkPayment.data($scope.OldPaymentData);

            var totAmt = 0;
            var totCount = 0;
           
            //angular.forEach(obj, function (row) {
            //    //totAmt = (Number(row.Amount) + Number(totAmt)).toFixed(2); //Number(totAmt).toFixed(2) + Number(row.Amount).toFixed(2);
            //    if (row.PrePost == 1) {
            //        row.IsSelected = false;
            //        row.row = true;
            //    }

            //    if (row.PrePost == 2) {
            //        totAmt = (Number(row.Amount) + Number(totAmt)).toFixed(2); //Number(totAmt).toFixed(2) + Number(row.Amount).toFixed(2);
            //        totCount++;
            //    }


            //});
            $scope.BulkPayment.NoOfRecords = totCount;
            $scope.BulkPayment.TotalPayAmount = totAmt > 0 ? Number(totAmt).toFixed(2) : Number(0).toFixed(2);
            $scope.BulkPayment.TotalAmount = Number(totAmt).toFixed(2);
            console.log(new Date().toLocaleString());
            $scope.CreateCRMObjectToValidateBulk();
        },
        data: []
    };

   


    $scope.OpenAddPayments = function () {
        
        localStorage.setItem("CurrentProductCategory", $scope.BulkPayment.ProdCat);
        var _selectedData = [];//_serialNumberList[_selectedItem.InvoiceNo + "." + _selectedItem.ItemCode + "." + _selectedItem.LineNo];
        _selectedData.push({ 'ConnectionReference': '112', 'ContractNumber': '071', 'Amount': '100.00', 'ReferenceNumber': '111' });
        $scope.addPaymentsDirectiveParams.params.RandomBillPaymentObjectCollection = $scope.RandomBillPaymentObjectCollection ? $scope.RandomBillPaymentObjectCollection : [];
        $scope.addPaymentsDirectiveParams.data = _selectedData;//RandomBillPaymentObjectCollection ? RandomBillPaymentObjectCollection : [];

        //open popup
        window._focuse();
        //$scope.$digest();
        //$scope.addPaymentsDirectiveParams.data = _selectedData ? _selectedData.SerialNo : [];

        //open popup
        window._focuse();
        window.paymentsDirectiveCb = $scope.addPaymentsDirectiveParams.callback;


        $("#myAddPaymentsNew").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        //$scope.infoMessage = new Message(MessageTypes.Empty);
       
       
    }; 

    /////////////////////////////////////////

    //##########################################################################################################################
   

    $scope.addBillInvoicePaymentsParams = {
        title: "Add Payments",
        disable: {

        },
        params: {
            Qty: qty++
        },
        callback: function (recCount, totAmount, rBPOCollection) {
            
            $scope.BulkPayment.NoOfRecords = recCount;
            $scope.BulkPayment.BatchTotal = totAmount;
            
            if (rBPOCollection.length < 1) {
                return;
            }
            
            $scope.dgGridBulkPayment.data(rBPOCollection);
            $scope.rowId = 0;
            angular.forEach($scope.dgGridBulkPayment.data(), function (row) {
                row.RowId = ++$scope.rowId;
            });

            $scope.BulkPayment.NoOfRecords = recCount;
            $scope.BulkPayment.TotalPayAmount = totAmount > 0 ? Number(totAmount).toFixed(2) : Number(0).toFixed(2);
            $scope.BulkPayment.TotalAmount = Number(totAmt).toFixed(2);
        },
        data: []
    };


    //--------------------------------------3gSIM Modal ----------------------------------------------------
    var config3GSIM = {};
    //TODO : toggleSelect
    var config3GSIM = {
        columns: [
                    { field: "IsSelected", headerTemplate: '<input type="checkbox" ng-disabled = "IsSIMDisabled" title="Select all" ng-click="toggleSelect4GSIM($event)" ng-model="IsSelectedAll4G"/>', template: '<input type="checkbox" ng-change="selectThis4GSIM($event)" ng-disabled="dataItem.IsRequested" ng-model="dataItem.IsSelected4GSIM" />', width: "2px" },
                    { field: "ConnectionRef", title: "Connection Reference", width: "10px" },
                    { field: "IsIssued", title: "Is Issued", width: "10px" },
        ],

        navigatable: true,
        editable: false,
        scrollable: true,
        dataBound: function () {
        }
    };

    config3GSIM.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'IsSelected': { editable: false, type: "boolean" },
                    'ConnectionRef': { editable: false, type: "string" },
                    'IsIssued': { editable: false, type: "string" },
                }
            }
        },
        pageSize: 10
    });

    $scope.dgGrid3GSIM = new DataGrid();
    $scope.dgGrid3GSIM.options(config3GSIM);

    $scope.Init3GSIM = function (arg) {
        $scope.dgGrid3GSIM.Init(arg);
    };

    $scope.Open3GSIM = function () {
        $scope.BulkPayment.SIMCount = "";
        //$scope.Get3GConnectionDetails();
        if ($scope.BulkPayment.BatchId == undefined || $scope.BulkPayment.BatchId == '') {
            toaster.error({ type: 'error', title: 'Error', body: "Please select Batch ID", showCloseButton: true });
            return;
        }
        else {
            $scope.Get3GConnectionDetailbyBatchID()

            $("#3GSIMModal").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        }
        //$scope.Get3GConnectionDetails();
    };

    //Update 3G SIM details to 3GSIMConnections table
    $scope.Update3GSIMDetails = function () {
        var _3GConnections = [];
        angular.forEach($scope.dgGrid3GSIM.data(), function (row) {
            if (row.IsSelected4GSIM) {
                $scope.obj = {
                    BatchId: $scope.BulkPayment.BatchId,
                    ConnectionRef: row.ConnectionRef
                };
                _3GConnections.push($scope.obj);
                //$('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed");
            }
        });

        BulkPaymentService.Update3GSIMDetails(_3GConnections).success(function (response) {
            if (response.Code != MessageTypes.Success) {              
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
            } else {
                $("#3GSIMModal").modal('hide');
                toaster.success({ type: 'Success', title: 'Success', body: response.Message, showCloseButton: true });
                
            }
        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
    };

    //Get the 3G connection details by Batch ID
    $scope.Get3GConnectionDetailbyBatchID = function () {
        var batchId = $scope.BulkPayment.BatchId;
        if (batchId == undefined || batchId == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Please enter batchId...!", showCloseButton: true });
            return;
        }
        BulkPaymentService.Get3GConnectionDetailbyBatchID(batchId).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                $scope.dgGrid3GSIM.data(response.Result);

                var dGrid = $scope.dgGrid3GSIM.data();
                //IsSIMDisabled
                angular.forEach(dGrid, function (row) {
                    if (row.IsRequested == true) {
                        $scope.IsSIMDisabled = true;  
                    }
                });
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });

    }

    $scope.toggleSelect4GSIM = function (e) {
        var dataItems4G = $scope.dgGrid3GSIM.data();
        for (var i = 0; i < dataItems4G.length; i++) {
            dataItems4G[i].IsSelected4GSIM = e.target.checked;
        }
        $scope.selectThis4GSIM();
    };

    $scope.selectThis4GSIM = function (e) {
        var dataItems4G = $scope.dgGrid3GSIM.data();
        var isSelected = true;
        var count = 0;
        for (var i = 0; i < dataItems4G.length; i++) {
            var sss = dataItems4G[i].IsSelected4GSIM;

            if (!dataItems4G[i].IsSelected4GSIM) {
                isSelected = false;
            } else {
                count = count + 1;
            }
        }
        $scope.IsSelectedAll4G = isSelected;
        $scope.BulkPayment.SIMCount = count;
    };

    //call the API and retrieve the details
    $scope.Get3GConnectionDetails = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var objAccountList = [];

        angular.forEach(GData, function (row) {
            debugger;
            if (row.ConnectionReference != "" && !angular.isUndefined(row.ConnectionReference) && row.ConnectionReference != null
                || row.ContractNumber != "" && !angular.isUndefined(row.ContractNumber) && row.ContractNumber != null) {
                if (row.CustomerIDType != 'TIN' && row.SBUDesc == "Mobile" && $scope.BulkPayment.ProdCat == 1) {
                    objAccountList.push({ 'MSISDN': row.ConnectionReference });//, 'accountNo': row.AccountNo 
                }
            }
        });

        var obj = {
            "MSISDN": objAccountList,
            "BatchId": $scope.BulkPayment.BatchId
        }
        if (0 < objAccountList.length < 11) {
            BulkPaymentService.Get3GConnectionDetails(obj).success(function (response) {
                if (response.Code != MessageTypes.Success) {
                    $scope.alertMessage = new Message(response.Code, response.Message);
                    return;
                } else {
                    //$scope.alertMessage = new Message(response.Code, response.Message);
                    if (response.Result == true) {
                        $scope.Open3GSIM();
                    }
                    return;
                }
            }).error(function (response) {
                $scope.alertMessage = new Message(response.Code, response.Message); return;
            });
        }
    }

    //--------------------------------------------------------------------------------------------------------

    ///////////////Bulk Excel Verification Modal//////////////

    $scope.bulkExcelVerificationDirectiveParams = {
        title: "Bulk Upload",
        params: {
            //Qty: qty++
        },
        callback: function (accType, data) {
            $scope.IsLoadingAtFirstTime = false;
            $scope.BulkPayment.UploadBtnIsDisabled = true;
            $scope.dgGridBulkPayment.data(data);
            $scope.AccountType = accType;
            //$scope.GenerateTotalAmountToPay(true);
            $scope.IsRetrivedCrmDetailsBulk = false;
            $("#myBulkExcelVerification").hide();
            var totAmt = 0;
            var totCount = 0;
            var suspenseAmt = 0;
            var suspenseCount = 0;

            angular.forEach(data, function (row) {

                if (row.IsSuspend) {
                    suspenseAmt = (Number(suspenseAmt) + Number(row.Amount)).toFixed(2);
                    suspenseCount++;
                }
                if (row.PrePost == 1) {
                    row.IsSelected = false;
                    row.row = true;
                }

                if (row.PrePost == 2) {
                    totAmt = (Number(row.Amount) + Number(totAmt)).toFixed(2); //Number(totAmt).toFixed(2) + Number(row.Amount).toFixed(2);
                    totCount++;
                }

            });
            $scope.CheckRowColor();
            $scope.BulkPayment.NoOfRecords = totCount;
            $scope.BulkPayment.TotalAmount = Number(totAmt).toFixed(2);
            $scope.BulkPayment.TToSuspendcount = suspenseCount;
            $scope.BulkPayment.TTSuspendAmount = Number(suspenseAmt).toFixed(2);
            $scope.BulkPayment.TotalPayAmount = totAmt > 0 ? Number(totAmt).toFixed(2) : Number(0).toFixed(2);
           
        },
        data: []
    };



    $scope.OpenBulkExcelVerification = function () {
        if ($scope.BulkPayment.Sbu == undefined || $scope.BulkPayment.Sbu == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Please select single BU!", showCloseButton: true });
            return;
        }

        if ($scope.BulkPayment.BillPaymentType == 3) {

            var gridData = $scope.dgGridBulkPayment.data();
            

            var _selectedData = {
                'Sbu': $scope.BulkPayment.Sbu,
                'ProductCat': $scope.BulkPayment.ProdCat,
                'PaymentType': $scope.BulkPayment.PaymentType,
                'PaymentSource': $scope.BulkPayment.PaymentSource,
                'PaymentMethod': $scope.BulkPayment.PaymentMethod,
                'ExcelData': []
            };
            $scope.bulkExcelVerificationDirectiveParams.params.BulkExcelPaymentObjectCollection = _selectedData ? _selectedData : [];
            $scope.bulkExcelVerificationDirectiveParams.data = _selectedData;//RandomBillPaymentObjectCollection ? RandomBillPaymentObjectCollection : [];

            //open popup
            window._focuse();
            $("#myBulkExcelVerification").modal('show');

            $scope.PaymentMethodDrop = true;
            $scope.PaymentTypeDrop = true;
            $scope.PaymentSourceDrop = true;
            $scope.PaymentBu = true;
            $scope.PaymentProdCatDrop = true;

        }
  
        
        //$scope.infoMessage = new Message(MessageTypes.Empty);
  
        
    };

    /////////////////////////////////////////
    ///////////////Posting Status Modal//////////////


    $scope.postingStatusDirectiveParams = {
        title: "Posting Status",
        params: {


        },
        callback: function () {

        },
        data: []
    };


    
    $scope.finderInvoiceNo = {
        title: "Invoice Finder",
        info: {
            appId: "ZBC-DCPOS",
            uiId: "POS-SRF-GENERATE-RECEIPT-02",
            mapId: "SRF-GENERATE-RECEIPT-002",
            modalId: "finderInvoiceNo", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.receipt.InvoiceId = data.selectedItem.InvoiceNo;
            var entryType = $scope.receipt.etypeNew;
            if (entryType == EntryType.CB) {
                $scope.receipt.DepositeCode = data.selectedItem.ItemCode;
                if (!angular.isUndefined(data.selectedItem)) {
                    $scope.depositLineNo = data.selectedItem.LineA;
                } else {
                    $scope.depositLineNo = 1;
                }

            } else {
                $scope.receipt.DepositeCode = 0;
                $scope.depositLineNo = 1;
            }
            $scope.LoadInvoiceDetailsByInvoiceId("invoice");
        },
        open: function () {
            this.info.onLoad = true;
            var objTemp = new Array();
            

            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
            //$scope.LoadInvoicePopUp();
        }
    };
    //######################################################################################################################################################

    // Payment mode details

    var objTemp = new Array();

    var aMessage = "";
    var bMessage = "";
    var cMessage = "";
    var dMessage = "";
    var eMessage = "";

    $scope.PayType = 1;
    $scope.AccountNoCustRet = "";
    $scope.SinglePaymentModeExistingReference = "";
    $scope.SinglePaymentModeSubCat = "";

    $scope.isSuccessSavingValidation = true;




    $scope.isTaxablle = true;

    $scope.GetPaymentSourseById = function () {
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        //$scope.BulkPayment.PaymentSource =
        if (defaultDataCookieObj == null || defaultDataCookieObj == undefined) {
            return;
        }
        return defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Id: $scope.BulkPayment.PaymentSource })[0].CcbsPaymentSource : "";
    }

    $scope.GetPaymentSourseByCcbsPaymentSource = function () {
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        //$scope.BulkPayment.PaymentSource =
        if (defaultDataCookieObj == null || defaultDataCookieObj == undefined) {
            return;
        }
        return defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: $scope.BulkPayment.PaymentSource })[0].Id : "";
    }

    //$scope.SetPaymentMode = function () {
    //    var objTemp = new PaymentModeOptions();


    //    $scope.SelectedPaymentMode = $scope.BulkPayment.PaymentMode;
    //    objTemp.PaymentMode = $scope.SelectedPaymentMode;
    //    objTemp.MobileNo = new Date().getTime().toString();
    //    objTemp.Callback = $scope.paymentModeCallBack;
    //    objTemp.Amount = Number(0).toFixed(2);
    //    objTemp.CustomerRef = "";
    //    var SbuId = '';
    //    var isMultipleSbuExists = false;



    //    $scope.Options = objTemp;

    //}


    //####################################      Finder Region Bulk Payment       #####################################################################


    $scope.BulkPayment = {};

    // Search By BatchNo


    $scope.BulkPaymentBatchID =
    {

        title: "Search by Batch ID",
        info: {
            // appId: "ZBC-DCPOS",
            // uiId: "POS-FLOAT-FLOATMSTER",
            //  mapId: "FLOAT-TRANSFER-FLOATMSTER",
            modalId: "BulkPaymentBatchID",
            onLoad: false

        },
        params: [],
        callback: function (data) {

            // $scope.BulkPayment.Code = data.selectedItem.BulkPaymentCode;
            // $scope.GetBulkPaymentDetail();
            // $scope.changePageState("SEARCH");
        },
        open: function () {
            this.info.onLoad = true;

            //$scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };


    //  ###################################################################################################################################

    //####################################      Finder Region Receipt Details       #########################################


    $scope.ReceiptDetails = {};

    // Search By BatchNo


    $scope.ReceiptDetailsBatchID =
    {

        title: "Search by Batch ID",
        info: {
            // appId: "ZBC-DCPOS",
            // uiId: "POS-FLOAT-FLOATMSTER",
            //  mapId: "FLOAT-TRANSFER-FLOATMSTER",
            modalId: "ReceiptDetailsBatchID",
            onLoad: false

        },
        params: [],
        callback: function (data) {

            // $scope.BulkPayment.Code = data.selectedItem.BulkPaymentCode;
            // $scope.GetBulkPaymentDetail();
            //  $scope.changePageState("SEARCH");
        },
        open: function () {
            this.info.onLoad = true;

            
            $("#" + this.info.modalId).modal('show');

        }
    };


    //  ###########################################################################################################################################################



    //  ###################

    // Customer ID Type dropdown
    $scope.CustomerIdTypeCollection = [{ Id: "NIC", Description: "NIC" }, { Id: "PP", Description: "PP" }, { Id: "OTHER", Description: "Other" }];//{ Id: "TIN", Description: "BR" }, 

    // print options dropdown
    $scope.OptionsPrintingOption = [
      { text: "Only one receipt per page", value: "1" },
      { text: "All receipts in one page", value: "2" }

    ];

    $scope.SetPermissionToDefault = function () {
        var permissionCodes = AuthService.getProfile().permission;

        if (permissionCodes.indexOf("41001") == -1) {
            $scope.PaymentSourceDrop = true;
            $scope.PaymentTypeDrop = true;
            $scope.PaymentMethodDrop = true;
            var d = $scope.userInfo();
            if ($scope.userInfo().outletType == 1) {
                $scope.BulkPayment.PaymentType = PaymentType.DAPOutlets;

            } else {
                $scope.BulkPayment.PaymentType = PaymentType.Franchises;
            }
        } else {
            $scope.PaymentSourceDrop = false;
            $scope.PaymentMethodDrop = false;

            if ($scope.userInfo().outletType == 1) {
                $scope.BulkPayment.PaymentType = PaymentType.DAPOutlets;

            } else {
                $scope.BulkPayment.PaymentType = PaymentType.Franchises;
            }
        }

        //if (permissionCodes.indexOf("41002") == -1) {
        //    $scope.PaymentSourceDrop = true;
        //}

        //if (permissionCodes.indexOf("41003") == -1) {
        //    $scope.PaymentMethodDrop = true;
        //}
    }
    
    $scope.SetPermissionToDefault();

    $scope.toggleSelect = function (e) {
        var dataItems = $scope.dgGridBulkPayment.data();
        $scope.totAmount = 0;
        for (var i = 0; i < dataItems.length; i++) {
            if (!dataItems[i].row) {
                dataItems[i].IsSelected = e.target.checked;
            } else {
                dataItems[i].IsSelected = false;
            }
            
            if (e.target.checked == true && !dataItems[i].row) {
                $scope.totAmount = $scope.totAmount + dataItems[i].Amount;
            }
        }
        $scope.BulkPayment.TotalPayAmount = $scope.totAmount > 0 ? Number($scope.totAmount).toFixed(2) : Number(0).toFixed(2);
        $scope.selectThis();

    };

    $scope.selectThis = function (e) {
        $scope.selectedRow = e;
        $scope.totAmount = 0;
        $scope.rowCount = 0;
        var isSelected = true;
        var dataItems = $scope.dgGridBulkPayment.data();
        for (var i = 0; i < dataItems.length; i++) {
            var sss = dataItems[i].IsSelected;
            if (!dataItems[i].IsSelected) {
                isSelected = false;
            } else {
                var f = $scope.totAmount;
                $scope.rowCount++;
                var g = dataItems[i].Amount;
                if (g != null) {
                    //$scope.totAmount = $scope.totAmount + Number(dataItems[i].Amount).toFixed(2);
                    $scope.totAmount = (Number($scope.totAmount) + Number(dataItems[i].Amount)).toFixed(2);
                }
                
            }
        }
        $scope.BulkPayment.NoOfRecords = $scope.rowCount;
        $scope.BulkPayment.TotalAmount = $scope.totAmount > 0 ? Number($scope.totAmount).toFixed(2) : Number(0).toFixed(2);
        $scope.BulkPayment.TotalPayAmount = $scope.totAmount > 0 ? Number($scope.totAmount).toFixed(2) : Number(0).toFixed(2);
        $scope.IsSelectedAll = isSelected;

    };


    $scope.toggleSelect1 = function (e) {

        var dataItems1 = $scope.dgGridReceiptDetails.data();
        $scope.totAmount = 0;
        for (var i = 0; i < dataItems1.length; i++) {
            dataItems1[i].IsSelected = e.target.checked;
            if (e.target.checked == true) {
                $scope.totAmount = $scope.totAmount + dataItems1[i].Amount;
            }
        }
        $scope.selectThis1();

    };

    $scope.selectThis1 = function (e) {
        
        var dataItems1 = $scope.dgGridReceiptDetails.data();
        var isSelected = true;
        for (var i = 0; i < dataItems1.length; i++) {
            var sss = dataItems1[i].IsSelected;
            if (!dataItems1[i].IsSelected) {
                isSelected = false;
            } else {
                var f = $scope.totAmount;
                var g = dataItems1[i].Amount;
                if (g != null) {
                    //$scope.totAmount = $scope.totAmount + Number(dataItems[i].Amount).toFixed(2);
                    $scope.totAmount = (Number($scope.totAmount) + Number(dataItems1[i].Amount)).toFixed(2);
                }

            }
        }
        $scope.IsSelectedAll = isSelected;

    };

    

    $scope.LoadPaymentSourseByPaymentType = function () {
        debugger;
        var permissionCodes = AuthService.getProfile().permission;
        if ($scope.PaymentSourceDrop && $scope.PaymentTypeDrop) {
            var sou = [{ 'Description': $scope.userInfo().outletDescription, 'Id': $scope.userInfo().outletCode }];
            $scope.PaymentSourceCollection = sou;
            //$scope.PaymentSourceCollection = "";
            $scope.BulkPayment.PaymentMethod = PaymentMethod.Paymentreceived;
            return;
        }

        var payType = 0;
        if (permissionCodes.indexOf("41001") != -1) {
            payType = $scope.BulkPayment.PaymentType;
            if (payType == null) {
                return;
            }
        } else {
            //payType = $scope.userInfo().outletType;
            
        }

        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        
        //$scope.BulkPayment.PaymentSource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: response.Result.OutletCode })[0].Id : "";
        $scope.PaymentSou = [];
        angular.forEach(defaultDataCookieObj.BillingPaymentSource, function (item) {
            if (payType == 0) {
                $scope.PaymentSou.push({ "Id": item.CcbsPaymentSource, "Description": item.Description });
            }
            else if (item.PaymentType == payType) {
                
                $scope.PaymentSou.push({ "Id": item.CcbsPaymentSource, "Description": item.Description });
            }
        });
        $scope.PaymentSourceCollection = $scope.PaymentSou;

        //BulkPaymentService.GetPaymentSource(payType).then(function (response) {
        //    if (response.data.Code == "0") {
        //        $scope.PaymentSourceCollection = response.data.Result;
        //    } else {
        //        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        //    }
        //}, function (response) {
        //    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        //});
    }



    $scope.GetCustomerDetailsByCustomerId = function () {
        BulkPaymentService.GetCustomerDetailsByCustomerId().then(function (response) {
            if (response.data.Code == "0") {

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }

    $scope.GetBillDetailsByCustomerId = function () {
        BulkPaymentService.GetBillDetailsByCustomerId().then(function (response) {
            if (response.data.Code == "0") {

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }

    $scope.GetBillDetailsByBullInvoiceId = function () {
        BulkPaymentService.GetBillDetailsByBullInvoiceId().then(function (response) {
            if (response.data.Code == "0") {

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }

    $scope.ValidateIdNumber = function (NicType) {
        if (NicType == 2) {
            var id = $scope.BulkPayment.OldNic;
            var regex = /^[0-9]\d*[V|v|x|X]$/;
            if (id.length != 10) {
                return false;
            }
            if (!regex.test(id)) {
                return false;
            } else {
                return true;
            }

        } else {
            var id = $scope.BulkPayment.NewNic;
            var regex = /^[0-9]\d*$/;
            if (id.length != 12) {
                return false;
            }
            if (!regex.test(id)) {
                return false;
            } else {
                return true;
            }
        }
    }

    $scope.FindCustomerByNIC = function (NicType) {
        if ($scope.BulkPayment.IsCustomerId) {
            var custId = "";
            if ($scope.BulkPayment.IdType == "NIC") {
                if (!$scope.ValidateIdNumber(NicType)) {
                    toaster.error({ type: 'error', title: 'Error', body: "NIC format is invalied!", showCloseButton: true });
                    return;
                }
                if (NicType == 1) {
                    custId = $scope.BulkPayment.NewNic
                } else {
                    custId = $scope.BulkPayment.OldNic
                }
            } else {
                custId = $scope.BulkPayment.NewNic
            }

            var obj = {
                "custRef": $scope.BulkPayment.NewNic,
                "OldCustRef": $scope.BulkPayment.OldNic,
                "CustRefType": $scope.BulkPayment.IdType,
                "productCategory": $scope.BulkPayment.ProdCat,
                "sbu": $scope.BulkPayment.Sbu,
                "billInvoiceNo": $scope.BulkPayment.BillInvoiceNo,
                "reqType": 1,
                "accounts": []
            }

            BulkPaymentService.FindCustomerByNIC(obj).then(function (response) {
                if (response.data.Code == "0") {
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
            });
        }


    }

    $scope.CustomerIdChange = function () {
        if ($scope.BulkPayment.IdType == "NIC") {
            $scope.labelNameCustomerId = 'Old NIC';
        } else {
            $scope.labelNameCustomerId = '';
        }
        
    }

    $scope.aa = function () {


        if ($scope.BulkPayment.BillPaymentType == 0) {
            $scope.BulkPayment.AddPaymentBtnIsDisabled = false;
            $scope.BulkPayment.CustIdIsDisabled = true;
            $scope.BulkPayment.BillInvIsDisabled = true;
            $scope.BulkPayment.UploadBtnIsDisabled = true;
            //$scope.BulkPayment.Sbu = 0;
            $scope.OpenAddPayments();
            //var GData = $scope.dgGridBulkPayment.data();
            //angular.forEach(GData, function (row) {
            //    gRow.ConnectionReferenceGridDisabled = false;
            //    gRow.ContractNumberGridDisabled = false;
            //});

        } else {

            if ($scope.BulkPayment.BillPaymentType == 1) {
                //$scope.BulkPayment.Sbu = 0;
                $scope.BulkPayment.AddPaymentBtnIsDisabled = true;
                $scope.BulkPayment.CustIdIsDisabled = false;
                $scope.BulkPayment.BillInvIsDisabled = true;
                $scope.BulkPayment.UploadBtnIsDisabled = true;
            } else if ($scope.BulkPayment.BillPaymentType == 2) {
                //$scope.BulkPayment.Sbu = 0;
                $scope.BulkPayment.AddPaymentBtnIsDisabled = true;
                $scope.BulkPayment.CustIdIsDisabled = true;
                $scope.BulkPayment.BillInvIsDisabled = false;
                $scope.BulkPayment.UploadBtnIsDisabled = true;
            } else if ($scope.BulkPayment.BillPaymentType == 3) {
                //$scope.BulkPayment.Sbu = 0;
                $scope.BulkPayment.AddPaymentBtnIsDisabled = true;
                $scope.BulkPayment.CustIdIsDisabled = true;
                $scope.BulkPayment.BillInvIsDisabled = true;
                $scope.BulkPayment.UploadBtnIsDisabled = false;
            }
            $scope.CustomerIdChange();
            //var GData = $scope.dgGridBulkPayment.data();
            //angular.forEach(GData, function (row) {
            //    gRow.ConnectionReferenceGridDisabled = true;
            //    gRow.ContractNumberGridDisabled = true;
            //});
        }

    }

    $scope.aa();
    

    // #########################        START Retrive CRM details  ##############################

    $scope.GenerateGRow = function (res, resHeader) {

        var gRow = new billingData();
        gRow.IsValiedAccount = true;
        gRow.IsRetrivedCrmDetails = false;
        gRow.PrePost = res.accountType;
        gRow.Hybrid = res.hybridFlag == 1 ? "Y" : "N";
        gRow.ProductType = res.productType;
        gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
        gRow.ContactNo = res.ContactNo;
        gRow.ConnectionReference = res.connRef;
        gRow.ContractNumber = res.contractNo;
        gRow.CustomerName = resHeader.custName;
        gRow.CustomerIDType = resHeader.custRefType;
        gRow.DisconnectedCode = res.disconReasonCode;
        gRow.SwitchStatus = res.conStatus;
        gRow.SwitchStatusDesc = res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense';
        gRow.DisconnectedReason = res.disconReason;
        gRow.BillingCycle = res.billCycle;
        gRow.PRCode = res.prCode;
        gRow.PREmail = res.prEmail;
        gRow.ContractEmail = res.contractEmail;
        gRow.CustomerIDNumber = resHeader.custRef;
        gRow.OldNIC = $scope.BulkPayment.IdType == "OTHER" ? "N/A" : resHeader.oldCustRef;
        gRow.AccountNo = res.accountNo;
        gRow.SBU = res.Sbu;
        gRow.ProductType = res.productType;
        gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
        gRow.IsSelected = true;
        gRow.ConnectionReferenceGridDisabled = false;
        gRow.ContractNumberGridDisabled = false;
        gRow.AmountGridDisabled = false;
        gRow.ReferenceNumberGridDisabled = true;
        gRow.RemarksGridDisabled = true;
        gRow.Remarks = $scope.BulkPayment.Remarks;

        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        if (defaultDataCookieObj != null) {
            gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";

        }
        gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";

        gRow.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: $scope.BulkPayment.PaymentMethod })[0].Description : "";
        return gRow;
    }

    $scope.RequetCRMDetails = function (cRMAccList) {
        $scope.BulkPayment.ExistingReference = "";
        $scope.PaymentModeReset();
        $scope.BulkPayment.PaymentMode = "CA";
        if ($scope.BulkPayment.BillPaymentType == 1) {
            if (($scope.BulkPayment.NewNic == null && $scope.BulkPayment.OldNic == null) ||
                ($scope.BulkPayment.NewNic == undefined && $scope.BulkPayment.OldNic == undefined) ||
                $scope.BulkPayment.NewNic == "" && $scope.BulkPayment.OldNic == "") {
                return;
            }

        }

        $scope.IsLoadingAtFirstTime = false;
        $cookieStore.put("accessToken", "");
        var obj = {
            "custRef": $scope.BulkPayment.IdType == "NIC" ? $scope.BulkPayment.NewNic : $scope.BulkPayment.OldNic,
            "OldCustRef": $scope.BulkPayment.IdType == "NIC" ? $scope.BulkPayment.OldNic : "",
            "CustRefType": $scope.BulkPayment.IdType,
            "productCategory": $scope.BulkPayment.ProdCat,
            "sbu": $scope.BulkPayment.Sbu,
            "billInvoiceNo": $scope.BulkPayment.BillInvoiceNo,
            "reqType": 1,
            "accounts": cRMAccList,
            "accessToken": $cookieStore.get('accessToken')
        }

        console.log(new Date().toLocaleString());
        BulkPaymentService.ValidateRecordsFromCRM(obj).success(function (response) {
            console.log(new Date().toLocaleString());
            if (response.Result.isNewAccessToken) {
                $cookieStore.put("accessToken", response.Result.accessToken);
            }
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                if ($scope.BulkPayment.BillPaymentType == 1 || $scope.BulkPayment.BillPaymentType == 2) {
                    var isCrmFail = true;
                    var gData = [];
                    if ($scope.BulkPayment.BillPaymentType == 1) {
                        if (response.Result.length < 1) {
                            toaster.error({ type: 'error', title: 'Error', body: "The NIC/PR/BR/PP number entered cannot be found in the CRM system!", showCloseButton: true });
                            return;
                        }
                    } else {
                        if (response.Result.length < 1) {
                            toaster.error({ type: 'error', title: 'Error', body: "The Bill Invoice number entered cannot be found in the CRM system!", showCloseButton: true });
                            return;
                        }
                    }

                    angular.forEach(response.Result.profiles, function (resHeader) {
                        $scope.PaymentProdCatDrop = true;
                        $scope.BulkPayment.NewNic = resHeader.custRef;
                        $scope.BulkPayment.IdType = resHeader.custRefType;
                        if (resHeader.accounts.length < 1) {
                            toaster.error({ type: 'error', title: 'Error', body: "Accounts not found for relevant Id!", showCloseButton: true });
                            return;
                        } else {
                            if (response.Result.length < 1) {
                                toaster.error({ type: 'error', title: 'Error', body: "Accounts not found for relevant Bill Invoice number!", showCloseButton: true });
                                return;
                            }
                        }
                        angular.forEach(resHeader.accounts, function (res) {
                            
                            if ($scope.BulkPayment.BillPaymentType == 0 && res.accountType == 1) {
                                isCrmFail = false;
                                gData.push($scope.GenerateGRow(res, resHeader));
                            }
                            else if (res.accountType == 2) {
                                isCrmFail = false;
                                gData.push($scope.GenerateGRow(res, resHeader));
                            } else {
                                
                            }
                            

                        });
                        
                    });


                    $scope.IsRetrivedCrmDetailsBulk = false;

                    if ($scope.BulkPayment.BillPaymentType == 1) {
                        
                        $scope.dgGridBulkPayment.data(gData);
                        $scope.rowId = 0;
                        angular.forEach($scope.dgGridBulkPayment.data(), function (gRow) {
                            gRow.ConnectionReferenceGridDisabled = true;
                            gRow.ContractNumberGridDisabled = true;
                            gRow.AmountGridDisabled = false;
                            gRow.ReferenceNumberGridDisabled = false;
                            gRow.RemarksGridDisabled = false;
                            gRow.RowId = ++$scope.rowId;
                        });
                    }

                    if ($scope.BulkPayment.BillPaymentType == 2) {
                        window._focuse();
                        window.paymentsDirectiveCb = $scope.addBillInvoicePaymentsParams.callback;
                        
                        $("#popAddBillInvoicePayments").modal({
                            show: true,
                            backdrop: 'static',
                            keyboard: false
                        });
                        
                        $scope.$broadcast('popAddBillInvoicePayments.CustomEvent', gData);
                    }

                } else {
                    var d = [];
                    var rowId = 0;
                    var GData = $scope.dgGridBulkPayment.data();
                    angular.forEach(GData, function (gRow) {
                        var isCrmFail = true;
                        rowId++;
                        gRow.RowId = rowId;

                        angular.forEach(response.Result.profiles, function (resHeader) {

                            if (resHeader.accounts.length < 1) {
                                toaster.error({ type: 'error', title: 'Error', body: "Accounts not found for relevant Id!", showCloseButton: true });
                                return;
                            } else {
                                if (response.Result.length < 1) {
                                    toaster.error({ type: 'error', title: 'Error', body: "Accounts not found for relevant Bill Invoice number!", showCloseButton: true });
                                    return;
                                }
                            }

                            $scope.PaymentProdCatDrop = true;

                            angular.forEach(resHeader.accounts, function (res) {
                                $scope.IsRetrivedCrmDetailsBulk = false;
                                if ($scope.BulkPayment.BillPaymentType == 0 && res.accountType == 1) {
                                    if (res.connRef != null && res.connRef == gRow.ConnectionReference) {
                                        gRow.IsValiedAccount = true;

                                        isCrmFail = false;
                                        gRow.IsRetrivedCrmDetails = false;
                                        gRow.PrePost = res.accountType;
                                        gRow.IsSelected = false;
                                        gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                        gRow.Hybrid = res.hybridFlag == 1 ? "Y" : "N";
                                        gRow.ConnectionReference = res.connRef;
                                        gRow.ContractNumber = res.contractNo;
                                        gRow.CustomerName = resHeader.custName;
                                        gRow.CustomerIDType = resHeader.custRefType;
                                        gRow.DisconnectedCode = res.disconReasonCode;
                                        gRow.SwitchStatus = res.conStatus;
                                        gRow.SwitchStatusDesc = res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense';
                                        gRow.DisconnectedReason = res.disconReason;
                                        gRow.BillingCycle = res.billCycle;
                                        gRow.PRCode = res.prCode;
                                        gRow.PREmail = res.prEmail;
                                        gRow.ContractEmail = res.contractEmail;
                                        gRow.CustomerIDNumber = resHeader.custRef;
                                        gRow.OldNIC = resHeader.oldCustRef;
                                        gRow.AccountNo = res.accountNo;
                                        gRow.SBU = res.Sbu;
                                        gRow.ProductType = res.productType;
                                        gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                        gRow.ContactNo = res.ContactNo;
                                        gRow.Remarks = $scope.BulkPayment.Remarks;

                                        if ($scope.BulkPayment.BillPaymentType != 3) {
                                            gRow.ConnectionReferenceGridDisabled = true;
                                            gRow.ContractNumberGridDisabled = true;
                                            gRow.AmountGridDisabled = false;
                                            gRow.ReferenceNumberGridDisabled = false;
                                            gRow.RemarksGridDisabled = false;
                                        } else {
                                            gRow.ConnectionReferenceGridDisabled = true;
                                            gRow.ContractNumberGridDisabled = true;
                                            gRow.AmountGridDisabled = true;
                                            gRow.ReferenceNumberGridDisabled = true;
                                            gRow.RemarksGridDisabled = true;
                                        }

                                        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                        if (defaultDataCookieObj != null) {
                                            gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";

                                        }
                                        gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                        gRow.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: $scope.BulkPayment.PaymentMethod })[0].Description : "";
                                        gRow.IsSelected = true;
                                    } else {
                                        if (res.contractNo != null && res.contractNo == gRow.ContractNumber) {
                                            gRow.IsValiedAccount = true;

                                            isCrmFail = false;
                                            gRow.IsRetrivedCrmDetails = false;
                                            gRow.PrePost = res.accountType;
                                            gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                            gRow.Hybrid = res.hybridFlag == 1 ? "Y" : "N";
                                            gRow.ConnectionReference = res.connRef;
                                            gRow.ContractNumber = res.contractNo;
                                            gRow.CustomerName = resHeader.custName;
                                            gRow.CustomerIDType = resHeader.custRefType;
                                            gRow.DisconnectedCode = res.disconReasonCode;
                                            gRow.SwitchStatus = res.conStatus;
                                            gRow.SwitchStatusDesc = res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense';
                                            gRow.DisconnectedReason = res.disconReason;
                                            gRow.BillingCycle = res.billCycle;
                                            gRow.PRCode = res.prCode;
                                            gRow.PREmail = res.prEmail;
                                            gRow.ContractEmail = res.contractEmail;
                                            gRow.CustomerIDNumber = resHeader.custRef;
                                            gRow.OldNIC = resHeader.oldCustRef;
                                            gRow.AccountNo = res.accountNo;
                                            gRow.SBU = res.Sbu;
                                            gRow.ProductType = res.productType;
                                            gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                            gRow.ContactNo = res.ContactNo;
                                            gRow.Remarks = $scope.BulkPayment.Remarks;

                                            if ($scope.BulkPayment.BillPaymentType != 3) {
                                                gRow.ConnectionReferenceGridDisabled = true;
                                                gRow.ContractNumberGridDisabled = true;
                                                gRow.AmountGridDisabled = false;
                                                gRow.ReferenceNumberGridDisabled = false;
                                                gRow.RemarksGridDisabled = false;
                                            } else {
                                                gRow.ConnectionReferenceGridDisabled = true;
                                                gRow.ContractNumberGridDisabled = true;
                                                gRow.AmountGridDisabled = true;
                                                gRow.ReferenceNumberGridDisabled = true;
                                                gRow.RemarksGridDisabled = true;
                                            }

                                            var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                            if (defaultDataCookieObj != null) {
                                                gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";

                                            }
                                            gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                            gRow.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: $scope.BulkPayment.PaymentMethod })[0].Description : "";
                                        }
                                    }
                                }
                                else if (res.accountType == 2) {
                                    if (res.connRef != null && res.connRef == gRow.ConnectionReference) {
                                        gRow.IsValiedAccount = true;

                                        isCrmFail = false;
                                        gRow.IsRetrivedCrmDetails = false;
                                        gRow.PrePost = res.accountType;
                                        gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                        gRow.Hybrid = res.hybridFlag == 1 ? "Y" : "N";
                                        gRow.ConnectionReference = res.connRef;
                                        gRow.ContractNumber = res.contractNo;
                                        gRow.CustomerName = resHeader.custName;
                                        gRow.CustomerIDType = resHeader.custRefType;
                                        gRow.DisconnectedCode = res.disconReasonCode;
                                        gRow.SwitchStatus = res.conStatus;
                                        gRow.SwitchStatusDesc = res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense';
                                        gRow.DisconnectedReason = res.disconReason;
                                        gRow.BillingCycle = res.billCycle;
                                        gRow.PRCode = res.prCode;
                                        gRow.PREmail = res.prEmail;
                                        gRow.ContractEmail = res.contractEmail;
                                        gRow.CustomerIDNumber = resHeader.custRef;
                                        gRow.OldNIC = resHeader.oldCustRef;
                                        gRow.AccountNo = res.accountNo;
                                        gRow.SBU = res.Sbu;
                                        gRow.ProductType = res.productType;
                                        gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                        gRow.ContactNo = res.ContactNo;
                                        gRow.Remarks = $scope.BulkPayment.Remarks;
                                        gRow.IsSelected = gRow.IsSelected;
                                        if ($scope.BulkPayment.BillPaymentType != 3) {
                                            gRow.ConnectionReferenceGridDisabled = true;
                                            gRow.ContractNumberGridDisabled = true;
                                            gRow.AmountGridDisabled = false;
                                            gRow.ReferenceNumberGridDisabled = false;
                                            gRow.RemarksGridDisabled = false;
                                        } else {
                                            gRow.ConnectionReferenceGridDisabled = true;
                                            gRow.ContractNumberGridDisabled = true;
                                            gRow.AmountGridDisabled = true;
                                            gRow.ReferenceNumberGridDisabled = true;
                                            gRow.RemarksGridDisabled = true;
                                        }

                                        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                        if (defaultDataCookieObj != null) {
                                            gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";

                                        }
                                        gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                        gRow.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: $scope.BulkPayment.PaymentMethod })[0].Description : "";
                                    }
                                    else if (res.contractNo != null && res.contractNo == gRow.ContractNumber) {
                                        gRow.IsValiedAccount = true;

                                            isCrmFail = false;
                                            gRow.IsRetrivedCrmDetails = false;
                                            gRow.PrePost = res.accountType;
                                            gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                            gRow.Hybrid = res.hybridFlag == 1 ? "Y" : "N";
                                            gRow.ConnectionReference = res.connRef;
                                            gRow.ContractNumber = res.contractNo;
                                            gRow.CustomerName = resHeader.custName;
                                            gRow.CustomerIDType = resHeader.custRefType;
                                            gRow.DisconnectedCode = res.disconReasonCode;
                                            gRow.SwitchStatus = res.conStatus;
                                            gRow.SwitchStatusDesc = res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense';
                                            gRow.DisconnectedReason = res.disconReason;
                                            gRow.BillingCycle = res.billCycle;
                                            gRow.PRCode = res.prCode;
                                            gRow.PREmail = res.prEmail;
                                            gRow.ContractEmail = res.contractEmail;
                                            gRow.CustomerIDNumber = resHeader.custRef;
                                            gRow.OldNIC = resHeader.oldCustRef;
                                            gRow.AccountNo = res.accountNo;
                                            gRow.SBU = res.Sbu;
                                            gRow.ProductType = res.productType;
                                        gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'GSM and DTV' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                            gRow.ContactNo = res.ContactNo;
                                            gRow.Remarks = $scope.BulkPayment.Remarks;
                                            gRow.IsSelected = gRow.IsSelected;
                                            if ($scope.BulkPayment.BillPaymentType != 3) {
                                                gRow.ConnectionReferenceGridDisabled = true;
                                                gRow.ContractNumberGridDisabled = true;
                                                gRow.AmountGridDisabled = false;
                                                gRow.ReferenceNumberGridDisabled = false;
                                                gRow.RemarksGridDisabled = false;
                                            } else {
                                                gRow.ConnectionReferenceGridDisabled = true;
                                                gRow.ContractNumberGridDisabled = true;
                                                gRow.AmountGridDisabled = true;
                                                gRow.ReferenceNumberGridDisabled = true;
                                                gRow.RemarksGridDisabled = true;
                                            }

                                            var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                            if (defaultDataCookieObj != null) {
                                                gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";
                                            }
                                            gRow.PrePostDesc = res.accountType == 1 ? "Pre" : "Post";
                                            gRow.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: $scope.BulkPayment.PaymentMethod })[0].Description : "";
                                    } else {
                                        gRow.IsSelected = gRow.IsSelected;
                                    }
                                    
                                }
                                
                            });
                        });

                        if (isCrmFail) {
                            gRow.IsRetrivedCrmDetails = true;
                        }
                        //gRow.IsSelected = true;

                        //Added by Ruwan
                        var totAmt = 0.00;
                        angular.forEach(GData, function (row) {
                            //$scope.TotAmt = (Number(row.Amount) + Number($scope.TotAmt)).toFixed(2);
                            totAmt = (parseFloat(row.Amount) + parseFloat(totAmt)).toFixed(2);
                        });
                        $scope.BulkPayment.TotalAmount = totAmt;

                    });
                }

                //if (response.Result.profiles.length > 0) {
                    //$scope.IsRetrivedCrmDetailsBulk = false;
                //}
                //var GData = $scope.dgGridBulkPayment.data();
            }

            $scope.CheckRowColor();
            var GData = $scope.dgGridBulkPayment.data();
            var totAmt = 0;
            var totCount = 0;
            angular.forEach(GData, function (gRow) {
                var isCrmFail = true;

                if (gRow.PrePost == 1) {
                    gRow.IsSelected = false;
                    gRow.row = true;
                }

                if (gRow.PrePost == 2) {
                    totAmt = (Number(gRow.Amount) + Number(totAmt)).toFixed(2); //Number(totAmt).toFixed(2) + Number(row.Amount).toFixed(2);
                    totCount++;
                }

                //IsValiedAccount
                angular.forEach(response.Result.ListofInValidNumbers, function (invList) {
                    if (invList.msisdn == gRow.ConnectionReference) {
                        gRow.IsValiedAccount = false;
                    }
                    else if (invList.contractNo == gRow.ContractNumber) {
                        gRow.IsValiedAccount = false;
                    }

                });
            });
            $scope.BulkPayment.NoOfRecords = totCount;
            $scope.BulkPayment.TotalPayAmount = totAmt > 0 ? Number(totAmt).toFixed(2) : Number(0).toFixed(2);
            $scope.BulkPayment.TotalAmount = Number(totAmt).toFixed(2);

        }).error(function (response) {
            if (response.Result.isNewAccessToken) {
                $cookieStore.put("accessToken", response.Result.accessToken);
            } toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
            return;
        });

    }

    $scope.CreateCRMObjectToValidateSingle = function (e) {
        var AccountList = [];
        if (e.dataItem != undefined) {
            if (e.dataItem.ConnectionReference != "" && !angular.isUndefined(e.dataItem.ConnectionReference)
            || e.dataItem.ContractNumber != "" && !angular.isUndefined(e.dataItem.ContractNumber)) {
                AccountList.push({
                    "connRef": e.dataItem.ConnectionReference,
                    //"accountNo": e.dataItem.AccountNo,
                    "contractNo": e.dataItem.ContractNumber
                });
                $scope.RequetCRMDetails(AccountList);
            } else {
                toaster.error({ type: 'error', title: 'Error', body: "One of the fields (MSISDN or ContractNumber) should provide!", showCloseButton: true });
            }
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "One of the fields (MSISDN or ContractNumber) should provide!", showCloseButton: true });
        }
        
    }

    $scope.CreateCRMObjectToValidateBulk = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var objAccountList = [];
        
        angular.forEach(GData, function (row) {
            if (row.ConnectionReference != "" && !angular.isUndefined(row.ConnectionReference) && row.ConnectionReference != null
                || row.ContractNumber != "" && !angular.isUndefined(row.ContractNumber) && row.ContractNumber != null) {
                objAccountList.push({ 'connRef': row.ConnectionReference, 'contractNo': row.ContractNumber });//, 'accountNo': row.AccountNo 
            }
        });

        if (objAccountList.length > 0) {
            $scope.RequetCRMDetails(objAccountList);
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "One of the fields (MSISDN or ContractNumber) should provide!", showCloseButton: true });
            return;
        }
        
    }

    $scope.GetCRMDetailsByID = function (type) {

        if (type == 1) {
            if (angular.isUndefined($scope.BulkPayment.OldNic) || $scope.BulkPayment.OldNic == null) {
                return;
            } else if ($scope.BulkPayment.IdType == 'NIC') {
                if ($scope.BulkPayment.OldNic.length != 10) {
                    toaster.error({ type: 'error', title: 'Error', body: "Old NIC length should be limited to 10", showCloseButton: true });
                    return;
                }
                if ($scope.BulkPayment.OldNic == "") {
                    //toaster.error({ type: 'error', title: 'Error', body: "Old NIC length should be limited to 10", showCloseButton: true });
                    return;
                }
            } else if ($scope.BulkPayment.IdType == 'TIN' || $scope.BulkPayment.IdType == 'PP' || $scope.BulkPayment.IdType == 'Oth') {
                if ($scope.BulkPayment.OldNic.length > 25) {
                    toaster.error({ type: 'error', title: 'Error', body: "Old NIC length should be limited to 25", showCloseButton: true });
                    return;
                }
                if ($scope.BulkPayment.OldNic == 0) {
                    //toaster.error({ type: 'error', title: 'Error', body: "Old NIC length should be limited to 25", showCloseButton: true });
                    return;
                }
            }
            
        } else {
            if (angular.isUndefined($scope.BulkPayment.NewNic) || $scope.BulkPayment.NewNic == null) {
                return;
            }
            if ($scope.BulkPayment.NewNic == "") {
                //toaster.error({ type: 'error', title: 'Error', body: "Old NIC length should be limited to 10", showCloseButton: true });
                return;
            }
        }
        $scope.RequetCRMDetails();

    }
    // #########################        END Retrive CRM details  ##############################


    // #########################        START Retrive PE details  ##############################
    $scope.RequetPEDetails = function (pEAccList) {
        
        var obj = {
            "productCategory": $scope.BulkPayment.ProdCat,
            "accounts": pEAccList,
            "accessToken": $cookieStore.get('accessToken')
        }

        if (pEAccList.length == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Valied items not found!", showCloseButton: true });
            return;
        }

        BulkPaymentService.ValidateRecordsFromPE(obj).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: "PE - " + response.Message, showCloseButton: true });
                return;
            } else {
                var GData = $scope.dgGridBulkPayment.data();
                toaster.success({ type: 'Success', title: 'Success', body: "PE - " + response.Message, showCloseButton: true });

                angular.forEach(response.Result.accounts, function (res) {
                    angular.forEach(GData, function (gRow) {
                        if (res.connRef == gRow.ConnectionReference && res.contractNo == gRow.ContractNumber) {
                            //gRow.TotalOutstanding = res.totalOS;
                            gRow.BalanceAsAt = res.totalOS;
                            gRow.MinReconFee = res.minAmtToConnect;
                            gRow.DTVReconFee = res.reconFee;
                        }
                    });
                });
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
    }

    $scope.CreatePEObjectToValidateSingle = function (e) {
        var obj = [];
        if (e.dataItem == undefined) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to PE!", showCloseButton: true });
            return;
        }

        $('tr[data-uid="' + e.dataItem.uid + '"] ').addClass("bg-highlightOrange");

        if (e.dataItem.IsSelected) {
            //if ((angular.isUndefined(e.dataItem.ConnectionReference) || e.dataItem.ConnectionReference == '') &&
            //    (angular.isUndefined(e.dataItem.ContractNumber) || e.dataItem.ContractNumber == '')) {
            if (e.dataItem.IsValiedAccount) {
                if (e.dataItem.PrePost != "" && !angular.isUndefined(e.dataItem.PrePost)) {
                    obj.push({ 'connRef': e.dataItem.ConnectionReference, 'sbu': e.dataItem.SBU, 'contractNo': e.dataItem.ContractNumber, 'accountType': e.dataItem.PrePost, 'productType': e.dataItem.ProductType });
                    $scope.RequetPEDetails(obj);
                }
                //else {
                //        toaster.error({ type: 'error', title: 'Error', body: "AccountType (Prepaid / Post-paid) should retrive from CRM!", showCloseButton: true });
                //    }
            } else {
                toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to PE!", showCloseButton: true });
            }//}
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "Please select item to get PE data!", showCloseButton: true });
        }
        
    }

    $scope.CreatePEObjectToValidateBulk = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var obj = [];
        var isExistInValiedAccount = false;
        angular.forEach(GData, function (row) {

            if (row.IsSelected) {
                if ((!angular.isUndefined(row.ConnectionReference) && row.ConnectionReference != '') &&
                (!angular.isUndefined(row.ContractNumber) && row.ContractNumber != '')) {
                    if (row.IsValiedAccount) {
                        if (row.PrePost != "" && !angular.isUndefined(row.PrePost)) {
                            obj.push({ 'connRef': row.ConnectionReference, 'sbu': row.SBU, 'contractNo': row.ContractNumber, 'accountType': row.PrePost, 'productType': row.ProductType });
                        }
                    }
                    else {
                        isExistInValiedAccount = true;
                    }
                }
            }
            
        });

        if (isExistInValiedAccount) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to PE. Please deselect invalied items.", showCloseButton: true });
            return;
        }
        $scope.RequetPEDetails(obj);

    }
    // #########################        END Retrive PE details  ##############################


    // #########################        START Retrive RBM details  ##############################
    $scope.RequetRBMDetails = function (rBMAccList) {

        var obj = {
            "productCategory": $scope.BulkPayment.ProdCat,
            "accounts": rBMAccList,
            "accessToken": $cookieStore.get('accessToken')
        }

        if (rBMAccList.length == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Valied items not found!", showCloseButton: true });
            return;
        }

        BulkPaymentService.ValidateRecordsFromRBM(obj).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: "RBM - " + response.Message, showCloseButton: true });
                return;
            } else {
                var GData = $scope.dgGridBulkPayment.data();
                angular.forEach(response.Result.accounts, function (res) {
                    angular.forEach(GData, function (gRow) {
                        if (res.connRef == gRow.ConnectionReference && res.contractNo == gRow.ContractNumber) {
                            gRow.LastMonthBillAmount = res.lastBill;
                            gRow.TotalOutstanding = res.totalOust;
                        }
                    });
                });
                toaster.success({ type: 'Success', title: 'Success', body: "RBM - " + response.Message, showCloseButton: true });
                var GData = $scope.dgGridBulkPayment.data();
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });

    }

    $scope.CreateRBMObjectToValidateSingle = function (e) {
        var obj = [];
        if (e.dataItem == undefined) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to PE!", showCloseButton: true });
            return;
        }

        $('tr[data-uid="' + e.dataItem.uid + '"] ').addClass("bg-highlightOrange");

        if (e.dataItem.IsSelected) {
            //if ((!angular.isUndefined(e.dataItem.ConnectionReference) || e.dataItem.ConnectionReference != '') &&
            //    (!angular.isUndefined(e.dataItem.ContractNumber) || e.dataItem.ContractNumber != '')) {
                if (e.dataItem.IsValiedAccount) {
                    obj.push({ 'connRef': e.dataItem.ConnectionReference, 'sbu': e.dataItem.SBU, 'contractNo': e.dataItem.ContractNumber, 'productType': e.dataItem.ProductType, 'accountType': e.dataItem.PrePost });
                    $scope.RequetRBMDetails(obj);
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to RBM", showCloseButton: true });
                    return;
                }
            //}

        } else {
            toaster.error({ type: 'error', title: 'Error', body: "Please select item to get RBM data!", showCloseButton: true });
        }


    }

    $scope.CreateRBMObjectToValidateBulk = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var obj = [];

        var isExistInValiedAccount = false;
        angular.forEach(GData, function (row) {
            if ((!angular.isUndefined(row.ConnectionReference) && row.ConnectionReference != '') &&
                (!angular.isUndefined(row.ContractNumber) && row.ContractNumber != '')) {
                if (row.IsSelected) {
                    if (row.IsValiedAccount) {
                        obj.push({ 'connRef': row.ConnectionReference, 'sbu': row.SBU, 'contractNo': row.ContractNumber, 'productType': row.ProductType, 'accountType': row.PrePost });
                    } else {
                        isExistInValiedAccount = true;
                    }
                }
            }
        });

        if (isExistInValiedAccount) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to RBM. Please deselect invalied items.", showCloseButton: true });
            return;
        }


        if (obj.length > 0) {
            $scope.RequetRBMDetails(obj);
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "Required details missing, Please retrieve the customer details again", showCloseButton: true });
            return;
        }
        
        
    }
    // #########################        Retrive RBM details  ##############################


    // #########################        Retrive OCS details  ##############################
    $scope.RequetOCSDetails = function (oCSAccList) {

        var obj = {
            "productCategory": $scope.BulkPayment.ProdCat,
            "accounts": oCSAccList,
            "accessToken": $cookieStore.get('accessToken')
        }

        if (oCSAccList.length == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Valied items not found!", showCloseButton: true });
            return;
        }

        BulkPaymentService.ValidateRecordsFromOCS(obj).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: "OCS - " + response.Message, showCloseButton: true });
            } else {
                //if (response.Result.accounts.length < 1 && response.Result.invalidAccounts.length > 1) {
                //    toaster.error({ type: 'error', title: 'Error', body: "OCS - " + " Invalied Accounts exists!", showCloseButton: true });
                //    return;
                //}

                var GData = $scope.dgGridBulkPayment.data();

                
                angular.forEach(response.Result.accounts, function (res) {
                    angular.forEach(GData, function (gRow) {
                        if (res.connRef == gRow.ConnectionReference && res.contractNo == gRow.ContractNumber) {
                            gRow.OCSStatus = res.creditStatus;
                            gRow.OCSStatusDesc = res.creditStatus == SwitchStatus.Connected ? 'Connected' : res.creditStatus == SwitchStatus.Disconnected ? 'Disconnected' : 'Suspense';
                        }
                    });
                });

                if (response.Result.invalidAccounts.length > 0) {
                    angular.forEach(response.Result.invalidAccounts, function (res) {
                        toaster.error({ type: 'error', title: 'Error', body: "Invalied account's exists ConnRef: " + res.connRef + " , " + "Contract No: " + res.contractNo + " | ", showCloseButton: true });
                        return;
                    });
                } else {
                    if (response.Result.accounts.length < 1) {
                        toaster.error({ type: 'error', title: 'Error', body: "OCS - " + " Account details not found in response!", showCloseButton: true }); return;
                        return;
                    }
                    toaster.success({ type: 'Success', title: 'Success', body: "OCS - " + response.Message, showCloseButton: true });
                }
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });

    }

    $scope.CreateOCSObjectToValidateSingle = function (e) {
        var obj = [];
        if (e.dataItem == undefined) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to OCS!", showCloseButton: true });
            return;
        }
        $('tr[data-uid="' + e.dataItem.uid + '"] ').addClass("bg-highlightOrange");

        var isExistInValiedAccount = false;
        //if ((angular.isUndefined(e.dataItem.ConnectionReference) || e.dataItem.ConnectionReference == '') &&
        //        (angular.isUndefined(e.dataItem.ContractNumber) || e.dataItem.ContractNumber == '')) {
        if (e.dataItem.IsSelected) {
            if (e.dataItem.IsValiedAccount) {
                obj.push({ 'connRef': e.dataItem.ConnectionReference, 'sbu': e.dataItem.SBU, 'contractNo': e.dataItem.ContractNumber, 'accountType': e.dataItem.PrePost, 'productType': e.dataItem.ProductType });
                $scope.RequetOCSDetails(obj);
            } else {
                toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to OCS", showCloseButton: true });
                return;
            }
        } else {
            if (e.dataItem.IsValiedAccount) {
                if (e.dataItem.ProductType == 1) // if WIFI
                {
                    toaster.error({ type: 'Error', title: 'Error', body: "Wifi number exists! ", showCloseButton: true });
                    return;
                }
            } else {
                isExistInValiedAccount = true;
                toaster.error({ type: 'Error', title: 'Error', body: "Account is Invalied! ", showCloseButton: true });
                return;
            }
        }
    }

    $scope.CreateOCSObjectToValidateBulk = function () {
        //$scope.alertMessage = new Message(1, "Success!");
        var GData = $scope.dgGridBulkPayment.data();
        var obj = [];

        var isExistInValiedAccount = false;

        var isExistWifi = "";

        angular.forEach(GData, function (row) {
            if ((!angular.isUndefined(row.ConnectionReference) && row.ConnectionReference != '') &&
                (!angular.isUndefined(row.ContractNumber) && row.ContractNumber != '')) {
                if (row.IsSelected) {
                    if (row.IsValiedAccount) {
                        if (row.ProductType == 1) // if WIFI
                        {
                            isExistWifi = isExistWifi + " Conn Ref: " + row.ConnectionReference + ", ";
                        }
                        else {
                            obj.push({ 'connRef': row.ConnectionReference, 'sbu': row.SBU, 'contractNo': row.ContractNumber, 'productType': row.ProductType, 'accountType': row.PrePost });
                        }
                    } else {
                        isExistInValiedAccount = true;
                    }

                    
                }
            }
            
        });

        if (isExistInValiedAccount) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to OCS. Please deselect invalied items.", showCloseButton: true });
            return;
        }
        if (isExistWifi != "") {
            if (obj.length < 1) {
                toaster.error({ type: 'error', title: 'Error', body: "Wifi numbers not supported to retrive OCS data!.", showCloseButton: true });
                return;
            } else {
                if ($scope.BulkPayment.ProdCat == 1) {
                    toaster.success({ type: 'Success', title: 'Success', body: "Wifi number exists and skiped! " + isExistWifi, showCloseButton: true });
                    //return;
                }
            }
            
        }
        $scope.RequetOCSDetails(obj);
    }
    // #########################        Retrive RBM details  ##############################

    // #########################        Retrive ADF remarks details  ##############################
    $scope.RequetADFDetails = function (aDFAccList) {

        var obj = {
            "productCategory": $scope.BulkPayment.ProdCat,
            "accounts": aDFAccList,
            "accessToken": $cookieStore.get('accessToken')
        }

        if (aDFAccList.length == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Valied items not found!", showCloseButton: true });
            return;
        }

        BulkPaymentService.ValidateRecordsFromADF(obj).success(function (response) {
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: "ADF - " + response.Message, showCloseButton: true });
                return;
            } else {
                var GData = $scope.dgGridBulkPayment.data();
                toaster.success({ type: 'Success', title: 'Success', body: "ADF - " + response.Message, showCloseButton: true });
                var remarksArray = [];
                angular.forEach(response.Result.accounts, function (res) {
                    angular.forEach(res.remarks, function (rem) {
                        remarksArray.push({
                            'notes': '', 'Remark': rem.remark, 'CreatedDate': rem.createdDate, 'CreatedUser': rem.createdUser
                        });
                    });
                });
                
                $scope.adfRemarksDirectiveParams.params = remarksArray ? remarksArray : [];
                //$scope.adfRemarksDirectiveParams.data = [{ Note: '457000', Remark: 'abc', CreatedDate: '2016/01/01', CreatedUser: '002' }];//remarksArray;//RandomBillPaymentObjectCollection ? RandomBillPaymentObjectCollection : [];

                $("#myADFRemarks").modal('show');
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
    }

    $scope.CreateADFObjectToValidateSingle = function (e) {

        if (e.dataItem == undefined) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to PE!", showCloseButton: true });
            return;
        }

        var aDFAccList = [];
        if (e.dataItem.IsSelected) {
            if (e.dataItem.IsValiedAccount) {
                aDFAccList.push({ 'contractNo': e.dataItem.ContractNumber, 'sbu': e.dataItem.SBU, 'productType': e.dataItem.ProductType });
                $scope.RequetADFDetails(aDFAccList);

            } else {
                toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to ADF!", showCloseButton: true });
            }
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "Please select item to get ADF Remark data!", showCloseButton: true });
        }
        

    }


    $scope.CreateADFObjectToValidateBulk = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var obj = [];
        var isExistInValiedAccount = false;
        angular.forEach(GData, function (row) {
            if (row.IsSelected) {
                if (row.IsValiedAccount) {
                    //obj.push({ 'contractNo': e.dataItem.ContractNumber, 'sbu': e.dataItem.SBU, 'productType': e.dataItem.ProductType });
                }
                else {
                    isExistInValiedAccount = true;
                }
            }
            
        });

        if (isExistInValiedAccount) {
            toaster.error({ type: 'error', title: 'Error', body: "Only CRM validated accounts send to ADF Remarks. Please deselect invalied items.", showCloseButton: true });
            return;
        }
        $scope.RequetADFDetails(obj);

    }


    ///////////////ADF Remarks Modal//////////////

    $scope.adfRemarksDirectiveParams = {
        title: "ADF Remarks",
        params: {


        },
        callback: function () {

        },
        data: []
    };

    // #########################        Retrive ADF remarks details  ##############################


    $scope.UpdateDateTime = function () {

        if ($scope.BulkPayment == null || $scope.BulkPayment.BatchId == undefined || $scope.BulkPayment.BatchId == '') {
            $scope.currentDate = new Date();
            //$scope.BulkPayment.DateTime = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss');
        }
        if ($scope.dgGridBulkPayment.data().length > 1) {
            $scope.BulkPayment.AddPaymentRadioBtnIsDisabled = true;
            $scope.BulkPayment.CustIdRadioBtnIsDisabled = true;
            $scope.BulkPayment.BillInvRadioBtnIsDisabled = true;
            $scope.BulkPayment.UploadRadioBtnIsDisabled = true;
        }
    }

    $scope.IsReadyForSubmit = true;
    //  #####################       Payment mode        ##################################
    $scope.ValidateRecords = function () {
        var GData = $scope.dgGridBulkPayment.data();
        var isAllValidated = true;
        var selectedCount = 0;
        var noPayCount = 0;
        var isError = false;
        angular.forEach(GData, function (item) {
            if (item.IsValiedAccount != undefined) {
                if (!item.IsValiedAccount && item.IsSelected) {
                    isAllValidated = false;
                } else {
                    if (item.IsSelected) {
                        if (item.Amount == undefined || item.Amount == "" || item.Amount == 0) {
                            noPayCount++;
                        }
                        selectedCount++;
                    }

                }
            }
        });

        if (noPayCount > 0) {
            $scope.BulkPayment.PaymentMode = '0'
            return "Please select the payments you want to submit!";
        }

        if (selectedCount == 0) {
            $scope.BulkPayment.PaymentMode = '0'
            return "Please select the payments you want to submit!";
        }
        if (!isAllValidated) {
            $scope.BulkPayment.PaymentMode = '0'
            return "Some of the payments submitting has invalid numbers. Please correct those numbers or uncheck them before submitting!";
        }
        return "";
    }

    $scope.ResetPaymantModeDerective = function () {
        $scope.BulkPayment.PaymentMode = "CA";
        $scope.SelectedPaymentMode = $scope.BulkPayment.PaymentMode;
        objTemp.PaymentMode = $scope.SelectedPaymentMode;
        objTemp.MobileNo = "";
        objTemp.Callback = $scope.paymentModeCallBack;
        objTemp.CustomerRef = "";
        objTemp.Amount = $scope.BulkPayment.TotalPayAmount;
        objTemp.ItemSbu = currentSBU;
        $scope.Options = objTemp;
    }

    $scope.SetPaymentMode = function () {
          
        if ($scope.BulkPayment.PaymentMode == "GN") {
            var GenieCounterId = JSON.parse(localStorage.getItem('profile')).GenieCounterId;
            if (GenieCounterId == null || GenieCounterId == 0) {
                toaster.error({ type: 'error', title: 'Error', body: "Genie counter ID not defined. So cannot take a payment from Genie.", showCloseButton: true });
                $scope.BulkPayment.PaymentMode = "CA";
                return;
            }
        }

        if ($scope.IsLoadingAtFirstTime) {
            $scope.IsLoadingAtFirstTime = false;
            return;
        }
        $scope.errorDesc = $scope.ValidateRecords();
        if ($scope.errorDesc != "") {
            toaster.error({ type: 'error', title: 'Error', body: $scope.errorDesc, showCloseButton: true });
            $scope.BulkPayment.PaymentMode = "0";
            return;
        }

        $scope.NewExistingReference = "";
        $scope.BulkPayment.ExistingReference = "";
        $scope.disabled = { AppliedAmount: true };//, Save: true
        var objTemp = new PaymentModeOptions();

        var isAllValidatedError = false;
        var GData = $scope.dgGridBulkPayment.data();
        var isPrePaidExist = false;
        var isDisconnectedExists = false;
        var currentSBU = 10;
        var isAllReceiptInSameSBU = true;

        angular.forEach(GData, function (row) {
            if (row.IsSelected) {
                if (row.IsValiedAccount != true) {
                    if ((angular.isUndefined(row.ConnectionReference) || row.ConnectionReference == '') &&
                    (angular.isUndefined(row.ContractNumber) || row.ContractNumber == '') ||
                    (angular.isUndefined(row.Amount) || row.Amount == '')) {
                        isAllValidatedError = true;
                    } 
                } else if (row.SwitchStatus == SwitchStatus.Disconnected) {
                    isDisconnectedExists = true;
                }
                if (row.SBU != null) {
                    if (currentSBU == 10) {
                        currentSBU = row.SBU;
                    } else if (row.SBU != currentSBU) {
                        isAllReceiptInSameSBU = false;
                    }
                }
                
                if (row.PrePost == 1) {
                    isPrePaidExist = true;
                }
            }
        });

        if (isDisconnectedExists && $scope.BulkPayment.PaymentMode == PaymentModesTypes.Cheque) {
            $scope.customMessage = {
                Title: 'Message',
                Message: 'Disconnected number exists Do you want to continue!'
            };
            $scope.IsReadyForSubmit = false;
            $scope.yesNoMessageParams = {
                Id: 2
            };
            $scope.YesNoMessageOpen();
        }

        if (isPrePaidExist) {
            toaster.error({ type: 'error', title: 'Error', body: "Prepaid account/s exists! Please uncheck Prepaid account/s data.", showCloseButton: true });
            $scope.ResetPaymantModeDerective();
            return;
        }

        if (isAllValidatedError) {
            toaster.error({ type: 'error', title: 'Error', body: "Some of the payments submitting has invalid numbers. Please correct those numbers or uncheck them before submitting.", showCloseButton: true });
            $scope.ResetPaymantModeDerective();
            return;
        }
        
        
        $scope.IsReadyForSubmit = true;

        objTemp.Params = {};
        objTemp.Params.InvoiceNo = "";//$scope.receipt.InvoiceId; // Voucher payment mode

        if (angular.isUndefined($scope.BulkPayment.PaymentMode)) {
            $scope.disabled.AppliedAmount = true;
            //return;
        }
        if ($scope.BulkPayment.PaymentMode == '0') {
            $scope.disabled.AppliedAmount = true;//, Save: true
            //return;
        }

        $scope.disabled.AppliedAmount = false;

        if ($scope.BulkPayment.PaymentMode != PaymentModesTypes.StarPoints && $scope.BulkPayment.PaymentMode != PaymentModesTypes.SMSVoucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.BTR && $scope.BulkPayment.PaymentMode != PaymentModesTypes.IBUY && $scope.BulkPayment.PaymentMode != PaymentModesTypes.GiftVoucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.Miscellaneous && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Voucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.eZCash && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Cheque && $scope.BulkPayment.PaymentMode != PaymentModesTypes.CreditCard
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.PreOrder && $scope.BulkPayment.PaymentMode != PaymentModesTypes.MS2
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.DDB
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Genie) {

            if ($scope.BulkPayment.PaymentMode == PaymentModesTypes.Cash) {
                angular.forEach(GData, function (row) {
                    row.row = false;
                });
                $scope.PaymentGridSelectAll = false;
            } else {
                angular.forEach(GData, function (row) {
                    row.row = true;
                });
                $scope.PaymentGridSelectAll = true;
            }

            $scope.formdata = {
                PaymentMode: $scope.BulkPayment.PaymentMode,
                AppliedAmount: $scope.BulkPayment.TotalPayAmount,
                PaymentModeDescription: $scope.BulkPayment.PaymentMode
            };
            $scope.paymentModeCallBack($scope.formdata);
        }
        else {
            
            
            if (!isAllReceiptInSameSBU && $scope.BulkPayment.PaymentMode == PaymentModesTypes.StarPoints) {
                toaster.error({ type: 'error', title: 'Error', body: "Payment for multiple SBUs cannot be paid from Star Point payment mode. Please select another payment mode .", showCloseButton: true });
                $scope.ResetPaymantModeDerective();
                return;
            }
            angular.forEach(GData, function (row) {
                row.row = true;
            });
            $scope.PaymentGridSelectAll = true;

            $scope.SelectedPaymentMode = $scope.BulkPayment.PaymentMode;
            objTemp.PaymentMode = $scope.SelectedPaymentMode;
            objTemp.MobileNo = "";
            objTemp.Callback = $scope.paymentModeCallBack;
            objTemp.CustomerRef = "";
            objTemp.Amount = $scope.BulkPayment.TotalPayAmount;
            objTemp.ItemSbu = currentSBU;
            $scope.Options = objTemp;
        }
        //ii++;
    };

    //  #####################       Payment mode        ##################################


    //  #######################       COMMON              ##################################
    $scope.GenerateTotalAmountToPay = function (isEditable) {
        $scope.TotalRecordsAmt = 0;
        var dGrid = $scope.dgGridBulkPayment.data();
        angular.forEach(dGrid, function (d) {
            d.ConnectionReferenceGridDisabled = isEditable;
            d.ContractNumberGridDisabled = isEditable;
            d.AmountGridDisabled = isEditable;
            d.ReferenceNumberGridDisabled = isEditable;
            d.RemarksGridDisabled = isEditable;
            $scope.TotalRecordsAmt += d.Amount;
        });
        $scope.BulkPayment.TotalPayAmount = $scope.TotalRecordsAmt > 0 ? Number($scope.TotalRecordsAmt).toFixed(2) : Number(0).toFixed(2);//$filter('number')($scope.TotalRecordsAmt, "2");
    }

    $scope.CustomerBalance = function () {

        Number($scope.BulkPayment.CustomerPayingAmount).toFixed(2);
        console.log(Number($scope.BulkPayment.CustomerPayingAmount));
        console.log(Number($scope.BulkPayment.TotalPayAmount));
        var s = (Number($scope.BulkPayment.CustomerPayingAmount) - Number($scope.BulkPayment.TotalPayAmount)).toFixed(2);
        if (s < 0) {
            $scope.BulkPayment.Balance = Number(0).toFixed(2);
        } else {
            $scope.BulkPayment.Balance = s;
        }
        
    }

    //#######################       COMMON              ####################################

    //#######################       Payment Mode Call Back  ################################

    var paymentModeInfoObj = function () {
        this.ReceiptNo = '';
        this.ReferenceNo = '';
        this.PaymentMode = '';
        this.PaidAmount = 0;
    };

    var BillingBatchRecCollection = function () {
        this.ReceiptNo = '';
        this.BatchId = '';
        this.OutletCode = '';
        this.SbuCode = 0;
        this.ReceiptDate = 0;
        this.CustName = '';
        this.CustAddress = '';
        this.PaymentMode = '';
        this.Amount = 0;
        this.Remarks = '';
        this.PaymentModeRef = '';
        this.CustRef = '';
        this.CustRefType = '';
        this.PrePostType = '';
        this.TotalOutstanding = 0;
        this.BalanceAmt = 0;
        this.ReconFee = 0;
        this.ReceiptStatus = false;
        this.AccountNo = '';
        this.ContractId = '';
        this.RefNo = '';
        this.ProdType = '';
        this.CustomerIDType = '';
        this.ConnectionType = '';
    }


    var BillingBatchObj = function () {
        this.BatchId = '';
        this.OutletCode = '';
        this.SbuCode = $scope.BulkPayment.Sbu;
        this.ProdCat = $scope.BulkPayment.ProdCat;
        this.PaymentType = $scope.BulkPayment.PaymentType;
        
        var permissionCodes = AuthService.getProfile().permission;

        if (permissionCodes.indexOf("41001") == -1) {
            this.PaymentSource = $scope.GetPaymentSourseByCcbsPaymentSource();
        } else {
            this.PaymentSource = $scope.GetPaymentSourseByCcbsPaymentSource();
        }

        //$scope.BulkPayment.PaymentSource =
        this.PaymentMethod = $scope.BulkPayment.PaymentMethod;
        this.PaymentMode = $scope.BulkPayment.PaymentMode;
        this.BatchTotal = $scope.BulkPayment.TotalPayAmount;
        this.AttachmentRef = '';
        this.Remarks = $scope.BulkPayment.Remarks;
        this.PaymentModeRef = '';///$scope.BulkPayment.PaymentModeRef;
        this.PaymentCriteria = $scope.BulkPayment.BillPaymentType;// 0 : Random bill, 1 : Customer id, 2 : Bill invoice, 3 : Bulk upload
        this.ProdCat = $scope.BulkPayment.ProdCat;
        this.AddedUser = '';
        this.BatchRec = [];
        this.PREmail = "";
        this.ContractEmail = "";
        this.ConnectionRef = "",
        this.CustomerIDNumber = ""
        this.OldNIC = ""
    }

    $scope.paymentModeCallBack = function (data) {
        if ($scope.IsLoadingAtFirstTime) {
            $scope.IsLoadingAtFirstTime = false;
            return;
        }
        batchObj = new BillingBatchObj();
        batchObj.PaymentModeRef = data.ReferenceNo;

        var isPaymentRefExists = true;

        if ($scope.BulkPayment.PaymentMode == PaymentModesTypes.GiftVoucher) {
            var payRef = '';
            angular.forEach(data, function (row) {

                var currentRefId = '';
                if (row.ReferenceNo != "" && row.ReferenceNo != undefined) {
                    currentRefId = row.ReferenceNo;
                } else if (row != "" && row != undefined) {
                    currentRefId = row;
                } else {
                    isPaymentRefExists = false;
                }

                if (payRef != '') {
                    payRef = currentRefId + ' , ' + row.ReferenceNo;

                } else {
                    payRef = currentRefId;
                }

            });
            if (isPaymentRefExists) {
                $scope.BulkPayment.ExistingReference = payRef;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: "Payment reference NO not exist's. Please try again. ", showCloseButton: true });
                return;
            }

        }
        else if ($scope.BulkPayment.PaymentMode == PaymentModesTypes.StarPoints) {
            $scope.BulkPayment.ExistingReference = data.Request.StpReference;
            batchObj.PaymentModeRef = data.Request.StpReference;

            if (data.Request.StpReference == "" || data.Request.StpReference == undefined) {
                isPaymentRefExists = false;
            }
        }
        else if ($scope.BulkPayment.PaymentMode != PaymentModesTypes.SMSVoucher &&
                $scope.BulkPayment.PaymentMode != PaymentModesTypes.BTR && $scope.BulkPayment.PaymentMode != PaymentModesTypes.IBUY &&
                $scope.BulkPayment.PaymentMode != PaymentModesTypes.Miscellaneous && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Voucher &&
                $scope.BulkPayment.PaymentMode != PaymentModesTypes.eZCash && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Cheque && $scope.BulkPayment.PaymentMode != PaymentModesTypes.CreditCard
                && $scope.BulkPayment.PaymentMode != PaymentModesTypes.PreOrder && $scope.BulkPayment.PaymentMode != PaymentModesTypes.MS2
                && $scope.BulkPayment.PaymentMode != PaymentModesTypes.DDB
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Genie) {

            isPaymentRefExists = true;

        }
        else {
            $scope.BulkPayment.ExistingReference = data.ReferenceNo;
            if (data.ReferenceNo == "" || data.ReferenceNo == undefined) {
                isPaymentRefExists = false;
            }
        }

        if (isPaymentRefExists == false) {
            $scope.PaymentModeReset();
            toaster.error({ type: 'error', title: 'Error', body: "Payment reference NO not exist's. Please try again. ", showCloseButton: true });
            return;
        }

        $scope.disabled.AppliedAmount = false;

        var d = $scope.dgGridBulkPayment.data();
        $scope.paiedAmt = 0;

        angular.forEach(d, function (row) {
            if (row.IsSelected) {
                if (row.IsValiedAccount == true) {
                    $scope.paiedAmt = (Number($scope.paiedAmt) + Number(row.Amount)).toFixed(2);
                }
            }

            if ($scope.BulkPayment.PaymentMode == PaymentModesTypes.Cash) {
                row.row = false;
            } else {
                row.row = true;
            }
        });

        if ($scope.BulkPayment.PaymentMode == PaymentModesTypes.Cash) {
            $scope.PaymentGridSelectAll = false;
        }
        $scope.BulkPayment.TotalPayAmount = $scope.paiedAmt > 0 ? $scope.paiedAmt : Number(0).toFixed(2);
         
        if ($scope.BulkPayment.PaymentMode != PaymentModesTypes.StarPoints && $scope.BulkPayment.PaymentMode != PaymentModesTypes.SMSVoucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.BTR && $scope.BulkPayment.PaymentMode != PaymentModesTypes.IBUY && $scope.BulkPayment.PaymentMode != PaymentModesTypes.GiftVoucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.Miscellaneous && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Voucher &&
        $scope.BulkPayment.PaymentMode != PaymentModesTypes.eZCash && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Cheque && $scope.BulkPayment.PaymentMode != PaymentModesTypes.CreditCard
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.PreOrder && $scope.BulkPayment.PaymentMode != PaymentModesTypes.MS2
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.DDB
            && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Genie) {
            var objTemp = new PaymentModeOptions();
            
            $scope.SelectedPaymentMode = "50";
            objTemp.PaymentMode = "50";
            objTemp.MobileNo = new Date().getTime().toString();
            objTemp.Callback = $scope.paymentModeCallBack;
            //$scope.PaymentModeReset();

            $scope.Options = objTemp;
        }
    }

    var batchObj = new BillingBatchObj();
    //#######################       Payment Mode Call Back  ################################

    $scope.PaymentModeReset = function () {
        var objTemp = new PaymentModeOptions();

        $scope.SelectedPaymentMode = "50";
        objTemp.PaymentMode = "50";
        objTemp.MobileNo = new Date().getTime().toString();
        objTemp.Callback = $scope.paymentModeCallBack;

        $scope.Options = objTemp;
    }
    $scope.BindRetrivedBillData = function (response) {
        

        var totAmt = 0;
        var totCount = 0;
        var suspenseAmt = 0;
        var suspenseCount = 0;

        $scope.BulkPayment = response.Result;
        var gData = response.Result.BatchReceipt;
        $scope.dgGridReceiptDetails.data(gData);
        gBindData = $scope.dgGridReceiptDetails.data();
        $scope.BulkPayment.PaymentMode = response.Result.BatchReceipt.length > 0 ? response.Result.BatchReceipt[0].PaymentMode : "";
        $scope.BulkPayment.PaymentMethod = response.Result.BatchReceipt.length > 0 ? response.Result.BatchReceipt[0].PaymentMethod : "";
        $scope.BulkPayment.Sbu = response.Result.BatchReceipt.length > 0 ? response.Result.BatchReceipt[0].SBU : "";
        $scope.BulkPayment.ProdCat = response.Result.ProdCat;


        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

        //$scope.BulkPayment.PaymentSource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: response.Result.OutletCode })[0].Id : "";
        

        var isCancelExists = false;
        angular.forEach(gBindData, function (item) {
            item.IsSelected = true;

            if (item.PREmail == "" || item.PREmail == undefined) {
                item.IsEmailExists = false;
                
            } else {
                item.IsEmailExists = true;
            }
            //item.ContractEmail
            if (item.IsSuspense) {
                suspenseCount++;
                suspenseAmt = suspenseAmt + item.Amount
            }
            totAmt = totAmt + item.Amount;
            totCount++;

            if (item.ReceiptStatus != "Valid") {
                item.IsCancel = true;
                item.IsTransfer = true;
                item.IsSelected = false;
                item.IsSelectedRowDisabled = true;
                isCancelExists = true;
            }

            if (response.Result.IsSameDayTransfer < 1) {
                item.IsTransfer = true;
            }
        });

        if (isCancelExists) {
            $scope.IsSelectedTempDisabled = true;
        }

        $scope.BulkPayment.BatchId = $scope.LastRetrivedBatchId;

        $scope.BulkPayment.NoOfRecords = totCount;
        $scope.BulkPayment.TotalAmount = Number(totAmt).toFixed(2);
        $scope.BulkPayment.TToSuspendcount = suspenseCount;
        $scope.BulkPayment.TTSuspendAmount = Number(suspenseAmt).toFixed(2);

        $scope.BulkPayment.User = response.Result.AddedUser;
        $scope.BulkPayment.DateTime = response.Result.AddedDate;
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

        $scope.BulkPayment.PaymentSourceRec = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Id: response.Result.PaymentSource })[0].Description : "";
        $scope.PaymentSou = [];
        $scope.BulkPayment.PaymentType = response.Result.PaymentType;
        angular.forEach(defaultDataCookieObj.BillingPaymentSource, function (item) {
            if (item.PaymentType == $scope.BulkPayment.PaymentType) {
                $scope.PaymentSou.push({ "Id": item.CcbsPaymentSource, "Description": item.Description });
            }
        });
        $scope.PaymentSourceCollection = $scope.PaymentSou;
        var paySource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Id: response.Result.PaymentSource })[0].CcbsPaymentSource : "";
        $scope.BulkPayment.PaymentSource = paySource;
        $scope.PaymentMethodDrop = true;
        $scope.PaymentTypeDrop = true;
        $scope.PaymentSourceDrop = true;
        $scope.PaymentBu = true;
        $scope.PaymentProdCatDrop = true;

        $scope.disabled.BulkEmailButton = false;
        $scope.disabled.BulkCancelButton = false;

        $("#BulkEntry").removeClass("active");
        $("#ReceiptDetails").addClass("active");

        $("li#ListBulkEntry").removeClass("active");
        $("li#ListReceiptDetails").addClass("active");
    }

    $scope.IsRequestSent = false;

    $scope.PostBillData = function () {
        //if ($scope.BulkPayment.PaymentMode != PaymentModesTypes.StarPoints && $scope.BulkPayment.PaymentMode != PaymentModesTypes.SMSVoucher &&
        //    $scope.BulkPayment.PaymentMode != PaymentModesTypes.BTR && $scope.BulkPayment.PaymentMode != PaymentModesTypes.IBUY && $scope.BulkPayment.PaymentMode != PaymentModesTypes.GiftVoucher &&
        //    $scope.BulkPayment.PaymentMode != PaymentModesTypes.Miscellaneous && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Voucher &&
        //    $scope.BulkPayment.PaymentMode != PaymentModesTypes.eZCash && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Cheque && $scope.BulkPayment.PaymentMode != PaymentModesTypes.CreditCard
        //        && $scope.BulkPayment.PaymentMode != PaymentModesTypes.PreOrder && $scope.BulkPayment.PaymentMode != PaymentModesTypes.MS2
        //        && $scope.BulkPayment.PaymentMode != PaymentModesTypes.DDB) {
        //            batchObj = new BillingBatchObj();

        //}
        $scope.disabled.SaveButton = true;
        var IsVerticleSlashValid = false;

        if ($scope.IsRequestSent) {
            //$scope.IsRequestSent = true;
            toaster.error({ type: 'error', title: 'Error', body: "Request already sent!", showCloseButton: true });
            return;
        } else {
            $scope.IsRequestSent = true;
        }
            var GData = $scope.dgGridBulkPayment.data();
            var isAllValidatedError = false;
            var isPrePaidExist = false;
            if (!$scope.IsReadyForSubmit) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: "Request is not ready for submit!", showCloseButton: true });
                return;
            }

            if ($scope.BulkPayment.PaymentMode == 0) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: "Please select the payment mode you want to submit!", showCloseButton: true });
                return;
            }

            batchObj = new BillingBatchObj();
            batchObj.PaymentModeRef = $scope.BulkPayment.ExistingReference;

            if ($scope.BulkPayment.PaymentMode != PaymentModesTypes.StarPoints && $scope.BulkPayment.PaymentMode != PaymentModesTypes.SMSVoucher &&
            $scope.BulkPayment.PaymentMode != PaymentModesTypes.BTR && $scope.BulkPayment.PaymentMode != PaymentModesTypes.IBUY && $scope.BulkPayment.PaymentMode != PaymentModesTypes.GiftVoucher &&
            $scope.BulkPayment.PaymentMode != PaymentModesTypes.Miscellaneous && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Voucher && $scope.BulkPayment.PaymentMode != PaymentModesTypes.DDB &&
            $scope.BulkPayment.PaymentMode != PaymentModesTypes.eZCash && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Cheque && $scope.BulkPayment.PaymentMode != PaymentModesTypes.CreditCard
                && $scope.BulkPayment.PaymentMode != PaymentModesTypes.PreOrder && $scope.BulkPayment.PaymentMode != PaymentModesTypes.MS2 && $scope.BulkPayment.PaymentMode != PaymentModesTypes.Genie) {
                
            }
            else {
                if ($scope.BulkPayment.ExistingReference == "") {
                    $scope.IsRequestSent = false;
                    $scope.disabled.SaveButton = false;
                    toaster.error({ type: 'error', title: 'Error', body: "Payment mode data not found please try again!", showCloseButton: true });
                    return;
                }
            }
            
            if (!$scope.IsBackOfficeUser) {
                if ($scope.userInfo().outletCode != $scope.BulkPayment.PaymentSource) {
                    toaster.error({ type: 'error', title: 'Error', body: "Payment source not match with Outlet code!", showCloseButton: true });
                    $scope.disabled.SaveButton = false;
                    return;
                }
            }

            $scope.errorDesc = $scope.ValidateRecords();
            if ($scope.errorDesc != "") {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: $scope.errorDesc, showCloseButton: true });
                return;
            }

            angular.forEach(GData, function (row) {
                if (row.IsSelected) {
                if (row.ReferenceNumber.indexOf('|') > -1) {
                    IsVerticleSlashValid = true;
                    return;

                }
                    if (row.IsValiedAccount != true) {
                        if ((angular.isUndefined(row.ConnectionReference) || row.ConnectionReference == '') ||
                    (angular.isUndefined(row.ContractNumber) || row.ContractNumber == '') ||
                    (angular.isUndefined(row.Amount) || row.Amount == '' || row.Amount == 0)) {
                        if (row.IsValiedAccount != undefined) {
                                isAllValidatedError = true;
                            }
                        }
                    } else {
                        if (row.PrePost == 1) {
                            isPrePaidExist = true;
                        }
                        var s = new BillingBatchRecCollection();
                        s.ConnectionRef = row.ConnectionReference;
                        s.ContractId = row.ContractNumber;
                        s.SbuCode = row.SBU;//
                        s.PrePostType = row.PrePost;            
                        s.Hybrid = row.Hybrid == "Y" ? 1 : 0;
                        s.ConnectionReference = row.ConnectionReference;
                        s.ProdType = row.ProductType;
                        s.PREmail = row.PREmail;
                        s.ContractEmail = row.ContractEmail;
                        s.IsValiedAccount = row.IsValiedAccount;
                        s.ContactNo = row.ContactNo;
                        s.Amount = row.Amount;
                        s.TotalOutstanding = row.TotalOutstanding;//
                        s.BalanceAmt = row.BalanceAsAt;
                        s.ReconFee = row.MinReconFee;
                        s.ReferenceNumber = $scope.BulkPayment.ExistingReference;//
                        s.Remarks = row.Remarks;
                        s.PaymentModeRef = $scope.BulkPayment.ExistingReference;
                        s.IsSuspense = row.IsSuspend;
                        s.PaymentMode = $scope.BulkPayment.PaymentMode;
                        s.CustRef = row.CustomerIDNumber;
                        s.CustRefType = row.PrePost;
                        s.CustName = row.CustomerName;//
                        s.AccountNo = row.AccountNo;
                        s.Transferred = 2;
                        s.CustomerIDNumber = row.CustomerIDNumber;
                        s.OldNIC = row.OldNIC;
                        s.RefNo = row.ReferenceNumber;
                        s.ConnectionType = row.SwitchStatus;
                        if (row.IsSuspend) {
                            s.PaymentMethod = 3;
                        } else {
                            s.PaymentMethod = $scope.BulkPayment.PaymentMethod;
                        }
                        s.CustomerIDType = row.CustomerIDType;
                        batchObj.BatchRec.push(s);
                    }
                }               

            });
        if (IsVerticleSlashValid) {
            $scope.IsRequestSent = false;
            $scope.disabled.SaveButton = false;
            toaster.error({ type: 'error', title: 'Error', body: 'Please remove the Vertical Slash Marks ( | ) entered in the Ref. Number field', showCloseButton: true });
            return;
        }
            if (isPrePaidExist) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: "Prepaid account/s exists! Please uncheck Prepaid account/s data.", showCloseButton: true });
                return;
            }
            if (isAllValidatedError) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: "Please select the payments you want to submit!", showCloseButton: true });
                return;
            }
            if (batchObj.BatchRec.length < 1) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: "Please select the payments you want to submit!", showCloseButton: true });
                return;
            } 
            batchObj.AttachmentRef = $scope.TransRef;
            batchObj.Remarks = $scope.BulkPayment.Remarks;
            batchObj.TempAttachmentRef = $scope.TempAttachmentRef;
            batchObj.IsAttach = $scope.IsAttach;
        BulkPaymentService.PostBatchDetails(batchObj).success(function (response) {
                if (response.Code != MessageTypes.Success) {
                    $scope.IsRequestSent = false;
                    $scope.disabled.SaveButton = false;
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                    return;
                } else {
                    $scope.disabled.Remarks = true;
                    $scope.BulkPayment.BatchId = response.Result;
                    $scope.IsRequestSent = true;

                    toaster.success({ type: 'Success', title: 'Receipt/s saved successfully', body: response.Message, showCloseButton: true });
                    $scope.GetBatchDetails();
                    $scope.disabled.Remarks = true;
                    $scope.disabled.Attachment = true;
                    $scope.PaymentMethodDrop = true;
                    $scope.PaymentTypeDrop = true;
                    $scope.PaymentSourceDrop = true;
                    $scope.PaymentBu = true;
                    $scope.PaymentProdCatDrop = true;
                    $scope.IsRetrivedCrmDetails = true;
                    $scope.IsRetrivedCrmDetailsBulk = true;
                    //$scope.BindRetrivedBillData(response);
                    $scope.Get3GConnectionDetails();
                }

            }).error(function (response) {
                $scope.IsRequestSent = false;
                $scope.disabled.SaveButton = false;
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
            });
    }


    $scope.GetBatchDetails = function () {

        

        var batchId = $scope.BulkPayment.BatchId;
        if (batchId == undefined || batchId == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Please enter batchId...!", showCloseButton: true });
            return;
        }
        BulkPaymentService.GetBatchDetails(batchId).success(function (response) {

            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                $scope.dgGridBulkPayment.data([]);
                //toaster.success({ type: 'Success', title: 'Success', body: response.Message, showCloseButton: true });
                $scope.LastRetrivedBatchId = batchId;
                $scope.BindRetrivedBillData(response);
                $scope.disabled.SaveButton = true;
                $scope.disabled.Remarks = true;
                $scope.PrintAllButton12 = false;
                $scope.PrintAllButton12 = false;
                $scope.BulkPayment.UploadRadioBtnIsDisabled = true;
                $scope.BulkPayment.AddPaymentRadioBtnIsDisabled = true;
                $scope.BulkPayment.CustIdRadioBtnIsDisabled = true;
                $scope.BulkPayment.BillInvRadioBtnIsDisabled = true;
                $scope.BulkPayment.AddPaymentBtnIsDisabled = true;
                $scope.BulkPayment.CustIdIsDisabled = true;
                $scope.BulkPayment.BillInvIsDisabled = true;
                $scope.BulkPayment.UploadBtnIsDisabled = true;
            }

        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });

    }


    //((((((((((((((((((((((((((((((((((       Cancel Batch     ((((((((((((((((((((((((((((((((((((((((((((((((((((((((

    $scope.CancelReceipt = function (row) {
        
        var a = $scope.BulkPayment.PaymentType;
        
            
        var c = row.PaymentMethod;
        var d = row.SBU;
        var e = $scope.BulkPayment.ProdCat;
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

        if (defaultDataCookieObj != null) {
            var b = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource,
                { CcbsPaymentSource: $scope.BulkPayment.PaymentSource })[0].Id : "";

            $scope.aa = defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType,
                { Id: a })[0].Description : "";

            $scope.dd = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu,
                { Id: d })[0].Description : "";

            $scope.bb = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource,
                { Id: b })[0].Description : "";

            $scope.cc = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods,
                { Id: c })[0].Description : "";

            $scope.ee = defaultDataCookieObj.BillingProdCat.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingProdCat,
                { Id: e })[0].Description : "";
        }


        //$scope.CancelReceiptObj = {};
        $scope.CancelReceiptObj = {
            IsSelected: true,
            ReceiptStatus: row.ReceiptStatus,
            PrePost: row.PrePostDesc,
            SBU: $scope.dd,
            SbuCode: row.SBU,
            ReceiptDate: $scope.BulkPayment.DateTime,
            ReceiptNumber: row.ReceiptNo,
            ReferenceNo: row.ReferenceNumber,
            ConnectionReference: row.ConnectionReference,
            ContractNo: row.ContactNo,
            Amount: row.Amount,
            PaymentMode: $scope.BulkPayment.PaymentMode,
            PaymentMethod: $scope.cc,
            PaymentSource: $scope.bb,
            ReceiptGeneratedUser: $scope.BulkPayment.User,
            PaymentModeId: $scope.BulkPayment.PaymentMode,
            PaymentMethodId: c,
            PaymentSourceId: b,
            PaymentTypeId: a,
            PaymentType: $scope.aa,
            ProductType: row.ProductType,
            PaymentSeq: row.PaymentSeq
        };
        return $scope.CancelReceiptObj;
    };

    $scope.CancelSingleReceipt = function (e) {

        if (permissionCodes.indexOf("50104") == -1) {
            toaster.error({ type: 'error', title: 'Error', body: 'You have not enough permission to continue.!', showCloseButton: true });
            return;
        } else {
        }

        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridReceiptDetails.findByGuid(guId);
        var dataItems = $scope.dgGridReceiptDetails.data();
        var row = dataItems[selectRow];

        $scope.CancelReceiptObj1 = [];
       
        $scope.CancelReceiptObj1.push($scope.CancelReceipt(row));

        $scope.recObj = {
            'BatchId': $scope.BulkPayment.BatchId,
            'BatchDate': $scope.BulkPayment.DateTime,
            'TotalAmt': row.Amount,
            'RecCollection': $scope.CancelReceiptObj1
        };
        

        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentCancellation";

    }

    $scope.CancelBulkReceipt = function () {
        var dGrid = $scope.dgGridReceiptDetails.data();

        $scope.ReceiptObj = [];
        $scope.totAmt = 0;
        angular.forEach(dGrid, function (row) {
            if (row.IsSelected) {
                $scope.totAmt = row.Amount;
                $scope.ReceiptObj.push($scope.CancelReceipt(row));
            }
        });

        $scope.recObj = {
            'BatchId': $scope.BulkPayment.BatchId,
            'BatchDate': $scope.BulkPayment.DateTime,
            'TotalAmt': $scope.totAmt,
            'RecCollection': $scope.ReceiptObj
        };

        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentCancellation";

    }

    $scope.Transfer = function (e) {

        if (permissionCodes.indexOf("50105") == -1) {
            toaster.error({ type: 'error', title: 'Error', body: 'You have not enough permission to continue.!', showCloseButton: true });
            return;
        } else {
            
        }

        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridReceiptDetails.findByGuid(guId);
        var dataItems = $scope.dgGridReceiptDetails.data();
        var row = dataItems[selectRow];

        $scope.CancelReceiptObj1 = [];
        $scope.CancelReceiptObj1.push($scope.CancelReceipt(row));

        $scope.recObj = {
            'BatchId': $scope.BulkPayment.BatchId,
            'BatchDate': $scope.BulkPayment.DateTime,
            'TotalAmt': row.Amount,
            'RecCollection': $scope.CancelReceiptObj1
        };


        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentTransfer";

    }

    $scope.OpenPostingStatus = function (e) {
        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridReceiptDetails.findByGuid(guId);
        var dataItems = $scope.dgGridReceiptDetails.data();
        var row = dataItems[selectRow];

        $scope.CancelReceiptObj1 = [];
        $scope.CancelReceiptObj1.push($scope.CancelReceipt(row));

        $scope.recObj = {
            'BatchId': $scope.BulkPayment.BatchId,
            'BatchDate': $scope.BulkPayment.DateTime,
            'TotalAmt': row.Amount,
            'RecCollection': $scope.CancelReceiptObj1
        };


        localStorage.setItem('InquiryReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentInquiry";

    };


    $scope.selectedDrp = 0;
    $scope.YesNoConditions = function () {
        //if (($scope.BulkPayment.BatchId == "" || $scope.BulkPayment.BatchId == undefined) && $scope.dgGridBulkPayment.data().length > 1) {
            $scope.YesNoMessageOpen();
        //}
    }
    $scope.oldPTypeValue = 0;
    $scope.oldPSourceValue = 0;
    $scope.oldPMethodValue = 0;
    $scope.oldBuValue = 0;
    $scope.oldPCategoryValue = 0;

    $scope.as = function (drpId) {
       
        if (drpId == 1) {
            $scope.oldPTypeValue = $scope.BulkPayment.PaymentType;
        } else if (drpId == 2) {
            $scope.oldPSourceValue = $scope.BulkPayment.PaymentSource;
        } else if (drpId == 3) {
            $scope.oldPMethodValue = $scope.BulkPayment.PaymentMethod;
        } else if (drpId == 4) {
            $scope.oldBuValue = $scope.BulkPayment.Sbu;
        } else if (drpId == 5) {
            $scope.oldPCategoryValue = $scope.BulkPayment.ProdCat;
        }
    }
    $scope.ChangePaymentSourse = function (newValue, oldValue) {
        //console.log(newValue);
        //console.log(oldValue);
        //var d = $scope.BulkPayment.PaymentSource;
        //$scope.YesNoConditions(2);
    }
    

    //$scope.ChangePaymentMethod = function () {
    //    $scope.YesNoConditions(3);
    //}

    //$scope.ChangeSbu = function () {
    //    $scope.YesNoConditions(4);
    //}

    $scope.ChangeProductCategory = function () {
        localStorage.setItem("CurrentProductCategory", $scope.BulkPayment.ProdCat);
    }

    //)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
  

    //##########################################################

    var s1 = [];

    //////////////////////=========== GRID Navigation =============/////////////////////////////

    $scope.EditPaymentValue = function (row, e) {
        var d = $scope.dgGridBulkPayment.data();
        $scope.paiedAmt = 0;
        angular.forEach(d, function (gridRow) {
            if (gridRow.ConnectionReference == row.dataItem.ConnectionReference) {

            } else if (gridRow.ContractNumber == row.dataItem.ContractNumber) {

            } if (gridRow.IsSelected) {
                $scope.paiedAmt = (Number($scope.paiedAmt) + Number(gridRow.Amount)).toFixed(2);
            }
            
        });
        $scope.BulkPayment.TotalPayAmount = $scope.paiedAmt > 0 ? $scope.paiedAmt : Number(0).toFixed(2);
        $scope.BulkPayment.TotalAmount = $scope.paiedAmt > 0 ? $scope.paiedAmt : Number(0).toFixed(2);
    }

    $scope.KK = function (row, e) {

        //if ($scope.BulkPayment.BillPaymentType != 0 &&  $scope.BulkPayment.BillPaymentType != 3) {
        //    toaster.error({ type: 'error', title: 'Error', body: 'This option enabled only for Random Bill Payment / Bulk Upload. Please select one of them...!', showCloseButton: true });
        //    return;
        //}

        var key = e.keyCode ? e.keyCode : e.which;
        if (key === 13) {

            var focusedElement = $(e.target);
            var nextElement = focusedElement.closest('td').next();

            var $nonempty = $('.conn-ref2').eq(0).filter(function () {
                return this.value != ''
            });         
           
            ///////////////////////////////////
            if (focusedElement.hasClass("ref-no")) {

                nextElement = focusedElement.closest('td').next();
                nextElement.find('input').focus();

                
                var s = row.dataItem;

                if (!s.ConnectionReferenceGridDisabled) {

          
                    //////////
                    s1 = $scope.dgGridBulkPayment.data();
                    if ((angular.isUndefined(s.ConnectionReference) || s.ConnectionReference == '') &&
                    (angular.isUndefined(s.ContractNumber) || s.ContractNumber == '') ||
                    (angular.isUndefined(s.Amount) || s.Amount == '' || s.Amount <= 0)) {
                        toaster.error({ type: 'error', title: 'Error', body: 'Amount should be entered with Connection Reference or Contract Number!', showCloseButton: true });
                        return;
                    } else {
                        //  toaster.success({ type: 'Success', title: 'Success', body: 'Successfully added!', showCloseButton: true });


                        $scope.RowsId = $scope.RowsId + 1;
                        s1.splice(s1.length - 1, 0, { 'IsSelected': true, 'RowId': $scope.RowsId, 'ConnectionReference': s.ConnectionReference, 'ContractNumber': s.ContractNumber, 'Amount': s.Amount, 'ReferenceNumber': s.ReferenceNumber });


                        $scope.dgGridBulkPayment.data(s1);
                        var d = $scope.dgGridBulkPayment.data();

                        var AccountList = [];

                        AccountList.push({
                            "connRef": s.ConnectionReference,
                            //"accountNo": e.dataItem.AccountNo,
                            "contractNo": s.ContractNumber
                        });
                        $scope.RequetCRMDetails(AccountList);

                        s.ConnectionReference = '';
                        s.ContractNumber = '';
                        s.Amount = '';
                        s.ReferenceNumber = '';


                        ///////////////////////////////////

                        setTimeout(function () {
                            var index = 0;
                            $('#dgBulkPayment tr:last .conn-ref2').focus();

                        }, 10);


                        if (proCategory != 2 && s.ConnectionReference.length > 0 && (s.ConnectionReference.length < 8 || s.ConnectionReference.length > 9)) {
                            toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between 8 and 9!', showCloseButton: true });
                            return;
                        } else {
                            if ($scope.BulkPayment.ProdCat == 2 && s.ConnectionReference != null && s.ConnectionReference.length > 20) {
                                toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference Length should be 0 < length <= 20!', showCloseButton: true });
                                return;
                            } else {

                            }
                        }
                         
                    }

                }

            }

            else if (focusedElement.hasClass("conn-ref2")) {


                if ($nonempty.length == 0) {

                    setTimeout(function () {
                        nextElement.find('input').focus();
                    }, 10);
                }

                else {

                    nextElement = focusedElement.closest('td').next().next().next().next();
                    nextElement.find('input').focus();

                }
            }

            else if (focusedElement.hasClass("contract-no")) {

                nextElement = focusedElement.closest('td').next().next().next();

                nextElement.find('input').focus();
            }

            else if (focusedElement.hasClass("amount")) {
                nextElement = focusedElement.closest('td').next().next().next().next().next().next().next().next().next().next();

                setTimeout(function () {
                    nextElement.find('input').focus();
                }, 10);

            }
////////           

        }

        var d = $scope.dgGridBulkPayment.data();
        $scope.paiedAmt = 0;
        angular.forEach(d, function (row) {
            $scope.paiedAmt = (Number($scope.paiedAmt) + Number(row.Amount)).toFixed(2);
        });
        $scope.BulkPayment.TotalPayAmount = $scope.paiedAmt > 0 ? $scope.paiedAmt : Number(0).toFixed(2);
        $scope.BulkPayment.TotalAmount = $scope.paiedAmt > 0 ? $scope.paiedAmt : Number(0).toFixed(2);

        $scope.BulkPayment.NoOfRecords = $scope.BulkPayment.BillPaymentType == 0 ? d.length - 1 : d.length;
    }
    ////////////////////////////////////////////////////////

    
    // ------------------ Attachments ------------------------------------

    $scope.receipt = [];
    // $scope.receipt.ReceiptId123 = "";
    $scope.IsAttach = "NO";

    //REFERENCE POPUP
    $scope.referenceParams = {
        moduleId: "BILLING-BULK-PAYMENT-001",
        TransactionId: $scope.TempAttachmentRef,
        isAttachedDoc: true
    };

    $scope.$watch("TempAttachmentRef", function (newValue) {
        $scope.referenceParams.TransactionId = $scope.TempAttachmentRef;
    });

    $scope.$watch("BulkPayment.BatchId", function (newValue) {
        $scope.referenceParams.TransactionId = $scope.BulkPayment.BatchId;
        $scope.referenceParams = {
            moduleId: "BILLING-BULK-PAYMENT-001",
            TransactionId: $scope.BulkPayment.BatchId,
            isAttachedDoc: true,
            IsDisabled: true
        };
    });


    //End REFERENCE POPUP
    $scope.TransRef = "";
    $scope.referenceCallback = function (data) {
        console.log(data, 'call back');
        $scope.TransRef = data.TransactionReference[0];
        $scope.IsAttach = "YES";
    };

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
    }


    $scope.IsAttach = "NO";

    //-------------------- End Attachment ----------------------------

    $scope.result = {};
    ///////////////Yes No Modal//////////////
    

    $scope.customMessage = {
        Title: 'this message is a custom string',
        Message: 'this message is a second custom string'
    };

    $scope.yesNoMessageCallback = function (data) {
        // console.log(data,'data');
        if (data.Id == 1) {
            if (data.YesNoResponse != 'no') {
                $scope.GenerateGuid();
                objTemp = [];
                $scope.finderBulkBillingBatchID.info.onLoad = true;
                $scope.finderBulkBillingBatchID.params = objTemp;
                $("#" + $scope.finderBulkBillingBatchID.info.modalId).modal('show');
            }
        } else if (data.Id == 2) {
            if (data.YesNoResponse == 'no') {
                $scope.BulkPayment.PaymentMode = "0";
                toaster.error({ type: 'error', title: 'Error', body: "Please select another payment mode instead of Cheque!", showCloseButton: true });
                $scope.IsReadyForSubmit = false;

                var objTemp = new PaymentModeOptions();
                $scope.SelectedPaymentMode = "50";
                objTemp.PaymentMode = "50";
                objTemp.MobileNo = new Date().getTime().toString();
                objTemp.Callback = $scope.paymentModeCallBack;
                $scope.Options = objTemp;
                return;
            } else {
                $scope.IsReadyForSubmit = true;
            }
        } else if (data.Id == 3) {
            if (data.YesNoResponse != 'no') {
                $scope.changePageState('NEW');
            }
        }

    };


    $scope.YesNoMessageOpen = function () {
        //open popup 
        window._focuse();  
        $("#YesNoMessage").modal({
            backdrop: 'static',
            keyboard: false
        }, 'show');
    };

    $scope.PrintReceipts = function (e, isMail) {//use contractEmail
        var guId = e.dataItem.uid;
        var selectRow = $scope.dgGridReceiptDetails.findByGuid(guId);
        var dataItems = $scope.dgGridReceiptDetails.data();
        var row = dataItems[selectRow];
        if (isMail == 1) {
            if (row.ReceiptNo != undefined && row.ReceiptNo != "") {

                BulkPaymentService.GetSendEmail(row.ReceiptNo, 2).success(function (response) {
                    if (response.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                        return;
                    } else {
                        toaster.success({ type: 'success', title: 'Success', body: response.Message, showCloseButton: true });
                    }

                }).error(function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
                });
            }
        } else {

            if (appConfig.IsPostpaidCloud == 1) {
                window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingGetSingleReceiptPrint/" + row.ReceiptNo + "/" + $scope.userInfo().userId);
            }
            else {
            PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: isMail, Outlet: $scope.userInfo().outletCode, type: "BillingSingleReceiptPrint", receiptId: row.ReceiptNo, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');

        }
        
        }
        
    };

    $scope.BulkPrintReceipts = function () {//premail
        if ($scope.CPOSoutletSMSPrintingOption == 2) {
            var custId = "";
            var custIdType = "";
            var isCorrect = true;
            $scope.disabled.BulkEmailButton = true;
            angular.forEach($scope.dgGridReceiptDetails.data(), function (row) {

                if (row.CustomerIDType == "TIN") {
                    if (custId == "") {
                        custId = row.CustRef;
                    } else {
                        if (custId != row.CustRef) {
                            isCorrect = false;
                        }
                    }
                } else {
                    isCorrect = false;
                }
            });

            if (!isCorrect) {
                toaster.error({ type: 'error', title: 'Error', body: " Cannot use this print option because there are multiple TIN numbers in the batch...!", showCloseButton: true });
                $scope.PrintAllButton12 = true;
                return;
            } else {
                $scope.PrintAllButton12 = false;
            }
        } else {
            $scope.disabled.BulkEmailButton = false;
            $scope.PrintAllButton12 = false;
        }

        var d = $scope.userInfo();
        if ($scope.CPOSoutletSMSPrintingOption == 1) {
            if (appConfig.IsPostpaidCloud == 1) {
                debugger;
                window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingGetReceiptBatchContPrint/" + $scope.BulkPayment.BatchId + "/" + $scope.userInfo().userId);
            }
            else {
                PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: "2", Outlet: $scope.userInfo().outletCode, type: "BillingBulkReceiptsOnePage", batchId: $scope.BulkPayment.BatchId, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');//BLLB710015817
            }

        } else {
            if (appConfig.IsPostpaidCloud == "1") {
                window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingGetBulkReceipt/" + $scope.BulkPayment.BatchId + "/" + $scope.userInfo().userId);
            } else {
                PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: "2", Outlet: $scope.userInfo().outletCode, type: "BillingBulkReceipts", batchId: $scope.BulkPayment.BatchId, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');//BLLB710015817
            }
        }
    };

    DirectPrintService.start();

    $scope.DirectBulkPrintReceipts = function () {
        var dataItems1 = $scope.dgGridReceiptDetails.data();
        if (dataItems1.length <= appPrintingConfig.PRINTING_COPIES) {
            $scope.AutoPrint();
        } else {
            if ($scope.CPOSoutletSMSPrintingOption == 1) {
                if (appConfig.IsPostpaidCloud == 1) {
                    debugger;
                    window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingGetReceiptBatchContPrint/" + $scope.BulkPayment.BatchId + "/" + $scope.userInfo().userId);
                }
                else {
                PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: "2", Outlet: $scope.userInfo().outletCode, type: "BillingBulkReceiptsOnePage", batchId: $scope.BulkPayment.BatchId, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');//BLLB710015817
                }

            } else {
                if (appConfig.IsPostpaidCloud == "1") {
                    window.open(appConfig.POSTPAID_MODULE_URL + "/GetBillingGetBulkReceipt/" + $scope.BulkPayment.BatchId + "/" + $scope.userInfo().userId);
                } else {
                PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: "2", Outlet: $scope.userInfo().outletCode, type: "BillingBulkReceipts", batchId: $scope.BulkPayment.BatchId, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');//BLLB710015817
            }
        }        
        }        
    };


    $scope.AutoPrint = function () {
        debugger;
        ReceiptPrintingService.GetBulkPaymentPrintingByBatchNo($scope.BulkPayment.BatchId, $scope.userInfo().userId).then(function (response) {
            debugger;
            if (response.data.Code == "0") {
                for (var i = 0; i < response.data.Result.length; i++) {
                    DirectPrintService.print(function () {
                        $scope.$apply(function () {
                            console.log('Print Completed');
                            $timeout(function () {
                            }, 3000);
                        });
                    },
                   response.data.Result[i].ReportHtml);
                };
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };



    $scope.BulkEmailReceipts = function () {
        if ($scope.CPOSoutletSMSPrintingOption == 1) {
            if ($scope.BulkPayment.BatchId != undefined && $scope.BulkPayment.BatchId != "") {

                BulkPaymentService.GetSendEmail($scope.BulkPayment.BatchId, 1, $scope.userInfo().userId).success(function (response) {
                    if (response.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                        return;
                    } else {
                        toaster.success({ type: 'success', title: 'Success', body: response.Message, showCloseButton: true });
                    }

                }).error(function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
                });
            }
            
            //PrintService.OpenPrint('POST', appConfig.REPORT_URL + 'ReportViewer.aspx', { PrintType: "1", Outlet: $scope.userInfo().outletCode, type: "BillingBulkReceiptsEmail", batchId: $scope.BulkPayment.BatchId, userId: $scope.userInfo().userId, WithSerial: false, Token: $scope.userInfo().token }, '_blank');//BLLB710015817
        } else {
            toaster.error({ type: 'error', title: 'Error', body: "This feature not enabled ...!", showCloseButton: true });
        }
    };

    
    $scope.ChangePrint = function () {
        
        var custId = "";
        var custIdType = "";
        var isCorrect = true;
        if ($scope.CPOSoutletSMSPrintingOption == 2) {
            $scope.disabled.BulkEmailButton = true;
            angular.forEach($scope.dgGridReceiptDetails.data(), function (row) {

                if (row.CustomerIDType == "TIN") {
                    if (custId == "") {
                        custId = row.CustRef;
                    } else {
                        if (custId != row.CustRef) {
                            isCorrect = false;
                        }
                    }
                } else {
                    isCorrect = false;
                }
            });

            if (!isCorrect) {
                toaster.error({ type: 'error', title: 'Error', body: " Cannot use this print option because there are multiple TIN numbers in the batch...!", showCloseButton: true });
                $scope.PrintAllButton12 = true;
            } else {
                $scope.PrintAllButton12 = false;
            }
        } else {
            $scope.disabled.BulkEmailButton = false;
            $scope.PrintAllButton12 = false;
        }

    }

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

            $scope.BulkPayment.TotalPayAmount = data.selectedItem.Amount;
            $scope.BulkPayment.ExistingReference = data.selectedItem.ReferenceNo;
            $scope.NewExistingReference = data.selectedItem.ReferenceNo;
            
            $scope.paymentModeCallBack({ 'ReferenceNo': data.selectedItem.ReferenceNo });
            //  console.log($scope.NewExistingReference)
        },
        open: function () {
            window._focuse(this.info.modalId);
            objTemp = [];
            objTemp.push($scope.userInfo().userId);
            objTemp.push("");
            objTemp.push($scope.BulkPayment.PaymentMode);
            objTemp.push($scope.userInfo().outletCode);
            this.params = objTemp;


            this.info.onLoad = true;
            $("#" + this.info.modalId).modal('show');
        }
    };

    //$scope.a = 0;
    //$scope.TabChange = function () {
    //    $scope.a = $scope.a + 1;
    //    var d = $scope.a % 2;
    //    if (d == 1) {
    //        $("li#ListReceiptDetails").removeClass("active");
    //        $("li#ListBulkEntry").addClass("active");
    //    } else {
    //        $("li#ListBulkEntry").removeClass("active");
    //        $("li#ListReceiptDetails").addClass("active");
    //    }
    //}

    $scope.GoToContractSummary = function (e) {
        //Test URL
        var d = new Date();
        var todate = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);//
        $window.open('http://172.26.86.45/contract-summary/#/contractId/' + e.dataItem.ContractNumber + '/fromDate/' + '2013-01-01' + '/toDate/' + todate + '/user/' + $scope.userInfo().userId);//

        //Live URL
        //var d = new Date();
        //var todate = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);//
        //$window.open('http://172.26.86.41/contract-summary/#/contractId/' + e.dataItem.ContractNumber + '/fromDate/' + '2016-12-01' + '/toDate/' + todate + '/user/' + $scope.userInfo().userId);//

    }

    $scope.InheritRemarks = function () {
        var dGrid = $scope.dgGridBulkPayment.data();
        angular.forEach(dGrid, function (row) {
            row.Remarks = $scope.BulkPayment.Remarks;
        });
    }
    var a = true;

    $scope.onExit = function () {

        a = BulkPayment.aa;
        if (a == '1') {
            return true;
        } else {
            return false;
        }
    };

    $window.onbeforeunload = $scope.onExit;

    $scope.AddBillInvoicePayments = function () {
        $scope.RequetCRMDetails();
    };

    $scope.focusBillInvoiceNumber = function () {
        var myEl = angular.element(document.querySelector('#focusBillInvoiceNumberValue'));
        myEl.focus();
    };

}]);

//test