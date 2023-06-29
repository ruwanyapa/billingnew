angular.module("DialogBilling").controller('PaymentTransferController', ["$scope", "Page", "$routeParams", "$filter", "AuthService", "PaymentInqueryService", "BulkPaymentService", "PaymentTransferService", "$cookieStore", "toaster", function ($scope, Page, $routeParams, $filter, AuthService, PaymentInqueryService, BulkPaymentService, PaymentTransferService, $cookieStore, toaster) {
    //Set Page Title
    Page.setTitle("Payment Transfers");

    //========================
    $scope.PaymentTransfer = [];
    $scope.payTrans = {};
    var s1 = [];
    var Receiptsdata = JSON.parse(localStorage.getItem('CancelReceipts'));
    $scope.IsBackOfficeUser = false;
    //=========================
    $scope.TempAttachmentRef = '';

    var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

    // Transfer Within dropdown
    $scope.OptionsTransferWithin = [
      { text: "Different product category", value: "1" },
      { text: "Same Product Category", value: "2" }
    ];

    // Mistake Done By dropdown
    $scope.OptionsMistakeDoneBy = [
      { text: "Customer", value: "1" },
      { text: "Cashier", value: "2" },
      { text: "Other", value: "3" }
    ];

    //===================

    var PaymentTransferSample = [];

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations

    var gg1 = [
       {}
    ];

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
            moduleId: "BACK-OFFICE-PAYMENT-TRANSFER",
            TransactionId: $scope.payTrans.BathId,
            isAttachedDoc: true,
            IsDisabled: true
        };
    }

    //////////====================== Correct Entry Details   ===================

    var configTransCorrectEntryDetails = {};
    var configTransCorrectEntryDetails = {
        columns: [
                     {
                         field: "IsSelected",
                         headerTemplate: '<input type="checkbox" ng-disabled="disableGrid" title="Select all" ng-model="selectAll" ng-click="toggleSelect($event)" />',
                         template: '<input ng-show="dataItem.SBU != undefined" ng-model="dataItem.IsSelected" type="checkbox" ng-disabled="dataItem.disable" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
                         width: "32px"
                     },
                    { field: "SBU", title: "BU", width: "80px" },
                    { field: "PrePost", title: "Pre/Post", width: "80px" },
                    { field: "ProductType", title: "Product Type", width: "80px" },
                    {
                        field: "ConnectionReference",
                        title: 'Connection Reference',
                        template: '<input type ="text" ng-keydown="KK(this,$event)" ng-change="dataItem.ContractNumber = null" ng-model="dataItem.ConnectionReference"  ng-disabled="dataItem.IsDisabled"   class="k-fill conn-ref kk"/>',
                        width: "100px"
                    },
                    {
                        field: "ContractNo", title: "Contract No",
                        template: '<input type ="text" ng-keydown="KK(this,$event)" ng-change="dataItem.ConnectionReference = null" ng-model="dataItem.ContractNumber"  ng-disabled="dataItem.IsDisabled"    class="k-fill contact kk"/>',
                        width: "100px"
                    },
                    {
                        field: "Amount", title: "Amount",
                        template: '<input type ="text" ng-keydown="KK(this,$event)" ng-model="dataItem.Amount"    kendo-numeric-text-box class="k-fill text-right amount kk"       />',
                        width: "100px"
                    }

        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: false,
        scrollable: true,
        dataBound: function () {

            var dGrid = $scope.dgGridTransCorrectEntryDetails.data();

            angular.forEach(dGrid, function (row) {

                if (!row.IsValiedAccount && row.IsValiedAccount != undefined) {
                    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                }
            });


        }

    };

    configTransCorrectEntryDetails.dataSource = new kendo.data.DataSource({
        data: [gg1],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'IsSelected': { editable: false, type: "boolean" },
                    'IsValiedAccount': { editable: false, type: "boolean" },
                    'SBU': { editable: false, type: "string" },
                    'PrePost': { editable: false, type: "string" },
                    'ProductType': { editable: false, type: "string" },
                    'ContractNumber': { editable: false, type: "number" },
                    'AccountNo': { editable: true, type: "string" },
                    'ConnectionRef': { editable: true, type: "string" },
                    'CustAddress': { editable: true, type: "string" },
                    'CustName': { editable: true, type: "string" },
                    'CustRef': { editable: true, type: "string" },
                    'CustRefType': { editable: true, type: "string" },
                    'SbuCode': { editable: true, type: "string" },
                    'PrePostCode': { editable: true, type: "string" },
                    'ProductTypeCode': { editable: true, type: "string" },
                    'Amount': { editable: false, type: "number" }
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGridTransCorrectEntryDetails = new DataGrid();
    $scope.dgGridTransCorrectEntryDetails.options(configTransCorrectEntryDetails);

    $scope.Init1 = function (arg) {
        $scope.dgGridTransCorrectEntryDetails.Init(arg);
    };

    //#################################### Finder Payment Transfer #################

    $scope.PaymentTransferID = {};

    $scope.GetPaymentSourseByCcbsPaymentSource = function () {
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        //$scope.BulkPayment.PaymentSource =
        if (defaultDataCookieObj == null || defaultDataCookieObj == undefined) {
            return;
        }
        return defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: $scope.payTrans.PaymentSourceId })[0].Id : "";
    }

    $scope.selectThis = function (e) {
        console.log('called');
        var sum = 0;

        var dataItems = $scope.dgGridTransCorrectEntryDetails.data();

        for (var i = 0; i < dataItems.length; i++) {

            if (dataItems[i].IsSelected === true) {
                console.log(dataItems[i].Amount, parseInt(dataItems[i].Amount));
                if (dataItems[i].Amount == parseInt(dataItems[i].Amount)) {
                    sum = sum + parseInt(dataItems[i].Amount);
                }

            }


        }

        $scope.payTrans.total = sum;
        //  $scope.payCancel.Canceltotal = $scope.payCancel.Canceltotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    $scope.CancelTypeDisabled = false;
    var permissionCodes = AuthService.getProfile().permission;
    if (permissionCodes.indexOf("41001") == -1) {
        $scope.CancelTypeDisabled = true;
    }

    $scope.toggleSelect = function (e) {
        var dataItems = $scope.dgGridTransCorrectEntryDetails.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        }
        setTimeout(function () {

            var sum = 0;

            var dataItems = $scope.dgGridTransCorrectEntryDetails.data();

            for (var i = 0; i < dataItems.length; i++) {

                if (dataItems[i].IsSelected === false) {
                    console.log(dataItems[i].Amount, parseInt(dataItems[i].Amount));
                    if (dataItems[i].Amount == parseInt(dataItems[i].Amount)) {
                        sum = sum + parseInt(dataItems[i].Amount);
                    }

                }


            }

            $scope.payTrans.total = sum;

        }, 100);

    };


    // Search By ReceiptUser

    $scope.PaymentTransferID =
    {

        title: "Search by Payment Transfer ID",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-TRANSFER-BATCH",
            mapId: "BILLING-TRANSFER-BATCH",
            modalId: "PaymentTransferID", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: true,
            onLoad: false
        },
        params: [],
        callback: function (data) {
            $scope.payTrans.BathId = data.selectedItem.PayTransferBatchId;
            $scope.GetTransferBatchDetails();

        },
        open: function () {
            $scope.validateBtn = true;
            $scope.GenerateGuid();
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');

        }
    };
    //  #########################

    // ------------------ Attachments ------------------------------------

    $scope.receipt = [];
    // $scope.receipt.ReceiptId123 = "";
    $scope.IsAttach = "NO";


    //REFERENCE POPUP
    $scope.referenceParams = {
        moduleId: "BACK-OFFICE-PAYMENT-TRANSFER",
        TransactionId: $scope.payTrans.BathId,
        isAttachedDoc: true,
    };

    $scope.$watch("payTrans.BathId", function (newValue) {
        //$scope.referenceParams.TransactionId = $scope.payTrans.BathId;
        $scope.referenceParams = {
            moduleId: "BACK-OFFICE-PAYMENT-TRANSFER",
            TransactionId: $scope.payTrans.BathId,
            isAttachedDoc: true,
            IsDisabled: true
        };
    });


    //End REFERENCE POPUP
    $scope.TransRef = [];
    $scope.referenceCallback = function (data) {
        console.log(data, 'call back');
        $scope.TransRef = data.TransactionReference;
        $scope.IsAttach = "YES";

    };

    //-------------------- End Attachment ----------------------------



    $scope.LoadReceiptFromStorage = function () {
        $scope.prodCatDrop = false;
        $scope.GenerateGuid();
        if (Receiptsdata != null) {

            //$scope.payTrans.BatchDate = Receiptsdata.BatchDate;
            //$scope.payCancel.Canceltotal = CancelReceiptsdata.TotalAmt;
            //$scope.payTrans.BathId = Receiptsdata.BatchId;

            angular.forEach(Receiptsdata.RecCollection, function (item) {

                console.log(item, 'item');
                ///$scope.payTrans.PayMethod = item.PaymentMethod;
                //$scope.payTrans.PaymentModeNew = item.PaymentMode;
                $scope.payTrans.ReceiptStatus = item.ReceiptStatus;
                $scope.payTrans.PrePost = item.PrePost;
                $scope.payTrans.SBU = item.SBU;
                $scope.payTrans.ReceiptDate = item.ReceiptDate;
                $scope.payTrans.ReceiptNumber = item.ReceiptNumber;
                $scope.payTrans.ReferenceNo = item.ReferenceNo;
                $scope.payTrans.ConnectionReference = item.ConnectionReference;
                $scope.payTrans.ContractNo = item.ContractNo;
                $scope.payTrans.Amount = item.Amount;
                $scope.payTrans.PaymentMode = item.PaymentMode;
                $scope.payTrans.PaymentMethod = item.PaymentMethod;
                $scope.payTrans.PaymentSource = item.PaymentSource;
                $scope.payTrans.user = item.ReceiptGeneratedUser;
                $scope.payTrans.PaymentModeId = item.PaymentModeId;
                $scope.payTrans.PayMethodId = item.PaymentMethodId;
                $scope.payTrans.PaymentSourceId = item.PaymentSourceId;
                $scope.payTrans.SbuCode = item.SbuCode;
                $scope.payTrans.PaymentTypeId = item.PaymentTypeId;
                $scope.payTrans.PaymentType = item.PaymentType;
                $scope.payTrans.ProductTypeId = item.ProductType;
                $scope.payTrans.OldProdCat = item.ProdCat;
                $scope.payTrans.PaymentSeq = item.PaymentSeq;
                try {
                    $scope.payTrans.PaymentMode = defaultDataCookieObj.BillingPaymentMode.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMode,
                { Id: item.PaymentMode })[0].Description : "";

                } catch (e) {

                }
                

            });

            console.log($scope.payTrans.user, '$scope.payTrans.user');

            localStorage.setItem('CancelReceipts', null);

        }

    }


    $scope.PageLoad = function () {
        var permissionCodes = AuthService.getProfile().permission;
        if (permissionCodes.indexOf("41001") == -1) {
            $scope.IsBackOfficeUser = false;
        } else {
            $scope.IsBackOfficeUser = true;
        }

        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        //if (defaultDataCookieObj == null) {
        BulkPaymentService.GetDefaultData($scope.userInfo().outletType, $scope.IsBackOfficeUser).then(function (response) {

                if (response.data.Code == "0") {


                    $scope.ProductCatCollection = response.data.Result.BillingProdCat;
                    $scope.cancellattonCode = response.data.Result.reasonCodes;
                    $scope.CancellationDesc = response.data.Result.reasonDesc;


                    localStorage.setItem("BulkPaymentDefaultData", JSON.stringify(response.data.Result));


                } else {
                    $scope.alertMessage = new Message(response.data.Code, response.data.Message);
                }
            }, function (response) {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);
            });
        //} else {

        //    $scope.ProductCatCollection = defaultDataCookieObj.BillingProdCat;
        //    $scope.cancellattonCode = defaultDataCookieObj.reasonCodes;
        //    $scope.CancellationDesc = defaultDataCookieObj.reasonDesc;
        //}

        console.log($scope.cancellattonCode, $scope.CancellationDesc, $scope.ProductCatCollection);

        //$scope.cancellattonCode.unshift({ Id: "0", Description: "Select" });
        //$scope.CancellationDesc.unshift({ Id: "0", Description: "Select" });
        //$scope.ProductCatCollection.unshift({ Id: "0", Description: "All" });

        $scope.LoadReceiptFromStorage();
    }

    $scope.PageLoad();

    //$scope.$watch("payTrans.CancelDesc", function () {
    //    $scope.ResonDescChange();
    //});

    //$scope.$watch("payTrans.cancelCode", function () {
    //    $scope.ResonCodeChange();
    //});

    //$scope.ResonCodeChange = function () {
    //    $scope.payTrans.CancelDesc = $scope.payTrans.cancelCode;

    //}

    //$scope.ResonDescChange = function () {
    //    $scope.payTrans.cancelCode = $scope.payTrans.CancelDesc;
    //}

    var rec = function () {
        this.disable = false;
        this.IsSelected = true;
        this.IsValiedAccount = false;
        this.SBU = "";
        this.PrePost = "";
        this.ProductType = "";
        this.ConnectionReference = "";
        this.ContractNumber = "";
        this.Amount = 0;
        this.AccountNo = "";
        this.ConnectionRef = "";
        this.ContractId = "";
        this.CustAddress = "";
        this.CustName = "";
        this.CustRef = "";
        this.CustRefType = "";
        this.PrePostType = "";
        this.SbuCode = "";
        this.PrePostCode = "";
        this.ProductTypeCode = "";
        this.OldProdCat = "";
        this.ConnectionType = 1;
    }


    $scope.KK = function (row, e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key === 13) {
            $('#pleaseWaitDialog').modal();

            var objAccountList = [];

            var focusedElement = $(e.target);
            var nextElement = focusedElement.closest('td').next();
           
            var $nonempty = $('.conn-ref').eq(0).filter(function () {
                return this.value != ''
            });


            s1 = $scope.dgGridTransCorrectEntryDetails.data();
           

            var s = row.dataItem;

            ///////////////////////////////////
            if (focusedElement.hasClass("conn-ref")) {

                //if (!s.ConnectionReference) {
                //    return;
                //}



                if ($nonempty.length == 0) {

                    setTimeout(function () {
                        nextElement.find('input').focus();
                    }, 10);
                }

                else {

                    nextElement = focusedElement.closest('td').next().next();
                    nextElement.find('input').focus();


                    objAccountList.push({ 'connRef': s.ConnectionReference.trim(), 'contractNo': '' });
                }



            }

            else if (focusedElement.hasClass("contact")) {

                setTimeout(function () {
                    nextElement.find('input').focus();
                }, 10);

                if (!s.ContractNumber) {
                    return;
                }




                objAccountList.push({ 'connRef': '', 'contractNo': s.ContractNumber.trim() });

            }

            if (focusedElement.hasClass("amount")) {
                if (s.ConnectionReference != null && s.sbu == null) {
                    objAccountList.push({ 'connRef': s.ConnectionReference.trim(), 'contractNo': '' });
                } else if (s.ContractNumber != null) {
                    objAccountList.push({ 'connRef': '', 'contractNo': s.ContractNumber.trim() });
                }

                var obj = {
                    "custRef": '',
                    "OldCustRef": '',
                    "CustRefType": '',
                    "productCategory": $scope.payTrans.ProdCat,
                    "sbu": 0,
                    "billInvoiceNo": '',
                    "reqType": 1,
                    "accounts": objAccountList,
                    "accessToken": $cookieStore.get('accessToken')
                }

                var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                var sbuDesc = "";

                console.log(defaultDataCookieObj, 'defaultDataCookieObj');
                $scope.prodCatDrop = true;
                PaymentTransferService.SearchByConRef(obj).then(function (response) {

                    if (response.data.Code == MessageTypes.Success) {

                        for (var i = 0; i < defaultDataCookieObj.BillingSbu.length; i++) {

                            var a = defaultDataCookieObj.BillingSbu[i];

                            console.log(a, 'a');

                            if (a.Id == response.data.Result.SBU) {
                                sbuDesc = a.Description;
                            }
                        }

                        var gData = [];
                        if (s.ContractNumber != undefined && s.SBU == undefined) {
                            var g = new rec();//s1[i];
                            
                            if (response.data.Result.ContractNumber == s.ContractNumber) {
                                g.IsValiedAccount = true;
                                g.IsSelected = true;
                                g.SBU = sbuDesc;
                                g.PrePost = response.data.Result.PrePost;
                                g.ProductType = response.data.Result.ProductType;
                                g.ContractNumber = response.data.Result.ContractNumber;
                                g.AccountNo = response.data.Result.AccountNo;
                                g.ConnectionReference = response.data.Result.ConnectionReference;
                                g.ContractId = response.data.Result.ContractId;
                                g.CustAddress = response.data.Result.CustAddress;
                                g.CustName = response.data.Result.CustName;
                                g.CustRef = response.data.Result.CustRef;
                                g.CustRefType = response.data.Result.CustRefType;
                                g.PrePostType = response.data.Result.PrePostType;
                                g.SbuCode = response.data.Result.SbuCode;
                                g.Amount = s.Amount;
                                g.PrePostCode = response.data.Result.PrePostCode;
                                g.ProductTypeCode = response.data.Result.ProductTypeCode;
                                g.ConnectionType = response.data.Result.ConnectionType;

                                gData = $scope.dgGridTransCorrectEntryDetails.data();
                                gData.push(g);
                                var totAmt = 0;
                                angular.forEach(gData, function (gRow) {
                                    if (gRow.IsSelected == true) {
                                        totAmt = (Number(totAmt) + Number(gRow.Amount)).toFixed(2); //totAmt + gRow.Amount;
                                    }
                                });
                                $scope.payTrans.total = totAmt;
                            }
                        } else if (s.ConnectionReference != undefined && s.SBU == undefined) {
                            var g = new rec();
                            if (response.data.Result.ConnectionRef == s.ConnectionReference) {
                                g.IsDisabled = true;
                                g.IsValiedAccount = true;
                                g.IsSelected = true;
                                g.SBU = sbuDesc;
                                g.PrePost = response.data.Result.PrePost;
                                g.ProductType = response.data.Result.ProductType;
                                g.ContractNumber = response.data.Result.ContractNumber;
                                g.AccountNo = response.data.Result.AccountNo;
                                g.ConnectionReference = response.data.Result.ConnectionReference;
                                g.ContractId = response.data.Result.ContractId;
                                g.CustAddress = response.data.Result.CustAddress;
                                g.CustName = response.data.Result.CustName;
                                g.CustRef = response.data.Result.CustRef;
                                g.CustRefType = response.data.Result.CustRefType;
                                g.PrePostType = response.data.Result.PrePostType;
                                g.SbuCode = response.data.Result.SbuCode;
                                g.Amount = s.Amount;
                                g.PrePostCode = response.data.Result.PrePostCode;
                                g.ProductTypeCode = response.data.Result.ProductTypeCode;
                                g.ConnectionType = response.data.Result.ConnectionType;

                                 gData = $scope.dgGridTransCorrectEntryDetails.data();
                                gData.push(g);
                                var totAmt = 0;
                                angular.forEach(gData, function (gRow) {
                                    if (gRow.IsSelected == true) {
                                        totAmt = (Number(totAmt) + Number(gRow.Amount)).toFixed(2); //totAmt + gRow.Amount;
                                    }
                                });
                                $scope.payTrans.total = totAmt;

                            }
                        }


                        //Added by Ruwan2017
                        var totAmt = 0.00;
                        angular.forEach(gData, function (row) {
                            if (row.Amount != null) {

                                //var newfloat = parseFloat(row.Amount).toFixed(2);
                                //$scope.TotAmt = (Number(row.Amount) + Number($scope.TotAmt)).toFixed(2);
                                totAmt = (parseFloat(Number(row.Amount)) + parseFloat(totAmt)).toFixed(2);
                            }
                         
                        });
                        $scope.payTrans.total = totAmt;

                      //  nextElement = focusedElement.closest('td').next().next();
                        //  nextElement.find('input').focus();

                        ///////////////////////////////////

                        setTimeout(function () {
                            var index = 0;
                            $('.kk').eq(index).focus();

                        }, 10);


                    } else {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });

                       

                    }
                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            }


            if (focusedElement.hasClass("amount")) {
                //$scope.AddToGrid(s);
            }

            $('#pleaseWaitDialog').modal('hide');
            console.log(s.ConnectionReference, s.ContractNumber, s.Amount, s.SBU, s.PrePost, s.ProductType);


        }
    }



    $scope.PageLoad = function () {
        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
        if (defaultDataCookieObj == null) {
            BulkPaymentService.GetDefaultData().then(function (response) {
                if (response.data.Code == "0") {

                    localStorage.setItem("BulkPaymentDefaultData", JSON.stringify(response.data.Result));


                } else {
                    $scope.alertMessage = new Message(response.data.Code, response.data.Message);
                }
            }, function (response) {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);
            });
        }

    }

    $scope.PageLoad();

     


    $scope.SubmitPaymentTransfer = function () {  

        if ($scope.payTrans.PaymentMode == "Genie") {
            toaster.error({ type: 'Error', title: 'Error', body: 'Cannot cancel Genie receipts.', showCloseButton: true });
            return;
        }

        if (permissionCodes.indexOf("41001") == -1) {
            $scope.CancelTypeDisabled = true;
        }
        if ($scope.payTrans.cancelCode == '-- Select --') {
            toaster.error({ type: 'Error', title: 'Error', body: 'Please select transfer reason.', showCloseButton: true });
            return;
        }

        var grid = $scope.dgGridTransCorrectEntryDetails.data();
        var isPrePaidExists = false;
        if (grid.length < 2) {
            toaster.error({ type: 'Error', title: 'Error', body: 'Please key-in the amount and press enter key to validate the new payment in Correct Entry Details grid.', showCloseButton: true });
            return;
        }
        var newReceipt = [];
        angular.forEach(grid, function (gRow) {
            if ((gRow.IsSelected == undefined && gRow.IsValiedAccount == undefined) || (gRow.ConnectionRef == undefined && gRow.ContractNumber == null)) {

            } else {
                if (gRow.IsSelected && gRow.IsValiedAccount) {
                    if (gRow.PrePostCode == 1) {
                        isPrePaidExists = true;
                    } else {
                        newReceipt.push(gRow);
                    }
                    
                }
            }
        });

        if (isPrePaidExists) {
            toaster.error({ type: 'error', title: 'Error', body: "Prepaid account/s exists! Please uncheck Prepaid account/s data.", showCloseButton: true });
            return;
        }

        if (newReceipt.length < 1) {
            toaster.error({ type: 'Error', title: 'Error', body: 'Receipts not found to transfer!.', showCloseButton: true });
            return;
        }
        $scope.TotalNewRec = 0;
        angular.forEach(newReceipt, function (gRow) {
            if (gRow.IsSelected && gRow.IsValiedAccount) {
                $scope.TotalNewRec = (Number($scope.TotalNewRec) + Number(gRow.Amount)).toFixed(2);
            }
        });
        
        //Comment By Ruwan need to uncomment after CR Done
        //if (Number($scope.TotalNewRec).toFixed(2) != Number($scope.payTrans.Amount).toFixed(2)) {
        //    toaster.error({ type: 'Error', title: 'Error', body: 'Correct entry amount should be equal!.', showCloseButton: true });
        //    return;
        //}

        $scope.formData = {
            
            ProdCat: $scope.payTrans.ProdCat,
            cancelCode: $scope.payTrans.cancelCode,
            MistakeDoneBy: $scope.payTrans.MistakeDoneBy,
            Email:$scope.payTrans.Email,
            custContactDetails: $scope.payTrans.custContactDetails,
            remarks: $scope.payTrans.remarks,
            originalReceipt: $scope.payTrans.originalReceipt,
            PayTransForm: $scope.payTrans.PayTransForm,
            NicCopy: $scope.payTrans.NicCopy,
            ReqLetter: $scope.payTrans.ReqLetter,
            PaymentTypeId: $scope.payTrans.PaymentTypeId,
            PaymentSourceId: $scope.payTrans.PaymentSourceId,//$scope.GetPaymentSourseByCcbsPaymentSource(),
            PayMethodId: $scope.payTrans.PayMethodId,
            TransferTo: $scope.payTrans.TransferTo,
            ReceiptNumber: $scope.payTrans.ReceiptNumber,
            ReferenceNo: $scope.payTrans.ReferenceNo,
            ReceiptDate: $scope.payTrans.ReceiptDate,
            SbuCode: $scope.payTrans.SbuCode,
            ConnectionReference: $scope.payTrans.ConnectionReference,
            ContractNo: $scope.payTrans.ContractNo,
            PrePostCode: $scope.payTrans.PrePostCode,
            ProductTypeId: $scope.payTrans.ProductTypeId,
            PaymentModeId: $scope.payTrans.PaymentModeId,
            PaymentSource:$scope.payTrans.PaymentSource,
            PayMethod: $scope.payTrans.PayMethod,
            OutletType : $scope.userInfo().outletType,

            Amount: $scope.payTrans.Amount,
            user: $scope.payTrans.user,
            total: $scope.payTrans.total,
            needWorkFlow: $scope.CancelTypeDisabled,

            GridData: newReceipt,
            AttachedList: $scope.TransRef,
            TempAttachmentRef: $scope.TempAttachmentRef,
            OldProdCat: $scope.payTrans.OldProdCat,
            PaymentSeq: $scope.payTrans.PaymentSeq

        };
        $scope.validateBtn = true;
        $scope.SaveBtn = true;
        PaymentTransferService.SubmitPaymentTransfer($scope.formData).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                var s = response.data.Message;

                $scope.payTrans.BathId = response.data.Result.BathId;
                $scope.payTrans.workflowCodes = response.data.Result.workflowCodes;
                $scope.payTrans.workflow = response.data.Result.workflow;
                $scope.payTrans.BatchDate = response.data.Result.BatchDate;
                //$scope.payTrans.PayMethod = response.data.Result.PaymentMethod;
                $scope.payTrans.PaymentModeNew = response.data.Result.PaymentModeNew;
                $scope.payTrans.TransferTo = response.data.Result.TransferTo;
                $scope.payTrans.PayMethod = response.data.Result.PaymentMethod;
                //    defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods,
                //{ Id: response.data.Result.PaymentMethod })[0].Description : "";
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });

            } else {
                $scope.validateBtn = false;
                $scope.SaveBtn = false;
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }

        }, function (response) {
            $scope.validateBtn = false;
            $scope.SaveBtn = false;
            toaster.error({ type: 'Error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });

    }

    $scope.RequetCRMDetails = function (cRMAccList) {

        $scope.IsLoadingAtFirstTime = false;
        //$cookieStore.put("accessToken", "");

        var obj = {
            "custRef": "",
            "OldCustRef": "",
            "CustRefType": "",
            "productCategory": $scope.payTrans.ProdCat,
            "sbu": 0,
            "billInvoiceNo": "",
            "reqType": 1,
            "accounts": cRMAccList,
            "accessToken": $cookieStore.get('accessToken')
        }


        BulkPaymentService.ValidateRecordsFromCRM(obj).success(function (response) {
            if (response.Result.isNewAccessToken) {
                $cookieStore.put("accessToken", response.Result.accessToken);
            }
            if (response.Code != MessageTypes.Success) {
                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            } else {
                var GData = $scope.dgGridTransCorrectEntryDetails.data();
                angular.forEach(GData, function (gRow) {
                    var isCrmFail = true;
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
                        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                        angular.forEach(resHeader.accounts, function (res) {
                            $scope.IsRetrivedCrmDetailsBulk = false;
                            if ((res.contractNo != null && res.contractNo == gRow.ContractNumber) ||
                                (res.connRef != null && res.connRef == gRow.ConnectionReference)) {

                                //gRow.SBU = res.Sbu;
                                //gRow.PrePost = res.accountType;
                                //gRow.PrePostDesc = res.accountType == 1 ? "Pre Paid" : "Post Paid";
                                //gRow.ProductType = res.productType;
                                //gRow.ProductTypeDesc = res.productType == ProductTypes.Other ? 'Other' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : 'LTE',
                                //gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";
                                //gRow.ConnectionReference = res.connRef;
                                //gRow.ContractNumber = res.contractNo;

                                gRow.ProductType = res.productType == ProductTypes.Other ? 'Other' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.Fixed ? 'Fixed' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                gRow.IsValiedAccount = true;
                                gRow.IsSelected = true;
                                gRow.SBUDesc = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "";
                                gRow.PrePost = res.accountType == 1 ? "Pre" : "Post";;
                                gRow.ProductTypeCode = res.productType;
                                gRow.ContractNumber = res.contractNo;
                                gRow.AccountNo = res.accountNo;//accountNo.AccountNo;
                                gRow.ConnectionRef = res.connRef;
                                gRow.ContractId = res.contractNo;
                                //gRow.CustAddress = response.Result.CustAddress;
                                //gRow.CustName = response.Result.CustName;
                                //gRow.CustRef = response.Result.CustRef;
                                //gRow.CustRefType = response.Result.CustRefType;
                                //gRow.PrePostType = response.Result.PrePostType;
                                gRow.SbuCode = res.Sbu;
                                gRow.PrePostCode = res.accountType;
                                //gRow.ProductTypeCode = response.Result.ProductTypeCode;

                            }

                        });
                    });

                    if (isCrmFail) {
                        gRow.IsRetrivedCrmDetails = true;
                    }

                    gRow.IsSelected = true;
                });

                var GData = $scope.dgGridTransCorrectEntryDetails.data();//$scope.dgGridBulkPayment.data();

                //$scope.TotAmt = 0.00;
                //angular.forEach(GData, function (row) {
                //    //$scope.TotAmt = (Number(row.Amount) + Number($scope.TotAmt)).toFixed(2);
                //    $scope.TotAmt = (parseFloat(row.Amount) + parseFloat($scope.TotAmt)).toFixed(2);
                //});
                //$scope.payTrans.total = Number($scope.TotAmt).toFixed(2);;

                //Added by Ruwan2017
                var totAmt = 0.00;
                angular.forEach(GData, function (row) {
                    if (row.Amount != null) {
                        //var newfloat = parseFloat(row.Amount).toFixed(2);
                        //$scope.TotAmt = (Number(row.Amount) + Number($scope.TotAmt)).toFixed(2);
                        totAmt = (parseFloat(Number(row.Amount)) + parseFloat(totAmt)).toFixed(2);
                    }

                });
                $scope.payTrans.total = totAmt;

                //Add by Ruwan
                //angular.forEach(GData, function (row) {

                //    if (!row.IsValiedAccount && row.IsValiedAccount != undefined) {
                //        $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                //    }
                //});
            }

            //$scope.CheckRowColor();

        }).error(function (response) {
            if (response.Result.isNewAccessToken) {
                $cookieStore.put("accessToken", response.Result.accessToken);
            } toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
            return;
        });

    }

    $scope.CreateCRMObjectToValidateBulk = function () {
        var GData = $scope.dgGridTransCorrectEntryDetails.data();
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

    $scope.GetTransferBatchDetails = function () {
        $scope.validateBtn = true;
        $scope.SaveBtn = true;
        var batchId = $scope.payTrans.BathId;
        PaymentTransferService.GetTransferBatchDetails(batchId).then(function (response) {

            if (response.data.Code == "0") {
                $scope.payTrans = response.data.Result;
                $scope.dgGridTransCorrectEntryDetails.data(response.data.Result.GData);
                $scope.gdata = $scope.dgGridTransCorrectEntryDetails.data();
                $scope.TotAmt = 0;
                $scope.payTrans.MistakeDoneBy = response.data.Result.MistakeDoneBy;
                var Pmethod = response.data.Result.PayMethod;
                var PNewmethod = response.data.Result.PaymentMethod;

                $scope.payTrans.PaymentMethod = Pmethod;//
                $scope.payTrans.SBU = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: response.data.Result.SBU })[0].Description : "";
                $scope.payTrans.PayMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods,
                { Id: PNewmethod })[0].Description : "";

                $scope.payTrans.PaymentModeNew = defaultDataCookieObj.BillingPaymentMode.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMode,
                { Id: response.data.Result.PaymentModeNew })[0].Description : "";
                $scope.payTrans.PaymentMode = defaultDataCookieObj.BillingPaymentMode.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMode,
                { Id: response.data.Result.PaymentMode })[0].Description : "";
               
                $scope.PaymentModeCollection = defaultDataCookieObj.BillingPaymentMode;

                angular.forEach($scope.dgGridTransCorrectEntryDetails.data(), function (row) {
                    row.IsDisabled = true;
                    //row.ProductType = row.ProductType == ProductTypes.Other ? 'Other' : row.productType == ProductTypes.Wifi ? 'Wifi' : row.productType == ProductTypes.NFC ? 'NFC' : row.productType == ProductTypes.CDMA ? 'CDMA' : row.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE';
                    $scope.TotAmt = (Number(row.Amount) + Number($scope.TotAmt)).toFixed(2);
                });
                $scope.payTrans.total = $scope.TotAmt;
                $scope.payTrans.cancelCode = response.data.Result.cancelCode;
                $scope.payTrans.CancelDesc = response.data.Result.cancelCode;
                $scope.IsAttach = response.data.Result.IsAttached;
                var ss = $scope.payTrans.cancelCode;
            } else {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);
            }
        }, function (response) {
            $scope.alertMessage = new Message(response.data.Code, response.data.Message);
        });
    }

    $scope.SetTransferReasonDesc = function () {
        $scope.payTrans.cancelCode = $scope.payTrans.CancelDesc;
    }
    $scope.SetTransferReasonId = function () {
        $scope.payTrans.CancelDesc = $scope.payTrans.cancelCode;
    }

}]);