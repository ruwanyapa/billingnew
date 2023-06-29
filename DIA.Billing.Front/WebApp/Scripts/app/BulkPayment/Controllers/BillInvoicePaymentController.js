angular.module("DialogBilling").controller('BillInvoicePaymentController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "BillInvoicePaymentService", "PrintService", "appConfig", "BulkPaymentService", "AuthService", function ($scope, Page, $routeParams, $filter, toaster, BillInvoicePaymentService, PrintService, appConfig, BulkPaymentService, AuthService) {
    Page.setTitle("Bill Invoice Payments");

    $scope.init = function () {
        $scope.BillInvoicePayment = {
            BatchID: "",
            ReceiptNo: "",
            AccountNo: "",
            ConnectionReference: "",
            CustName: "",
            invoiceDetailList: {},
            BatchDateandTime: "",
            TotalAmount: 0,
            ReceiptStatus: "",
            Remarks: "",
            TotalUnsettledAmount: 0,
            AdditionalAmount: 0,
            TotalPayAmount: 0,
            CustomerPayingAmount: 0,
            Balance: 0,
            PaymentMode: 0,
            sbu: 0,
            ProductCategory: 0,
            ExistingReference: "",
            ContractID: "",
            AccountType: "",
            ProductType: ""
        };
        $scope.disabled = {
            CancelButton: true,
            PrintButton: true,
            SaveButton: true,
            disableActiveFields: false,
            keyEnterFields: false
        };
        $scope._ReceiptStatus = {
            1: "Valid",
            2: "Pending",
            4: "Cancelled"
        }
    }
    $scope.init();

    $scope.changePageState = function (InterfaceState) {
        if (InterfaceState == 'NEW') {
            $scope.init();
            $scope.ResetPaymantModeDerective();
            $scope.dgGridBillInvoicePayment.data([]);
            toaster.clear();
        }
    }

    $scope.PageLoad = function () {
        BillInvoicePaymentService.GetBIPaymentModes().then(function (response) {
            _PaymentModeCollection = response.data.Result.BillingPaymentMode;
            var index = _PaymentModeCollection.indexOf(_PaymentModeCollection[0]);
            _PaymentModeCollection.splice(index, 1);

            $scope.PaymentModeCollection = _PaymentModeCollection;
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    }

    $scope.PageLoad();

    $scope.GetAccountNo = function (keyEvent) {
        
        if (keyEvent.which === 13) {
            BillInvoicePaymentService.PostForGetCxInvoiceDetails({ queryType: "CONTRACT", queryValue: $scope.BillInvoicePayment.AccountNo, isSettledUnsettled: "UNSETTLED" })
                .success(function (response) {
                    if (response.Result.invoiceDetailList.length == 0) {
                        toaster.error({ type: 'error', title: 'Error', body: "CCBS API Error:" + response.Result.errorCode + " " + response.Result.errorDesc, showCloseButton: true });
                        return;
                    }

                    if (response.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                        return;
                    } else {
                        $scope.changePageState('NEW');

                        $scope.disabled = {
                            keyEnterFields: true,
                            CancelButton: true,
                            PrintButton: true,
                            SaveButton: false
                        }

                        $scope.dgGridBillInvoicePayment.data(response.Result.invoiceDetailList);
                        $scope.BillInvoicePayment.AccountNo = response.Result.accountNo;
                        $scope.BillInvoicePayment.CustName = response.Result.custName;
                        $scope.BillInvoicePayment.AccountNo = response.Result.accountNo;
                        $scope.BillInvoicePayment.ProductCategory = response.Result.productCategory;
                        $scope.BillInvoicePayment.sbu = response.Result.sbu;
                        $scope.BillInvoicePayment.AccountType = response.Result.accountType;
                        $scope.BillInvoicePayment.ProductType = response.Result.productType;
                        $scope.BillInvoicePayment.ContractID = response.Result.contractID;
                    }

                }).error(function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.errorDesc, showCloseButton: true }); return;
                });
        }
    }

    $scope.GetConnectionReference = function (keyEvent) {
        var ConnectionReference_ = $scope.BillInvoicePayment.ConnectionReference;

        if (keyEvent.which === 13) {
            BillInvoicePaymentService.PostForGetCxInvoiceDetails({ queryType: "CONN_REF", queryValue: $scope.BillInvoicePayment.ConnectionReference, isSettledUnsettled: "UNSETTLED" }).success(function (response) {

                if (response.Result.invoiceDetailList.length == 0) {
                    toaster.error({ type: 'error', title: 'Error', body: "API Error:" + response.Result.errorCode +" "+ response.Result.errorDesc, showCloseButton: true });
                    return;
                }

                if (response.Code != MessageTypes.Success) {
                    toaster.error({ type: 'error', title: 'Error', body: response.errorDesc, showCloseButton: true });
                    return;
                } else {
                    $scope.changePageState('NEW');

                    $scope.disabled = {
                        keyEnterFields: true,
                        CancelButton: true,
                        PrintButton: true,
                        SaveButton: false
                    }

                    $scope.dgGridBillInvoicePayment.data(response.Result.invoiceDetailList);
                    $scope.BillInvoicePayment.AccountNo = response.Result.accountNo;
                    $scope.BillInvoicePayment.CustName = response.Result.custName;
                    $scope.BillInvoicePayment.AccountNo = response.Result.accountNo;
                    $scope.BillInvoicePayment.ProductCategory = response.Result.productCategory;
                    $scope.BillInvoicePayment.sbu = response.Result.sbu;
                    $scope.BillInvoicePayment.ContractID = response.Result.contractID;
                    $scope.BillInvoicePayment.AccountType = response.Result.accountType;
                    $scope.BillInvoicePayment.ProductType = response.Result.productType;
                    $scope.BillInvoicePayment.ConnectionReference = ConnectionReference_;
                }
            }).error(function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
            });
        }


    }

    //  #####################       Payment mode        ##################################
    var objTemp = new Array();
    $scope.ResetPaymantModeDerective = function () {
        $scope.BillInvoicePayment.PaymentMode = "CA";
        $scope.SelectedPaymentMode = $scope.BillInvoicePayment.PaymentMode;
        objTemp.PaymentMode = $scope.SelectedPaymentMode;
        objTemp.MobileNo = "";
        objTemp.Callback = $scope.paymentModeCallBack;
        objTemp.CustomerRef = "";
        objTemp.Amount = $scope.BillInvoicePayment.TotalPayAmount;
        objTemp.ItemSbu = "";
        $scope.Options = objTemp;
    }
    $scope.ResetPaymantModeDerective();

    $scope.paymentModeCallBack = function (data) {
        if (data.ReferenceNo == undefined) {
            if (data[0].GVValue >= $scope.BillInvoicePayment.TotalPayAmount) {
                $scope.BillInvoicePayment.ExistingReference = data[0].ReferenceNo;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: "", showCloseButton: true });
            }
        } else {
            $scope.BillInvoicePayment.ExistingReference = data.ReferenceNo;
        }
    }


    $scope.SetPaymentMode = function () {
        $scope.Options = {
            Amount: $scope.BillInvoicePayment.TotalPayAmount,
            CustomerRef: "",
            ItemSbu: $scope.BillInvoicePayment.sbu,
            MobileNo: "",
            Params: { InvoiceNo: "" },
            PaymentDetailsRefCollection: null,
            Callback: $scope.paymentModeCallBack,
            PaymentMode: $scope.BillInvoicePayment.PaymentMode,
        }
    }
    //  #####################       Payment mode        ##################################

    $scope.selectThis = function (event) {
        $scope.disabled.SaveButton = false;
        if ($scope.BillInvoicePayment.AdditionalAmount < 0) {
            $scope.BillInvoicePayment.AdditionalAmount = 0;
        }

        var selectedCount = 0;
        var list = $scope.dgGridBillInvoicePayment.data();
        for (var i = 0; i < list.length; i++) {
            if (list[i].isSelected) {
                selectedCount += 1;
            }
        }

        if (selectedCount > 3) {
            toaster.error({ type: 'error', title: 'Error', body: "Maximum no of records can be selected is 3", showCloseButton: true });
            $scope.disabled.SaveButton = true;
            return;
        }

        $scope.BillInvoicePayment.TotalUnsettledAmount = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i].isSelected) {
                $scope.BillInvoicePayment.TotalUnsettledAmount += list[i].unsettledAmount;
            }
        }
        $scope.CalculateAdditionalAmount();

        //set default values
        $scope.BillInvoicePayment.Balance = 0;
    }

    $scope.IsTotalPayAmountIncorrect = false;
    $scope.CalculateAdditionalAmount = function () {
        $scope.BillInvoicePayment.AdditionalAmount = 0

        if ($scope.BillInvoicePayment.TotalPayAmount - $scope.BillInvoicePayment.TotalUnsettledAmount > 0) {
            $scope.BillInvoicePayment.AdditionalAmount = $scope.BillInvoicePayment.TotalPayAmount - $scope.BillInvoicePayment.TotalUnsettledAmount;
            $scope.IsTotalPayAmountIncorrect = false;
        } else {
            $scope.IsTotalPayAmountIncorrect = true;
        }

        $scope.CalculateBalance();
    }

    $scope.CalculateBalance = function () {
        if ($scope.BillInvoicePayment.CustomerPayingAmount - $scope.BillInvoicePayment.TotalPayAmount > 0) {
            $scope.BillInvoicePayment.Balance = $scope.BillInvoicePayment.CustomerPayingAmount - $scope.BillInvoicePayment.TotalPayAmount;
        } else {
            $scope.BillInvoicePayment.Balance = 0;
        }
    }


    $scope.PostBillData = function () {
        $scope.disabled.SaveButton = true;

        if ($scope.IsTotalPayAmountIncorrect) {
            toaster.error({ type: 'error', title: 'Error', body: "Total Amount should be equal or greater than the Total Pay Amount", showCloseButton: true });
            $scope.disabled.SaveButton = false;
            return;
        }

        if ($scope.BillInvoicePayment.TotalPayAmount == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Please Enter Total Pay Amount", showCloseButton: true });
            $scope.disabled.SaveButton = false;
            return;
        }
        
        if ($scope.BillInvoicePayment.PaymentMode != "CA") {
            if ($scope.BillInvoicePayment.ExistingReference=="") {
                toaster.error({ type: 'error', title: 'Error', body: "Please Select Payment Reference Details", showCloseButton: true });
                $scope.disabled.SaveButton = false;
                return;
            }
        }       
        
        if ($scope.BillInvoicePayment.AccountType != "2") {
            toaster.error({ type: 'error', title: 'Error', body: "API Error: wrong account type", showCloseButton: true });
            $scope.disabled.SaveButton = false;
            return;
        }        

        var OutletCode = $scope.userInfo().outletCode;
        var AddedUser = $scope.userInfo().userId;

        var invoiceNumberList = [];
        var invoiceList = [];

        for (var i = 0; i < $scope.dgGridBillInvoicePayment.data().length; i++) {
            if ($scope.dgGridBillInvoicePayment.data()[i].isSelected) {
                invoiceNumberList.push($scope.dgGridBillInvoicePayment.data()[i].invoiceNumber);
                invoiceList.push({
                    invoiceNumber: $scope.dgGridBillInvoicePayment.data()[i].invoiceNumber,
                    billDate: $scope.dgGridBillInvoicePayment.data()[i].billDate,
                    fomatedBillDate: $scope.dgGridBillInvoicePayment.data()[i].billDate,
                    billSequence: $scope.dgGridBillInvoicePayment.data()[i].billSequence,
                    invoiceAmount: $scope.dgGridBillInvoicePayment.data()[i].invoiceAmount,
                    settledAmount: $scope.dgGridBillInvoicePayment.data()[i].settledAmount,
                    unsettledAmount: $scope.dgGridBillInvoicePayment.data()[i].unsettledAmount,
                });
            }
        }

        var _BatchRec = [{
            "AccountNo": $scope.BillInvoicePayment.AccountNo,
            "AddedUser": AddedUser,
            "Amount": $scope.BillInvoicePayment.TotalPayAmount,
            "BalanceAmt": null,
            "ConnectionRef": $scope.BillInvoicePayment.ConnectionReference,
            "ConnectionType": null,
            "ContactNo": null,
            "ContractEmail": null,
            "ContractId": $scope.BillInvoicePayment.ContractID,
            "CustAddress": null,
            "CustName": $scope.BillInvoicePayment.CustName,
            "CustomerIDNumber": null,
            "CustRef": null,
            "IsSuspense": null,
            "OldNIC": null,
            "OutletCode": OutletCode,
            "PaymentMethod": "10",
            "PaymentMode": $scope.BillInvoicePayment.PaymentMode,
            "PaymentModeRef": $scope.BillInvoicePayment.ExistingReference,
            "prEmail": null,
            "PrePostType": $scope.BillInvoicePayment.AccountType,
            "ProdType": $scope.BillInvoicePayment.ProductType,
            "ReceiptStatus": "1",
            "ReconFee": null,
            "RefNo": null,
            "Remarks": $scope.BillInvoicePayment.Remarks,
            "SbuCode": $scope.BillInvoicePayment.sbu,
            "TotalOutstanding": null,
            "TransferBatchId": null,
            "Transferred": 2,
            "transferredMode": null,
            "transferredNo": null,
            "TransferredType": null,
            "CustomerIDType": null
        }];

        var postingObj = {
            OutletCode: OutletCode,
            PaymentType: null,
            PaymentSource: null,
            BatchTotal: $scope.BillInvoicePayment.TotalPayAmount,
            Remarks: $scope.BillInvoicePayment.Remarks,
            AttachmentRef: null,
            AddedUser: AddedUser,
            ProdCat: $scope.BillInvoicePayment.ProductCategory,
            usertype: null,
            sourceip: null,
            tempattachmentref: null,
            transferbatchid: null,
            cancelledbatchid: null,
            SbuCode: $scope.BillInvoicePayment.sbu,
            BatchRec: _BatchRec,
            IsBillingRec: false,
            invoiceNumberList: invoiceNumberList.join(),
            invoiceList: JSON.stringify(invoiceList)
        }

        BillInvoicePaymentService.PostBatchDetails(postingObj).success(function (response) {
            $scope.disabled.disableActiveFields = true;
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
                $scope.disabled.SaveButton = false;
                $scope.disabled.disableActiveFields = false;
                return;
            } else {
                toaster.success({ type: 'Success', title: 'Success', body: response.Message, showCloseButton: true });
                $scope.disabled = {
                    CancelButton: false,
                    PrintButton: false,
                    SaveButton: true
                }

                $scope.BillInvoicePayment.BatchID = response.Result.BatchID;
                $scope.BillInvoicePayment.BatchDateandTime = response.Result.Date;
                $scope.BillInvoicePayment.ReceiptStatus = $scope._ReceiptStatus[1];
                $scope.BillInvoicePayment.TotalAmount = $scope.BillInvoicePayment.TotalPayAmount;

                BulkPaymentService.GetBatchDetails($scope.BillInvoicePayment.BatchID).then(function (response) {
                    $scope.BillInvoicePayment.ReceiptNo = response.data.Result.BatchReceipt[0].ReceiptNo;
                }, function (response) {
                    $scope.disabled.SaveButton = false;
                    $scope.disabled.disableActiveFields = false;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            }
        }).error(function (response) {

            $scope.disabled.SaveButton = false;
            $scope.disabled.disableActiveFields = false;
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
    }

    $scope.clearConRef = function () {
        $scope.BillInvoicePayment.ConnectionReference = '';
    }

    //===================================================================
    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations
    var d1 = {};
    var configBillInvoicePayment = {};
    var configBillInvoicePayment = {
        columns: [
            {
                field: "isSelected",
                headerTemplate: '',
                template: '<input type="checkbox" ng-disabled="disabled.disableActiveFields" ng-click="selectThis($event)" ng-model="dataItem.isSelected" ng-disabled="dataItem.row"/>',
                width: "32px"
            },
            {
                field: "invoiceNumber",
                title: "Invoice No",
                width: "100px"
            },
            {
                field: "fomatedBillDate",
                title: "Invoice Date",
                width: "100px"
            },

            {
                field: "billSequence",
                title: 'Bill Sequence',
                width: "110px"
            }, {
                field: "invoiceAmount",
                title: 'Invoice Amount',
                width: "110px"
            },
            {
                field: "settledAmount", title: "Settled Amount", width: "100px"
            },
            {
                field: "unsettledAmount", title: "Unsettled Amount", width: "100px"
            },
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configBillInvoicePayment.dataSource = new kendo.data.DataSource({
        data: [d1],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'isSelected': { editable: false, type: "boolean" },
                    'invoiceNumber': { editable: false, type: "number" },
                    'billDate': { editable: false, type: "date" },
                    'billSequence': { editable: false, type: "string" },
                    'invoiceAmount': { editable: false, type: "number" },
                    'settledAmount': { editable: false, type: "number" },
                    'unsettledAmount': { editable: false, type: "number" },
                    'fomatedBillDate': { editable: false, type: "date" }
                }
            }
        },
        pageSize: 10

    }); 

    $scope.dgGridBillInvoicePayment = new DataGrid();
    $scope.dgGridBillInvoicePayment.options(configBillInvoicePayment);

    $scope.InitA = function (arg) { 
        $scope.dgGridBillInvoicePayment.Init(arg);
    };
    //================================================================================

    //======================   Bill Invoice Batch ID Finder      =====================
    $scope.BillInvoiceBatchID = {
        title: "Bill Invoice Payments Finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILL-INVOICE-PAYMENT-001",
            mapId: "BILL-INVOICE-PAYMENT-001",
            modalId: "findBillInvoiceBatch", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],
        callback: function (data) {
            BillInvoicePaymentService.GetBatchDetailsById(data.selectedItem.BatchId).then(function (response) {
                $scope.BillInvoicePayment = {
                    BatchID: response.data.Result.BatchId,
                    ReceiptNo: response.data.Result.BatchReceipt[0].ReceiptNo,
                    AccountNo: response.data.Result.BatchReceipt[0].accountNo,
                    ConnectionReference: response.data.Result.BatchReceipt[0].ConnectionReference,
                    CustName: response.data.Result.BatchReceipt[0].CustomerName,
                    invoiceDetailList: {},
                    BatchDateandTime: response.data.Result.BatchDate,
                    TotalAmount: response.data.Result.TotalAmount,
                    ReceiptStatus: $scope._ReceiptStatus[response.data.Result.BatchReceipt[0].Cancel],
                    Remarks: response.data.Result.Remarks,
                    TotalUnsettledAmount: 0,
                    AdditionalAmount: 0,
                    TotalPayAmount: response.data.Result.TotalAmount,
                    CustomerPayingAmount: 0,
                    Balance: 0,
                    PaymentMode: response.data.Result.BatchReceipt[0].PaymentMode,
                    sbu: 0,
                    ProductCategory: 0,
                    ExistingReference: "",
                    ContractID: "",
                    AccountType: "",
                    ProductType: ""
                };


                var invoiceArray = JSON.parse(response.data.Result.BillRecNos);
                if (invoiceArray != undefined) {
                    $scope.dgGridBillInvoicePayment.data(invoiceArray);
                } else {
                    $scope.dgGridBillInvoicePayment.data([]);
                }
                $scope.disabled.disableActiveFields = true;
                $scope.disabled.PrintButton = false;
                $scope.disabled.SaveButton = true;
                if($scope.BillInvoicePayment.ReceiptStatus == "Valid")
                {
                    $scope.disabled.CancelButton = false;
                } else {
                    $scope.disabled.CancelButton = true;
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        },
        open: function () {
            window._focuse(this.info.modalId);
            objTemp = [];
            objTemp.push($scope.userInfo().userId);
            objTemp.push("");
            objTemp.push($scope.BillInvoicePayment.PaymentMode);
            objTemp.push($scope.userInfo().outletCode);
            this.params = objTemp;
            this.info.onLoad = true;
            $("#" + this.info.modalId).modal('show');
        }
    };



    $scope.printReceipt = function (obj) {
        PrintService.OpenPrint('POST',
            appConfig.REPORT_URL + 'ReportViewer.aspx',
            {
                PrintType: "2",
                Outlet: $scope.userInfo().outletCode,
                type: "BillInvoicePayment",
                batchId: $scope.BillInvoicePayment.BatchID,
                userId: $scope.userInfo().userId,
                WithSerial: false,
                Token: $scope.userInfo().token
            }, '_blank');
    };

    $scope.CancelSingleReceipt = function (e) {
        var permissionCodes = AuthService.getProfile().permission;
        if (permissionCodes.indexOf("50104") == -1) {
            toaster.error({ type: 'error', title: 'Error', body: 'You have not enough permission to continue.!', showCloseButton: true });
            return;
        }

        $scope.recObj = {
            'BatchId': $scope.BillInvoicePayment.BatchID,
            'BatchDate': $scope.BillInvoicePayment.BatchDateandTime,
            'TotalAmt': $scope.BillInvoicePayment.TotalAmount,
            'RecCollection': [{
                Amount: $scope.BillInvoicePayment.TotalAmount,
                ContractNo: $scope.BillInvoicePayment.ContractID,
                ConnectionReference: $scope.BillInvoicePayment.ConnectionReference,
                IsSelected: true,
                PaymentMethod: "Payment Received",
                PaymentMethodId: 10,
                PaymentMode: $scope.BillInvoicePayment.PaymentMode,
                PaymentModeId: $scope.BillInvoicePayment.PaymentMode,
                PrePost: "Post",
                ProductType: $scope.BillInvoicePayment.ProductType,
                ReceiptDate: $scope.BillInvoicePayment.BatchDateandTime,
                ReceiptGeneratedUser: $scope.userInfo().userId,
                ReceiptNumber: $scope.BillInvoicePayment.ReceiptNo,
                ReceiptStatus: $scope.BillInvoicePayment.ReceiptStatus,
                ReferenceNo: null,
                SBU: "send SBU code and get SBU name",
                SbuCode: $scope.BillInvoicePayment.sbu,

                PaymentSource: "",
                PaymentSourceId: "",
                PaymentType: "",
                PaymentTypeId: ""
            }]
        };
        localStorage.setItem('CancelReceipts', JSON.stringify($scope.recObj));
        window.location = "app.html#/BulkPayment/PaymentCancellation";
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
            $scope.BillInvoicePayment.TotalPayAmount = data.selectedItem.Amount;
            $scope.BillInvoicePayment.ExistingReference = data.selectedItem.ReferenceNo;
            $scope.NewExistingReference = data.selectedItem.ReferenceNo;
            $scope.paymentModeCallBack({ 'ReferenceNo': data.selectedItem.ReferenceNo });
        },
        open: function () {
            window._focuse(this.info.modalId);
            objTemp = [];
            objTemp.push($scope.userInfo().userId);
            objTemp.push("");
            objTemp.push($scope.BillInvoicePayment.PaymentMode);
            objTemp.push($scope.userInfo().outletCode);
            this.params = objTemp;

            this.info.onLoad = true;
            $("#" + this.info.modalId).modal('show');
        }
    };

}]);