angular.module("DialogBilling").controller('ChequeReturnReasonsController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "ChequeReturnReasonsService", function ($scope, Page, $routeParams, $filter, toaster, ChequeReturnReasonsService) {
    //Set Page Title
    Page.setTitle("Cheque Return Reasons");
    $scope.ChqReturnReason = {};

    //####################################      Finder Cheque Return Reasons Code       ########################################

    $scope.finderChqReturnReason = {
        title: "Search by Cheque Return Reasons",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-CHEQUERETURNREASON",
            mapId: "BILLING-CHEQUERETURNREASON-MAP",
            modalId: "finderChqReturnReason",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            
            //$scope.ChqReturnReason.Code = data.selectedItem.Code;
            //$scope.GetChequeReturnReasonsByCode($scope.ChqReturnReason.Code);
            $scope.ChqReturnReason.Code = data.selectedItem.Code;
            $scope.ChqReturnReason.Description = data.selectedItem.Description;
            $scope.ChqReturnReason.InActive = data.selectedItem.Inactive;
            $scope.ReasonCode = true;
            $scope.$apply();
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
        $scope.ChqReturnReason.Code = null;
        $scope.ChqReturnReason.Description = null;
        $scope.ChqReturnReason.InActive = false;
        $scope.ReasonCode = false;
    };

    //$scope.GetChequeReturnReasonsByCode = function (Code) {
    //    ChequeReturnReasonsService.GetChequeReturnReasonsByCode(Code).then(function (response) {
    //        if (response.data.Code == "0") {

    //            $scope.ChqReturnReason.Code = response.data.Result.Code;
    //            $scope.ChqReturnReason.Description = response.data.Result.Description;
    //            $scope.ChqReturnReason.InActive = response.data.Result.InActive;

    //        } else {
    //            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
    //        }
    //    }, function (response) {
    //        toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
    //    });
    //};
    
    $scope.PostChequeReturnReasons = function () {
        if ($scope.ChqReturnReason.Code == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Reason Code is Mandatory", showCloseButton: true });
            return;
        }
        if ($scope.ChqReturnReason.Description == null) {
            toaster.error({ type: 'error', title: 'Error', body: "Description is Mandatory", showCloseButton: true });
            return;
        }

        $scope.obj = {
            Code: $scope.ChqReturnReason.Code,
            Description: $scope.ChqReturnReason.Description,
            InActive: $scope.ChqReturnReason.InActive
        };

        ChequeReturnReasonsService.PostChequeReturnReasons($scope.obj).then(function (response) {
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