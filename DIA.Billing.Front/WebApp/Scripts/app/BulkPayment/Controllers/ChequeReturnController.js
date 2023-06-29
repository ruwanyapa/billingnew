angular.module("DialogBilling").controller('ChequeReturnController', [
    "$scope", '$interval', "Page", "$cookies", "ChequeReturnService", "$routeParams", "$filter", "toaster", "AuthService", function ($scope, $interval, Page, $cookieStore, ChequeReturnService, $routeParams, $filter, toaster, AuthService) {
        //Set Page Title
        Page.setTitle("Cheque Return");

        $scope.ChequeReturn = {};
        var selectedCount = 0;

        //-> Grid Start
        var commonGridConfig = {
            input: true,
            numeric: false,
            pageSize: 10,
            pageSizes: [15, 50, 75, 100]
        };

        $scope.DateTime = new Date();
        $scope.ChequeReturn.DateTime = $filter('date')($scope.DateTime, 'dd MMM yyyy HH:mm:ss');

        $scope.UpdateDateTime = function () {

            $scope.currentDate = new Date();
            $scope.ChequeReturn.DateTime = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm a');
        }
        //-> Grid Configurations

        //////////====================== Check return Grid ===================


        var configChequeReturn = {
            columns: [
                { field: "ReceiptNo", title: "Receipt No", width: "100px" },
                { field: "ReceiptDate", title: "Receipt Date", width: "90px" },
                {
                    field: "Amount",
                    title: "Amount",
                    template: "{{dataItem.Amount|currency:''}}",

                    // template: '<input type ="text"  kendo-numeric-text-box class="k-fill text-right"   format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />',
                    width: "100px"
                },
                { field: "SBU", title: "BU", width: "80px" },
                {
                    field: "ConnectionReference",
                    title: 'Connection Reference',
                    // template: '<input type ="text"    class="k-fill "/>',
                    width: "90px"
                },
                {
                    field: "RecStatus",
                    title: 'Receipt Status',
                    // template: '<input type ="text"    class="k-fill "/>',
                    width: "90px"
                }
            ],

            pageable: commonGridConfig,
            navigatable: true,
            editable: "inline",
            scrollable: true

        };

        configChequeReturn.dataSource = new kendo.data.DataSource({
            data: [],
            schema: {
                model: {
                    id: "ID",
                    fields: {
                        'ReceiptNo': { editable: false, type: "number" },
                        'ReceiptDate': { editable: false, type: "date" },
                        'Amount': { editable: false, type: "number" },
                        'SBU': { editable: false, type: "string" },
                        'ConnectionReference': { editable: true, type: "number" },
                        'RecStatus': { editable: true, type: "string" },
                        'SbuCode': { editable: true, type: "string" }
                    }
                }
            },
            pageSize: 10

        });





        $scope.abcdgGridChequeReturn = new DataGrid();
        $scope.abcdgGridChequeReturn.options(configChequeReturn);

        $scope.InitA = function (arg) {
            $scope.abcdgGridChequeReturn.Init(arg);
        };





        var configBulkChqBatchId = {};
        var configBulkChqBatchId = {
            columns: [
                         {
                             field: "IsSelected",
                             headerTemplate: '',
                             template: '<input type="checkbox"  ng-click="selectThis1($event)" ng-model="dataItem.IsSelected"/>',
                             width: "22px"
                         },

                         { field: "BatchId", title: "Batch ID", width: "50px" },
                         { field: "ChAmount", title: "Cheque Amount", width: "40px" },
                         { field: "ChDate", title: "Cheque Date", width: "40px" },

            ],

            pageable: commonGridConfig,
            navigatable: true,
            editable: "inline",
            scrollable: true,
            dataBound: function () {
                var dGrid = $scope.dgconfigBulkChqBatchId.data();
                angular.forEach(dGrid, function (row) {
                    //if (row.IsSelectedRowDisabled == true) {
                    //    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                    //} else if (row.Description == "Cancelled") {
                    //    $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //red
                    //    if ($scope.IsUploads) {
                    //        row.IsSelected = false;
                    //    } else {
                    //        row.IsSelected = true;
                    //    }
                    //}

                    //if (!$scope.IsUploads) {
                    //    row.IsSelectedRowDisabled = true;
                    //}
                });
            }
        };

        configBulkChqBatchId.dataSource = new kendo.data.DataSource({
            data: [],
            schema: {
                model: {
                    id: "ID",
                    fields: {
                        'IsSelected': { editable: false, type: "boolean" },
                        'BatchId': { editable: false, type: "string" },
                        'ChAmount': { editable: false, type: "number" },
                        'ChDate': { editable: false, type: "date" },
                       
                    }
                }
            },
            pageSize: 10

        });


        $scope.selectThis1 = function (e) {
            var dataItems1 = $scope.dgconfigBulkChqBatchId.data();
            selectedCount = 0;
            var isSelected = true;
            for (var i = 0; i < dataItems1.length; i++) {
                var sss = dataItems1[i].IsSelected;              
                if (!dataItems1[i].IsSelected) {
                    isSelected = false;
                } else {
                    selectedCount = selectedCount + 1;
                }
            }
            $scope.IsSelectedAll = isSelected;

        };


        $scope.dgconfigBulkChqBatchId = new DataGrid();
        $scope.dgconfigBulkChqBatchId.options(configBulkChqBatchId);

        $scope.InitB = function (arg) {
            $scope.dgconfigBulkChqBatchId.Init(arg);
        };

        //####################################      Finder Transaction ID Search    ##########################################


        var modalId = {};
        // Search By BatchNo


        //  #########################################################


        $scope.PageLoad = function () {

            ChequeReturnService.GetMasterDetails().then(function (response) {

                if (response.data.Code == "0") {
                    $scope.ReturnReasonsCollection = response.data.Result.ChequeReturnReasons;
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }


            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });


        }

        $scope.PageLoad();

        $scope.GetChequeDetailsByNo = function () {
            selectedCount = 0;
            if ($scope.ChequeReturn.ChNo === "" || $scope.ChequeReturn.ChNo === undefined) {
                toaster.error({ type: 'error', title: 'Error', body: "Cheque number should not be empty", showCloseButton: true });
                return;
            }

            if ($scope.ChequeReturn.ChBank === "" || $scope.ChequeReturn.ChBank === undefined) {
                toaster.error({ type: 'error', title: 'Error', body: "Bank Code should not be empty", showCloseButton: true });
                return;
            }

            if ($scope.ChequeReturn.ChBrancho === "" || $scope.ChequeReturn.ChBranch === undefined) {
                toaster.error({ type: 'error', title: 'Error', body: "Branch Code should not be empty", showCloseButton: true });
                return;
            }

            ChequeReturnService.ValidateChequeDetails($scope.ChequeReturn.ChNo, $scope.ChequeReturn.ChBank, $scope.ChequeReturn.ChBranch).then(function (response) {
                $scope.chkStatus = response.data.Result;

                if (response.data.Code == "0") {
                    if ($scope.chkStatus == true) {
                        $scope.ClearDetails();
                        toaster.error({ type: 'error', title: 'Error', body: "Receipts already cancelled for the entered cheque number", showCloseButton: true });
                        return;
                    } else {
                        ChequeReturnService.GetChequeDetails($scope.ChequeReturn.ChNo, $scope.ChequeReturn.ChBank, $scope.ChequeReturn.ChBranch).then(function (response) {

                            if (response.data.Code == "0") {
                                if (response.data.Result.ChequeDetails == null || response.data.Result.ChequeDetails.length==0 ) {
                                    $scope.ClearDetails();
                                    toaster.error({ type: 'error', title: 'Error', body: "Cheque details not found! Please verify the entered cheque number", showCloseButton: true });
                                    return;
                                }

                                if (response.data.Result.IsSameChqDetails == 1) {
                                    $('#GoodIssueBulkSerial').modal('show');
                                    var obj = [];

                                    angular.forEach(response.data.Result.ChqBatchId, function (row) {
                                        obj.push({ 'BatchId': row.BatchId, 'ChAmount': row.Amount, 'ChDate': $filter('date')(row.ChDate, 'dd MMM yyyy') });
                                    });
                                    $scope.dgconfigBulkChqBatchId.data(obj);
                                    $scope.ChqRawDetails = response.data.Result;
                                } else {
                                    $scope.ChquDetails = response.data.Result.ChequeDetails[0];
                                    $scope.ChequeReturn.ChBankName = $scope.ChquDetails.ChBankName;
                                    $scope.ChequeReturn.ChAmount = $scope.ChquDetails.ChAmount;
                                    $scope.ChequeReturn.ChBranchName = $scope.ChquDetails.ChBranchName;
                                    $scope.ChequeReturn.ChDate = $filter('date')($scope.ChquDetails.ChDate, 'dd MMM yyyy');
                                    $scope.ChequeReturn.RecUser = $scope.ChquDetails.RecUser;
                                  
                                    var obj = [];

                                    angular.forEach(response.data.Result.ChequeReceiptDetails, function (row) {
                                        obj.push({ 'ReceiptNo': row.ReceiptNo, 'Amount': row.Amount, 'ReceiptDate': $filter('date')(row.ReceiptDate, 'dd MMM yyyy HH:mm:ss a'), 'SBU': row.SBU, 'ConnectionReference': row.ConnectionReference, 'RecStatus': row.RecStatus, 'SbuCode': row.SbuCode });
                                    });
                                    $scope.abcdgGridChequeReturn.data(obj);
                                    $scope.CheckRowColor();
                                }

                                //$scope.ChequeReturn.NowDate = $filter('date')($scope.ChquDetails.NowDate, 'dd MMM yyyy HH:mm:ss a');

                                //$scope.abcdgGridChequeReturn.data(response.data.Result.ChequeReceiptDetails);

                               

                            } else {
                                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                            }


                        }, function (response) {
                            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                        });
                    }
                }

            });


        }

        $scope.GetChequeDetailsByFinder = function () {


            ChequeReturnService.GetChequeDetails($scope.ChequeReturn.ChNo, $scope.ChequeReturn.ChBank, $scope.ChequeReturn.ChBranch).then(function (response) {

                if (response.data.Code == "0") {
                    if (response.data.Result.ChequeDetails == null) {
                        $scope.ClearDetails();
                        toaster.error({ type: 'error', title: 'Error', body: "Cheque details not found! Please verify the entered cheque number", showCloseButton: true });
                        return;
                    }


                    $scope.ChquDetails = response.data.Result.ChequeDetails;
                    $scope.ChequeReturn.ChBankName = $scope.ChquDetails.ChBankName;
                    $scope.ChequeReturn.ChAmount = $scope.ChquDetails.ChAmount;
                    $scope.ChequeReturn.ChBranchName = $scope.ChquDetails.ChBranchName;
                    $scope.ChequeReturn.ChDate = $filter('date')($scope.ChquDetails.ChDate, 'dd MMM yyyy');
                    $scope.ChequeReturn.RecUser = $scope.ChquDetails.RecUser;
                    $scope.ChequeReturn.DateTime = $filter('date')(response.data.Result.DateTime, 'dd MMM yyyy HH:mm:ss');


                    var obj = [];

                    angular.forEach(response.data.Result.ChequeReceiptDetails, function (row) {
                        obj.push({ 'ReceiptNo': row.ReceiptNo, 'Amount': row.Amount, 'ReceiptDate': $filter('date')(row.ReceiptDate, 'dd MMM yyyy HH:mm:ss a'), 'SBU': row.SBU, 'ConnectionReference': row.ConnectionReference, 'RecStatus': row.RecStatus, 'SbuCode': row.SbuCode });
                    });
                    $scope.abcdgGridChequeReturn.data(obj);
                    $scope.CheckRowColor();

                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }


            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });

        };




        $scope.CheckRowColor = function () {
            if (!$scope.IsLoadingAtFirstTime) {
                var dGrid = $scope.abcdgGridChequeReturn.data();

                angular.forEach(dGrid, function (row) {
                    if ((row.RecStatus == "Cancelled")) {
                        $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightRed"); //red
                    } else {
                        if ((row.RecStatus == "Cancel – Pending Approval")) {
                            $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //red
                        }
                    }

                });
            }
        }

        //$scope.CheckRowColor = function () {
        //    if (!$scope.IsLoadingAtFirstTime) {
        //        var dGrid = $scope.abcdgGridChequeReturn.data();

        //        angular.forEach(dGrid, function (row) {
        //            if ((row.RecStatus == "Pending for approval")) {
        //                $('tr[data-uid="' + row.uid + '"] ').addClass("bg-highlightBlue"); //red


        //            }
        //        });
        //    }
        //}


        var retHeaderObj = function () {
            this.ChNo1 = $scope.ChequeReturn.ChNo;
            this.ChNo2 = $scope.ChequeReturn.ChBank;
            this.ChNo3 = $scope.ChequeReturn.ChBranch;
            this.ChDate = $scope.ChequeReturn.ChDate;
            this.ChBank = $scope.ChequeReturn.ChBank;
            this.ChBranch = $scope.ChequeReturn.ChBranch;
            this.ReasonCode = $scope.ChequeReturn.ReasonCode;
            this.RecUser = $scope.ChequeReturn.RecUser;
            this.AddedUser = '';
            this.SourceIp = '';
            this.BatchRec = [];
        }

        var retLineObj = function () {
            this.ReceiptNo = '';
            this.SbuCode = '';
            this.ReceiptDate = '';
            this.Amount = '';
            this.ConnectionRef = '';
            this.RecStatus = '';

        }

        $scope.ValidateReturnStatus = function () {
            ChequeReturnService.ValidateChequeDetails($scope.ChequeReturn.ChNo, $scope.ChequeReturn.ChBank, $scope.ChequeReturn.ChBranch).then(function (response) {
                $scope.chkStatus = response.data.Result;
                if (response.data.Code == "0") {
                    if ($scope.chkStatus == true) {
                        $scope.ClearDetails();
                        toaster.error({ type: 'error', title: 'Error', body: "Receipts already cancelled for the entered cheque number", showCloseButton: true });
                        return true;
                    } else {
                        return false;
                    }
                }

            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }

        $scope.PostChqDetails = function () {
            ChequeReturnService.ValidateChequeDetails($scope.ChequeReturn.ChNo, $scope.ChequeReturn.ChBank, $scope.ChequeReturn.ChBranch).then(function (response) {

                if (response.data.Code == "0") {

                    $scope.GetChequeDetailsByNo();

                    $scope.chkStatus = response.data.Result;

                    if ($scope.chkStatus == true) {
                        toaster.error({ type: 'error', title: 'Error', body: "Receipts already cancelled for the entered cheque number", showCloseButton: true });
                        return;
                    } else {

                        var hDObj = new retHeaderObj();

                        hDObj.ChNo1 = $scope.ChequeReturn.ChNo;
                        hDObj.ChNo2 = $scope.ChequeReturn.ChBank;
                        hDObj.ChNo3 = $scope.ChequeReturn.ChBranch;
                        hDObj.ChDate = $scope.ChequeReturn.ChDate;
                        hDObj.ChBank = $scope.ChequeReturn.ChBank;
                        hDObj.ChBranch = $scope.ChequeReturn.ChBranch;
                        hDObj.ReasonCode = $scope.ChequeReturn.ReasonCode;

                        hDObj.RecUser = $scope.ChequeReturn.RecUser;
                        hDObj.AddedUser = '';
                        hDObj.SourceIp = '';


                        angular.forEach($scope.abcdgGridChequeReturn.data(), function (row) {
                            var line = new retLineObj();
                            if (row.RecStatus == "Valid") {

                                line.Amount = row.Amount;
                                line.ConnectionRef = row.ConnectionReference;
                                line.ReceiptDate = row.ReceiptDate;
                                line.ReceiptNo = row.ReceiptNo;
                                line.SbuCode = row.SbuCode;
                                line.RecStatus = row.RecStatus;

                                hDObj.BatchRec.push(line);
                            } else {

                                toaster.error({ type: 'error', title: 'Error', body: "Cannot return the cheque because, there are cancellation pending receipts. Please reject/accept the cancellation first and then return the cheque", showCloseButton: true });
                                return;
                            }

                        });

                        if (hDObj.BatchRec.length == 0) {
                            //toaster.error({ type: 'error', title: 'Error', body: "Valid receipt details not found to preform this action", showCloseButton: true });
                            return;
                        }

                        ChequeReturnService.PostChequeReturn(hDObj).success(function (response) {
                            if (response.Code != MessageTypes.Success) {
                                toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true });
                                return;
                            } else {
                                $scope.ChequeReturn.TransNo = response.Result;
                                toaster.success({ type: 'Success', title: 'Success', body: response.Message, showCloseButton: true });
                            }

                        }).error(function (response) {
                            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
                        });

                    }





                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }


            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });


        }



        $scope.selectChqBatches = function () {
            debugger;

            if (selectedCount == 0) {
                toaster.error({ type: 'error', title: 'Error', body: 'Please select one record.', showCloseButton: true });
                return;
            }
            else if (selectedCount > 1) {
                toaster.error({ type: 'error', title: 'Error', body: 'Please select one record only.', showCloseButton: true });
                return;
            } else {
                var allBatchIds = $scope.dgconfigBulkChqBatchId.data();
                var allChqDetails = $scope.ChqRawDetails.ChequeDetails;
                var allChqReceiptDetails = $scope.ChqRawDetails.ChequeReceiptDetails;
                var valiedReceipts = [];

                $scope.totalNoOfRecords = allBatchIds.length;
                for (var i = 0; i < allBatchIds.length; i++) {
                    if (allBatchIds[i].IsSelected == true) {
                        for (var j = 0; j < allChqDetails.length; j++) {
                            if (allBatchIds[i].BatchId == allChqDetails[j].BatchId) {
                                $scope.ChquDetails = allChqDetails[j];
                                $scope.ChequeReturn.ChAmount = $scope.ChquDetails.ChAmount;
                                $scope.ChequeReturn.ChBranchName = $scope.ChquDetails.ChBranchName;
                                $scope.ChequeReturn.ChDate = $filter('date')($scope.ChquDetails.ChDate, 'dd MMM yyyy');
                                $scope.ChequeReturn.RecUser = $scope.ChquDetails.RecUser;


                                var obj = [];

                                angular.forEach(allChqReceiptDetails, function (row) {
                                    if (allBatchIds[i].BatchId == row.BatchId) {
                                        obj.push({ 'ReceiptNo': row.ReceiptNo, 'Amount': row.Amount, 'ReceiptDate': $filter('date')(row.ReceiptDate, 'dd MMM yyyy HH:mm:ss a'), 'SBU': row.SBU, 'ConnectionReference': row.ConnectionReference, 'RecStatus': row.RecStatus, 'SbuCode': row.SbuCode });
                                    }
                                });

                            }
                        }
                        $scope.abcdgGridChequeReturn.data(obj);
                        $scope.CheckRowColor();
                    }


                }

                if (selectedCount > 1) {
                    toaster.error({ type: 'error', title: 'Error', body: 'Please select one record only.', showCloseButton: true });
                    return;
                }
                $scope.Receipt.NoofRecords = valiedReceipts.length;

                if ($scope.Receipt.NoofRecords == 0) {
                    toaster.error({ type: 'error', title: 'Error', body: 'No recodes selected', showCloseButton: true });
                    return;
                }
            }




        };


        $scope.TransactionIDSearch =
        {

            title: "Search Cheque Return Details",
            info: {
                appId: "ZBC-DCPOS-BILLING",
                uiId: "BILLING-CHQ-RETURN",
                mapId: "BILLING-POSTED-CHQ-RETURNS",
                modalId: "TransactionIDSearch",
                onLoad: true

            },
            params: [],
            callback: function (data) {


                $scope.ChequeReturn.TransNo = data.selectedItem.TransId;
                $scope.ChequeReturn.ChNo = data.selectedItem.ChNo1;
                $scope.ChequeReturn.ChBank = data.selectedItem.ChNo2;
                $scope.ChequeReturn.ChBranch = data.selectedItem.ChNo3;
                $scope.ChequeReturn.ReasonCode = data.selectedItem.ReasonCode;
                $scope.GetChequeDetailsByFinder();

            },
            open: function () {
                this.info.onLoad = true;

                //$scope.alertMessage = new Message(MessageTypes.Empty, '');
                $("#" + this.info.modalId).modal('show');

            }
        };

        $scope.ClearDetails = function () {

            $scope.ChequeReturn.TransNo = '';
            $scope.ChequeReturn.ChNo = '';
            $scope.ChequeReturn.ChBank = '';
            $scope.ChequeReturn.ChBranch = '';
            $scope.ChequeReturn.ChDate = '';
            $scope.ChequeReturn.ChBank = '';
            $scope.ChequeReturn.ChBranch = '';
            $scope.ChequeReturn.ReasonCode = '';
            $scope.ChequeReturn.RecUser = '';

            $scope.ChequeReturn.ChBankName = '';
            $scope.ChequeReturn.ChAmount = '';
            $scope.ChequeReturn.ChBranchName = '';
            $scope.ChequeReturn.ChDate = '';

            $scope.abcdgGridChequeReturn.data([]);
            $scope.PageLoad();
            $scope.UpdateDateTime();
        }

        //###################################     

        $scope.crcontainer = document.getElementsByClassName("crcontainer")[0];
        $scope.crcontainer.onkeyup = function (e) {
            var target = e.srcElement;
            var maxLength = parseInt(target.attributes["maxlength"].value, 10);
            var myLength = target.value.length;
            if (myLength >= maxLength) {
                var next = target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName.toLowerCase() == "input") {
                        next.focus();
                        break;
                    }
                }
            }
        }

    }]);