angular.module("DialogBilling").controller('ProductCategoryController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "ProductCategoryService", function ($scope, Page, $routeParams, $filter, toaster, ProductCategoryService) {
    //Set Page Title
    Page.setTitle("Product Category");
    $scope.ProductCategory = {};

    //####################################      Finder Product Category Code       ########################################

    $scope.finderProductCategory = {
        title: "Search by Product Category Code",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-PRODUCTCATEGORY",
            mapId: "BILLING-PRODUCTCATEGORY-MAP",
            modalId: "finderProductCategory",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.ProductCategory.Id = data.selectedItem.Id;
            $scope.GetProductCategoryById($scope.ProductCategory.Id);
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
        $scope.ProductCategory.Id = 0;
        $scope.ProductCategory.Description = null;
        $scope.ProductCategory.InActive = false;
    };

    $scope.GetProductCategoryById = function (id) {

        ProductCategoryService.GetProductCategoryById(id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.ProductCategory.Id = response.data.Result.Id;
                $scope.ProductCategory.Description = response.data.Result.Description;
                $scope.ProductCategory.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostProductCategorys = function () {
        if ($scope.ProductCategory.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Product Category is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.ProductCategory.Id,
            Description: $scope.ProductCategory.Description,
            InActive: $scope.ProductCategory.InActive

        };

        ProductCategoryService.PostProductCategorys($scope.obj).then(function (response) {
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