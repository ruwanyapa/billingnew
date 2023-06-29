angular.module("DialogBilling").controller('PaymentTypeController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "PaymentTypeService", function ($scope, Page, $routeParams, $filter, toaster, PaymentTypeService) {
    //Set Page Title
    Page.setTitle("Payment Type");
    $scope.PaymentType = {};

    //####################################      Finder Payment Type Code       ########################################

    $scope.finderPaymentType = {
        title: "Search by Payment Type Code",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-PAYMENTTYPE",
            mapId: "BILLING-PAYMENTTYPE-MAP",
            modalId: "finderPaymentType",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.PaymentType.Id = data.selectedItem.Id;
            $scope.GetPaymentTypeById($scope.PaymentType.Id);
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
        $scope.PaymentType.Id = 0;
        $scope.PaymentType.PrefixChar = null;
        $scope.PaymentType.Description = null;
        $scope.PaymentType.InActive = false;
    };

    $scope.GetPaymentTypeById = function (id) {

        PaymentTypeService.GetPaymentTypeById(id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.PaymentType.Id = response.data.Result.Id;
                $scope.PaymentType.PrefixChar = response.data.Result.PrefixChar;
                $scope.PaymentType.Description = response.data.Result.Description;
                $scope.PaymentType.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostPaymentTypes = function () {
        if ($scope.PaymentType.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Type is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.PaymentType.Id,
            PrefixChar: $scope.PaymentType.PrefixChar,
            Description: $scope.PaymentType.Description,
            InActive: $scope.PaymentType.InActive
        };

        PaymentTypeService.PostPaymentTypes($scope.obj).then(function (response) {
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