angular.module("DialogBilling").directive("finderNew", ['FinderService', function (FinderService) {
    return {
        restrict : "E",
        replace : true,
        scope : {
            callback: "&",
            params:"=",
            info:"=",
            title:"@"
        },
        templateUrl : "./Views/Common/Finder.html",
        controller: ["$scope", "$attrs", "FinderService", function ($scope, $attrs, FinderService) {
            
            //Initiate
            var grid_id = $scope.info.modalId + "_Grid";
            $scope.gridId_ = grid_id;

            //String Type
            $scope.types = [
                { "type_name": "=", "type": "String" },
                { "type_name": "Contains", "type": "String" },
                { "type_name": "Starts With", "type": "String" },
                { "type_name": "Ends With", "type": "String" },
                { "type_name": "Before", "type": "DateTime" },
                { "type_name": "After", "type": "DateTime" },
                { "type_name": "Between", "type": "DateTime" },
                { "type_name": "Equals", "type": "Boolean" },
                
                { "type_name": "=", "type": "Number" },
                { "type_name": ">", "type": "Number" },
                { "type_name": "<", "type": "Number" },
                { "type_name": "Not Equals", "type": "Boolean" },
                { "type_name": "Not Equals", "type": "Number" },
                { "type_name": "Between", "type": "Number" }
            ];

            //String Type == Boolean value
            $scope.prop = {
                "type": "select",
                "name": "Service",
                "value": "true",
                "values": [ "", "true", "false"]
            };

            //Operators
            $scope.operator = [
                {value : "AND", text : "And"},
                {value : "OR", text : "Or"}
            ];
            
            //watch params and render grid data
            var changedFirstTime = true,
                paramArray = [];
            $scope.$watchCollection("params", function (params) {
                paramArray = params;
                if (changedFirstTime) {
                    changedFirstTime = false;
                } else {
                    //initData();
                }
            });


            //watch info and render finder
            $scope.$watchCollection("info", function () {
               
                if ($scope.info.onLoad) {
                  
                    initData();
                }
            });
           
            
            function init(){

                $scope.finderDirectiveMessage = new Message(MessageTypes.Empty);

                //Only first time initiation
                $scope.searchCount = [0,1,2,3,4];
                $scope.finder = [];
                $scope.typesDropDown = [];

                for(var i=0; i < $scope.searchCount.length; i++){
                    var selected = i==0 ? true : false;
                    var operator = i==0 ? "WHERE" : "";
                    $scope.finder.push({"Operator" : operator,"ColumnName" : "", "FieldType":"", "OperatorType" : "", "KeyValue":"", "KeyValue2":"", "Boolean":true, "selected": selected});
                }

                //Load Data on first time
            }

            init();

            function initData() {
                console.log("finder new val", $scope.info.appId);
                FinderService.getFields({ "appId": $scope.info.appId, "uiId": $scope.info.uiId, "mapId": $scope.info.mapId, "param": paramArray, "dataLoad": !$scope.info.dataLoad }).then(function (response) {

                    if (!response.data.Result) {
                        $scope.finderDirectiveMessage = new Message(MessageTypes.Error, "<h1>Finder details not found</h1> Please contact the administrator.");
                        return;
                    }
                 
                    //set data to grid
                    var finderScriptFields_ = response.data.Result.finder.finderScriptFields || "";
                    $scope.finderFields = finderScriptFields_;

                    // -> GRID
                    var columns_ = [];
                    angular.forEach(finderScriptFields_, function (data) {
                     //   console.log("before", data.FieldOrder);
                        if (data.FieldAlignment == 2
                            ) {
                                                    
                            columns_.push({ field: data.FieldName, title: data.FieldHeaderText, width: data.FieldWidth, attributes: { class: "text-right" } });
                        } else {
                            columns_.push({ field: data.FieldName, title: data.FieldHeaderText, width: data.FieldWidth });
                        }
                        
                    });

                    //default grid data
                    $("#"+grid_id).kendoGrid({
                        dataSource: {
                            data: response.data.Result.finder.finderDataGrid == null ? [] : response.data.Result.finder.finderDataGrid.Table,
                            pageSize: 10
                        },
                        sortable: true,
                        selectable: "single row",
                        resizable : true,
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

                 

                },function(){
                    $scope.finderDirectiveMessage = new Message(MessageTypes.Error, "<h1>Finder details not found</h1> Please check the service.");
                });

            }

            //Row Toggle
            $scope.rowHidden = true;
            $scope.rowHide = function(rowID){
                if($scope.rowHidden){
                    return rowID > 0;
                } else {
                    return false;
                }
            };

            //Select & set search option based on string types.
            $scope.setSearchOptions = function(e){

                //reset input fields
                $scope.finder[e].KeyValue = "";
                $scope.finder[e].KeyValue2 = "";

                angular.forEach($scope.finderFields, function(field){
                    if(field.FieldName==$scope.finder[e].ColumnName) {

                        //Set Types Drop down
                        var typesDropDown = [];
                        angular.forEach($scope.types, function(type){
                            if(type.type==field.FieldType){
                                typesDropDown.push(type);
                            }
                        });
                        $scope.typesDropDown[e] = typesDropDown;

                        //Set Field Type
                        $scope.finder[e].FieldType = field.FieldType;
                    }
                });
            };




            //GET GRID DATA on SEARCH
            $scope.finderForm = function(){

                $scope.successData = [];
                angular.forEach($scope.finder, function(data) {
                    if (data.selected) {$scope.successData.push(data);}
                });

                FinderService.searchQuery({ "appId": $scope.info.appId, "uiId": $scope.info.uiId, "mapId": $scope.info.mapId, "param": paramArray, "searchClause": $scope.successData }).then(function (response) {

                    if (!response.data.Result) {
                        $scope.finderDirectiveMessage = new Message(MessageTypes.Error, "<h1>Finder details not found</h1> Data not found.");
                        return;
                    }
                    var grid = $("#" + grid_id).data("kendoGrid");
                    grid.dataSource.data(response.data.Result.finder.finderDataGrid.Table);

                },function(){
                    $scope.finderDirectiveMessage = new Message(MessageTypes.Error, "<h1>Finder details not found</h1> Please contact the administrator.");
                });

            };

            //UPDATE FIND FIELD
            $scope.updateModel = function(val){

                var grid = $("#"+grid_id).data("kendoGrid");
                var selectedItem = grid.dataItem(grid.select());

                if(selectedItem){
                    var func = $scope.callback();
                    func({"appId": $scope.info.appId, "uiId": $scope.info.uiId, "mapId": $scope.info.mapId, "selectedItem":selectedItem});
                    $("#"+$scope.info.modalId).modal('hide');
                } else {
                    $scope.finderDirectiveMessage = new Message(MessageTypes.Error, "Please select a row in grid.");
                }

            };

            function dbClickUpdate() {
                console.log("modal")
                $('#'+$scope.info.modalId).modal('hide');
                $scope.updateModel();
            }

        }]
    } 
}]);
 

//FOCUS INPUT FUNCTION
window._focuse = function (modalID) {
    setTimeout(function () { 
        $("#" + modalID).find(".focus-here").focus();
    }, 700)
}
