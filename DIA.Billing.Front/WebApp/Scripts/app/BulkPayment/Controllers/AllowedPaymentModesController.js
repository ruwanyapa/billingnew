angular.module("DialogBilling").controller('AllowedPaymentModesController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "AllowedPaymentModesService", function ($scope, Page, $routeParams, $filter, toaster, AllowedPaymentModesService) {
    //Set Page Title
    Page.setTitle("Allowed Payment Modes");
    $scope.AllowedPaymentMode = {};
    var configAllowedPaymentModes = {};

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 15,
        pageSizes: [50, 75, 100]
    };

    var configAllowedPaymentModes = {
        columns: [
                    {
                        //field: "",
                        field: "IsSelected",
                        headerTemplate: '<input type="checkbox" title="Select" ng-click="toggleSelect($event)" ng-model="IsSelectedAll"/>',
                        template: '<input type="checkbox" ng-click="selectThis($event)" ng-model="dataItem.IsSelected" />',
                        width: "18px"
                    },
                    {
                        field: "PaymentMode",
                        title: 'Payment Modes',
                        width: "130px"
                    }
        ],

        pageable: false,
        navigatable: true,
        editable: "incell",
        scrollable: true
    };
    configAllowedPaymentModes.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            schema: {
                model: {
                    fields: {
                        'Id': { editable: false, type: "text" },
                        'IsSelected': { editable: false, type: "text" },
                        'PaymentMode': { editable: false, type: "text" }
                    }
                }
            },
        },
        pageSize: 15
    });

    $scope.dgGridAllowedPaymentModes = new DataGrid();
    $scope.dgGridAllowedPaymentModes.options(configAllowedPaymentModes);
    $scope.InitA = function (arg) {
        $scope.dgGridAllowedPaymentModes.Init(arg);
    };

    //#############################################################################

    // DAP Outlet Type dropdown
    $scope.DAPOutletTypeOption = [
      { text: " -- Select -- ", value: "" },
      { text: "Front-Line", value: "BOF" },
      { text: "Back Office", value: "BO" }
    ];

    $scope.GetAllowedPayModesByDapOutletData = function () {
        if ($scope.AllowedPaymentMode.PaymentType != null) {
            AllowedPaymentModesService.GetAllowedPayModesByDapOutletData($scope.AllowedPaymentMode.PaymentType).then(function (response) {
                if (response.data.Code == "0") {
                    $scope.dgGridAllowedPaymentModes.data(response.data.Result.dtGrid);
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }
    };

    $scope.PostAllowedPaymentModes = function () {
        if ($scope.AllowedPaymentMode.PaymentType == "") {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Type not selected", showCloseButton: true });
            return;
        }

        var dataItems = $scope.dgGridAllowedPaymentModes.data();
        var allowedPay = [];
        for (var i = 0; i < dataItems.length; i++) {
            $scope.obj = {
                Id: $scope.AllowedPaymentMode.PaymentType,
                PaymentMode: dataItems[i].Id,
                IsSelected: dataItems[i].IsSelected
            };
            allowedPay.push($scope.obj);
        }

        AllowedPaymentModesService.PostAllowedPaymentModes(allowedPay).then(function (response) {
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