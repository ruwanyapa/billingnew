angular.module("DialogBilling").controller('PaymentSourceController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "PaymentSourceService", function ($scope, Page, $routeParams, $filter, toaster, PaymentSourceService) {
    //Set Page Title
    Page.setTitle("Payment Source");
    $scope.PaymentSource = {};

    //####################################      Finder Payment Source Code       ########################################

    $scope.finderPaymentSource = {
        title: "Search by Payment Source Code",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-PAYMENTSOURCE",
            mapId: "BILLING-PAYMENTSOURCE-MAP",
            modalId: "finderPaymentSource",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.PaymentSource.Id = data.selectedItem.Id;
            $scope.GetPaymentSourceById($scope.PaymentSource.Id);
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
        $scope.PaymentSource.Id = 0;
        $scope.PaymentSource.PaymentType = 0;
        $scope.PaymentSource.CcbsPaymentSource = null;
        $scope.PaymentSource.Description = null;
        $scope.PaymentSource.InActive = false;
        $scope.MapCode = false;
    }

    $scope.GetPaymentTypes = function () {
        PaymentSourceService.GetPaymentTypes().then(function (response) {
            if (response.data.Code == "0") {
                $scope.PaymentTypeCollection = response.data.Result.PaymentTypeCollection;
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };
    $scope.GetPaymentTypes();

    $scope.GetPaymentSourceById = function (data) {
        PaymentSourceService.GetPaymentSourceById(data).then(function (response) {
            if (response.data.Code == "0") {

                $scope.PaymentSource.Id = response.data.Result.Id;
                $scope.PaymentSource.PaymentType = response.data.Result.PaymentType;
                $scope.PaymentSource.CcbsPaymentSource = response.data.Result.CcbsPaymentSource;
                $scope.PaymentSource.Description = response.data.Result.Description;
                $scope.PaymentSource.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostPaymentSources = function () {
        if ($scope.PaymentSource.PaymentType == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Type not selected", showCloseButton: true });
            return;
        }
        if ($scope.PaymentSource.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Source is Mandatory", showCloseButton: true });
            return;
        }
        if ($scope.PaymentSource.CcbsPaymentSource == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Mapping Code is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.PaymentSource.Id,
            PaymentType: $scope.PaymentSource.PaymentType,
            CcbsPaymentSource: $scope.PaymentSource.CcbsPaymentSource,
            Description: $scope.PaymentSource.Description,
            InActive: $scope.PaymentSource.InActive
        };

        PaymentSourceService.PostPaymentSources($scope.obj).then(function (response) {
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