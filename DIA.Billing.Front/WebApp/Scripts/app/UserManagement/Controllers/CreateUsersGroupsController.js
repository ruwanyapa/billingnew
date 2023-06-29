//
angular.module("UserManagement").controller("CreateUsersGroupsController", ["$scope", "Page", "CreateUsersGroupsService", function ($scope, Page, createUsersGroupsService) {

    //Set Page Title
    Page.setTitle("Create Users Groups");
    //FINDER controler (pop up) 1st finder "GroupId"

    $scope.userGroups = {};
    $scope.UserGroup = {};

    $scope.disabled = {
        GroupID: true
    };
    $scope.finderGropID = function (response) {

        $scope.disabled = {
            groupId: false
        };
        
        $scope.userGroups = {
            GroupId: response.selectedItem.GroupCode,
            status: response.selectedItem.Inactive
        };
        $scope.getUserGroupsByGroupCode();
    };

    //FINDER controler (pop up) 2st finder "FromUserGroup"
    $scope.finderUserGrop = function (response) {
        $scope.userGroups.FromUserGroup = response.selectedItem.GroupCode;
        $scope.userGroups.GroupDescription1 = response.selectedItem.GroupDescription;
        $scope.getPermissionFormUserGroupsByGroupCode();
    };
    $scope.Init = function (arg) {
        $scope.dgGrid.Init(arg);
    };

     var config = {};
    var permissionDescriptiontxt = "";
    $scope.AllPermissionCollection = [];
    //Create a datagrid object
    $scope.dgGrid = new DataGrid();

    config.pageable = {
        input: true,
        numeric: false
    };

    config.columns = [
        {
            field: "IsSelected",
            headerTemplate: '<input type="checkbox" title="Select all" ng-model="selectAll" ng-click="toggleSelect($event)" />',
            template: '<input type="checkbox" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
            width: "32px",
            sortable: false

        },
        {
            field: "PermissionCode",
            title: "Permission Code",
            width: "120px",
        },
        {
            field: "PermissionDescription",
            title: "Permission Description",
            width: "350px",
        },
        {
            field: "ModuleDescription",
            title: "Module Description",
            width: "160px"
        },
        //{
        //    field: "ModuleId",
        //    title: "Module Id",
        //    width: "160px",
        //},
        {
            field: "InterfaceDescription",
            title: "Interface Description"
        },
        //{
        //    field: "InterfaceId",
        //    title: "Interface Id"
        //},
        
    ];

    config.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "SubCatCode",
                fields: {
                    'PermissionCode': { editable: false, type: "string" },
                    'PermissionDescription': { editable: false, type: "string" },
                    //'ModuleId': { editable: false, type: "string" },
                    'InterfaceDescription': { editable: false, type: "string" },
                    'ModuleDescription': { editable: false, type: "string" }
                }
            }
        },
        pageSize: 8

    });
    //eeeeesdssdcsd
    $scope.dgGrid.options(config);

    $scope.selectThis = function (e) {
        $scope.selectedRow = e;
    };

    $scope.toggleSelect = function (e, gId) {
        var dataItems = [];

        dataItems = $scope.dgGrid.data();

        for (var i = 0; i < dataItems.length; i++) {
            dataItems[i].IsSelected = e.target.checked;
        } $scope.selectThis();
    };

    //Form Load Get Modules
    $scope.ModuleCollections = [];

    var sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) { return primer(x[field]) } :
            function (x) { return x[field] };

        reverse = [-1, 1][+!!reverse];

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };
    $scope.LoadPage = function () {
        $scope.disabled = {
            GroupID: true
        };
        createUsersGroupsService.formLoad(0).success(function (response) {


            if (response.Code == 0) {
                $scope.ModuleCollections = response.Result;

            } else {
                $scope.alertMessage = {
                    //   title: "Error!",
                    message: response.Message,
                    type: "E"
                };
            }
        }).error(function (response) {
            $scope.alertMessage = {
                // title: "Error!",
                message: response.Message,
                type: "E"
            };
        });

    }
    $scope.LoadPage();
    //Get All Groups by Module ID

    var groupId = 0;
    try {
        if (angular.isUndefined($scope.userGroups.GroupId) || $scope.userGroups.GroupId === null) {
            groupId = $scope.userGroups.GroupId;
        }
    } catch (e) {
        groupId = 0;
    }
    createUsersGroupsService.GetPermissionByUserGroupId(groupId).success(function (response) {
        $scope.dgGrid.data(response.Result);
        $scope.AllPermissionCollection = response.Result;
    }).error(function (response) {
        $scope.alertMessage = {
           // title: "Error!",
            message: response.Message,
            type: "E"
        };
    });

    var moduleId = 0;
    var interfaceId = 0;

    //Blur in Form group TextBox
    $scope.getPermissionFormUserGroupsByGroupCode = function () {

        if (angular.isUndefined($scope.userGroups.FromUserGroup) || $scope.userGroups.FromUserGroup === null) {
            $scope.alertMessage = {
               // title: "Error!",
                message: "User Group Id not found!",
                type: "E"
            };
            return;
        }
        if ($scope.userGroups.FromUserGroup != "") {
            //Load Permission Data
            createUsersGroupsService.getPermissionGroupsByGroupCode($scope.userGroups.FromUserGroup).success(function (response) {
                $scope.userGroups.GroupDescription1 = response.Result.GroupDescription;
                $scope.dgGrid.data(response.Result.GroupPermissionViewModel);
                $scope.AllPermissionCollection = response.Result.GroupPermissionViewModel;
                
            }).error(function (response) {
                $scope.alertMessage = {
                  //  title: "Error!",
                    message: response.Message,
                    type: "E"
                };
            });
        }
    };

    //Blur in group TextBox
    $scope.getUserGroupsByGroupCode = function () {
        var ss = $scope.userGroups.GroupId;
        if (!$scope.userGroups.GroupId) {
            $scope.alertMessage = "";
            $scope.reset();
            return;
        }

        createUsersGroupsService.getPermissionGroupsByGroupCode($scope.userGroups.GroupId).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                $scope.disabled = {
                    GroupID: true
                };
                console.log(response.data.Result.GroupPermissionViewModel);
                $scope.alertMessage = "";
                // $scope.UiReportCollections = response.data.Result;
                $scope.dgGrid.data(response.data.Result.GroupPermissionViewModel);
                $scope.userGroups.GroupDescription = response.data.Result.GroupDescription;
                $scope.userGroups.status = response.data.Result.Inactive;
                $scope.finderUserGroup.info.onLoad = false;
                $scope.finderGropID.info.onLoad = false;

            } else {
                $scope.reset();
                $scope.disabled = {
                    GroupID: false
                };
                $scope.userGroups.GroupId = ss;
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);
                return;
            }
        }, function (response) {

            $scope.reset();
            $scope.userGroups.GroupId = ss;
            $scope.alertMessage = new Message(response.data.Code, response.data.Message);
        });
        
    };

    $scope.UiReportCollections = [];
    $scope.loadGroupsByModuleId = function () {
        $scope.UserGroup.permissionDescription = "";
    };

 
    //reset button
    $scope.reset = function () {
        console.log("asdasd");
        $scope.disabled = {
            GroupID: true
        };
        $scope.userGroups.switchCopy = false;
        $scope.selectAll=false;
        $scope.finderUserGroup.info.onLoad = false;
        $scope.finderGropID.info.onLoad = false;
        $scope.disabled.GroupID = true;
        $scope.userGroups.GroupId = "";
        $scope.userGroups.GroupDescription = "";
        $scope.userGroups.status = "";
        angular.forEach($scope.AllPermissionCollection, function (row) {
            row.IsSelected = false;
        });
        $scope.dgGrid.data($scope.AllPermissionCollection);
        $scope.UserGroup.ModuleName = 0;
        $scope.UserGroup.UIReport = 0;
        $scope.UserGroup.permissionDescription = "";
        $scope.disabled = {
            GroupDesc: false
        };
        $scope.alertMessage = [];
        $scope.userGroups.FromUserGroup = "";
        $scope.userGroups.GroupDescription1 = "";
        $scope.CreateUsersGroupForm.$setPristine();
        $scope.FormLoadV1();
    };


    $scope.resetcopy = function () {

            $scope.userGroups.FromUserGroup = "";
            $scope.userGroups.GroupDescription1 = "";
            $scope.alertMessage = "";
    };


    $scope.disabled = {
        GroupDesc: false
    };

    //SAVE USER GROUP DATA

    $scope.createUserGroupFormSubmit = function () {
        console.log("sadasdasd");
        //  if (isValid) {
        if (!$scope.userGroups.GroupDescription) {
            $scope.alertMessage = new Message(3, "Please enter valid Group Description");
            return;
        }
            
            var items = $scope.dgGrid.data();
            var gId = 0;
            if (angular.isUndefined($scope.userGroups.GroupId)) {
                gId = 0;
            } else {
                gId=$scope.userGroups.GroupId;
            }
            $scope.formdata = {
                GroupCode: gId,
                gridData: items,
                GroupDescription: $scope.userGroups.GroupDescription,
                Inactive: $scope.userGroups.status
            };
            createUsersGroupsService.PostUserGroupPermissions($scope.formdata).then(function (data) {
                $scope.userGroups.GroupId = data.data.Result;
                $scope.alertMessage = new Message(data.data.Code, data.data.Message);
            }, function () {
                $scope.alertMessage = {
                    //title: "Error!",
                    message: response.Message,
                    type: "E"
                };
            });
    };

    $scope.loadUserGrops = function () {
        $scope.UserGroup.permissionDescription = "";
    };


    $scope.FilterPermissionGroupByKeyword = function (type) {
       $scope.alertMessage = "";
        var criteria = '';
        var currentGrid = [];

        $scope.CurrentPermissionCollection = [];
        var originalSelectedItemList = [];
        criteria = $scope.UserGroup.permissionDescription.toLowerCase();
        originalSelectedItemList = $scope.AllPermissionCollection;
        currentGrid = $scope.dgGrid.data();

        angular.forEach(originalSelectedItemList, function (row) {
            angular.forEach(currentGrid, function (row1) {
                if (row.PermissionCode == row1.PermissionCode) {
                    row.IsSelected = row1.IsSelected;
                }
            });
        });

        angular.forEach(originalSelectedItemList, function(row) {

            if (row.PermissionDescription.toLowerCase().indexOf(criteria) > -1) {
                $scope.CurrentPermissionCollection.push(row);
            }
        });
        $scope.dgGrid.data($scope.CurrentPermissionCollection);

    };    


    $scope.CreateUsersGroupFilterReset = function () {
        $scope.UserGroup.permissionDescription = "";
        var iD = -1;
        var uiDs= -1;
        
        $scope.alertMessage = "";
        if ($scope.UserGroup.ModuleName == 0 && $scope.UserGroup.UIReport == 0 && !$scope.UserGroup.permissionDescription) {
            $scope.alertMessage = new Message(3, "Please select / enter search Criteria");
            return;
        }

        if ($scope.userGroups.GroupId) {
            iD = $scope.userGroups.GroupId;
        }
        if ($scope.UserGroup.UIReport) {
            uiDs = $scope.UserGroup.UIReport;
        }

        console.log($scope.UserGroup.ModuleName, uiDs, iD);
        createUsersGroupsService.Search($scope.UserGroup.ModuleName, uiDs, iD).then(function (response) {
       
                if (response.data.Code == MessageTypes.Success) {
                    $scope.alertMessage = "";
                    $scope.dgGrid.data(response.data.Result);
                    $scope.AllPermissionCollection = response.data.Result;


                } else {
                    $scope.alertMessage = new Message(response.data.Code, response.data.Message);
                    $scope.dgGrid.data([]);

                    return;
                }
            }, function (response) {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);
            });    
       
    };
    

    $scope.FilterIterface = function () {

        if (!$scope.UserGroup.ModuleName) {
            return;
        }
     
        createUsersGroupsService.FilterIterfaceByModeule($scope.UserGroup.ModuleName).then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                console.log(response.data.Result);
                $scope.alertMessage = "";
                $scope.UiReportCollections = response.data.Result;
                $scope.CreateUsersGroupFilterReset();

            } else {
                $scope.alertMessage = new Message(response.data.Code, response.data.Message);               
                return;
            }
        }, function (response) {
            $scope.alertMessage = new Message(response.data.Code, response.data.Message);
        });

    };
    

    $scope.$watch("UserGroup.ModuleName", function () {
        $scope.UserGroup.UIReport = 0;
        $scope.selectAll = false;
        //console.log();
        if ($scope.UserGroup.ModuleName) {
            if ($scope.UserGroup.ModuleName == 0) {
               return;
            }
            $scope.FilterIterface();
        }
    });


    $scope.$watch("UserGroup.UIReport", function () {
        $scope.selectAll = false;
        if ($scope.UserGroup.UIReport) {
            if ($scope.UserGroup.UIReport == 0) {
                return;
            }

            $scope.CreateUsersGroupFilterReset();
        }
    });
    

    $scope.FormLoadV1 = function () {
        
        createUsersGroupsService.formLoad(0).success(function (response) {


            if (response.Code == 0) {
                $scope.ModuleCollections = response.Result;

            } else {
                $scope.alertMessage = {
                    //   title: "Error!",
                    message: response.Message,
                    type: "E"
                };
            }
        }).error(function (response) {
            $scope.alertMessage = {
                // title: "Error!",
                message: response.Message,
                type: "E"
            };
        }); var groupId = 0;
        try {
            if (angular.isUndefined($scope.userGroups.GroupId) || $scope.userGroups.GroupId === null) {
                groupId = $scope.userGroups.GroupId;
            }
        } catch (e) {
            groupId = 0;
        }
        createUsersGroupsService.GetPermissionByUserGroupId(groupId).success(function (response) {
            $scope.dgGrid.data(response.Result);
            $scope.AllPermissionCollection = response.Result;
        }).error(function (response) {
            $scope.alertMessage = {
                // title: "Error!",
                message: response.Message,
                type: "E"
            };
        });

        moduleId = 0;
        interfaceId = 0;
    };   


    $scope.FormLoadV1();


    $scope.finderGropID = {
        title: "User Group Finder",
        info: {
            appId: "",
            uiId: "",
            mapId: "CER-USER-GRO",
            modalId: "finderGropID", 
            onLoad: true
        },
        params: [],

        callback: function (data) {
            $scope.disabled = {
                groupId: false
            };

            $scope.userGroups = {
                GroupId: data.selectedItem.GroupCode,
                status: data.selectedItem.Inactive
            };
            $scope.getUserGroupsByGroupCode();
        },
        open: function () {
            //$scope.reset();
            $scope.disabled = {
                GroupID: true
            };
            window._focuse(this.info.modalId);
            this.info.onLoad = true;
            $scope.finderGropID.info.onLoad = false;
            $scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };

    $scope.finderUserGroup = {
        title: "User Group Finder",
        info: {
            appId: "",
            uiId: "",
            mapId: "CER-USER-GRO-002",
            modalId: "finderUserGroup", 
            onLoad: true
        },
        params: [],

        callback: function (data) {
            $scope.userGroups.FromUserGroup = data.selectedItem.GroupCode;
            $scope.userGroups.GroupDescription1 = data.selectedItem.GroupDescription;
            $scope.getPermissionFormUserGroupsByGroupCode();
        },
        open: function () {
            this.info.onLoad = false;
            this.info.onLoad = true;

            $scope.alertMessage = new Message(MessageTypes.Empty, '');

            var objTemp = new Array();

            objTemp.push($scope.userGroups.GroupId);

            this.params = objTemp;
            $("#" + this.info.modalId).modal('show');

        }
    };

}]);