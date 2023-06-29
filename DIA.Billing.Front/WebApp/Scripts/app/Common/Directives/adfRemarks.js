/*
ADF Remarks Modal Directive

*/

angular.module("DialogBilling").directive("adfRemarks", [function () {
    return {
        restrict: "E",  
        replace: true,
        scope: {
            params: "=",
            callback: "&",
            data: "@",        
            title: "@"
        },
        templateUrl: "./Views/Common/adfRemarks.html",
        controller: ["$scope", "$attrs", function ($scope, $attrs) {

            //Init
            //@@@@@@@@@@@@@@@@@@@@@@@@@@
            //-> Grid Sample data for demo purposes

            var adfRemarksSample = [
                { Note: '001', Remark: '001', CreatedDate: '002', CreatedUser: '002' }
            ];


            //@@@@@@@@@@@@@@@@@@@@@@@@@@



            var commonGridConfig = {
                input: true,
                numeric: false,
                pageSize: 10,
                pageSizes: [15, 50, 75, 100]
            };

            var configADFRemarks = {};
            var configADFRemarks = {
                columns: [
                   
                    { field: "Note", title: "Note", width: "100px" },
                    { field: "Remark", title: "Remark", width: "100px" },
                    { field: "CreatedDate", title: "CreatedDate", width: "80px" },
                    { field: "CreatedUser", title: "CreatedUser", width: "80px" }

                ],


                pageable: commonGridConfig,
                navigatable: true,
                editable: "inline",
                scrollable: true

            };

            configADFRemarks.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                   
                            'Note': { editable: false, type: "string" },//CustomerName
                            'Remark': { editable: false, type: "string" },
                            'CreatedDate': { editable: false, type: "string" },
                            'CreatedUser': { editable: false, type: "string" }
                        }
                    }
                },
                pageSize: 10
            });


            $scope.dgGridADFRemarks = new DataGrid();
            $scope.dgGridADFRemarks.options(configADFRemarks);

            $scope.InitB = function (arg) {
                $scope.dgGridADFRemarks.Init(arg);
            };

            //watch params and initiate directives
            $scope.$watchCollection("params", function (_val) {
                if ($scope.params.onLoad) {
                    $scope.InitB();
                }
                console.log("params Adf" + _val);
                $scope.dgGridADFRemarks.data(_val);
                //$scope.dgGridADFRemarks.data(_val);
            });

            $scope.$watchCollection("data", function (_val) {
            });
            ///////////////////
        }]
    }

}]);