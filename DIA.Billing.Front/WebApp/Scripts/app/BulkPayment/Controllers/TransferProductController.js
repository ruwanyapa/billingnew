angular.module("DialogBilling").controller('TransferProductController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "TransferProductService", function ($scope, Page, $routeParams, $filter, toaster, TransferProductService) {
    //Set Page Title
    Page.setTitle("Transfer Product");
    $scope.TransferProduct = {};

    //####################################      Finder Transfer Product Code       ########################################

    $scope.finderTransferProduct = {
        title: "Search by Transfer Product",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-TRANSFERPRODUCT",
            mapId: "BILLING-TRANSFERPRODUCT-MAP",
            modalId: "finderTransferProduct",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.TransferProduct.Id = data.selectedItem.Id;
            $scope.GetTransferProductById($scope.TransferProduct.Id);
        },
        open: function () {
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
        }
    };

    //  #########################################################

    $scope.changePageState = function (status) {
        $scope.TransferProduct.Id = 0;
        $scope.TransferProduct.SbuCode = 0;
        $scope.TransferProduct.ProductType = 0;
        $scope.TransferProduct.TypeMapping = null;
        $scope.TransferProduct.InActive = false;
        $scope.SbuCodesCollection = null;
    }

    $scope.GetSbuCodes = function () {
        TransferProductService.GetSbuCodes().then(function (response) {
            if ($scope.TransferProduct.ProductType > 0) {
                if (response.data.Code == "0") {
                    $scope.SbuCodesCollection = response.data.Result.dtGrid;
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.GetProductTypes = function () {
        TransferProductService.GetProductTypes().then(function (response) {
            if (response.data.Code == "0") {
                $scope.ProductTypeCollection = response.data.Result.ProductTypeCollection;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };
    $scope.GetProductTypes();

    $scope.GetTransferProductById = function (Id) {
        TransferProductService.GetTransferProductById(Id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.TransferProduct.Id = response.data.Result.Id;
                $scope.TransferProduct.ProductType = response.data.Result.ProductType;
                $scope.GetSbuCodes();
                $scope.TransferProduct.SbuCode = response.data.Result.SbuCode;
                $scope.TransferProduct.TypeMapping = response.data.Result.TypeMapping;
                $scope.TransferProduct.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostTransferProduct = function () {
        if ($scope.TransferProduct.TypeMapping == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Transfer Product is Mandatory", showCloseButton: true });
            return;
        }
        if ($scope.TransferProduct.ProductType == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Product Type not selected", showCloseButton: true });
            return;
        }
        if ($scope.TransferProduct.SbuCode == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "BU not selected", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.TransferProduct.Id,
            SbuCode: $scope.TransferProduct.SbuCode,
            ProductType: $scope.TransferProduct.ProductType,
            TypeMapping: $scope.TransferProduct.TypeMapping,
            InActive: $scope.TransferProduct.InActive
        };

        TransferProductService.PostTransferProduct($scope.obj).then(function (response) {
            if (response.data.Code == "0") {
                toaster.success({ type: 'success', title: 'Success', body: response.data.Message, showCloseButton: true });
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

}]);