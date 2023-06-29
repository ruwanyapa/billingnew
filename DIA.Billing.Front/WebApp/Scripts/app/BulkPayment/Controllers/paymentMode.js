var PaymentModeOptions = function () {
    this.PaymentMode = '';
    this.MobileNo = '';
    this.Amount = 0;
    this.Callback = null;
    this.PaymentDetailsRefCollection = null;
    this.CustomerRef = "";
    this.Params = null;
    this.ItemSbu = null;
};

angular.module("DialogBilling").directive("paymentMode", ['PaymentModeService', "toaster", "$filter", function (PaymentModeService, toaster, $filter) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            options: "="
        },
        template: '<div class="well well-sm" ng-include="paymentModeTemplateUrl"></div>',
        controller: ["$scope", "$attrs", "PaymentModeService", function ($scope, $attrs, PaymentModeService) {

            var options = $attrs.options,
                baseUrl = "Views/Common/PaymentMode/";

            $scope.$watch('options', function (value) {
                if (!value) { return; }

                _initTemplate(value.PaymentMode, value.PaymentDetailsRefCollection);
            });
            //Create a datagrid object
            $scope.GfDgGrid = new DataGrid();
            //Initialize
            var Initializer = {};
            $scope.Initializer = Initializer;

            var firstRw = new KeyValuePair();
            firstRw.Key = '0'; firstRw.Value = "Select";

            //Default values for anymode
            var Defaults = {
                Date: '',
                User: ''
            };
            var saveBtn = true;
            //Default validator object
            var ValidatorObj = PaymentModeService.getValidator();

            $scope.ErrorTypes = ValidatorObj.ErrorTypes;
            $scope.hasError = ValidatorObj.hasError;
            $scope.showErrors = ValidatorObj.showErrors;

            //Finder Parameters
            $scope.FinderParams = null;

            //CreditNexusCard
            var CreditNexusCard = {
                CcCardType: 0,
                CcCardBankCode: 0,

                CcCardNo1: '',
                CcCardNo2: '1234',
                CcCardNo3: '1234',
                CcCardNo4: '',
                CcApprovalCode: '',
                ReferenceNo: '',
                PaymentMode: '',
                CustomerRef: '',
                PaymentModeSubCat: 1,
                Amount: 0
            };
            $scope.CreditNexusCard = CreditNexusCard;

            var _initCreditNexusCard = function () {
                CreditNexusCard.CcCardType = 0;
                CreditNexusCard.CcCardBankCode = 0;

                CreditNexusCard.CcCardNo1 = '';
                CreditNexusCard.CcCardNo2 = '1234';
                CreditNexusCard.CcCardNo3 = '1234';
                CreditNexusCard.CcCardNo4 = '';
                CreditNexusCard.CcApprovalCode = '';
                CreditNexusCard.ReferenceNo = '';
            };

            //EzCash
            var EzCash = {

                VerifyEzCashRedeem: false,

                AccountType: '',

                EzcAccountCode: '',
                NfcAccountCode: '',

                EzcVerified: false,
                NfcVerified: false,
                PaymentModeSubCat: '',
                Request: {
                    DateTime: null,
                    EzcReference: '',
                    Status: '',
                    Remarks: '',

                    Approval: {
                        EzcApproveCode: '',
                        DateTime: null
                    }
                }
            }; $scope.EzCash = EzCash;

            var _initEzCash = function () {
                EzCash.AccountType = '';
                EzCash.VerifyEzCashRedeem = false;
                EzCash.EzcAccountCode = '';
                EzCash.NfcAccountCode = '';

                EzCash.EzcVerified = false;
                EzCash.NfcVerified = false;

                EzCash.Request.DateTime = null;
                EzCash.Request.EzcReference = '';
                EzCash.Request.Status = '';
                EzCash.Request.Remarks = '';

                EzCash.Request.Approval.EzcApproveCode = '';
                EzCash.Request.Approval.DateTime = null;
            };

            //Cheque
            var Cheque = {
                ChForcefulRealization: false,
                ChNo1: '',
                ChNo2: '',
                ChNo3: '',
                ChDate: null,
                ChBank: '',
                ChBranch: '',
                ChIsOtherBank: false,
                ChIsOtherBranch: false,
                ChChequeNo: '',
                ChOtherBank: '',
                ChOtherBranch: '',
                ChRealizedStatus: 'Pending',
                ChRealizedDate: null,
                ChRemarks: '',
                ChUpdatedBy: '',
                ReferenceNo: '',
                PaymentModeSubCat: '',
                Amount: 0,
                ContactNo:'',
                Email:''
            }; $scope.Cheque = Cheque;

            //
            var _initCheque = function () {
                //Cheque.ChForcefulRealization = true;
                Cheque.ChNo1 = '';
                Cheque.ChNo2 = '';
                Cheque.ChNo3 = '';
                Cheque.ChDate = null;
                Cheque.ChBank = '';
                Cheque.ChBranch = '';
                Cheque.ChIsOtherBank = false;
                Cheque.ChIsOtherBranch = false;
                Cheque.ChChequeNo = '';
                Cheque.ChOtherBank = '';
                Cheque.ChOtherBranch = '';
                Cheque.ChRealizedStatus = 'Pending';
                Cheque.ChRealizedDate = null;
                Cheque.ChRemarks = '';
                Cheque.ChUpdatedBy = '';
                Cheque.BankCode = "";
                Cheque.BranchCode = "";
                Cheque.ReferenceNo = '';
                ContactNo: '';
                Email: '';
                $scope.chequeForceRealization();
            };

            //StarPoints
            var ReferenceTypes = { Account: 1, Mobile: 2 };
            $scope.ReferenceTypes = ReferenceTypes;

            var VerificationTypes = { Mobile: 1, NIC: 2 };
            $scope.VerificationTypes = VerificationTypes;

            var StarPoints = {
                Verified: false,

                RefCode: '',
                ReferenceType: '',
                AvlBalance: '',
                RedemptionStatus: '',
                VerificationType: '',
                PaymentModeSubCat: '',
                Sbu: '',
                Mobile: {
                    RequestPin: false,
                    NfcCode: '',
                    NfcPin: ''
                },

                NIC: {
                    Question: '',
                    Answer: ''
                },

                Request: {
                    DateTime: null,
                    StpReference: '',
                    Status: '',
                    Remarks: '',

                    Approval: {
                        StpCode: '',
                        DateTime: null
                    }
                }
            }; $scope.StarPoints = StarPoints;

            var _initStarPoints = function () {
                StarPoints.Verified = false;

                StarPoints.RefCode = '';
                StarPoints.ReferenceType = ReferenceTypes.Mobile;

                StarPoints.AvlBalance = '';
                StarPoints.RedemptionStatus = '';
                StarPoints.VerificationType = ''; //VerificationTypes.Mobile;
                StarPoints.Sbu = '';

                StarPoints.Mobile.RequestPin = false;
                StarPoints.Mobile.NfcCode = '';
                StarPoints.Mobile.NfcPin = '';

                StarPoints.NIC.Question = '';
                StarPoints.NIC.Answer = '';

                StarPoints.Request.DateTime = null;
                StarPoints.Request.EzcReference = '';
                StarPoints.Request.Status = '';
                StarPoints.Request.Remarks = '';

                StarPoints.Request.Approval.EzcApproveCode = '';
                StarPoints.Request.Approval.DateTime = null;
            };

            var PreOrderVoucherSerials = function () {
                BatchId = '';
                SerialNo = '';
                Status = '';
                VoucherAmount = '';
                SoldDate = '';
                ExpireDate = '';
                RadeemDate = '';
                AddedDate = '';
                AddedPcName = '';
                AddedPcIp = '';
                AddedUserId = '';
                ReferenceNo = '';
                PaymentMode = '';
                CustRefCode = '';
            };

            //SMS Based Gift Voucher
            var SmsGiftVoucher = {
                SmsGvVoucherCode: '',
                SmsGvAmount: '',
                ReferenceNo: ''
            }; $scope.SmsGiftVoucher = SmsGiftVoucher;

            var _initSmsGiftVoucher = function () {
                SmsGiftVoucher.SmsGvVoucherCode = '';
                SmsGiftVoucher.SmsGvAmount = '';
                SmsGiftVoucher.ReferenceNo = '';
            };

            //Create a datagrid object
            $scope.SmDgGrid = new DataGrid();

            //Remove from datagird
            $scope.SmRemoveThis = function (e) {
                var row = $(e.currentTarget).closest("tr");
                var dataItem = $scope.SmDgGrid.dataItem(row);

                $scope.SmDgGrid.removeByGuid(dataItem.uid);
                $scope.SmDgGrid.refresh(); return false;
            };


            //<!-- Grid Configurations

            var SmConfig = {};

            SmConfig.pageable = {
                input: true,
                numeric: false
            };

            SmConfig.columns = [
                { field: "", title: "&nbsp;", template: '<button type="button"  data-ng-click=\"SmRemoveThis($event)\" class=\"btn btn-xs btn-danger\" tooltip title="Remove" data-placement="left"><i class="icon icon_trash"></i></button>', width: 40 },
                { field: "SmsGvVoucherCode", title: "Voucher Code" },
                { field: "SmsGvAmount", title: "Amount" },
                { field: "SmsGvStatus", title: "Status Text" },
                { field: "SmsGvApprovedDateTime", title: "Approved Date & Time" },
                { field: "SmsGvRemarks", title: "Remarks" },
                { field: "SmsGvApprovalCode", title: "Approval Code" }
            ];

            SmConfig.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "VoucherCode",
                        fields: {
                            'SmsGvVoucherCode': { editable: false, type: "string" },
                            'SmsGvAmount': { editable: false, type: "string" },
                            'SmsGvStatus': { editable: false, type: "string" },
                            'SmsGvApprovedDateTime': { editable: false, type: "string" },
                            'SmsGvRemarks': { editable: false, type: "string" },
                            'SmsGvApprovalCode': { editable: false, type: "string" },
                            'ReferenceNo': { editable: false, type: "string" }
                        }
                    }
                },
                pageSize: 8
            });

            $scope.SmDgGrid.options(SmConfig);
            //-->

            //Gift Voucher
            var GiftVoucher = {
                Code: '',
                Total: '',
                ReferenceNo: ''
            }; $scope.GiftVoucher = GiftVoucher;

            var _initGiftVoucher = function () {
                GiftVoucher.Code = '';
                GiftVoucher.Total = '';
                GiftVoucher.ReferenceNo = '';
            };



            //Remove from datagird
            $scope.GfRemoveThis = function (e) {

                console.log(e, "remove 11");
                var row = $(e.currentTarget).closest("tr");

                console.log(row, "row");

                var dataItem = $scope.GfDgGrid.dataItem(row);



                $scope.GfDgGrid.removeByGuid(dataItem.uid);
                $scope.GfDgGrid.refresh(); $scope.$apply(function () {
                    $scope.GfCalculateTotal();
                }); return false;
            };

            //Calculate total of datagird
            $scope.GfCalculateTotal = function () {
                var dclTemp = 0, dataItems = $scope.GfDgGrid.data();

                for (var i = 0; i < dataItems.length; i++) {
                    var dataItem = dataItems[i];
                    dclTemp += dataItem.GVValue;
                } GiftVoucher.Total = dclTemp;
            };

            //<!-- Grid Configurations

            var GfConfig = {};
            GfConfig.scrollable = true;
            GfConfig.pageable = {
                input: true,
                numeric: false
            };

            GfConfig.columns = [
                {
                    field: "", title: "&nbsp;", width: 40,
                    template: '<button type="button"  ng-disabled="dataItem.RemoveBtn" data-ng-click=\"GfRemoveThis($event)\" class=\"btn btn-xs btn-danger\" tooltip title="Remove" data-placement="right"><i class="icon icon_trash"></i></button>'
                },
                { field: "GVSerialNo", title: "Serial No", width: 100 },
                { field: "GVItemCode", title: "Item Code", width: 100 },
                { field: "GVItemText", title: "Item Description", width: 100 },
                { field: "GVExpireDate", title: "Expire Date", width: 100},
                { field: "GVSoldDate", title: "Sold Date", width: 100},
                { field: "GVValue", title: "Value", width: 70}
            ];

            GfConfig.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "SerialNo",
                        fields: {
                            'GVSerialNo': { editable: false, type: "string" },
                            'GVItemCode': { editable: false, type: "string" },
                            'GVItemText': { editable: false, type: "string" },
                            'GVExpireDate': { editable: false, type: "string" },
                            'GVSoldDate': { editable: false, type: "string" },
                            'ReferenceNo': { editable: false, type: "string" },
                            'GVValue': { editable: false, type: "string" }
                        }
                    }
                },
                pageSize: 8
            });

            $scope.GfDgGrid.options(GfConfig);
            //-->

            //Btr
            var Btr = {
                BtrRefCode: '',
                ReferenceNo: ''
            }; $scope.Btr = Btr;

            var _initBtr = function () {
                Btr.BtrRefCode = '';
                Btr.ReferenceNo = '';
            };

            //Ibuy
            var Ibuy = {
                IbuyRefCode: '',
                ReferenceNo: ''
            }; $scope.Ibuy = Ibuy;

            var _initIbuy = function () {
                Ibuy.IbuyRefCode = '';
                Ibuy.ReferenceNo = '';
            };  

            //Direct Debit
            var DDB = {
                DDBCode: '',
                ReferenceNo: ''
            }; $scope.DDB = DDB;

            var _initDdb = function () {
                DDB.ddbCode = '';
                DDB.ReferenceNo = '';
                DDB.DDBCode = '';
                $scope.disabled.btnSaveDdb = false;
            };

            //Direct Debit
            var MS2 = {
                MS2Code: '',
                ReferenceNo: ''
            };
            $scope.MS2 = MS2;

            var _initMS2 = function () {
                MS2.MS2Code = '';
                MS2.ReferenceNo = '';
                $scope.disabled.Mis2button = false;
            };


            //Misce
            var Miscellaneous = {
                MisPayModeCategory: false,
                MisRefCode: '',
                Remarks: '',
                ReferenceNo: ''
            }; $scope.Miscellaneous = Miscellaneous;

            var _initMiscellaneous = function () {
                Miscellaneous.MisPayModeCategory = false;
                Miscellaneous.MisRefCode = '';
                Miscellaneous.Remarks = '';
                Miscellaneous.ReferenceNo = '';
                $scope.disabled.Misbutton = false;
            };

            // Voucher
            var Voucher = {
                Code: '',
                Category: {
                    Code: '',
                    Text: ''
                },
                SubCategory: {
                    Code: '',
                    Text: ''
                },
                Amount: '',
                ExpiringOn: '',
                SalesAgent: {
                    Code: '',
                    Text: ''
                }
            }; $scope.Voucher = Voucher;

            var _initVoucher = function () {
                Voucher.Code = '';

                Voucher.Category.Code = '';
                Voucher.Category.Text = '';

                Voucher.SubCategory.Code = '';
                Voucher.SubCategory.Text = '';

                Voucher.Amount = '';
                Voucher.ExpiringOn = '';

                Voucher.SalesAgent.Code = '';
                Voucher.SalesAgent.Text = '';
            };
            //-->

            //-->POVD
            var POVD = {
                BatchId: '',
                PreOrderVoucherSerialNumber: '',
                Status: '',
                StatusId: '',
                Value: '',
                DealerName: '',
                ExpairyDate: '',
            }; $scope.POVD = POVD;

            //-->POVD
            var _POVD = function () {
                POVD.BatchId = '';
                POVD.PreOrderVoucherSerialNumber = '';
                POVD.Status = '';
                POVD.StatusId = '';
                POVD.Value = '';
                POVD.DealerName = '';
                POVD.ExpairyDate = '';
            };

            $scope.EzAccTypeChnage = function () {
                var AccType = EzCash.AccountType; _initEzCash();

                EzCash.NfcVerified = (AccType == 3) ? false : true;
                EzCash.EzcVerified = false; EzCash.AccountType = AccType;
            };

            //-> Gift Voucher Init function
            $scope.GfInit = function (arg) {
                $scope.GfDgGrid.Init(arg, true);
                $scope.GfDgGrid.data([]);
            };

            //-> set template for payment method
            var _initTemplate = function (paymentMode, paymentDetailsRefCollection) {
                $scope.payAlertMessage = new Message(MessageTypes.Empty);

                if (paymentMode == PaymentModesTypes.CreditCard) {
                    $scope.paymentModeTemplateUrl = baseUrl + "creditNexusCard.html"; _initCreditNexusCard();

                    Initializer.CardTypes = [];
                    Initializer.CardTypes.push(firstRw);

                    Initializer.Banks = [];
                    Initializer.Banks.push(firstRw);

                    PaymentModeService.initCreditNexusCard().then(function (response) {
                        if (response.data.Result) { } else {
                            //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                            // toaster.error({ type: 'error', title: 'Error', body: "Oops something went wrong !", showCloseButton: true });
                            toaster.success({ type: 'Success', title: 'Success', body: "PE - " + response.data.Message, showCloseButton: true });
                            return;
                        }

                        var Result = response.data.Result;

                        var temp = Initializer.CardTypes.concat(Result.CardTypes);
                        Initializer.CardTypes = temp;

                        temp = Initializer.Banks.concat(Result.Banks);
                        Initializer.Banks = temp;

                        if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                            if (!angular.isUndefined(paymentDetailsRefCollection[0].ReferenceNo)) {
                                $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.CreditCard);
                            }
                        } else {
                            _initCreditNexusCard();
                            $scope.disabled = {
                                btnSaveCc: false
                            }
                        }
                         
                    }, function (response) {
                        //$scope.payAlertMessage = new Message(response.data.Code, response.data.Message);
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    });
                }
                else if (paymentMode == PaymentModesTypes.Cheque) {
                    $scope.paymentModeTemplateUrl = baseUrl + "cheque.html";

                    setTimeout(function () {
                       
                        $('#ChequeNo3').focus();

                    }, 10);

                  //  var myEl2 = angular.element(document.querySelector('#ChequeNo3'));
                 //   myEl2.focus();

                    PaymentModeService.initCheque().then(function (response) {
                        if (!response.data) {
                            //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                            return;
                        }

                        if (response.data.Code == MessageTypes.Success) {
                            var Result = response.data.Result;

                            Defaults = Result.Defaults;
                            Cheque.ChUpdatedBy = Defaults.User;
                            if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                                if (!angular.isUndefined(paymentDetailsRefCollection[0].ReferenceNo)) {
                                    $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.Cheque);
                                }
                            } else {
                                _initCheque();
                                $scope.disabled = {
                                    btnSaveCheck: false
                                }
                            }
                        }
                        else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                    }, function (response) {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    });
                }
                else if (paymentMode == PaymentModesTypes.eZCash) {
                    $scope.paymentModeTemplateUrl = baseUrl + "eZCash.html"; _initEzCash();

                    EzCash.AccountType = 1; $scope.EzAccTypeChnage();
                    if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                        if (!angular.isUndefined(paymentDetailsRefCollection[0].ReferenceNo)) {
                            $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.eZCash);
                        }
                    } else {
                        _initEzCash();
                    }
                }
                else if (paymentMode == PaymentModesTypes.StarPoints) {
                    $scope.paymentModeTemplateUrl = baseUrl + "StarPoints.html"; _initStarPoints();
                    setTimeout(function () {

                        $('#stpoRefCode').focus();

                    }, 10);

                    if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                        $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.StarPoints);

                    }
                }
                else if (paymentMode == PaymentModesTypes.SMSVoucher) {
                    //need seperate method to smsgv and gv
                    $scope.paymentModeTemplateUrl = baseUrl + "SMSBasedGiftVoucher.html";
                    //_initSmsGiftVoucher();

                    if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                        $scope.SmDgGrid.data([]);
                        for (var j = 0; j < paymentDetailsRefCollection.length; j++) {
                            if (paymentDetailsRefCollection[j] !== null && paymentDetailsRefCollection.length > 0) {
                                var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[j].ReferenceNo, PaymentModesTypes.SMSVoucher);

                            }
                        }
                    }
                }
                else if (paymentMode == PaymentModesTypes.GiftVoucher) {
                    $scope.paymentModeTemplateUrl = baseUrl + "GiftVoucherRedemption.html";
                    // var s = $scope.GfDgGrid.data([]);

                    console.log("gift Voucher init");
                    //_initGiftVoucher();
                    if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                        for (var i = 0; i < paymentDetailsRefCollection.length; i++) {
                            if (paymentDetailsRefCollection[i] !== null && paymentDetailsRefCollection.length > 0) {
                                var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[i].ReferenceNo, PaymentModesTypes.GiftVoucher);
                            }
                        }
                    }

                    console.log($scope.GfDgGrid.data, "scope.GfDgGrid");
                    //$scope.GfDgGrid.data([]);
                }
                else if (paymentMode == PaymentModesTypes.BTR) {
                    $scope.paymentModeTemplateUrl = baseUrl + "btr.html";
                    //_initBtr();

                    if (paymentDetailsRefCollection != null && paymentDetailsRefCollection.length > 0) {

                        var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.BTR);

                    }
                } else if (paymentMode == PaymentModesTypes.PreVoucher) {
                    $scope.paymentModeTemplateUrl = baseUrl + "preOderVoucher.html"; _POVD();
                    //_initIbuy();

                    if (paymentDetailsRefCollection != null && paymentDetailsRefCollection.length > 0) {

                        var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.IBUY);

                    }
                }
                else if (paymentMode == PaymentModesTypes.IBUY) {
                    $scope.paymentModeTemplateUrl = baseUrl + "iBuy.html";
                    //_initIbuy();

                    if (paymentDetailsRefCollection != null && paymentDetailsRefCollection.length > 0) {

                        var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.IBUY);

                    }
                }
                else if (paymentMode == PaymentModesTypes.Miscellaneous) {
                    $scope.paymentModeTemplateUrl = baseUrl + "miscellaneous.html";
                    //_initMiscellaneous();

                    Initializer.PayModeCategories = [];
                    Initializer.PayModeCategories.push(firstRw);

                    PaymentModeService.initMiscellaneous().then(function (response) {
                        if (response.data.Result) { } else {
                            //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !"); 
                            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                            return;
                        }

                        var Result = response.data.Result;

                        Initializer.PayModeCategories = Initializer.PayModeCategories.concat(Result.PayModeCategories);


                        if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                            $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.Miscellaneous);

                        }


                    }, function (response) {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    });
                }
                else if (paymentMode == PaymentModesTypes.Voucher) {
                    $scope.paymentModeTemplateUrl = baseUrl + "voucher.html"; _initVoucher();

                    //$scope.param = [];
                    //$scope.param.push($scope.options.Params.InvoiceNo);
                }
                    ///////////////////// ddebit, misc 2 payment modes
                else if (paymentMode == PaymentModesTypes.DDB) {
                    $scope.paymentModeTemplateUrl = baseUrl + "directDebit.html";// _initDdb();
                    setTimeout(function () {

                        $('#ddbRefCode').focus();

                    }, 10);

                    if (paymentDetailsRefCollection !== null && paymentDetailsRefCollection.length > 0) {
                        $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.DDB);

                    }
                    // console.log("ddb");
                }
                else if (paymentMode == PaymentModesTypes.MS2) {
                    //need seperate method to smsgv and gv
                    $scope.paymentModeTemplateUrl = baseUrl + "miscellaneous2.html";
                    //_initSmsGiftVoucher();
                    setTimeout(function () {

                        $('#ms2RefCode').focus();

                    }, 10);

                    if (paymentDetailsRefCollection != null && paymentDetailsRefCollection.length > 0) {

                        var paymentDetailsRef = $scope.GetPaymentReferenceDetailsByReferenceId(paymentDetailsRefCollection[0].ReferenceNo, PaymentModesTypes.MS2);

                    }
                }
                else if (paymentMode == PaymentModesTypes.Genie) {
                    $scope.paymentModeTemplateUrl = baseUrl + "genie.html";
                    $scope.genie = {};
                }
                else {
                    $scope.paymentModeTemplateUrl = "";
                    _initStarPoints();
                    _initEzCash(); _initCheque();
                    _initCreditNexusCard();
                    _initSmsGiftVoucher();
                    _initGiftVoucher();
                    _initBtr();
                    _initIbuy();
                    _initMiscellaneous();
                    _initVoucher();
                    _POVD();
                    _initDdb();
                    _initMS2();
                }

                //->
                if ($scope.payAlertMessage) { $scope.payAlertMessage = new Message(MessageTypes.Empty); }
            };

            // Genie send pay request
            $scope.sendPayRequest = function () {
                if ($scope.genie.genieRegisteredNumber == undefined || $scope.genie.genieRegisteredNumber == null) {
                    toaster.error({ type: 'error', title: 'Error', body: "Genie Registered Number not found !", showCloseButton: true });
                    return;
                }
                var sendPayRequestRequest = {
                    genieRegisteredNumber: $scope.genie.genieRegisteredNumber,
                    Amount: $scope.options.Amount
                };

                PaymentModeService.sendPayRequest(sendPayRequestRequest).success(function (response) {
                    if (response.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                        return;
                    } else {
                        toaster.success({ type: 'success', title: 'Success', body: response.Message, showCloseButton: true });
                        $scope.genie.genieTransactionId = response.Result.genieTransactionId;
                        $scope.genie.SourceReference = response.Result.SourceReference;
                    }
                }).error(function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                    return;
                });
            }

            //Direct Genie
            var Genie = {
                ReferenceNo: ''
            };
            $scope.Genie = Genie;

            var _initGenie = function () {
                Genie.ReferenceNo = '';
            };
             
            // Genie Verify Status
            $scope.genieVerifyStatus = function () {
                if ($scope.genie.genieTransactionId == undefined || $scope.genie.genieTransactionId == null) {
                    toaster.error({ type: 'error', title: 'Error', body: "Genie Transaction Id not found !", showCloseButton: true });
                    return;
                }
                var genieVerifyStatusRequest = {
                    genieTransactionId: $scope.genie.genieTransactionId, 
                    sourceReference: $scope.genie.SourceReference
                };

                PaymentModeService.genieVerifyStatus(genieVerifyStatusRequest).success(function (response) {
                    if (response.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                        return;
                    } else {
                        toaster.success({ type: 'success', title: 'Success', body: response.Message, showCloseButton: true });
                        $scope.genie.paymentSource = response.Result.paymentSource;
                        $scope.genie.cardType = response.Result.cardType;

                        var objReturn = jQuery.extend(true, {}, Genie);
                        objReturn.ReferenceNo = $scope.genie.SourceReference;
                        finish(objReturn);
                    }
                }).error(function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                    return;
                });
            }

            $scope.sourceReferenceFinder = {
                title: "Source Reference",
                info: {
                    appId: "ZBC-DCPOS",
                    uiId: "PMOD-GENIE-ID",
                    mapId: "PMOD-GENIE-ID-MAP",
                    modalId: "sourceReferenceFinder",
                    onLoad: true
                },
                params: [],
                callback: function (data) {
                    $scope.genie.SourceReference = data.selectedItem.SourceReference;
                    $scope.genie.genieTransactionId = data.selectedItem.GenieTransactionId;
                    $scope.genie.genieRegisteredNumber = data.selectedItem.GenieRegisteredNumber;
                },
                open: function () {
                    window._focuse(this.info.modalId);
                    objTemp = [];
                    objTemp.push(JSON.parse(localStorage.getItem('profile')).userId);
                    objTemp.push(JSON.parse(localStorage.getItem('profile')).outletCode);
                    this.params = objTemp;

                    this.info.onLoad = true;
                    $("#" + this.info.modalId).modal('show');
                }
            };

            $scope.GetPaymentReferenceDetailsByReferenceId = function (ezcReference, paymentMode) {
                PaymentModeService.GetPaymentReferenceDetailsByReferenceId(ezcReference, paymentMode).then(function (response) {
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Payment reference data not found !");
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        saveBtn = true;
                        return;
                    }
                    //$scope.disabled.btnSaveCc == false;
                    //$scope.disabled.btnSaveCheck == false;
                    //EzCash.EzcVerified == true;
                    //StarPoints.Mobile.NfcPin == true;
                    //$scope.disabled.smsGVbutton == false;
                    //$scope.disabled.GVbutton == false;
                    //$scope.disabled.BtrSave == false;
                    //$scope.disabled.Ibuybutton == false;
                    //$scope.disabled.Misbutton == false;
                    //$scope.disabled.VoucherSave == false;


                    if (response.data.Code == MessageTypes.Success) {


                        if (response.data.Result !== null) {
                            if (paymentMode == PaymentModesTypes.CreditCard) {
                                CreditNexusCard.CcCardType = response.data.Result.paymentDetailsRefCollection[0].CcCardType;
                                CreditNexusCard.CcCardBankCode = response.data.Result.paymentDetailsRefCollection[0].CcCardBankCode;
                                CreditNexusCard.CcCardNo1 = response.data.Result.paymentDetailsRefCollection[0].CcCardNo1;
                                //CreditNexusCard.CcCardNo2 = response.data.Result.paymentDetailsRefCollection[0].CcCardNo2;
                                //CreditNexusCard.CcCardNo3 = response.data.Result.paymentDetailsRefCollection[0].CcCardNo3;
                                CreditNexusCard.CcCardNo4 = response.data.Result.paymentDetailsRefCollection[0].CcCardNo4;
                                CreditNexusCard.CcApprovalCode = response.data.Result.paymentDetailsRefCollection[0].CcApprovalCode;
                                $scope.disabled = {
                                    btnSaveCc: true
                                }
                            }
                            else if (paymentMode == PaymentModesTypes.Cheque) {
                                Cheque.ChNo1 = response.data.Result.paymentDetailsRefCollection[0].ChNo1;
                                Cheque.ChNo2 = response.data.Result.paymentDetailsRefCollection[0].ChNo2;
                                Cheque.ChNo3 = response.data.Result.paymentDetailsRefCollection[0].ChNo3;
                                Cheque.ChForcefulRealization = response.data.Result.paymentDetailsRefCollection[0].ChForcefulRealization;
                                Cheque.ChDate = response.data.Result.paymentDetailsRefCollection[0].ChDate.split('T')[0];
                                Cheque.ChBank = response.data.Result.paymentDetailsRefCollection[0].ChBank;
                                Cheque.ChIsOtherBank = response.data.Result.paymentDetailsRefCollection[0].ChIsOtherBank;
                                Cheque.ChOtherBank = response.data.Result.paymentDetailsRefCollection[0].ChOtherBank;
                                Cheque.ChBranch = response.data.Result.paymentDetailsRefCollection[0].ChBranch;
                                Cheque.ChIsOtherBranch = response.data.Result.paymentDetailsRefCollection[0].ChIsOtherBranch;
                                Cheque.ChOtherBranch = response.data.Result.paymentDetailsRefCollection[0].ChOtherBranch;
                                Cheque.ChRealizedStatus = response.data.Result.paymentDetailsRefCollection[0].ChRealizedStatus;

                                $scope.currentDate = new Date();
                                Cheque.ChRealizedDate = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss a');

                                //Cheque.ChRealizedDate = //response.data.Result.paymentDetailsRefCollection[0].ChRealizedDate.split('T')[0];
                                Cheque.ChRemarks = response.data.Result.paymentDetailsRefCollection[0].ChRemarks;
                                Cheque.ContactNo = response.data.Result.paymentDetailsRefCollection[0].ContactNo;
                                Cheque.Email = response.data.Result.paymentDetailsRefCollection[0].Email;
                                Cheque.ChUpdatedBy = response.data.Result.paymentDetailsRefCollection[0].ChUpdatedBy;
                                $scope.disabled = {
                                    btnSaveCheck: true
                                }
                            }
                            else if (paymentMode == PaymentModesTypes.eZCash) {
                                EzCash.Request.DateTime = response.data.Result.paymentDetailsRefCollection[0].ReqDateTime.split('T')[0];
                                EzCash.Request.EzcReference = response.data.Result.paymentDetailsRefCollection[0].EzcReference;
                                EzCash.Request.Status = response.data.Result.paymentDetailsRefCollection[0].EzStatus;
                                EzCash.Request.Remarks = response.data.Result.paymentDetailsRefCollection[0].EzRemarks;
                                EzCash.Request.Approval.EzcApproveCode = response.data.Result.paymentDetailsRefCollection[0].EzcApproveCode;
                                EzCash.Request.Approval.DateTime = response.data.Result.paymentDetailsRefCollection[0].DateTime.split('T')[0];
                                EzCash.EzcVerified = false;

                            }
                            else if (paymentMode == PaymentModesTypes.StarPoints) {
                                StarPoints.Request.DateTime = response.data.Result.paymentDetailsRefCollection[0].StRequestDate.split('T')[0];
                                StarPoints.Request.StpReference = response.data.Result.paymentDetailsRefCollection[0].ReferenceNo;
                                StarPoints.Request.Status = response.data.Result.paymentDetailsRefCollection[0].StStatus;
                                StarPoints.Request.Approval.StpCode = response.data.Result.paymentDetailsRefCollection[0].StReferenceCode;
                                StarPoints.Request.Approval.DateTime = response.data.Result.paymentDetailsRefCollection[0].StApprovedDate.split('T')[0];
                                StarPoints.Request.Remarks = response.data.Result.paymentDetailsRefCollection[0].StRemarks;
                                StarPoints.Mobile.NfcPin = false;
                            }
                            else if (paymentMode == PaymentModesTypes.SMSVoucher) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    var dtRow = {
                                        SmsGvVoucherCode: response.data.Result.paymentDetailsRefCollection[0].SmsGvVoucherCode,
                                        SmsGvAmount: response.data.Result.paymentDetailsRefCollection[0].SmsGvAmount,
                                        SmsGvApprovalCode: response.data.Result.paymentDetailsRefCollection[0].SmsGvApprovalCode,
                                        SmsGvApprovedDateTime: response.data.Result.paymentDetailsRefCollection[0].SmsGvApprovedDateTime,
                                        SmsGvRemarks: response.data.Result.paymentDetailsRefCollection[0].SmsGvRemarks,
                                        SmsGvStatus: response.data.Result.paymentDetailsRefCollection[0].SmsGvStatus,
                                        ReferenceNo: response.data.Result.paymentDetailsRefCollection[0].ReferenceNo
                                    };//);

                                    $scope.disabled = {
                                        smsGVbutton: true
                                    };
                                    var s = $scope.SmDgGrid.data();
                                    if (s.length > 0) {
                                        //s = [];
                                        s.push(dtRow);
                                    } else {
                                        s = [];
                                        s.push(dtRow);
                                    }
                                    $scope.SmDgGrid.data(s);
                                }
                            }
                            else if (paymentMode == PaymentModesTypes.GiftVoucher) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    var dtRow = {
                                        GVSerialNo: response.data.Result.paymentDetailsRefCollection[0].GVSerialNo,
                                        GVItemCode: response.data.Result.paymentDetailsRefCollection[0].GVItemCode,
                                        GVItemText: response.data.Result.paymentDetailsRefCollection[0].GVItemText,
                                        GVExpireDate: response.data.Result.paymentDetailsRefCollection[0].GVExpireDate,
                                        GVSoldDate: response.data.Result.paymentDetailsRefCollection[0].GVSoldDate,
                                        GVValue: response.data.Result.paymentDetailsRefCollection[0].GVValue,
                                        ReferenceNo: response.data.Result.paymentDetailsRefCollection[0].ReferenceNo
                                    };
                                    $scope.disabled = {
                                        GVbutton: true
                                    };
                                    var s = $scope.GfDgGrid.data();
                                    if (s.length > 0) {
                                        //s = [];
                                        s.push(dtRow);
                                    } else {
                                        s = [];
                                        s.push(dtRow);
                                    }
                                    $scope.GfDgGrid.data(s);
                                }

                            }
                            else if (paymentMode == PaymentModesTypes.BTR) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    Btr.BtrRefCode = response.data.Result.paymentDetailsRefCollection[0].BtrRefCode;

                                    $scope.disabled = {
                                        BtrSave: true
                                    }
                                }
                            }
                            else if (paymentMode == PaymentModesTypes.IBUY) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    Ibuy.IbuyRefCode = response.data.Result.paymentDetailsRefCollection[0].IbuyRefCode;
                                    $scope.disabled = {
                                        Ibuybutton: true
                                    }
                                }
                            }
                            else if (paymentMode == PaymentModesTypes.Miscellaneous) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    Miscellaneous.MisPayModeCategory = response.data.Result.paymentDetailsRefCollection[0].MisPayModeCategory;
                                    Miscellaneous.MisRefCode = response.data.Result.paymentDetailsRefCollection[0].MisRefCode;
                                    Miscellaneous.Remarks = response.data.Result.paymentDetailsRefCollection[0].Remarks;
                                    $scope.disabled = {
                                        Misbutton: true
                                    }
                                }
                            }

                            else if (paymentMode == PaymentModesTypes.Voucher) {
                                if (response.data.Result !== null && response.data.Result.paymentDetailsRefCollection.length > 0) {
                                    Voucher.VoucherCategory = response.data.Result.paymentDetailsRefCollection[0].VoucherCategory;
                                    Voucher.VoucherSubCategory = response.data.Result.paymentDetailsRefCollection[0].VoucherSubCategory;
                                    Voucher.VoucherCode = response.data.Result.paymentDetailsRefCollection[0].VoucherCode;
                                    Voucher.SalesAgent = response.data.Result.paymentDetailsRefCollection[0].SalesAgent;
                                    Voucher.VoucherAmount = response.data.Result.paymentDetailsRefCollection[0].VoucherAmount;
                                    Voucher.ExpiringOn = response.data.Result.paymentDetailsRefCollection[0].ExpiringOn;
                                    $scope.disabled = {
                                        VoucherSave: true
                                    }
                                }
                            }
                        }
                    } else {
                        saveBtn = true;
                    }
                });
            };
            //-> Credit card save function

            $scope.SaveCreditNexusCard = function (form) {

                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                if (form && form.$valid) { }
                else {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }

                if ($scope.CreditNexusCard.CcCardType == "0") {
                    toaster.error({ type: 'error', title: 'Error', body: "Please select card type!", showCloseButton: true });
                    saveBtn = true;
                    return;
                }
                if ($scope.CreditNexusCard.CcCardBankCode == "0") {
                    toaster.error({ type: 'error', title: 'Error', body: "Please select bank!", showCloseButton: true });
                    saveBtn = true;
                    return;
                }

                var isSuccess = $scope.ValidateLengthToSave();
                if (!isSuccess) {
                    toaster.error({ type: 'error', title: 'Error', body: "Card number invalied!", showCloseButton: true });
                    saveBtn = true;
                    return;
                } else {
                    $scope.payAlertMessage = new Message(MessageTypes.Empty);
                }

                //CreditNexusCard.CcCardType = CreditNexusCard.CardType;
                var objReturn = jQuery.extend(true, {}, CreditNexusCard);
                objReturn.PaymentModeSubCat = $scope.CreditNexusCard.CcCardBankCode;
                //_initCreditNexusCard();
                CreditNexusCard.CcCardType = $scope.CreditNexusCard.CcCardType;
                CreditNexusCard.CcCardBankCode = $scope.CreditNexusCard.CcCardBankCode;
                CreditNexusCard.CcCardNo1 = $scope.CreditNexusCard.CcCardNo1;
                CreditNexusCard.CcCardNo2 = "1234";//$scope.CreditNexusCard.CcCardNo2;
                CreditNexusCard.CcCardNo3 = "1234";//$scope.CreditNexusCard.CcCardNo3;
                CreditNexusCard.CcCardNo4 = $scope.CreditNexusCard.CcCardNo4;
                CreditNexusCard.CcApprovalCode = $scope.CreditNexusCard.CcApprovalCode;
                CreditNexusCard.CustRefCode = $scope.options.CustomerRef;
                CreditNexusCard.PaymentMode = $scope.options.PaymentMode;
                CreditNexusCard.PaymentModeSubCat = $scope.CreditNexusCard.CcCardType;
                CreditNexusCard.Amount = $scope.options.Amount;
                PaymentModeService.PostPamentModeReferences(CreditNexusCard, PaymentModesTypes.CreditCard).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        toaster.error({ type: 'error', title: 'Error', body: "Credit / Nexus card data error!", showCloseButton: true });
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Credit / Nexus card data error!");
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        toaster.success({ type: 'error', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        objReturn.ReferenceNo = response.data.Result;
                        $scope.disabled.btnSaveCc = true;
                        finish(objReturn);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "Credit / Nexus card data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };
            //
            //-> EZ Cash save function

            $scope.SaveEzCash = function () {

                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                $scope.payAlertMessage = "";
                //$scope.options.Amount = 60;           Only for diffrent account Discuss with daminda
                PaymentModeService.EzCashRedemption({
                    MobileNo: EzCash.EzcAccountCode,
                    EzAccountType: EzCash.AccountType,
                    EzAccountRef: EzCash.EzcAccountCode,
                    NfcAccountRef: EzCash.NfcAccountCode,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount,
                    InvoiceNo: ""//$scope.options.Params.InvoiceNo
                }).then(function (response) {
                    saveBtn = true;
                    console.log("0", response);
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Eazy Cash redemption error !");
                        toaster.error({ type: 'error', title: 'Error', body: "Eazy Cash redemption error !", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;
                        console.log("1", response);
                        //    $scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully redemption!");
                        EzCash.Request = Result.Request; EzCash.VerifyEzCashRedeem = true;

                        //  var objReturn = jQuery.extend(true, {}, EzCash); finish(objReturn);

                    }
                    else { console.log("2"); toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> EZ Cash redeemtion verify function

            $scope.VerifyReedemtion = function () {

                if (!saveBtn) {
                    return;
                }
                saveBtn = false;

                $scope.payAlertMessage = "";

                PaymentModeService.VerifyReedemtion({
                    EzcApproveCode: $scope.EzCash.Request.Approval.EzcApproveCode,
                    EzcReference: $scope.EzCash.Request.EzcReference
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        console.log(response.data);
                        EzCash.Request = response.data.Result.Request;
                        EzCash.Request.Approval = response.data.Result.Request.Approval; EzCash.VerifyEzCashRedeem = false;
                        if (response.data.Result.Request.Status == 'Success') {
                            var objReturn = jQuery.extend(true, {}, EzCash); finish(objReturn);
                        }

                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> EZ Cash verify function
            $scope.EzCashVerifyStatus = function () {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                $scope.payAlertMessage = "";
                PaymentModeService.EzCashVerifyStatus({
                    MobileNo: EzCash.EzcAccountCode,
                    EzcAccCode: EzCash.EzcAccountCode
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        EzCash.EzcVerified = Result.EzcVerified;
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> EZ Cash from NFC code function
            $scope.EzCashRetrieveAccRef = function () {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                PaymentModeService.EzCashRetrieveAccRef({
                    MobileNo: $scope.options.MobileNo,
                    NfcAccCode: EzCash.NfcAccountCode
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        EzCash.NfcVerified = Result.NfcVerified;
                        EzCash.EzcAccountCode = Result.EzcAccountCode;
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> Cheque init date pickers function
            $scope.chequeInitDatePickers = chequeInitDatePickers;
            function chequeInitDatePickers(idFromDP) {

                var objDtPicker = new DatePicker();
                
                $scope.tomorrow = new Date();
                $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
                
                objDtPicker.Init(idFromDP);
                objDtPicker.setOptions({
                    max: $scope.tomorrow
                });
            };


            //-> Cheque reslove bank/branch function
            $scope.chequeReslove = function () {
                if (Cheque.ChNo1 && Cheque.ChNo2 && Cheque.ChNo3) { } else { return; }

                PaymentModeService.chequeReslove({
                    ChNo1: Cheque.ChNo1,
                    ChNo2: Cheque.ChNo2,
                    ChNo3: Cheque.ChNo3
                }).then(function (response) {
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: "Cheque init failed !", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        Cheque.ChIsOtherBank = Result.ChIsOtherBank;
                        Cheque.BankCode = Result.BankCode;
                        Cheque.ChBank = Result.ChBank;

                        Cheque.ChIsOtherBranch = Result.ChIsOtherBranch;
                        Cheque.BranchCode = Result.BranchCode;
                        Cheque.ChBranch = Result.ChBranch;
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> Cheque force realization function
            $scope.chequeForceRealization = function () {
                if (Cheque.ChForcefulRealization === true) {
                    Cheque.ChRealizedStatus = 'Realized';
                    $scope.currentDate = new Date();
                    Cheque.ChRealizedDate = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss a');
                }
                else {
                    Cheque.ChRealizedStatus = 'Pending';
                    Cheque.ChRealizedDate = '';
                }
            };

            //-> Cheque save function
            $scope.chequeSubmit = function (form) {
                if (!saveBtn) {
                    return;
                }

                saveBtn = false;
                if (form && form.$valid) { } else {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }

                if ($scope.Cheque.ContactNo.length < 1) {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }
                var objReturn = jQuery.extend(true, {}, Cheque);


                PaymentModeService.PostPamentModeReferences({ 
                    ChNo1: $scope.Cheque.ChNo1,
                    ChNo2: $scope.Cheque.ChNo2,
                    ChNo3: $scope.Cheque.ChNo3,
                    ChForcefulRealization: $scope.Cheque.ChForcefulRealization,
                    ChDate: $scope.Cheque.ChDate,
                    ChBank: 0, //$scope.Cheque.ChBank,
                    ChIsOtherBank: $scope.Cheque.ChIsOtherBank,
                    ChBranch: 0, //$scope.Cheque.ChBranch,
                    ChIsOtherBranch: $scope.Cheque.ChIsOtherBranch,
                    ChOtherBank: $scope.Cheque.ChOtherBank,
                    ChOtherBranch: $scope.Cheque.ChOtherBranch,
                    ChRealizedStatus: false, //$scope.Cheque.ChRealizedStatus,
                    ChRealizedDate: $scope.Cheque.ChRealizedDate,
                    ChRemarks: $scope.Cheque.ChRemarks,
                    ContactNo: $scope.Cheque.ContactNo,
                    Email: $scope.Cheque.Email,
                    ChUpdatedBy: $scope.Cheque.ChUpdatedBy,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.Cheque).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Check data saving fails!");
                        toaster.success({ type: 'error', title: 'Error', body: "Check data saving fails!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        objReturn.ReferenceNo = response.data.Result;
                        objReturn.PaymentModeSubCat = $scope.Cheque.ChBank == '' ? 1 : $scope.Cheque.ChBank;
                        finish(objReturn);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "Check data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };
            $scope.StarPoints.RefCodeEnabled = true;
            //-> StarPoints Verification Type chnaged
            $scope.StPointVerTypeChanged = function () {
                if (StarPoints.VerificationType == VerificationTypes.Mobile) {
                    StarPoints.NIC.Question = '';
                    StarPoints.NIC.Answer = '';
                }
                else if (StarPoints.VerificationType == VerificationTypes.NIC) {
                    StarPoints.Mobile.RequestPin = false;
                    StarPoints.Mobile.NfcCode = '';
                    StarPoints.Mobile.NfcPin = '';
                }
            };

            //-> StarPoints Show Balance
            $scope.StShowBalance = function () {
                PaymentModeService.StShowBalance({
                    MobileNo: $scope.options.MobileNo,
                    RefCode: StarPoints.RefCode,
                    RefType: StarPoints.ReferenceType,
                    Sbu: $scope.options.ItemSbu,
                    SystemId:2
                }).then(function (response) {
                    if (!response.data) {
                        $scope.StarPoints.RefCodeEnabled = true;
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        return;
                    }

                    $scope.payAlertMessage = new Message(MessageTypes.Empty);

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;
                        $scope.StarPoints.RefCodeEnabled = false;
                        StarPoints.AvlBalance = Result.AvlBalance;
                        StarPoints.RedemptionStatus = Result.RedemptionStatus;
                    }
                    else {
                        $scope.StarPoints.RefCodeEnabled = true;
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    }

                }, function (response) {
                    $scope.StarPoints.RefCodeEnabled = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> StarPoints Request Pin Changed
            $scope.StRequestPinChanged = function () {
                StarPoints.Mobile.NfcCode = '';
                StarPoints.Mobile.NfcPin = '';
            };

            //-> StarPoints Request PIN
            $scope.StRequestNfcPin = function () {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                StarPoints.Mobile.NfcPin = '';

                PaymentModeService.StRequestNfcPin({
                    MobileNo: $scope.options.MobileNo,
                    NfcAccCode: StarPoints.Mobile.NfcCode,
                    Sbu: $scope.options.ItemSbu,
                    SystemId: 2
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: "Oops something went wrong !", showCloseButton: true });
                        return;
                    }

                    $scope.payAlertMessage = new Message(MessageTypes.Empty);

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        StarPoints.RefCode = Result.RefCode;
                        StarPoints.ReferenceType = Result.ReferenceType;
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> StarPoints Request Question
            $scope.StRequestQuestion = function () {
                PaymentModeService.StRequestQuestion({
                    MobileNo: $scope.options.MobileNo,
                    RefCode: StarPoints.RefCode,
                    RefType: StarPoints.ReferenceType,
                    Sbu: $scope.options.ItemSbu,
                    SystemId: 2
                }).then(function (response) {
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: "Oops something went wrong !", showCloseButton: true });
                        return;
                    }

                    $scope.payAlertMessage = new Message(MessageTypes.Empty);

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        StarPoints.Mobile.NfcPin = '';

                        StarPoints.VerificationType = Result.VerificationType;
                        StarPoints.NIC.Question = Result.Question;
                        // $scope.payAlertMessage = new Message(MessageTypes.Success, "Pin Request Successful!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Pin Request Successful!", showCloseButton: true });
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> StarPoints save function
            $scope.SaveStarPoints = function () {
                //$scope.options.Amount = 10; // SIT purpose only
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;

                PaymentModeService.StarPointsRedemption({
                    MobileNo: $scope.options.MobileNo,
                    PaymentMode: $scope.options.PaymentMode,

                    StReferenceCode: StarPoints.RefCode,
                    StVerificationType: StarPoints.VerificationType,
                    StNfcAccountRef: StarPoints.Mobile.NfcCode,
                    StNfcPin: StarPoints.Mobile.NfcPin,
                    StQuestion: StarPoints.NIC.Question,
                    StAnswer: StarPoints.NIC.Answer,
                    CustRefCode: $scope.options.CustomerRef,
                    Amount: $scope.options.Amount,
                    RefCode: StarPoints.RefCode,
                    RefType: StarPoints.ReferenceType,
                    Sbu: $scope.options.ItemSbu,
                    SystemId: 2
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        toaster.error({ type: 'error', title: 'Error', body: "Starpoints submition error !", showCloseButton: true });
                        return;
                    }

                    $scope.payAlertMessage = new Message(MessageTypes.Empty);

                    if (response.data.Code == MessageTypes.Success) {
                        var Result = response.data.Result;

                        StarPoints.Request = Result.Request;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully submited!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Successfully submited!", showCloseButton: true });
                        var objReturn = jQuery.extend(true, {}, StarPoints);
                        finish(objReturn);
                    }
                    else {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> SMS Gift Voucher Init function
            $scope.SmInit = function (arg) {
                $scope.SmDgGrid.Init(arg, true);
                $scope.SmDgGrid.data([]);
            };

            //-> SMS Gift Voucher Add to grid
            $scope.SmAddVoucher = function () {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                var dataItems = $scope.SmDgGrid.data();

                PaymentModeService.SmRequestVoucher({
                    SmsGvVoucherCode: $scope.SmsGiftVoucher.SmsGvVoucherCode,
                    PaymentMode: $scope.options.PaymentMode,
                    SmsGvAmount: 0 //$scope.SmsGiftVoucher.SmsGvAmount
                }).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Sms gift voucher data submition error !");
                        toaster.error({ type: 'error', title: 'Error', body: "Sms gift voucher data submition error !", showCloseButton: true });
                        return;
                    }


                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);

                        var Result = response.data.Result;

                        dataItems.push({}); var rwIndex = dataItems.length - 1;

                        var dataItem = dataItems[rwIndex];

                        dataItem.SmsGvVoucherCode = Result.SmsGvVoucherCode;
                        dataItem.SmsGvAmount = Result.SmsGvAmount;
                        dataItem.SmsGvStatus = Result.SmsGvStatus;
                        dataItem.SmsGvApprovedDateTime = Result.SmsGvApprovedDateTime;
                        dataItem.SmsGvRemarks = Result.SmsGvRemarks;
                        dataItem.SmsGvApprovalCode = Result.SmsGvApprovalCode;
                        dataItem.ReferenceNo = Result.ReferenceNo;

                        $scope.SmDgGrid.refresh(); _initSmsGiftVoucher();
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    saveBtn = true;
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> SMS Gift Voucher save function
            $scope.SaveSmGfVouchers = function () {
                var dataItems = $scope.SmDgGrid.data();

                var dtTable = [];

                for (var i = 0; i < dataItems.length; i++) {
                    var dataItem = dataItems[i];

                    dtTable.push({
                        SmsGvVoucherCode: dataItem.SmsGvVoucherCode,
                        SmsGvAmount: dataItem.SmsGvAmount,
                        SmsGvApprovalCode: dataItem.SmsGvApprovalCode,
                        SmsGvApprovedDateTime: dataItem.SmsGvApprovedDateTime,
                        SmsGvRemarks: dataItem.SmsGvRemarks,
                        SmsGvStatus: dataItem.SmsGvStatus,
                        ReferenceNo: dataItem.ReferenceNo,
                        CustRefCode: $scope.options.CustomerRef,
                        PaymentMode: $scope.options.PaymentMode
                    });
                } finish(dtTable);
            };

            //-> Gift Voucher Init function
            $scope.GfInit = function (arg) {
                $scope.GfDgGrid.Init(arg, true);
                $scope.GfDgGrid.data([]);
            };

            //-> Gift Voucher Add to grid
            $scope.GfAddVoucher = function () {
                debugger;
                console.log("gift Vo");
                var dataItems = $scope.GfDgGrid.data();

                for (var key in dataItems) {
                    var objTemp = dataItems[key];
                    if (objTemp.GVSerialNo !== null && GiftVoucher.GVSerialNo) {
                        if (objTemp.GVSerialNo == GiftVoucher.GVSerialNo) {
                            //$scope.payAlertMessage = new Message(MessageTypes.Warning, "Serial No '" + objTemp.GVItemCode + "' already added");
                            toaster.error({ type: 'error', title: 'Error', body: "Serial No '" + objTemp.GVItemCode + "' already added", showCloseButton: true });
                            return;
                        }
                    }

                } $scope.payAlertMessage = new Message(MessageTypes.Empty);
                debugger;
                PaymentModeService.GfRequestVoucher({
                    
                    GVSerialNo: GiftVoucher.Code
                }).then(function (response) {
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: "Gift voucher not found !", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);
                        console.log(response.data.Result, "insert");

                        var dataItems = $scope.GfDgGrid.data();

                        for (var i = 0; i < dataItems.length; i++) {

                            //check prefix -- if not has on grid RETURN
                            if (dataItems[i].GVSerialNo == response.data.Result.GVSerialNo) {
                                //$scope.payAlertMessage = new Message(3, "Serial already added.");
                                toaster.error({ type: 'error', title: 'Error', body: "Serial already added.", showCloseButton: true });
                                return;
                            }
                        }
                        var Result = response.data.Result;

                        dataItems.push({}); var rwIndex = dataItems.length - 1;

                        var dataItem = dataItems[rwIndex];

                        dataItem.GVSerialNo = Result.GVSerialNo;
                        dataItem.GVItemCode = Result.GVItemCode;
                        dataItem.GVItemText = Result.GVItemText;
                        dataItem.GVExpireDate = Result.GVExpireDate;
                        dataItem.GVSoldDate = Result.GVSoldDate;
                        dataItem.GVValue = Result.GVValue;
                        dataItem.ReferenceNo = Result.ReferenceNo;
                        $scope.GfDgGrid.refresh(); _initGiftVoucher(); $scope.GfCalculateTotal();
                    }
                    else {
                        toaster.error({
                            type: 'error', title: 'Error', body: "Gift voucher not found ! " + response.data.Message, showCloseButton: true
                        });
                    }

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: "Gift voucher not found ! " + response.data.Message, showCloseButton: true });
                });
            };

            $scope.ChangeGiftVoucher = function (a) {
                if (a.which === 13) {
                    $scope.GfAddVoucher();
                }
            };
            $scope.disabled = {};
            //-> Gift Voucher save function
            $scope.SaveGfVouchers = function () {
                try {
                    var dataItems = $scope.GfDgGrid.data();

                    var GVTotal = 0;//$scope.options.Amount = 3000
                    var Amount = $scope.options.Amount;
                    var GvSingleValue = 0;

                    var dtTable = [];
                    if (dataItems.length < 1) {
                        $scope.payAlertMessage = new Message(MessageTypes.Error, "Gift voucher data not found !");
                        toaster.error({ type: 'error', title: 'Error', body: "Gift voucher data not found !", showCloseButton: true });
                        return;
                    }

                    for (var i = 0; i < dataItems.length; i++) {

                        var dataItem = dataItems[i];
                        dataItem.GVValue;
                        if (Amount > dataItem.GVValue) {
                            GvSingleValue = dataItem.GVValue;
                        } else if (Amount == dataItem.GVValue) {
                            GvSingleValue = dataItem.GVValue;
                        } else {
                            GvSingleValue = Amount;
                        }
                        dtTable.push({
                            GVSerialNo: dataItem.GVSerialNo,
                            GVItemCode: dataItem.GVItemCode,
                            GVItemText: dataItem.GVItemText,
                            GVExpireDate: dataItem.GVExpireDate,
                            GVSoldDate: dataItem.GVSoldDate,
                            GVValue: GvSingleValue,
                            ReferenceNo: dataItem.ReferenceNo,
                            CustRefCode: $scope.options.CustomerRef,
                            PaymentMode: $scope.options.PaymentMode
                        });
                        Amount = Amount - dataItem.GVValue;
                    }

                    angular.forEach($scope.GfDgGrid.data(), function (row) {
                        row.RemoveBtn = true;
                    });
                    $scope.disabled.gvbutton = true;
                    debugger;
                    PaymentModeService.PostPamentModeReferences(dtTable, PaymentModesTypes.GiftVoucher).then(function (response) {
                        if (!response.data) {
                            //$scope.payAlertMessage = new Message(MessageTypes.Error, "Gift Voucher data error!");
                            toaster.error({ type: 'error', title: 'Error', body: "Gift Voucher data error!", showCloseButton: true });
                            return;
                        }

                        if (response.data.Code == MessageTypes.Success) {
                            //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                            toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                            $scope.GfDgGrid.data([]);
                            $scope.GfDgGrid.refresh();


                            finish(response.data.Result);
                        }

                    });
                } catch (e) {
                    angular.forEach($scope.GfDgGrid.data(), function (row) {
                        row.RemoveBtn = true;
                    });
                    $scope.disabled.gvbutton = true;
                }
            };

            //-> Btr save function
            $scope.SaveBtr = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                if (form && form.$valid) { } else { $scope.showErrors(form); return; }
                var objReturn = jQuery.extend(true, {}, Btr);

                PaymentModeService.PostPamentModeReferences({
                    BtrRefCode: $scope.Btr.BtrRefCode,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.BTR).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Btr data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "Btr data error!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);
                        Btr.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        finish(Btr);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "BTR data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };

            //-> Ibuy save function
            $scope.SaveIbuy = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                if (form && form.$valid) { } else {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }
                var objReturn = jQuery.extend(true, {}, Ibuy);

                PaymentModeService.PostPamentModeReferences({
                    IbuyRefCode: $scope.Ibuy.IbuyRefCode,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.IBUY).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Ibuy data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "Ibuy data error!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Empty);
                        Ibuy.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        finish(Ibuy);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "IBUY data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };

            //-> DDB save function
            $scope.SaveDdb = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                //if (form && form.$valid) { } else { $scope.showErrors(form); return; }
                var objReturn = jQuery.extend(true, {}, DDB);

                PaymentModeService.PostPamentModeReferences({
                    IbuyRefCode: $scope.DDB.DDBCode,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.DDB).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Ibuy data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "DDB data saving failed!", showCloseButton: true });
                        return; 
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Empty);
                        DDB.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        finish(DDB);
                        $scope.disabled.btnSaveDdb = true;
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "DDB data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };


            //-> MS2 save function
            $scope.SaveMs2 = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                //if (form && form.$valid) { } else { $scope.showErrors(form); return; }
                var objReturn = jQuery.extend(true, {}, MS2);
                if ($scope.MS2.MS2Code == "" || $scope.MS2.MS2Code == null) {
                    toaster.error({ type: 'error', title: 'Error', body: "Miscellaneous 2 Reference Code is !", showCloseButton: true });
                    return;
                }
                PaymentModeService.PostPamentModeReferences({
                    IbuyRefCode: $scope.MS2.MS2Code,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.MS2).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {

                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Ibuy data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "Miscellaneous 2 data saving error!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);
                        MS2.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        $scope.disabled.Mis2button = true;
                        finish(MS2);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "Miscellaneous 2 data saving fails!" + response.data.Message, showCloseButton: true });
                });


            };

            //-> Miscellaneous save function
            $scope.SaveMiscellaneous = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                if (form && form.$valid) { } else {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }
                var objReturn = jQuery.extend(true, {}, Miscellaneous);

                PaymentModeService.PostPamentModeReferences({
                    MisPayModeCategory: $scope.Miscellaneous.MisPayModeCategory,
                    MisRefCode: $scope.Miscellaneous.MisRefCode,
                    MisRemarks: $scope.Miscellaneous.Remarks,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode,
                    Amount: $scope.options.Amount
                }, PaymentModesTypes.Miscellaneous).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Miscellaneous data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "Miscellaneous data saving error!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);
                        Miscellaneous.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.success({ type: 'Success', title: 'Success', body: "Payment mode information saved successfully!", showCloseButton: true });
                        $scope.disabled.Misbutton = true;
                        finish(Miscellaneous);
                    }
                }, function (response) {
                    saveBtn = true;
                    toaster.success({ type: 'error', title: 'Error', body: "Miscellaneous data saving fails!" + response.data.Message, showCloseButton: true });
                });

            };

            //-> Voucher - finder call back
            $scope.VoFinderVoucher = function (response) {
                var dtRow = response.selectedItem;

                if (dtRow.VoucherNo) { } else { return; }

                PaymentModeService.VoRetrieveVoucher({
                    Code: dtRow.VoucherNo,
                    Category: dtRow.VoucherCat,
                    SubCategory: dtRow.VoucherCatSub
                }).then(function (response) {
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                        toaster.error({ type: 'error', title: 'Error', body: "Voucher data retrive error !", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code != MessageTypes.Success) {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); return;
                    }
                    var Result = response.data.Result;
                    Voucher = Result.Voucher; $scope.Voucher = Voucher;

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });
            };

            //-> Voucher save function
            $scope.SaveVoucher = function (form) {
                if (!saveBtn) {
                    return;
                }
                saveBtn = false;
                if (form && form.$valid) { } else {
                    $scope.showErrors(form);
                    saveBtn = true;
                    return;
                }
                var objReturn = jQuery.extend(true, {}, Voucher);

                PaymentModeService.PostPamentModeReferences({
                    Code: Voucher.Code,
                    Category: Voucher.Category.Code,
                    SubCategory: Voucher.SubCategory.Code,
                    Amount: Voucher.Amount,
                    ExpiringOn: Voucher.ExpiringOn,
                    SalesAgent: Voucher.SalesAgent.Code,
                    CustRefCode: $scope.options.CustomerRef,
                    PaymentMode: $scope.options.PaymentMode
                }, PaymentModesTypes.Voucher).then(function (response) {
                    saveBtn = true;
                    if (!response.data) {
                        //$scope.payAlertMessage = new Message(MessageTypes.Error, "Voucher data error!");
                        toaster.error({ type: 'error', title: 'Error', body: "Voucher data saving error!", showCloseButton: true });
                        return;
                    }

                    if (response.data.Code == MessageTypes.Success) {
                        $scope.payAlertMessage = new Message(MessageTypes.Empty);

                        objReturn.ReferenceNo = response.data.Result;
                        //$scope.payAlertMessage = new Message(MessageTypes.Success, "Successfully saved!");
                        toaster.error({ type: 'Success', title: 'Error', body: "Payment mode information saved successfully!", showCloseButton: true });

                        finish(objReturn);
                    }
                    else { toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); }

                }, function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                });

            };

            //-> Final Callback to parent controller.
            var finish = function (data) {
                $scope.options.Callback(data);
            };

            $scope.Validate = function (type) {
                var ss = $scope.Btr.BtrRefCode;
                var regex = /^[0-9a-zA-Z]*$/;
                if (type == 1) {
                    if (!regex.test(ss)) {
                        //$scope.alertMessageBtr = new Message(MessageTypes.Error, "Reference should be alpha numeric!");
                        toaster.error({ type: 'error', title: 'Error', body: "Reference should be alpha numeric!", showCloseButton: true });
                    } else {
                        $scope.alertMessageBtr = new Message(MessageTypes.Empty);
                    }
                } else if (type == 2) {
                    if (!regex.test(ss)) {
                        //$scope.alertMessageIbuy = new Message(MessageTypes.Error, "Reference should be alpha numeric!");
                        toaster.error({ type: 'error', title: 'Error', body: "Reference should be alpha numeric!", showCloseButton: true });
                    } else {
                        $scope.alertMessageIbuy = new Message(MessageTypes.Empty);
                    }
                } else if (type == 3) {
                    if (!regex.test(ss)) {
                        //$scope.alertMessageMis = new Message(MessageTypes.Error, "Reference should be alpha numeric!");
                        toaster.error({ type: 'error', title: 'Error', body: "Reference should be alpha numeric!", showCloseButton: true });
                    } else {
                        $scope.alertMessageMis = new Message(MessageTypes.Empty);
                    }
                }

            }

            $scope.FocusToNextTextBox = function (type, event) {
                var cardType = $scope.CreditNexusCard.CcCardType;

                if (cardType == CardTypes.AMEX) {
                    if (type == 1) {

                        var length = $scope.CreditNexusCard.CcCardNo1.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#CcCardNo4'));
                            myEl.focus();
                        }

                    }
                    else if (type == 2) {
                        var length = $scope.CreditNexusCard.CcCardNo2.length;

                        if (length == 6) {
                            var myEl = angular.element(document.querySelector('#CcCardNo3'));
                            myEl.focus();
                        }
                    }
                    else if (type == 4) {
                        var length = $scope.CreditNexusCard.CcCardNo4.length;

                        if (length == 5) {
                            var myEl = angular.element(document.querySelector('#CcApprovalCode'));
                            myEl.focus();
                        }
                    }
                } else {
                    if (type == 1) {

                        var length = $scope.CreditNexusCard.CcCardNo1.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#CcCardNo4'));
                            myEl.focus();
                        }

                    }
                    else if (type == 2) {
                        var length = $scope.CreditNexusCard.CcCardNo2.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#CcCardNo3'));
                            myEl.focus();
                        }
                    }
                    else if (type == 3) {
                        var length = $scope.CreditNexusCard.CcCardNo3.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#CcCardNo4'));
                            myEl.focus();
                        }
                    } else {
                        var length = $scope.CreditNexusCard.CcCardNo4.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#CcApprovalCode'));
                            myEl.focus();
                        }
                    }
                }
            }

            $scope.ValidateLength = function (type, event) {
                var cardType = $scope.CreditNexusCard.CcCardType;
                var regex = /^[0-9]*$/;



                if (cardType == CardTypes.AMEX) {
                    if (type == 1) {

                        var length = $scope.CreditNexusCard.CcCardNo1.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo1)) {
                            event.preventDefault();
                        }

                        if (length == 4) {
                            event.preventDefault();
                        }

                    }
                    else if (type == 2) {
                        var length = $scope.CreditNexusCard.CcCardNo2.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo2)) {
                            event.preventDefault();
                        }

                        if (length == 6) {
                            event.preventDefault();
                        }
                    }
                    else if (type == 4) {
                        var length = $scope.CreditNexusCard.CcCardNo4.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo4)) {
                            event.preventDefault();
                        }

                        if (length == 5) {
                            event.preventDefault();
                        }
                    } else {
                        event.preventDefault();
                    }
                } else {
                    if (type == 1) {

                        var length = $scope.CreditNexusCard.CcCardNo1.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo1)) {
                            event.preventDefault();
                        }

                        if (length == 4) {
                            event.preventDefault();
                        }

                    }
                    else if (type == 2) {

                        var length = $scope.CreditNexusCard.CcCardNo2.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo2)) {
                            event.preventDefault();
                        }

                        if (length == 4) {
                            event.preventDefault();
                        }
                    }
                    else if (type == 3) {

                        var length = $scope.CreditNexusCard.CcCardNo3.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo3)) {
                            event.preventDefault();
                        }

                        if (length == 4) {
                            event.preventDefault();
                        }
                    } else {

                        var length = $scope.CreditNexusCard.CcCardNo4.length;

                        if (!regex.test($scope.CreditNexusCard.CcCardNo4)) {
                            event.preventDefault();
                        }

                        if (length == 4) {
                            event.preventDefault();
                        }
                    }
                }
            }

            $scope.ValidateLengthToSave = function () {
                var cardType = $scope.CreditNexusCard.CcCardType;



                if (cardType == CardTypes.AMEX) {
                    if ($scope.CreditNexusCard.CcCardNo1 != undefined) {
                        var length1 = $scope.CreditNexusCard.CcCardNo1.length;
                        if (length1 != 4) {
                            return false;
                        }
                    } else {
                        return true;
                    }

                    //if ($scope.CreditNexusCard.CcCardNo1 != undefined) {
                    //    var length2 = $scope.CreditNexusCard.CcCardNo2.length;
                    //    if (length2 != 6) {
                    //        return false;
                    //    }
                    //} else {
                    //    return true;
                    //}

                    if ($scope.CreditNexusCard.CcCardNo4 != undefined) {
                        var length4 = $scope.CreditNexusCard.CcCardNo4.length;
                        if (length4 != 5) {
                            return false;
                        }
                    } else {
                        return true;
                    }

                    return true;
                } else {
                    if ($scope.CreditNexusCard.CcCardNo1 != undefined) {
                        var length = $scope.CreditNexusCard.CcCardNo1.length;
                        if (length != 4) {
                            return false;
                        }
                    } else {
                        return true;
                    }

                    //if ($scope.CreditNexusCard.CcCardNo2 != undefined) {
                    //    var length = $scope.CreditNexusCard.CcCardNo2.length;
                    //    if (length != 4) {
                    //        return false;
                    //    }
                    //} else {
                    //    return true;
                    //}
                    //if ($scope.CreditNexusCard.CcCardNo3 != undefined) {
                    //    var length = $scope.CreditNexusCard.CcCardNo3.length;
                    //    if (length != 4) {
                    //        return false;
                    //    }
                    //} else {
                    //    return true;
                    //}
                    if ($scope.CreditNexusCard.CcCardNo4 != undefined) {
                        var length = $scope.CreditNexusCard.CcCardNo4.length;
                        if (length != 4) {
                            return false;
                        }
                    } else {
                        return true;
                    }
                    return true;
                }
            }

            $scope.ChangeCardType = function () {
                $scope.CreditNexusCard.CcCardNo1 = '';
                $scope.CreditNexusCard.CcCardNo2 = '1234';
                $scope.CreditNexusCard.CcCardNo3 = '1234';
                $scope.CreditNexusCard.CcCardNo4 = '';
                $scope.CreditNexusCard.CcCardBankCode = 0;
                $scope.CreditNexusCard.CcApprovalCode = '';
            }

            $scope.btnVerifyClickPOVD = function () {
                PaymentModeService.VerifySerialNumbers($scope.POVD.PreOrderVoucherSerialNumber).then(function (response) {
                    if (response.data.Code == MessageTypes.Success) {
                        $scope.POVD.BatchId = response.data.Result.BatchId;
                        $scope.POVD.Status = response.data.Result.Status;
                        $scope.POVD.StatusId = response.data.Result.StatusId;
                        $scope.POVD.Value = response.data.Result.Value;
                        $scope.POVD.DealerName = response.data.Result.DealerName;
                        $scope.POVD.ExpairyDate = response.data.Result.ExpairyDate;
                    }
                    else {
                        $scope.alertMessage = new Message(response.data.Code, "Invalid serial details");
                        toaster.error({ type: 'error', title: 'Error', body: "", showCloseButton: true });
                        return;
                    }
                },
                function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    return;
                });
            }

            $scope.btnUpdateClickPOVD = function () {

                if ($scope.POVD.PreOrderVoucherSerialNumber == "" || $scope.POVD.PreOrderVoucherSerialNumber == undefined) {
                    //$scope.payAlertMessage = new Message(MessageTypes.Error, "Serial number not entered");
                    toaster.error({ type: 'error', title: 'Error', body: "Serial number not entered", showCloseButton: true });
                    return;
                }

                if ($scope.POVD.StatusId != "0") {
                    //$scope.payAlertMessage = new Message(MessageTypes.Error, "Serial number is not valid to redeem");
                    toaster.error({ type: 'error', title: 'Error', body: "Serial number is not valid to redeem", showCloseButton: true });
                    //$scope.alertMessage = new Message(MessageTypes.Error, "Serial number is not valid to redeem");
                    return;
                }

                var detailItem = new PreOrderVoucherSerials();
                detailItem.BatchId = $scope.POVD.BatchId;
                detailItem.SerialNo = $scope.POVD.PreOrderVoucherSerialNumber;
                detailItem.Status = $scope.POVD.StatusId,
                detailItem.VoucherAmount = $scope.POVD.Value,

                detailItem.CustRefCode = $scope.options.CustomerRef;

                PaymentModeService.UpdateSerials(detailItem).then(function (response) {
                    if (response.data.Code == MessageTypes.Success) {
                        var objReturn = jQuery.extend(true, {}, POVD);

                        objReturn.ReferenceNo = response.data.Result.ReferenceNo;
                        objReturn.PaymentMode = response.data.Result.PaymentMode;
                        finish(objReturn);
                    }
                    else {
                        //$scope.alertMessage = new Message(response.data.Code, "Serial number not redeem");
                        toaster.error({ type: 'error', title: 'Error', body: "Serial number not redeem", showCloseButton: true });
                        return;
                    }
                },
                function (response) {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    return;
                });
            }
            var objTemp = new Array();
            $scope.VoFinderVoucher = {
                title: "Voucher",
                info: {
                    appId: "ZBC-DCPOS",
                    uiId: "POS-PMT-VOUCHER-01",
                    mapId: "PMT-VOUCHER-01",
                    modalId: "VoFinderVoucher", //This must be match with HTML Finder element ID (<finder id=�invoice-SalesOrder�>)
                    onLoad: true
                },
                params: [],

                callback: function (response) {
                    var dtRow = response.selectedItem;

                    if (dtRow.VoucherNo) { } else { return; }

                    PaymentModeService.VoRetrieveVoucher({
                        Code: dtRow.VoucherNo,
                        Category: dtRow.VoucherCat,
                        SubCategory: dtRow.VoucherCatSub
                    }).then(function (response) {
                        if (!response.data) {
                            //$scope.payAlertMessage = new Message(MessageTypes.Error, "Oops something went wrong !");
                            toaster.error({ type: 'error', title: 'Error', body: "Voucher retrive failer!", showCloseButton: true });
                            return;
                        }

                        if (response.data.Code != MessageTypes.Success) {
                            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true }); return;
                        }
                        var Result = response.data.Result;
                        Voucher = Result.Voucher; $scope.Voucher = Voucher;

                    }, function (response) {
                        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                    });
                },
                open: function () {




                    objTemp = [];
                    $scope.finderDetailsObj = $scope.options.Params.InvoiceNo;

                    objTemp.push($scope.finderDetailsObj);
                    $scope.alertMessage = new Message(MessageTypes.Empty, '');

                    this.params = objTemp;
                    this.info.onLoad = true;
                    $("#" + this.info.modalId).modal('show');
                }
            };


             

             
            /////////////////////////////////////

            //$scope.checkFilled = function (e) {
            //    var inputVal = document.getElementByName("starPointsAns");
            //    if (inputVal.length.length > 4) {
            //        inputVal.style.backgroundColor = "#F5CEDB";
            //    }
            //    else {
            //        inputVal.style.backgroundColor = "yellow";
            //    }
            //}




            ////////////////////////////////

            $scope.ValidateCheqLength = function (type, event) {
                // var cardType = $scope.CreditNexusCard.CcCardType;
                var regex = /^[0-9]*$/;

                if (type == 1) {

                    var length = $scope.Cheque.ChNo3.length;

                    if (!regex.test($scope.Cheque.ChNo3)) {
                        event.preventDefault();
                    }

                    if (length == 6) {
                        event.preventDefault();
                    }

                }
                else if (type == 2) { 

                    var length = $scope.Cheque.ChNo1.length;

                    if (!regex.test($scope.Cheque.ChNo1)) {
                        event.preventDefault();
                    }

                    if (length == 4) {
                        event.preventDefault();
                    }

                }
                else if (type == 3) {

                    var length = $scope.Cheque.ChNo2.length;

                    if (!regex.test($scope.Cheque.ChNo2)) {
                        event.preventDefault();
                    }

                    if (length == 3) {
                        event.preventDefault();
                    }

                }
            }
       
            
                       

            $scope.FocusToNextCheqBox = function (type, event) {
             //   var cardType = $scope.CreditNexusCard.CcCardType;
                var regex = /^[0-9]*$/;

                    if (type == 1) {
                        var length = $scope.Cheque.ChNo3.length;

                        if (length == 6) {
                            var myEl = angular.element(document.querySelector('#ChequeNo1'));
                            myEl.focus();
                        }

                    }
                    else if (type == 2) {
                        var length = $scope.Cheque.ChNo1.length;

                        if (length == 4) {
                            var myEl = angular.element(document.querySelector('#ChequeNo2'));
                            myEl.focus();
                        }

                    }
                    else if (type == 3) {

                        var length = $scope.Cheque.ChNo2.length;

                        if (length == 3) {
                            var myEl = angular.element(document.querySelector('#ChDate'));
                            myEl.focus();
                        }

                    }
               
            }


        }]
    }
}]);