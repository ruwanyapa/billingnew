angular.module("DialogBilling").controller('SuspenseAccountConfigController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "SuspenseAccountConfigService", function ($scope, Page, $routeParams, $filter, toaster, SuspenseAccountConfigService) {
    //Set Page Title
    Page.setTitle("Suspense Account Config");
    $scope.SuspenseAccConfig = {};
    $scope.configSuspenseAccConfig = {};

    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //####################################      Finder Suspense Acc Config Code       ########################################

    $scope.finderSuspenseAccConfig = {
        title: "Search by Suspense Account Config",
        info: {
            appId: "ZBC-DCPOS-BILLING",
            uiId: "BILLING-SUSPENSEACCOUNTCONFIG",
            mapId: "BILLING-SUSPENSEACCOUNTCONFIG-MAP",
            modalId: "finderSuspenseAccConfig",
            dataLoad: false,
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.SuspenseAccConfig.Sbu = data.selectedItem.Sbu;
            $scope.SuspenseAccConfig.PayType = data.selectedItem.PayType;
            $scope.SuspenseAccConfig.PaySource = data.selectedItem.PaySource;
            $scope.GetSuspenseAccConfigById();
            $scope.GetSuspenseAccConfigData();
        },
        open: function () {
            objTemp = [];
            this.info.onLoad = true;
            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');
        }
    };

    //  #########################################################


    //####################################      Suspense Acc Config Grid       ########################################

    var configSuspenseAccConfig = {
        columns: [
                    //{ field: "Sbu", title: "SbuCode", width: "100px" },
                    { field: "SBUSCODE", title: "BU", width: "100px" },
                    {
                        field: "AccountNo",
                        headerTemplate: 'Connection Reference',
                        headerAttributes: { "class": "table-header-CRM" },
                        template: '<input type ="text" ng-model="dataItem.AccountNo" class="k-fill text-right conn-ref2 kk" maxlength="50" ng-disabled="isDisable"/>',
                        width: "100px"
                    },
                    {
                        field: "Description",
                        headerTemplate: 'Contract ID',
                        headerAttributes: { "class": "table-header-CRM" },
                        template: '<input type ="text" ng-model="dataItem.Description" class="k-fill text-right conn-ref2 kk" maxlength="50" ng-disabled="isDisable"/>',
                        width: "100px"
                    }
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true
    };

    configSuspenseAccConfig.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                fields: {
                    'Sbu': { editable: false, type: "number" },
                    'SBUSCODE': { editable: false, type: "string" },
                    'AccountNo': { editable: false, type: "string" },
                    'Description': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 10
    });

    $scope.dgGridSuspenseAccountConfig = new DataGrid();

    $scope.dgGridSuspenseAccountConfig.options(configSuspenseAccConfig);

    $scope.InitA = function (arg) {
        $scope.dgGridSuspenseAccountConfig.Init(arg);
    };

    //  #########################################################


    $scope.changePageState = function (status) {
        $scope.SuspenseAccConfig.Sbu = 0;
        $scope.SuspenseAccConfig.PayType = 0;
        $scope.SuspenseAccConfig.PaySource = 0;
        $scope.SuspenseAccConfig.InActive = false;
        $scope.GetSbuCodes();
    }

    $scope.GetSbuCodes = function () {
        SuspenseAccountConfigService.GetSbuCodes().then(function (response) {
            if (response.data.Code == "0") {
                $scope.dgGridSuspenseAccountConfig.data(response.data.Result.dtGrid);
            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };
    $scope.GetSbuCodes();

    $scope.GetPaymentTypes = function () {
        SuspenseAccountConfigService.GetPaymentTypes().then(function (response) {
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

    $scope.GetPaymentSourceByPaymentTypeId = function () {
        if ($scope.SuspenseAccConfig.PayType > 0) {
            SuspenseAccountConfigService.GetPaymentSourceByPaymentTypeId($scope.SuspenseAccConfig.PayType).then(function (response) {
                if (response.data.Code == "0") {
                    $scope.PaymentSourceCollection = response.data.Result.PaymentSourceCollection;
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }
    };

    $scope.GetSuspenseAccConfigData = function () {
        if ($scope.SuspenseAccConfig.PaySource != null) {
            SuspenseAccountConfigService.GetSuspenseAccConfigData($scope.SuspenseAccConfig.PayType, $scope.SuspenseAccConfig.PaySource).then(function (response) {
                if (response.data.Code == "0") {
                    $scope.dgGridSuspenseAccountConfig.data(response.data.Result.dtGrid);
                    $scope.isDisable = true;
                } else {
                    toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
                }
            }, function (response) {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            });
        }
    };

    $scope.GetSuspenseAccConfigById = function () {
        SuspenseAccountConfigService.GetSuspenseAccConfigById($scope.SuspenseAccConfig.Sbu, $scope.SuspenseAccConfig.PayType, $scope.SuspenseAccConfig.PaySource).then(function (response) {
            if (response.data.Code == "0") {

                $scope.SuspenseAccConfig.Sbu = response.data.Result.Sbu;
                $scope.SuspenseAccConfig.PayType = response.data.Result.PayType;
                $scope.GetPaymentSourceByPaymentTypeId();
                $scope.SuspenseAccConfig.PaySource = response.data.Result.PaySource;
                $scope.SuspenseAccConfig.InActive = response.data.Result.InActive;

            } else {
                toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
            }
        }, function (response) {
            toaster.error({ type: 'error', title: 'Error', body: response.data.Message, showCloseButton: true });
        });
    };

    $scope.EditSuspenseAccConfig = function () {
        //$scope.configSuspenseAccConfig.AccountNo.editable = true;
        $scope.isDisable = false;
    };

    $scope.PostSuspenseAccConfig = function () {
        debugger;
        if ($scope.SuspenseAccConfig.PayType == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Type not selected", showCloseButton: true });
            return;
        }
        if ($scope.SuspenseAccConfig.PaySource == 0) {
            toaster.error({ type: 'error', title: 'Error', body: "Payment Source not selected", showCloseButton: true });
            return;
        }

        var dataItems = $scope.dgGridSuspenseAccountConfig.data();
        var suspenseAcc = [];
        for (var i = 0; i < dataItems.length; i++) {
            $scope.obj = {
                Sbu: dataItems[i].Sbu,
                PayType: $scope.SuspenseAccConfig.PayType,
                PaySource: $scope.SuspenseAccConfig.PaySource,
                AccountNo: dataItems[i].AccountNo,
                Description: dataItems[i].Description,
                InActive: $scope.SuspenseAccConfig.InActive
            };
            suspenseAcc.push($scope.obj);
        }

        SuspenseAccountConfigService.PostSuspenseAccConfig(suspenseAcc).then(function (response) {
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