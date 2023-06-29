angular.module("DialogBilling").controller('PaymentMethodController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "PaymentMethodService", function ($scope, Page, $routeParams, $filter, toaster, PaymentMethodService) {
    //Set Page Title
    Page.setTitle("Payment Method");
    $scope.PaymentMethod = {};

    //####################################      Finder Payment Method Code       ########################################

    $scope.finderPaymentMethod = {
        title: "Search by Payment Method Code",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-PAYMENTMETHOD",
            mapId: "BILLING-PAYMENTMETHOD-MAP",
            modalId: "finderPaymentMethod",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.PaymentMethod.Id = data.selectedItem.Id;
            $scope.GetPaymentMethodById($scope.PaymentMethod.Id);
            $scope.MapCode = true;
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
        $scope.PaymentMethod.Id = 0;
        $scope.PaymentMethod.SapCode = null;
        $scope.PaymentMethod.Description = null;
        $scope.PaymentMethod.InActive = false;
        $scope.MapCode = false;
    };

    $scope.GetPaymentMethodById = function (id) {
        PaymentMethodService.GetPaymentMethodById(id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.PaymentMethod.Id = response.data.Result.Id;
                $scope.PaymentMethod.SapCode = response.data.Result.SapCode;
                $scope.PaymentMethod.Description = response.data.Result.Description;
                $scope.PaymentMethod.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostPaymentMethods = function () {
        if ($scope.PaymentMethod.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Method is Mandatory", showCloseButton: true });
            return;
        }
        if ($scope.PaymentMethod.SapCode == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Mapping Code is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.PaymentMethod.Id,
            SapCode: $scope.PaymentMethod.SapCode,
            Description: $scope.PaymentMethod.Description,
            InActive: $scope.PaymentMethod.InActive
        };

        PaymentMethodService.PostPaymentMethods($scope.obj).then(function (response) {
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