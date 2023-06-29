angular.module("DialogBilling").controller('ProductTypeController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "ProductTypeService", function ($scope, Page, $routeParams, $filter, toaster, ProductTypeService) {
    //Set Page Title
    Page.setTitle("Product Type");
    $scope.ProductType = {};

    //####################################      Finder Product Type Code       ########################################

    $scope.finderProductType = {
        title: "Search by Product Type Code",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-PRODUCTTYPE",
            mapId: "BILLING-PRODUCTTYPE-MAP",
            modalId: "finderProductType",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.ProductType.Id = data.selectedItem.Id;
            $scope.GetProductTypeById($scope.ProductType.Id);
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
        $scope.ProductType.Id = 0;
        $scope.ProductType.Description = null;
        $scope.ProductType.InActive = false;
    };

    $scope.GetProductTypeById = function (id) {
        ProductTypeService.GetProductTypeById(id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.ProductType.Id = response.data.Result.Id;
                $scope.ProductType.Description = response.data.Result.Description;
                $scope.ProductType.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostProductTypes = function () {
        if ($scope.ProductType.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Product Type is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.ProductType.Id,
            Description: $scope.ProductType.Description,
            InActive: $scope.ProductType.InActive
        };

        ProductTypeService.PostProductTypes($scope.obj).then(function (response) {
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