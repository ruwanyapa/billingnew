angular.module("DialogBilling").controller('CancellationTransferReasonsController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "CancellationTransferReasonsService", function ($scope, Page, $routeParams, $filter, toaster, CancellationTransferReasonsService) {
    //Set Page Title
    Page.setTitle("Cancellation & Transfer Reasons");
    $scope.CanTransReasons = {};

    //####################################      Finder Cancellation & Transfer Reasons Code       ########################################

    $scope.finderCanTransReason = {
        title: "Search by Cancellation & Transfer Reasons",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-CANCELLATIONREASON",
            mapId: "BILLING-CANCELLATIONREASON-MAP",
            modalId: "finderCanTransReason",
            dataLoad: false,
            onLoad: false
        }, 
        params: [],

        callback: function (data) {
            $scope.CanTransReasons.Id = data.selectedItem.Id;
            $scope.GetCanTransReasonsByReasonCode($scope.CanTransReasons.Id);
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
        $scope.CanTransReasons.Id = null;
        $scope.CanTransReasons.Description = null;
        $scope.CanTransReasons.InActive = false;
    };

    $scope.GetCanTransReasonsByReasonCode = function (Id) {
        CancellationTransferReasonsService.GetCanTransReasonsByReasonCode(Id).then(function (response) {
            if (response.data.Code == "0") {

                $scope.CanTransReasons.Id = response.data.Result.Id;
                $scope.CanTransReasons.Description = response.data.Result.Description;
                $scope.CanTransReasons.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.PostCanTransReasons = function () {
        if ($scope.CanTransReasons.Id == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Reason Code is Mandatory", showCloseButton: true });
            return;
        }
        if ($scope.CanTransReasons.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Description is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Id: $scope.CanTransReasons.Id,
            Description: $scope.CanTransReasons.Description,
            InActive: $scope.CanTransReasons.InActive
        };

        CancellationTransferReasonsService.PostCanTransReasons($scope.obj).then(function (response) {
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