angular.module("DialogBilling").controller('TransferLogicController', ["$scope", "Page", "$routeParams", "$filter","toaster", "TransferLogicService", function ($scope, Page, $routeParams, $filter,toaster, TransferLogicService) {
    //Set Page Title
    Page.setTitle("Transfer Logic");


    ///////////////Transfer Logic Finder Modal//////////////

    $scope.OpenTransferLogicFinder = function () {

        //open popup
        window._focuse();
        $("#TransferLogicFinder").modal('show');


    };

    /////////////////////////////////////////

    //-> Grid Sample data for demo purposes

    var TransferLogicSample = [];
    $scope.TransferLogic = {};

    //@@@@@@@@@@@@@@@@@@@@@@@@@@


    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 15,
        pageSizes: [50, 75, 100]
    };

    var configTransferLogic = {};
    var configTransferLogic = {                                                     
        columns: [

              {
                  field: "FromTransferProduct",
                  title: "From Transfer Product",
                  width: "200px"

              },
              {
                  field: "ToTransferProduct",
                  title: 'To Transfer Product',
                  width: "200px"

              },
                {
                    field: "NewReceiptPaymentMethod",
                    title: 'New Receipt Payment Method',
                    width: "200px"

                },
                {
                    field: "NewReceiptPaymentMode",
                    title: 'New Receipt Payment Mode',
                    width: "200px"

                }


        ],

        pageable: true,
        navigatable: true,
        editable: "incell",
        scrollable: true



    };

    configTransferLogic.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {

                    'FromTransferProduct': { editable: false, type: "text" },
                    'ToTransferProduct': { editable: true, type: "text" },
                    'NewReceiptPaymentMethod': { editable: true, type: "text" },
                    'NewReceiptPaymentMode': { editable: true, type: "text" }

                }
            }
        },
        pageSize: 15
    });

    ///////
    $scope.dgGridTransferLogic = new DataGrid();
    $scope.dgGridTransferLogic.options(configTransferLogic);

    //################      Finder      ###################
    $scope.finderTransferLogicId = {
        title: "Batch Finder",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-TRANSFERLOGIC",
            mapId: "BILLING-TRANSFERLOGIC-001",
            modalId: "finderTransferLogicId", //This must be match with HTML Finder element ID (<finder id=”invoice-SalesOrder”>)
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.TransferLogic.Id = data.selectedItem.Id;
            $scope.GetTransferDetails(data.selectedItem.Id);
        },
        open: function () {
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
        }
    };

    $scope.changePageState = function (status) {
        $scope.TransferLogic.Id = 0;
        $scope.TransferLogic.IsActive = false;
        $scope.TransferLogic.PaymentType = 0;
        $scope.TransferLogic.FromTransferProduct = 0;
        $scope.TransferLogic.ToTransferProduct = 0;
        $scope.TransferLogic.NewPaymentMethod = 0;
        $scope.TransferLogic.NewPaymentMode = 0;
    }

    $scope.PostTransferDetails = function () {
       if ($scope.TransferLogic.PaymentType == 0) {
           toaster.error({ type: 'error', title: 'Error', body: "Payment Type not selected", showCloseButton: true });
            return;
        }
        if ($scope.TransferLogic.FromTransferProduct == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "From Transfer Product not selected", showCloseButton: true });
            return;
        }
        if ($scope.TransferLogic.ToTransferProduct == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "To Transfer Product not selected", showCloseButton: true });
            return;
        }
        if ($scope.TransferLogic.NewPaymentMethod == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "New Payment Method not selected", showCloseButton: true });
            return;
        }
        if ($scope.TransferLogic.NewPaymentMode == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "New Payment Mode not selected", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.TransferLogic.Id,
            IsActive: $scope.TransferLogic.IsActive,
            PaymentType: $scope.TransferLogic.PaymentType,
            FromTypeMapping: $scope.TransferLogic.FromTransferProduct,
            ToTypeMapping: $scope.TransferLogic.ToTransferProduct,
            PaymentMethod: $scope.TransferLogic.NewPaymentMethod,
            PaymentMode: $scope.TransferLogic.NewPaymentMode
        };
        
        TransferLogicService.PostTransferDetails($scope.obj).then(function (response) {
            if (response.data.Code == "0") {
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    }

    $scope.GetTransferDetails = function (data) {
        
        TransferLogicService.GetTransferDetails(data).then(function (response) {
            if (response.data.Code == "0") {

                $scope.TransferLogic.Id = response.data.Result.Id;
                $scope.TransferLogic.IsActive = response.data.Result.IsActive;
                $scope.TransferLogic.PaymentType = response.data.Result.PaymentType;
                $scope.TransferLogic.FromTransferProduct = response.data.Result.FromTransferProduct;
                $scope.TransferLogic.ToTransferProduct = response.data.Result.ToTransferProduct;
                $scope.TransferLogic.NewPaymentMethod = response.data.Result.NewPaymentMethod;
                $scope.TransferLogic.NewPaymentMode = response.data.Result.NewPaymentMode;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    }

    $scope.LoadDefaultTransferLogicData = function () {
        TransferLogicService.LoadDefaultTransferLogicData().then(function (response) {
            if (response.data.Code == "0") {
                $scope.PaymentTypeCollection = response.data.Result.PaymentTypeCollection;
                $scope.FromTransferProductCollection = response.data.Result.FromTransferProductCollection;
                $scope.ToTransferProductCollection = response.data.Result.ToTransferProductCollection;
                $scope.NewPaymentMethodCollection = response.data.Result.NewPaymentMethodCollection;
                $scope.NewPaymentModeCollection = response.data.Result.NewPaymentModeCollection;
                $scope.TransferLogic.IsActive = false;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    }
    $scope.LoadDefaultTransferLogicData();

}]);