angular.module("BulkPayment").controller('ForcefulRealizationOfChequeController', ["$scope", "Page", "ForcefulRealizationOfChequeService", "$routeParams", "$filter", "toaster", function ($scope, Page, ForcefulRealizationOfChequeService, $routeParams, $filter, toaster) {
    //Set Page Title
    Page.setTitle("Forceful Realization Of Cheque");
    $scope.ForcefulRealizationOfCheque = {};

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    $scope.currentDate = new Date();
    $scope.ForcefulRealizationOfCheque.CurrentDate = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss');

    $scope.UpdateDateTime = function () {
        $scope.currentDate = new Date();
        $scope.ForcefulRealizationOfCheque.CurrentDate = $filter('date')($scope.currentDate, 'dd MMM yyyy HH:mm:ss');
    }

    //-> Grid Configurations

    //////////====================== Forceful Realization Of Cheque Grid ===================

    //var configForcefulRealizationOfCheque = {};
    var configForcefulRealizationOfCheque = {
        columns: [
                     //{
                     //    field: "IsSelected", 
                     //    headerTemplate: '<input type="checkbox" title="Select all" ng-checked="true" />',
                     //    template: '<input type="checkbox" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
                     //    width: "32px"
                     //},
                     { field: "ReceiptNo", title: "Receipt No", width: "100px" },
                     { field: "ReceiptDate", title: "Receipt Date", width: "90px" },
                     {
                         field: "Amount", title: "Amount",
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
                     }

        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configForcefulRealizationOfCheque.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    //'IsSelected': { editable: false, type: "boolean" },                   
                    'ReceiptNo': { editable: false, type: "number" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'Amount': { editable: false, type: "number" },
                    'SBU': { editable: false, type: "string" },
                    'ConnectionReference': { editable: true, type: "number" }                                                      
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGrid = new DataGrid();

    $scope.dgGrid.options(configForcefulRealizationOfCheque);

    $scope.InitA = function (arg) {
        $scope.dgGrid.Init(arg);
    };


    //####################################      Finder Transaction ID Search    ##########################################



    $scope.finderTransactionID = {
        title: "Transaction ID Finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "POS-UPDATE-CHEQUEFR-Transaction-Id",
            mapId: "POS-UPDATE-CHEQUEFR-Transaction-Id-map",
            modalId: "finderTransactionID", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            onLoad: false
        },
        params: [],
        callback: function (response) {
            console.log("transactionID", response);
            console.log("finder", response);
            $scope.ForcefulRealizationOfCheque = {

                TransactionID: response.selectedItem.TransactionId,
                Finder_ReciptNo: response.selectedItem.ReceiptNo,
                Finder_ChequeNo: response.selectedItem.ChequeNo

            };
            $scope.findrtransation();

        },
        open: function () {
            console.log("wgqjdv");
            this.info.onLoad = true;

            $scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');
            //  this.info.onLoad = false;
        }
    };


    //  #########################################################


    //####################################    Get Receipt Details By ChequeNo   ##########################################

    $scope.GetReceiptDetailsByChequeNo = function () {

        if ($scope.ForcefulRealizationOfCheque.checkNo == undefined || $scope.ForcefulRealizationOfCheque.checkNo == "") {
            //$scope.alertMessage = [];
            // $scope.alertMessage = new Message(3, "Please enter cheque No");
            toaster.error({ type: 'Error', title: 'Error', body: "Please enter cheque No", showCloseButton: true });
        }

        ForcefulRealizationOfChequeService.GetReceiptDetailsByChequeNo($scope.ForcefulRealizationOfCheque.checkNo, $scope.ForcefulRealizationOfCheque.Bankcode, $scope.ForcefulRealizationOfCheque.BranchCode).success(function (response) {

            if (response.Code == MessageTypes.Success) {
                //$scope.alertMessage = "";
                $scope.dgGrid.data(response.Result.checkDetailGrid);
                $scope.ForcefulRealizationOfCheque.amount = response.Result.ChequeFullAmount;
                $scope.ForcefulRealizationOfCheque.ChequeDateTxt = $filter('date')(response.Result.ChequeDate, 'dd MMM yyyy HH:mm:ss'); //response.Result.ChequeDate;

            } else {
                //$scope.alertMessage = new Message(response.Code, response.Message);
                toaster.error({ type: 'Error', title: 'Error', body: response.Message, showCloseButton: true });
                return;
            }
        }, function (response) {
            //$scope.alertMessage = new Message(response.Code, response.Message);
            toaster.success({ type: 'Success', title: 'Success', body: response.Message, showCloseButton: true });
        });

    };

    //  #########################################################

    //Bank Maste
    //find Branch no
    $scope.CheckBankCode = function () {
        if (!$scope.ForcefulRealizationOfCheque.Bankcode) {
            toaster.Warning({ type: 'Error', title: 'Error', body: "Please enter Bank Code", showCloseButton: true });
            return;
        }
        if ($scope.ForcefulRealizationOfCheque.TransactionID) {
            return;
        }
        if ($scope.ForcefulRealizationOfCheque.Bankcode != "") {
            ForcefulRealizationOfChequeService.GetBankName($scope.ForcefulRealizationOfCheque.Bankcode).success(function (response) {
                if (response.Code == 0) {
                    //$scope.alertMessage = [];
                    $scope.ForcefulRealizationOfCheque.bank = response.Result.BankName;
                }
                else {
                   // $scope.alertMessage = [];
                  
                    toaster.error({ type: 'Error', title: 'Error', body: "Bank No '" + $scope.ForcefulRealizationOfCheque.Bankcode + "'  is not valid  ", showCloseButton: true });
                }
            });
        }
    };

    //  #########################################################


    //  #########################################################

    $scope.getBranchNameAndValidateCheckNo = function () {
        if (!$scope.ForcefulRealizationOfCheque.BranchCode) {
            toaster.Warning({ type: 'Error', title: 'Error', body: "Please enter Branch Code", showCloseButton: true });
            return;
        }

        if ($scope.ForcefulRealizationOfCheque.checkNo == undefined || $scope.ForcefulRealizationOfCheque.checkNo == "") {
            //$scope.alertMessage = [];
            toaster.Warning({ type: 'Error', title: 'Error', body: "Please enter cheque No", showCloseButton: true });
            return;
        }

        if ($scope.ForcefulRealizationOfCheque.TransactionID) {
            return;
        }
        if ($scope.ForcefulRealizationOfCheque.BranchCode != "") {
            ForcefulRealizationOfChequeService.getBranchNameAndValidateCheckNo($scope.ForcefulRealizationOfCheque.checkNo, $scope.ForcefulRealizationOfCheque.Bankcode, $scope.ForcefulRealizationOfCheque.BranchCode).success(function (response) {
                if (response.Code == 0) {
                    $scope.ForcefulRealizationOfCheque.Branch = response.Result.branchName;
                }
                else {
                    
                    toaster.error({ type: 'Error', title: 'Error', body: "Branch Code '" + $scope.ForcefulRealizationOfCheque.BranchCode + "'  is not valid  ", showCloseButton: true });
                }
            });
        }
    };

    //  #############################################################


    $scope.updateValToTextBox = function () {
        if ($scope.ForcefulRealizationOfCheque.TransactionID) {
            return;
        }
        $scope.ForcefulRealizationOfCheque.BankcodeView = $scope.ForcefulRealizationOfCheque.Bankcode;
        $scope.ForcefulRealizationOfCheque.ChequeDateTxt = $scope.ForcefulRealizationOfCheque.ChequeDate;
        console.log($scope.ForcefulRealizationOfCheque.ChequeDateTxt, "date");

    };


    $scope.changePageState = function (state) {
        if (state == "SEARCH") {



        }
        else if (state == "NEW") {
            console.log("new")
            $scope.ForcefulRealizationOfCheque.TransactionID = "";
            $scope.ForcefulRealizationOfCheque.checkNo = "";

            $scope.ForcefulRealizationOfCheque.Bankcode = "";
            $scope.ForcefulRealizationOfCheque.BranchCode = "";
            $scope.ForcefulRealizationOfCheque.amount = "";
            $scope.ForcefulRealizationOfCheque.ChequeDateTxt = "";
            $scope.ForcefulRealizationOfCheque.bank = "";
            $scope.ForcefulRealizationOfCheque.Branch = "";
            $scope.dgGrid.data([]);
            $scope.alertMessage = "";

        }
    };


    // #################### Post Forcefull cheque data ############################

    //Update Cheque forcefull data  
    //save 
    $scope.FromForcefulRealizationOfChequeSubmit = function () {
        //if (form && form.$valid) { } else {
        //    $scope.showErrors(form);
        //    $scope.alertMessage = "";
        //}


        console.log($scope.ForcefulRealizationOfCheque, "Forcefull cheque ");
        var gridDetail = $scope.dgGrid.data();

        if ((!$scope.ForcefulRealizationOfCheque.checkNo) || ($scope.ForcefulRealizationOfCheque.checkNo == "")) {
            
            toaster.error({ type: 'Error', title: 'Error', body: "Please enter cheque No", showCloseButton: true });
            return;
        }
        else if ((!$scope.ForcefulRealizationOfCheque.Bankcode) || ($scope.ForcefulRealizationOfCheque.Bankcode == "")) {
           
            toaster.error({ type: 'Error', title: 'Error', body: "Please enter bank code", showCloseButton: true });
            return;

        }

        else if ((!$scope.ForcefulRealizationOfCheque.BranchCode) || ($scope.ForcefulRealizationOfCheque.BranchCode == "")) {
            
            toaster.error({ type: 'Error', title: 'Error', body: "Please enter branch code", showCloseButton: true });
            return;

        }
        
        else if ((gridDetail.length == 0)) {

            toaster.error({ type: 'Error', title: 'Error', body: "Please load receipt data to the table", showCloseButton: true });
            return;
            
        }


        var userId = $scope.userInfo().userId;
        var outstandDetail = $scope.dgGrid.data();
        $scope.UpdateDateTime();
        $scope.formdata = {
            TransactionId: $scope.ForcefulRealizationOfCheque.TransactionID,
            ChequeNo: $scope.ForcefulRealizationOfCheque.checkNo,
            ChDate: $scope.ForcefulRealizationOfCheque.ChequeDateTxt,
            BanksId: $scope.ForcefulRealizationOfCheque.Bankcode,
            BranchId: $scope.ForcefulRealizationOfCheque.BranchCode,
            AddedDate: $scope.ForcefulRealizationOfCheque.CurrentDate,
            AddedUser: $scope.userInfo().userId,
            //IsSelected: $scope.ForcefulRealizationOfCheque.IsSelected,

            GridDataForPost: outstandDetail
        };


        ForcefulRealizationOfChequeService.PostForcefulRealizationOfCheque($scope.formdata).success(function (response) {
           
                $scope.alertMessage = [];
                $scope.ForcefulRealizationOfCheque.TransactionID = response.Result;
                toaster.success({ type: 'Success', title: 'Success', body: "Cheque is  forcefully realized Successfully", showCloseButton: true });
            

            
        }).error(function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.Message, showCloseButton: true }); return;
        });
        
    };


    //  #############################################################


    $scope.findrtransation = function () {

        if (!$scope.ForcefulRealizationOfCheque.TransactionID) {
            return;
        }
        if ($scope.ForcefulRealizationOfCheque.TransactionID != "") {

            ForcefulRealizationOfChequeService.GetFindbytransationId($scope.ForcefulRealizationOfCheque.TransactionID, $scope.ForcefulRealizationOfCheque.Finder_ReciptNo).success(function (response) {

                if (response.Code == 0) {
                    $scope.alertMessage = "";

                    console.log("Test", response.Result);

                    //var grid = $("[kendo-grid]").data("kendoGrid");
                    //grid.dataSource.data(response.Result.Bank);



                    $scope.dgGrid.data(response.Result.checkDetailGrid);

                    $scope.ForcefulRealizationOfCheque.TransactionID = response.Result.TransactionId;
                    $scope.ForcefulRealizationOfCheque.checkNo = response.Result.ChequeNo;
                    $scope.ForcefulRealizationOfCheque.Bankcode = response.Result.BankCode;
                    $scope.ForcefulRealizationOfCheque.BranchCode = response.Result.BranchCode;
                    $scope.ForcefulRealizationOfCheque.amount = response.Result.Amount;
                    $scope.ForcefulRealizationOfCheque.CurrentDate = response.Result.addedDate;
                    $scope.ForcefulRealizationOfCheque.bank = response.Result.bank;
                    $scope.ForcefulRealizationOfCheque.Branch = response.Result.Branch;
                    $scope.ForcefulRealizationOfCheque.ChequeDateTxt = $filter('date')(response.Result.ChDate, 'dd MMM yyyy HH:mm');
                    $scope.ForcefulRealizationOfCheque.BankcodeView = response.Result.BankCode;

                    console.log($scope.ForcefulRealizationOfCheque.Bankcode, "bank", response.Result.BankCode);

                }
                else {
                    $scope.alertMessage = [];
                    $scope.alertMessage = new Message(response.Code, response.Message);
                }
            });
        }
    };   

    //###################################  

    $scope.frcontainer = document.getElementsByClassName("frcontainer")[0];
    $scope.frcontainer.onkeyup = function (e) {
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