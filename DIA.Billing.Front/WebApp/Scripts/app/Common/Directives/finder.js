angular.module("DialogBilling").directive("finder", ['FinderService', function (FinderService) {
    return {
        restrict: "E",
        replace: true,
        transclude : false,
        scope: {
            actionToCall: "&action",
            param: "=param",
            title: "@"
        },
        templateUrl: "./Views/Common/Finder.html",
        controller: ["$scope", "$attrs", "FinderService", function ($scope, $attrs, FinderService) {

            var grid_id = $attrs.id + "_Grid";
            $scope.gridId_ = grid_id;


            $scope.$watch("param", function (newParam) {
                console.log();
                $scope.finderDetailsObj = newParam;
            });


            //finder details object
            $scope.finderDetailsObj = [];
            if ($attrs.param) {
                $scope.$watch("param", function (newParam) {
                    $scope.finderDetailsObj = newParam;
                });
            }
            //Row Toggle
            $scope.rowHidden = true;
            $scope.rowHide = function (rowID) {
                if ($scope.rowHidden) {
                    return rowID > 0;
                } else {
                    return false;
                }
            };

            //Finder Dynamic Options List
            $scope.searchCount = [0, 1, 2, 3, 4];
            $scope.finder = [];
            $scope.typesDropDown = [];
            angular.forEach($scope.searchCount, function (i) {
                var selected = (i == "0");
                var operator = i == "0" ? "WHERE" : "";
                $scope.finder.push({ "Operator": operator, "ColumnName": "", "FieldType": "", "OperatorType": "", "KeyValue": "", "KeyValue2": "", "Boolean": true, "selected": selected });
            });

            //String Type
            $scope.types = [
                { "type_name": "Contains", "type": "String" },
                { "type_name": "Starts With", "type": "String" },
                { "type_name": "Ends With", "type": "String" },
                { "type_name": "Before", "type": "DateTime" },
                { "type_name": "After", "type": "DateTime" },
                { "type_name": "Between", "type": "DateTime" },
                { "type_name": "Equals", "type": "Boolean" },
                { "type_name": "Not Equals", "type": "Boolean" },
                { "type_name": "Not Equals", "type": "Number" },
                { "type_name": "=", "type": "Number" },
                { "type_name": ">", "type": "Number" },
                { "type_name": "<", "type": "Number" },
                { "type_name": "Between", "type": "Number" }
            ];

            //String Type == Boolean value
            $scope.prop = {
                "type": "select",
                "name": "Service",
                "value": "true",
                "values": ["", "true", "false"]
            };

            //Select & set search option based on string types.
            $scope.setSearchOptions = function (e) {
                $scope.finder[e].KeyValue = "";
                angular.forEach($scope.finderFields, function (field) {
                    if (field.FieldName == $scope.finder[e].ColumnName) {

                        //Set Types Drop down
                        var typesDropDown = [];
                        angular.forEach($scope.types, function (type) {
                            if (type.type == field.FieldType) {
                                typesDropDown.push(type);
                            }
                        });
                        $scope.typesDropDown[e] = typesDropDown;

                        //Set Field Type
                        $scope.finder[e].FieldType = field.FieldType;
                    }
                });
            };

            //Operators
            $scope.operator = [
                { value: "AND", text: "And" },
                { value: "OR", text: "Or" }
            ];

            //Load Data on first time
            FinderService.getFields({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "param": $scope.finderDetailsObj, "dataLoad": true })
                .then(function (response) {

                    if (!response.data.Result) {
                        return;
                    }
                    //set data to grid
                    var finderScriptFields_ = response.data.Result.finder.finderScriptFields || "";
                    $scope.finderFields = finderScriptFields_;

                    // -> GRID
                    //make columns
                    var columns_ = [];
                    angular.forEach(finderScriptFields_, function (data) {
                        columns_.push({ field: data.FieldName, title: data.FieldHeaderText, width: '150px' });
                    });

                    //default grid data
                    $("#" + grid_id).kendoGrid({
                        dataSource: {
                            data: response.data.Result.finder.finderDataGrid == null ? [] : response.data.Result.finder.finderDataGrid.Table,
                            pageSize: 10
                        },
                        sortable: true,
                        selectable: "multiple row",
                        pageable: {
                            refresh: true,
                            pageSizes: 8,
                            buttonCount: 8
                        },
                        change: dbClickRow,
                        columns: columns_
                    });

                    //enable double click
                    var clickedRow = null;
                    function dbClickRow(e) {
                        if(clickedRow == e.sender._data[0].uid){
                            clickedRow = null;
                            dbClickUpdate();
                        } else {
                            clickedRow = e.sender._data[0].uid;
                        }
                    }

                }, function () {
                });


            //GET GRID DATA on SEARCH
            $scope.finderForm = function () {

                $scope.successData = [];
                angular.forEach($scope.finder, function (data) {
                    if (data.selected) { $scope.successData.push(data); }
                });

                FinderService.searchQuery({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "searchClause": $scope.successData, "param": $scope.finderDetailsObj })
                    .then(function (response) {

                        var grid = $("#" + grid_id).data("kendoGrid");
                        grid.dataSource.data(response.data.Result.finder.finderDataGrid.Table);

                    }, function () {
                    });

            };

            //UPDATE FIND FIELD
            $scope.updateModel = function () {

                var grid = $("#" + grid_id).data("kendoGrid");
                var selectedItem = grid.dataItem(grid.select());

                if (selectedItem) {
                    var func = $scope.actionToCall();
                    func({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "selectedItem": selectedItem });
                } else {
                }

            };

            function dbClickUpdate(){
                $('#'+$attrs.id).modal('hide');
                $scope.updateModel();
            }

        }]
    };
}]);