/*
Bulk Excel Verification Modal Directive

*/

angular.module("DialogBilling").directive("bulkExcelVerification", ["bulkExcelVerificationService", "fileUploadService", "$filter", "$cookies", function (bulkExcelVerificationService, fileUploadService, $filter, $cookieStore) {
    return {
        restrict: "E",
        replace: true, 
        scope: {
            params: "=",
            callback: "&",
            data: "@",
            title: "@"
        },
        templateUrl: "./Views/Common/bulkExcelVerification.html",
        controller: ["$scope", "$attrs", "toaster", "AuthService", function ($scope, $attrs, toaster, AuthService) {

            var permissionCodes = AuthService.getProfile().permission;
            if (permissionCodes.indexOf("41001") == -1) {
                $scope.IsBackOfficeUser = false;
            } else {
                $scope.IsBackOfficeUser = true;
            }

            //Init
            $scope.RowsId = 1;
            $scope.isSendRequest = false;
            $scope.UploadSumarry = {};
            $scope.UploadSumarry.NoOfTotalRec=0;
            $scope.UploadSumarry.SuspenseCount = 0;
            $scope.UploadSumarry.TotalValiedAmt1 = Number(0).toFixed(2);
            $scope.UploadSumarry.SuspenseAmt = Number(0).toFixed(2);

            $scope.SelectedPaymentSource = "";
            $scope.SelectedPaymentType = "";
            $scope.suspenseAccId = "";
            $scope.bulkExcel = {};
            $scope.SubmitToBulkPaymentButtonDisabled = true;
            $scope.ChangeToSuspenseBtnDisabled = true;
            $scope.VerifyButtonDisabled = true;
            //watch params and initiate directives
            $scope.$watchCollection("params", function (_val) {
                console.log("params", _val);
                $scope.dgGridInvalidPayments.data([]);
                $scope.dgGridAllPayments.data([]);

                if ($scope.params.onLoad) {
                    init();
                }

                $scope.RowsId = 1;
                $scope.isSendRequest = false;
                $scope.UploadSumarry = {};
                $scope.UploadSumarry.NoOfTotalRec = 0;
                $scope.UploadSumarry.SuspenseCount = 0;
                $scope.UploadSumarry.TotalValiedAmt1 = Number(0).toFixed(2);
                $scope.UploadSumarry.SuspenseAmt = Number(0).toFixed(2);

                var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                if (defaultDataCookieObj != null) {
                    {
                        if (_val.BulkExcelPaymentObjectCollection == undefined) {
                            return;
                        }
                        $scope.bulkExcel.PaymentType = defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType, { Id: _val.BulkExcelPaymentObjectCollection.PaymentType })[0].Description : "";
                        $scope.bulkExcel.Sbu = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: _val.BulkExcelPaymentObjectCollection.Sbu })[0].Description : "";
                        $scope.bulkExcel.PaymentSource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: _val.BulkExcelPaymentObjectCollection.PaymentSource })[0].Description : "";
                        $scope.SelectedPaymentSource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: _val.BulkExcelPaymentObjectCollection.PaymentSource })[0].Id : "";
                       
                        $scope.bulkExcel.PaymentMethod = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Id: _val.BulkExcelPaymentObjectCollection.PaymentMethod })[0].Description : "";
                        $scope.bulkExcel.ProductCat = defaultDataCookieObj.BillingProdCat.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingProdCat, { Id: _val.BulkExcelPaymentObjectCollection.ProductCat })[0].Description : "";
                        $scope.AccountTypeCollection = defaultDataCookieObj.BillingSusAcc;

                    }
                }
            });

            $scope.$watchCollection("data", function (_val) {
                $scope.dgGridAllPayments.data();
                $scope.dgGridInvalidPayments.data();

            });

            ///////////////////

            //@@@@@@@@@@@@@@@@@@@@@@@@@@


            //-> Grid Sample data for demo purposes

            var bulkExcelVerificationSample = [
                { IsSelected: 'a', ID: '002', ConnectionReference: '001', ContractNumber: '001', PayAmount: '002', Reference: '002', Remarks: '002' }

            ];

            var bulkExcelVerificationSample2 = [
               { IsSelected: 'a', ID: '002', ApplyCorrection: '002', ConnectionReference: '001', ContractNumber: '001', PayAmount: '002', Reference: '002', Remarks: '002' }

            ];


            //@@@@@@@@@@@@@@@@@@@@@@@@@@

            //-> Grid Start
            var commonGridConfig = {
                input: true,
                numeric: false,
                pageSize: 10,
                pageSizes: [15, 50, 75, 100]
            };

            var configAllPayments = {};
            var configAllPayments = {
                columns: [
                    //{
                    //    field: "IsSelected", headerTemplate: '<input type="checkbox" title="Select all" ng-click="toggleSelect($event)" ng-model="IsSelectedAll"/>', template: '<input type="checkbox" ng-click="selectThis($event)" ng-model="dataItem.IsSelected" />', width: "32px"
                    //},
                    //{ field: "ID", title: "No", width: "32px" },
                    { field: "ConnectionReference", title: "Connection Reference", width: "80px" },
                    { field: "ContractNumber", title: "Contract Number", width: "80px" },
                    { field: "PrePostDesc", title: "Pre/Post", width: "40px" },
                    { field: "Amount", template: "{{dataItem.Amount|number:2}}", attributes: { style: "text-align:right;" }, title: "Pay Amount", width: "60px" },
                    { field: "ReferenceNumber", title: "Reference", width: "80px" },
                    { field: "Remarks", title: "Remarks", width: "120px" }

                ],


                pageable: commonGridConfig,
                navigatable: true,
                editable: "inline", sortable: true,
                scrollable: true



            };

            configAllPayments.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                            'IsSelected': { editable: false, type: "boolean" },
                            'RowId': { editable: false, type: "number" },
                            'SBU': { editable: false, type: "number" },
                            'PrePost': { editable: false, type: "string" },
                            'Hybrid': { editable: false, type: "string" },
                            'ConnectionReference': { editable: false, type: "number" },
                            'ContractNumber': { editable: false, type: "number" },//ContractNumber
                            'CustomerName': { editable: false, type: "string" },//CustomerName
                            'CustomerIDType': { editable: false, type: "string" },
                            'DisconnectedCode': { editable: false, type: "string" },
                            'SwitchStatus': { editable: false, type: "string" },                            
                            'DisconnectedReason': { editable: false, type: "string" },
                            'BillingCycle': { editable: false, type: "string" },
                            'PRCode': { editable: false, type: "string" },
                            'PREmail': { editable: false, type: "string" },
                            'ContractEmail': { editable: false, type: "string" },
                            'CustomerIDNumber': { editable: false, type: "string" },
                            'OldNIC': { editable: false, type: "string" },
                            'AccountNo': { editable: false, type: "string" },
                            'Amount': { editable: false, type: "number" },
                            'Remarks': { editable: false, type: "number" },
                            'IsSuspend': { editable: false, type: "boolean" },
                            'PrePostDesc':{ editable: false, type: "string" },
                            'SBUDesc': { editable: false, type: "string" },
                            'ContactNo': { editable: false, type: "string" },
                            'ProductType': { editable: false, type: "string" },
                            'ReferenceNumber': { editable: false, type: "string" },

                            'ProductTypeDesc': { editable: false, type: "string" },
                            'PaymentMethod': { editable: false, type: "string" },
                            'SwitchStatusDesc': { editable: false, type: "string" },
                        }
                    }
                },
                pageSize: 10
            });

            var configInvalidPayments = {};
            var configInvalidPayments = {
                columns: [
                    //{
                    //    field: "IsSelected",
                    //    headerTemplate: '<input type="checkbox" title="Select all"   />',
                    //    template: '<input type="checkbox"   />',
                    //    width: "32px"

                    //},
                    //{ field: "ID", title: "No", width: "32px" },
                    {
                        field: "ApplyCorrection",
                        headerTemplate: 'Apply Correction',
                        template: '<button class="btn btn-xs btn-info"  ng-disabled="dataItem.bulkExcelDisabled"  ng-click="ExcelVerifycationSingle(this)"><i class="glyphicon glyphicon-ok"></i></button>',
                        width: "100px"
                    },
                    {
                        field: "ConnectionReference",
                        headerTemplate: 'Connection Reference',
                        template: '<input type ="text"  ng-disabled="dataItem.bulkExcelDisabled" ng-model="dataItem.ConnectionReference" next-focus class="k-fill text-right"/>',
                        width: "130px"
                    },
                   {
                       field: "ContractNumber", title: "Contract Number",
                       headerTemplate: 'Contract Number',
                       template: '<input type ="text" ng-disabled="dataItem.bulkExcelDisabled" ng-model="dataItem.ContractNumber" next-focus class="k-fill text-right" />',
                       width: "130px"
                   },
                    //{ field: "Amount", template: "{{dataItem.Amount|number:2}}", attributes: { style: "text-align:right;" }, title: "Pay Amount", width: "80px" },
                    {
                        field: "Amount", title: "Pay Amount",
                        headerTemplate: 'Pay Amount',
                        template: '<input type ="text"  ng-disabled="dataItem.bulkExcelDisabled" ng-model="dataItem.Amount" kendo-numeric-text-box next-focus class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "130px"
                    },
                    {
                        field: "ReferenceNumber",
                        headerTemplate: 'Reference Number',
                        template: '<input type ="text" ng-disabled="dataItem.bulkExcelDisabled"  ng-model="dataItem.ReferenceNumber" text-box next-focus class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                        width: "120px"
                    },
                    {
                        field: "Remarks",
                        headerTemplate: 'Remarks',
                        template: '<input type ="text"  ng-disabled="dataItem.bulkExcelDisabled" ng-model="dataItem.Remarks" next-focus class="k-fill text-right"    />',
                        width: "100px"
                    }
                ],

                pageable: commonGridConfig,
                navigatable: true,
                editable: "inline",
                scrollable: true


            };

            configInvalidPayments.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                            'IsSelected': { editable: false, type: "boolean" },
                            'RowId': { editable: false, type: "number" },
                            'ApplyCorrection': { editable: false, type: "string" },
                            'SBU': { editable: false, type: "number" },
                            'PrePost': { editable: false, type: "string" },
                            'Hybrid': { editable: false, type: "string" },
                            'ConnectionReference': { editable: false, type: "number" },
                            'ContractNumber': { editable: false, type: "number" },//ContractNumber
                            'CustomerName': { editable: false, type: "string" },//CustomerName
                            'CustomerIDType': { editable: false, type: "string" },
                            'DisconnectedCode': { editable: false, type: "string" },
                            'SwitchStatus': { editable: false, type: "string" },
                            'DisconnectedReason': { editable: false, type: "string" },
                            'BillingCycle': { editable: false, type: "string" },
                            'PRCode': { editable: false, type: "string" },
                            'PREmail': { editable: false, type: "string" },
                            'ContractEmail': { editable: false, type: "string" },
                            'CustomerIDNumber': { editable: false, type: "string" },
                            'OldNIC': { editable: false, type: "string" },
                            'AccountNo': { editable: false, type: "string" },
                            'Amount': { editable: false, type: "number" },
                            'Remarks': { editable: false, type: "number" },
                            'IsSuspend': { editable: false, type: "boolean" },
                            'PrePostDesc': { editable: false, type: "string" },
                            'SBUDesc': { editable: false, type: "string" },
                            'ContactNo': { editable: false, type: "string" },
                            'ProductType': { editable: false, type: "string" },
                            'ReferenceNumber': { editable: false, type: "string" },

                            'ProductTypeDesc': { editable: false, type: "string" },
                            'PaymentMethod': { editable: false, type: "string" },
                            'SwitchStatusDesc': { editable: false, type: "string" },
                        }
                    }
                },
                pageSize: 10

            });

            ///////
            $scope.dgGridAllPayments = new DataGrid();
            $scope.dgGridAllPayments.options(configAllPayments);

            $scope.dgGridInvalidPayments = new DataGrid();
            $scope.dgGridInvalidPayments.options(configInvalidPayments);

            $scope.InitA = function (arg) {
                $scope.dgGridAllPayments.Init(arg);
            };
            $scope.InitB = function (arg) {
                $scope.dgGridInvalidPayments.Init(arg);
            };

            $scope.GridTitle = 'All Payments';
            $scope.gridShowValue = false; 

            //$scope.UploadSumarry.SuspenseAmt
            //$scope.UploadSumarry.TotalValiedAmt1
            $scope.toggleSelect = function (e) {
                var dataItems = $scope.dgGridAllPayments.data();
                $scope.totAmount = 0;
                for (var i = 0; i < dataItems.length; i++) {
                    dataItems[i].IsSelected = e.target.checked;
                    if (e.target.checked == true) {
                        $scope.totAmount = $scope.totAmount + dataItems[i].Amount;
                    }
                }
                $scope.UploadSumarry.TotalValiedAmt1 = $scope.totAmount > 0 ? Number($scope.totAmount).toFixed(2) : Number(0).toFixed(2);
                $scope.selectThis();
            };

            $scope.selectThis = function (e) {
                $scope.selectedRow = e;
                $scope.totAmount = 0;
                var isSelected = true;
                var dataItems = $scope.dgGridAllPayments.data();
                for (var i = 0; i < dataItems.length; i++) {
                    var sss = dataItems[i].IsSelected;
                    if (!dataItems[i].IsSelected) {
                        isSelected = false;
                    } else {
                        var f = $scope.totAmount;
                        var g = dataItems[i].Amount;
                        if (g != null) {
                            //$scope.totAmount = $scope.totAmount + Number(dataItems[i].Amount).toFixed(2);
                            $scope.totAmount = (Number($scope.totAmount) + Number(dataItems[i].Amount)).toFixed(2);
                        }

                    }
                }
                $scope.UploadSumarry.TotalValiedAmt1 = $scope.totAmount > 0 ? Number($scope.totAmount).toFixed(2) : Number(0).toFixed(2)
                $scope.IsSelectedAll = isSelected;
            };







            $scope.RequestStatusChange = function () {
                if ($scope.isSendRequest) {
                    toaster.error({ type: 'error', title: 'Error', body: 'Procedding...!', showCloseButton: true });
                    return true;
                } else {
                    return false;
                }
            }

          

            $scope.uploadDocuments = function () {

                if ($scope.RequestStatusChange()) {
                    return;
                }

                $scope.UploadSumarry.NoOfTotalRec = 0;
                $scope.UploadSumarry.TotalValiedAmt1 = Number(0).toFixed(2);
                $scope.UploadSumarry.SuspenseCount = 0;
                $scope.UploadSumarry.SuspenseAmt = Number(0).toFixed(2);

                console.log($scope.myFile, "$scope.myFile");
                if ($scope.myFile != undefined) {

                    //$scope.alertMessagePopup = new Message(1, "Success!");
                    var objAttached = {
                        form: $scope.Reference,
                        file: $scope.myFile,
                        ModuleId: '1',
                        TransactionId: '12'
                    };

                    fileUploadService.UploadExcelFiles(objAttached).then(
                        function (result) {
                            if (result.data.Code == 0 && result.data.Result.length > 0) {
                                $scope.dgGridAllPayments.data(result.data.Result);

                                $scope.SubmitToBulkPaymentButtonDisabled = true;
                                $scope.ChangeToSuspenseBtnDisabled = true;
                                $scope.VerifyButtonDisabled = false;

                                $scope.UploadSumarry.NoOfTotalRec = result.data.Result.length;
                                var totAmt = 0;
                                angular.forEach(result.data.Result, function (row) {
                                    totAmt = (Number(row.Amount) + Number(totAmt)).toFixed(2); //Number(totAmt).toFixed(2) + Number(row.Amount).toFixed(2);
                                });
                                $scope.UploadSumarry.TotalValiedAmt1 = totAmt > 0 ? Number(totAmt).toFixed(2) : Number(0).toFixed(2);

                                //$scope.alertMessagePopup = new Message(result.data.Code, "Success");
                                toaster.success({ type: 'Success', title: 'Success', body: 'Excel data successfully added!', showCloseButton: true });
                            } else {
                                $scope.SubmitToBulkPaymentButtonDisabled = true;
                                $scope.ChangeToSuspenseBtnDisabled = true;
                                $scope.VerifyButtonDisabled = true;

                                //$scope.alertMessagePopup = new Message(result.data.Code, result.data.Message);
                                toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                            }

                          

                            $scope.isSendRequest = false;
                        }, function (result) {
                            $scope.SubmitToBulkPaymentButtonDisabled = true;
                            $scope.ChangeToSuspenseBtnDisabled = true;
                            $scope.VerifyButtonDisabled = true;

                            toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                            $scope.isSendRequest = false;
                        });
                } else {
                    $scope.SubmitToBulkPaymentButtonDisabled = true;
                    $scope.ChangeToSuspenseBtnDisabled = true;
                    $scope.VerifyButtonDisabled = true;
                    //$scope.alertMessagePopup = new Message("0", "");
                    toaster.error({ type: 'error', title: 'Error', body: 'Please select the upload file!', showCloseButton: true });
                    $scope.isSendRequest = false;
                }
            };

            $scope.IsSuspenseGrid = false;

            //gridId == 1 ? dgGridAllPayments : dgGridInvalidPayments;
            $scope.ExcelVerifycationBulk = function (gridId) {
                debugger;
                $scope.GridTitle = 'Valid Payments';
                $scope.gridShowValue = true;

                if ($scope.RequestStatusChange()) {
                    $scope.isSendRequest = true;
                    return;
                }
                var s = [];
                if (gridId == 1) {
                    s = $scope.dgGridAllPayments.data();
                } else {
                    s = $scope.dgGridInvalidPayments.data();
                }
                $scope.ItemCollection = [];
                $scope.VerifyButtonDisabled = true;
                var objAccountList = [];

                if (gridId == 1) {
                    angular.forEach(s, function (row) {
                        objAccountList.push({ 'connRef': row.ConnectionReference, 'contractNo': row.ContractNumber });
                    });
                } else {
                    objAccountList.push({ 'connRef': $scope.suspenseAccId, 'contractNo': '' });
                }

                var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                $scope.ProductCatId = defaultDataCookieObj.BillingProdCat.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingProdCat, { Description: $scope.bulkExcel.ProductCat })[0].Id : "";
                $scope.SbuId = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Description: $scope.bulkExcel.Sbu })[0].Id : "";
                //$scope.SelectedPaymentSource = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { Description: $scope.bulkExcel.PaySource })[0].Id : "";
                $scope.SelectedPaymentType = defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType, { Description: $scope.bulkExcel.PaymentType })[0].Id : "";
               
                

                var obj = {
                    "custRef": "",
                    "OldCustRef": "",
                    "CustRefType": "",
                    "productCategory": $scope.ProductCatId,
                    "sbu": $scope.SbuId,
                    "billInvoiceNo": "",
                    "reqType": 1,
                    "accounts": objAccountList,
                    "accessToken": $cookieStore.get('accessToken')
                }

                bulkExcelVerificationService.ExcelVerifycation(obj).success(function (response) {
                    if (response.Result.isNewAccessToken) {
                        $cookieStore.put("accessToken", response.Result.accessToken);
                    }
                    if (response.Code == MessageTypes.Success) {
                        $scope.gridShowValue = true;

                        $scope.valiedDataGrid = [];
                        $scope.inValiedDataGrid = [];

                        $scope.TotalValiedAmt = 0;

                        if (gridId == 1) {
                            s = $scope.dgGridAllPayments.data();
                        } else {
                            s = $scope.dgGridInvalidPayments.data();
                        }
                       
                       

                        angular.forEach(s, function (gridObj) {
                            var isValidated = false;
                            if (response.Result.profiles.length < 1) {
                                toaster.error({ type: 'error', title: 'Error', body: 'CRM error : Profile data not found!.', showCloseButton: true });
                                return;
                            }
                            angular.forEach(response.Result.profiles, function (resHeader) {
                                if (resHeader.accounts.length < 1) {
                                    toaster.error({ type: 'error', title: 'Error', body: 'CRM error : Accounts data not found!.', showCloseButton: true });
                                    return;
                                }
                                angular.forEach(resHeader.accounts, function (res) {
                                    if (gridObj.ConnectionReference == res.connRef || gridObj.ContractNumber == res.contractNo || (($scope.suspenseAccId == res.connRef || gridObj.ContractNumber == res.contractNo) && gridId != 1)) {
                                        defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                        //$scope.ConRef = ;

                                        if (gridId == 1) {

                                        } else {
                                            gridObj.Remarks = gridObj.Remarks + " / " + gridObj.ConnectionReference;
                                            res.connRef = $scope.suspenseAccId;
                                            gridObj.ReferenceNumber = gridObj.Remarks;//gridObj.Remarks + " / " + gridObj.ConnectionReference;
                                        }

                                        var valiedObj = {
                                            'RowId': $scope.RowsId,
                                            'IsValiedAccount': true,
                                            'IsRetrivedCrmDetails': false,
                                            'PrePost': res.accountType,
                                            'Hybrid': res.hybridFlag == 1 ? "Y" : "N",
                                            'ConnectionReference': res.connRef,
                                            'ContractNumber': res.contractNo,
                                            'CustomerName': resHeader.custName,
                                            'CustomerIDType': resHeader.custRefType,
                                            'DisconnectedCode': res.disconReasonCode,
                                            'SwitchStatus': res.conStatus,
                                            'DisconnectedReason': res.disconReason,
                                            'BillingCycle': res.billCycle,
                                            'PRCode': res.prCode,
                                            'PREmail': res.prEmail,
                                            'ContractEmail': res.contractEmail,
                                            'CustomerIDNumber': resHeader.custRef,
                                            'OldNIC': resHeader.oldCustRef,
                                            'AccountNo': res.accountNo,
                                            'SBU': res.Sbu,
                                            'IsSuspend': false,
                                            'IsValiedAccount': true,
                                            'ProductType': res.productType,
                                            'ProductTypeDesc': res.productType == ProductTypes.Other ? 'Other' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                            'ContactNo':res.ContactNo,
                                            'PrePostDesc': res.accountType == 1 ? "Pre" : "Post",
                                            'SBUDesc': defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "",
                                            'Amount': gridObj.Amount,
                                            'Remarks': gridObj.Remarks,
                                            'IsSelected':true,
                                            'ConnectionReferenceGridDisabled': true,
                                            'ContractNumberGridDisabled': true,
                                            'AmountGridDisabled': true,
                                            'ReferenceNumberGridDisabled': true,
                                            'RemarksGridDisabled': true,
                                            'ReferenceNumber':gridObj.ReferenceNumber,
                                            'SwitchStatusDesc': res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense',
                                            'PaymentMethod': $scope.bulkExcel.PaymentMethod,

                                        }
                                        $scope.valiedDataGrid.push(valiedObj),
                                        isValidated = true;
                                        //$scope.UploadSumarry.TotalValiedAmt1 = (Number($scope.UploadSumarry.TotalValiedAmt1) + Number(gridObj.Amount)).toFixed(2);
                                        $scope.RowsId = $scope.RowsId + 1;
                                    }
                                });
                            });
                            if (!isValidated) {

                                var valiedObj = {
                                    'RowId': $scope.RowsId,
                                    'IsValiedAccount': false,
                                    'IsRetrivedCrmDetails': false,
                                    'PrePost': '',//res.accountType,
                                    'Hybrid': 'N',//res.hybridFlag == 1 ? "Y" : "N",
                                    'ConnectionReference': gridObj.ConnectionReference,//res.connRef,
                                    'ContractNumber': gridObj.ContractNumber,//res.contractNo,
                                    'CustomerName': '',//resHeader.custName,
                                    'CustomerIDType': '',//resHeader.custRefType,
                                    'DisconnectedCode': '',//res.disconReasonCode,
                                    'SwitchStatus': '',//res.conStatus,
                                    'DisconnectedReason': '',//res.disconReason,
                                    'BillingCycle': '',//res.billCycle,
                                    'PRCode': '',//res.prCode,
                                    'PREmail': '',//res.prEmail,
                                    'ContractEmail': '',//res.contractEmail,
                                    'CustomerIDNumber': '',//resHeader.custRef,
                                    'OldNIC': '',//resHeader.oldCustRef,
                                    'AccountNo': '',//res.accountNo,
                                    'SBU': gridObj.SBU,// res.Sbu,
                                    'IsSuspend': true,
                                    'IsValiedAccount': false,
                                    'ProductType': '',//gridObj.,//res.productType,
                                    'ProductTypeDesc': '',//res.productType == ProductTypes.Other ? 'Other' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : 'LTE',
                                    'ContactNo': '',// res.ContactNo,
                                    'PrePostDesc':  '',//res.accountType == 1 ? "Pre" : "Post",
                                    'SBUDesc': defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: gridObj.SBU })[0].Description : "",
                                    'Amount': gridObj.Amount,
                                    'Remarks': gridObj.Remarks,
                                    'IsSelected': true,
                                    'ConnectionReferenceGridDisabled': true,
                                    'ContractNumberGridDisabled': true,
                                    'AmountGridDisabled': true,
                                    'ReferenceNumberGridDisabled': true,
                                    'RemarksGridDisabled': '',//true,
                                    'ReferenceNumber': gridObj.ReferenceNumber,
                                    'SwitchStatusDesc': '',//res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : res.conStatus == SwitchStatus.NotConnected ? 'Not Connected' : 'Suspense',
                                    'PaymentMethod': '',//$scope.bulkExcel.PaymentMethod,
                                }
                                $scope.inValiedDataGrid.push(valiedObj);
                                //$scope.UploadSumarry.TotalValiedAmt1 = (Number($scope.UploadSumarry.TotalValiedAmt1) + Number(gridObj.Amount)).toFixed(2);
                                $scope.UploadSumarry.SuspenseAmt = (Number($scope.UploadSumarry.SuspenseAmt) + Number(gridObj.Amount)).toFixed(2);
                            }
                        });
                        

                        if (gridId == 1) {
                            s = $scope.dgGridAllPayments.data();
                            $scope.UploadSumarry.TotalValiedAmt1 = Number(0).toFixed(2);
                            angular.forEach(s, function (gridObj) {
                                $scope.UploadSumarry.TotalValiedAmt1 = (Number($scope.UploadSumarry.TotalValiedAmt1) + Number(gridObj.Amount)).toFixed(2);
                            });
                        } else {
                            $scope.dgGridInvalidPayments.data([]);
                            $scope.dgGridInvalidPayments.data($scope.valiedDataGrid);

                                s = $scope.dgGridInvalidPayments.data();
                                $scope.ToSuspenseData = $scope.dgGridInvalidPayments.data();
                                $scope.UploadSumarry.SuspenseCount = $scope.dgGridInvalidPayments.data().length;


                                var sbu = $scope.bulkExcel.Sbu;
                                var payMethod = $scope.bulkExcel.PaymentMethod;
                                var payType = $scope.bulkExcel.PaymentType;
                                $scope.UploadSumarry.SuspenseAmt = 0;
                                //var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                                
                                angular.forEach(s, function (res) {
                                    if (gridId == 1) {
                                        $scope.UploadSumarry.TotalValiedAmt1 = (Number($scope.UploadSumarry.TotalValiedAmt1) + Number(res.Amount)).toFixed(2);
                                    } else {
                                        $scope.UploadSumarry.SuspenseAmt = (Number($scope.UploadSumarry.SuspenseAmt) + Number(res.Amount)).toFixed(2);
                                        //$scope.UploadSumarry.TotalValiedAmt1 = (Number($scope.UploadSumarry.TotalValiedAmt1) + Number(res.Amount)).toFixed(2);
                                    }
                                //angular.forEach($scope.ToSuspenseData, function (res) {
                                    res.SBU = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Description: sbu })[0].Id : "",
                                    res.SBUDesc = sbu;
                                    res.IsSuspend = true;
                                    res.bulkExcelDisabled = true;
                                    //res.Remarks = res.Remarks + " / " + res.ConnectionReference;
                                    //res.ConnectionReference = $scope.suspenseAccId;//response.Result.SuspenseAcc;
                                    //$scope.UploadSumarry.SuspenseAmt = (Number($scope.UploadSumarry.SuspenseAmt) + Number(res.Amount)).toFixed(2);

                                    res.IsValiedAccount=true;
                                    res.IsSelected=true;
                                    res.ConnectionReferenceGridDisabled=true;
                                    res.ContractNumberGridDisabled= true;
                                    res.AmountGridDisabled= true;
                                    res.ReferenceNumberGridDisabled= true;
                                    res.RemarksGridDisabled = true;
                                //});
                                


                                });
                                $scope.SubmitToBulkPaymentButtonDisabled = false;
                                $scope.ChangeToSuspenseBtnDisabled = true;
                        }

                        if ($scope.inValiedDataGrid.length > 0) {
                            //var sus = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: $scope.SelectedPaymentSource })[0].Id : "";

                            var sucObj = $filter('filter')(defaultDataCookieObj.BillingSusAcc,
                            {
                                Sbu: $scope.SbuId,
                                PaySource: $scope.SelectedPaymentSource,  //Needed payment sourse
                                PayType: $scope.SelectedPaymentType
                            });

                            if (sucObj.length == 0) {
                                if ($scope.IsBackOfficeUser == true) {
                                    toaster.error({ type: 'error', title: 'Error', body: 'Suspense Account not found! Contact administrator.', showCloseButton: true });
                                    return;
                                } else {
                                    toaster.error({ type: 'error', title: 'Error', body: 'Invalid data exists in uploaded document!', showCloseButton: true });
                                }
                                
                            } else {
                                $scope.suspenseAccId = sucObj[0].AccountNo;
                            }

                        }

                        if (gridId == 1) {
                            $scope.dgGridAllPayments.data([]);
                            $scope.dgGridAllPayments.data($scope.valiedDataGrid);
                            $scope.dgGridInvalidPayments.data($scope.inValiedDataGrid);

                            $scope.UploadSumarry.SuspenseCount = $scope.dgGridInvalidPayments.data().length;

                            $scope.SubmitToBulkPaymentButtonDisabled = true;
                            $scope.ChangeToSuspenseBtnDisabled = true;
                            $scope.VerifyButtonDisabled = true;

                            if ($scope.dgGridInvalidPayments.data().length > 0) {
                                $scope.ChangeToSuspenseBtnDisabled = false;
                                $scope.SubmitToBulkPaymentButtonDisabled = true;
                            } else {
                                $scope.ChangeToSuspenseBtnDisabled = true;
                                $scope.SubmitToBulkPaymentButtonDisabled = false;
                            }
                        } else {
                            
                        }
                        
                        toaster.success({ type: 'Success', title: 'Success', body: 'Excel data successfully verified!', showCloseButton: true });
                    } else {
                        $scope.VerifyButtonDisabled = false;
                        //$scope.alertMessage = new Message(MessageTypes.Empty);
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                    }

                    $scope.isSendRequest = false;

                }).error(function (response) {
                    if (response.Result.isNewAccessToken) {
                        $cookieStore.put("accessToken", response.Result.accessToken);
                    }
                    $scope.VerifyButtonDisabled = false;
                    //                    $scope.alertMessage = new Message(response.Code, response.Message);
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                    $scope.isSendRequest = false;
                    return;
                });
            }

            $scope.ExcelVerifycationSingle = function (row) {

                if ($scope.RequestStatusChange()) {
                    return;
                }


                var row = row.dataItem;
                if ((angular.isUndefined(row.ConnectionReference) || row.ConnectionReference == "") && (angular.isUndefined(row.ContractNumber) || row.ContractNumber == "")) {
                    $scope.isSendRequest = false;
                    return;
                }
                var objAccountList = [];
                objAccountList.push({ 'connRef': row.ConnectionReference, 'contractNo': row.ContractNumber });

                $scope.ItemCollection = [];

                var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                $scope.ProductCatId = defaultDataCookieObj.BillingProdCat.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingProdCat, { Description: $scope.bulkExcel.ProductCat })[0].Id : "";
                $scope.SbuId = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Description: $scope.bulkExcel.Sbu })[0].Id : "";
                //$scope.SelectedPaymentSource = defaultDataCookieObj.BillingPaymentMethods.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentMethods, { Description: $scope.bulkExcel.PaymentMethod })[0].Id : "";
                $scope.SelectedPaymentType = defaultDataCookieObj.BillingPaymentType.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentType, { Description: $scope.bulkExcel.PaymentType })[0].Id : "";

                //$scope.suspenseAccId = defaultDataCookieObj.BillingSusAcc.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSusAcc, { Sbu: $scope.SbuId, PayMethod: $scope.SelectedPaymentSource, PayType: $scope.SelectedPaymentType })[0].AccountNo : "";
                //var sus = defaultDataCookieObj.BillingPaymentSource.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingPaymentSource, { CcbsPaymentSource: $scope.SelectedPaymentSource })[0].Id : "";

                var sucObj = $filter('filter')(defaultDataCookieObj.BillingSusAcc,
                            {
                                Sbu: $scope.SbuId,
                                PaySource: $scope.SelectedPaymentSource,  //Needed payment sourse
                                PayType: $scope.SelectedPaymentType
                            });

                if (sucObj.length == 0) {
                    toaster.error({ type: 'error', title: 'Error', body: 'Suspense Account not found!', showCloseButton: true });
                    return;
                } else {
                    $scope.suspenseAccId = sucObj[0].AccountNo;
                }

                var obj = {
                    "custRef": "",
                    "OldCustRef": "",
                    "CustRefType": "",
                    "productCategory": $scope.ProductCatId,
                    "sbu": $scope.SbuId,
                    "billInvoiceNo": "",
                    "reqType": 1,
                    "accounts": objAccountList,
                    "accessToken": $cookieStore.get('accessToken')
                }

                //$scope.ItemCollection.push(obj);

                bulkExcelVerificationService.ExcelVerifycation(obj).success(function (response) {
                    if (response.Result.isNewAccessToken) {
                        $cookieStore.put("accessToken", response.Result.accessToken);
                    }
                    if (response.Code == MessageTypes.Success) {
                        $scope.gridShowValue = true;

                        $scope.valiedDataGrid = $scope.dgGridAllPayments.data();
                        $scope.inValiedDataGrid = [];

                        $scope.TotalValiedAmt = 0;
                        angular.forEach($scope.dgGridInvalidPayments.data(), function (gridObj) {
                            var isValidated = false;
                            angular.forEach(response.Result.profiles, function (resHeader) {
                                angular.forEach(resHeader.accounts, function (res) {
                                    if (gridObj.ConnectionReference == res.connRef || gridObj.ContractNumber == res.contractNo) {
                                        var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));

                                        var valiedObj = {
                                            'RowId': $scope.RowsId,
                                            'PrePost': res.accountType,
                                            'Hybrid': res.hybridFlag == 1 ? "Y" : "N",
                                            'ConnectionReference': res.connRef,
                                            'ContractNumber': res.contractNo,
                                            'CustomerName': resHeader.custName,
                                            'CustomerIDType': resHeader.custRefType,
                                            'DisconnectedCode': res.disconReasonCode,
                                            'SwitchStatus': res.conStatus,
                                            'DisconnectedReason': res.disconReason,
                                            'BillingCycle': res.billCycle,
                                            'PRCode': res.prCode,
                                            'PREmail': res.prEmail,
                                            'ContractEmail': res.contractEmail,
                                            'CustomerIDNumber': resHeader.custRef,
                                            'OldNIC': resHeader.oldCustRef,
                                            'AccountNo': res.accountNo,
                                            'SBU': res.Sbu,
                                            'ProductType': res.productType,
                                            'ProductTypeDesc': res.productType == ProductTypes.Other ? 'Other' : res.productType == ProductTypes.Wifi ? 'Wifi' : res.productType == ProductTypes.NFC ? 'NFC' : res.productType == ProductTypes.CDMA ? 'CDMA' : res.productType == ProductTypes.LTE ? 'LTE' : 'VOLTE',
                                            'ContactNo': res.ContactNo,
                                            'PrePostDesc': res.accountType == 1 ? "Pre" : "Post",
                                            'SBUDesc': defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Id: res.Sbu })[0].Description : "",
                                            'IsSelected': true,
                                            'IsValiedAccount': true,
                                            'Amount': gridObj.Amount,
                                            'SwitchStatusDesc': res.conStatus == SwitchStatus.Connected ? 'Connected' : res.conStatus == SwitchStatus.Disconnected ? 'Disconnected' : 'Suspense',
                                            'PaymentMethod': $scope.bulkExcel.PaymentMethod,
                                            'ReferenceNumber': gridObj.ReferenceNumber,
                                            'ConnectionReferenceGridDisabled': true,
                                            'ContractNumberGridDisabled': true,
                                            'AmountGridDisabled': true,
                                            'ReferenceNumberGridDisabled': true,
                                            'RemarksGridDisabled': true,
                                        }

                                        //$scope.valiedDataGrid.push(valiedObj);
                                        $scope.dgGridAllPayments.data().push(valiedObj);
                                        isValidated = true;
                                        $scope.UploadSumarry.TotalValiedAmt1 = $scope.UploadSumarry.TotalValiedAmt1 + gridObj.Amount;
                                        $scope.RowsId = $scope.RowsId + 1;
                                    }
                                });

                            });
                            if (!isValidated) {
                                $scope.inValiedDataGrid.push(gridObj);
                                $scope.UploadSumarry.SuspenseAmt += gridObj.Amount;

                            }
                        });
                        if ($scope.inValiedDataGrid.length > 0) {
                            $scope.SubmitToBulkPaymentButtonDisabled = true;
                            $scope.ChangeToSuspenseBtnDisabled = false;
                            $scope.dgGridInvalidPayments.data($scope.inValiedDataGrid);
                        } else {
                            $scope.dgGridInvalidPayments.data([]);
                            $scope.SubmitToBulkPaymentButtonDisabled = false;
                            $scope.gridShowValue = false;
                            $scope.ChangeToSuspenseBtnDisabled = true;
                        }
                        
                        //$scope.dgGridAllPayments.data($scope.valiedDataGrid);
                        $scope.UploadSumarry.SuspenseCount = $scope.dgGridInvalidPayments.data().length;

                        toaster.success({ type: 'Success', title: 'Success', body: 'Excel data successfully verified!', showCloseButton: true });
                    } else {
                        $scope.SubmitToBulkPaymentButtonDisabled = true;
                        //$scope.alertMessage = new Message(MessageTypes.Empty);
                        toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                    }
                    $scope.isSendRequest = false;
                }).error(function (response) {
                    if (response.Result.isNewAccessToken) {
                        $cookieStore.put("accessToken", response.Result.accessToken);
                    }
                    $scope.SubmitToBulkPaymentButtonDisabled = true;
                    toaster.error({ type: 'error', title: 'Error', body: result.data.Message, showCloseButton: true });
                    $scope.isSendRequest = false;
                    return;
                });

            }

            $scope.ChangeToSuspense = function () {
                //try {
                debugger;
                //    if ($scope.RequestStatusChange()) {
                //        return;
                //    }

                //    $scope.ToSuspenseData = $scope.dgGridInvalidPayments.data();
                //    $scope.UploadSumarry.SuspenseCount = $scope.dgGridInvalidPayments.data().length;

                //    var sbu = $scope.bulkExcel.Sbu;
                //    var payMethod = $scope.bulkExcel.PaymentMethod;
                //    var payType = $scope.bulkExcel.PaymentType;
                //    var defaultDataCookieObj = JSON.parse(localStorage.getItem("BulkPaymentDefaultData"));
                //    angular.forEach($scope.ToSuspenseData, function (res) {
                //        res.SBU = defaultDataCookieObj.BillingSbu.length > 0 ? $filter('filter')(defaultDataCookieObj.BillingSbu, { Description: sbu })[0].Id : "",
                //        res.SBUDesc = sbu;
                //        res.IsSuspend = true;
                //        res.bulkExcelDisabled = true;
                //        res.Remarks = res.Remarks + " / " + res.ConnectionReference;
                //        res.ConnectionReference = $scope.suspenseAccId;//response.Result.SuspenseAcc;
                //        //$scope.UploadSumarry.SuspenseAmt = (Number($scope.UploadSumarry.SuspenseAmt) + Number(res.Amount)).toFixed(2);

                //        res.IsValiedAccount=true;
                //        res.IsSelected=true;
                //        res.ConnectionReferenceGridDisabled=true;
                //        res.ContractNumberGridDisabled= true;
                //        res.AmountGridDisabled= true;
                //        res.ReferenceNumberGridDisabled= true;
                //        res.RemarksGridDisabled = true;
                //    });
                //    $scope.SubmitToBulkPaymentButtonDisabled = false;
                //    $scope.ChangeToSuspenseBtnDisabled = true;
                //    $scope.isSendRequest = false;

                    $scope.ExcelVerifycationBulk(2);
                //} catch (e) {
                //    $scope.SubmitToBulkPaymentButtonDisabled = true;
                //    $scope.ChangeToSuspenseBtnDisabled = false;
                //    $scope.isSendRequest = false;
                //}

            }

            $scope.changeAddPaymentPageState = function (status) {
                $scope.UploadSumarry.NoOfTotalRec = 0;
                $scope.UploadSumarry.TotalValiedAmt1 = Number(0).toFixed(2);
                $scope.UploadSumarry.SuspenseCount = 0;
                $scope.UploadSumarry.SuspenseAmt = Number(0).toFixed(2);
            }


            $scope.SubmitToBulkPayment = function () {
                if ($scope.RequestStatusChange()) {
                    return;
                }
                var data = $scope.dgGridAllPayments.data();
                var suspenseData = $scope.dgGridInvalidPayments.data();
                var fun = $scope.callback();
                                
                var isSuspendNotExist = true;
                angular.forEach(suspenseData, function (res) {
                    if (!res.IsSuspend) {
                        isSuspendNotExist = false;
                    }
                    else {
                        res.PaymentMethod = "Suspense";
                        res.SwitchStatusDesc = 'Suspense',
                        data.push(res)
                    }
                });

                angular.forEach(suspenseData, function (res) {
                    
                    res.RowId = $scope.RowsId;
                    $scope.RowsId = $scope.RowsId + 1;
                });

                if (isSuspendNotExist) {
                    $scope.isSendRequest = false;
                    fun($scope.bulkExcel.AccountType, data);
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: "Please transfer invalied data to suspense account!", showCloseButton: true });
                    $scope.isSendRequest = false;
                    return;
                }
                
            }


        }]
    }

}]);

