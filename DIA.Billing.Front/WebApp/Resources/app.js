
////App Start
//angular.module("Sliit-DDES",[
//        "ngRoute",
//        "ngSanitize",
//        "ngCookies",
//        "ngAnimate",

//    //HELPERS
//        "kendo.directives",
//        "angular-loading-bar",

//    //APP
//        "UserManagement",
//        "Products",
    
//        "KpiManagement",

//    // Short Cut Handler
//        "cfp.hotkeys"
//        //"textAngular"
//    ]);

    

////Route Provider
//angular.module("Sliit-DDES").config(["$routeProvider", "$httpProvider", '$compileProvider', function ($routeProvider, $httpProvider, $compileProvider) {

//    //Route Navigation
//    $routeProvider
//        .when("/", {
//            templateUrl: "/dashboard"
//            //controller: "DashboardController"
//        })
//        .when("/dashboard", {
//            templateUrl: "./Views/Common/dashboard.html"
//            //controller: "DashboardController"
//        })
//        .when("/error/page-not-found", {
//            templateUrl: "./Views/Error/404.html",
//            controller: "ErrorController"
//        })
//        .when("/error/no-permission", {
//            templateUrl: "./Views/Error/no-permission.html",
//            controller: "ErrorController"
//        });
//        //.otherwise({ redirectTo: "/" });

//    //host confic
//    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

//}]);

////Run
//angular.module("Sliit-DDES").run(['$rootScope', 'AuthService', '$location', '$cookieStore', function($rootScope, AuthService, $location, $cookieStore){

//    // Everytime the route in our app changes check auth status
//    $rootScope.$on("$routeChangeStart", function(event, next, current) {

//        var permisionCodes = AuthService.getProfile();

//        // Check login & access permission
//        if (next.permissionCode && permisionCodes){

//            if (permisionCodes.permission.indexOf(next.permissionCode) < 0) {
//                $location.path('/error/no-permission');
//            }

//        } else {

//            var custompaths_ = ["/","/dashboard","/error/no-permission","/error/page-not-found"];

//            if(custompaths_.indexOf($location.$$path) < 0){
//                AuthService.setAuthentication(false);
//            }
//        }
//    });

//}]);





//angular.module("Sliit-DDES").config(["$provide", "$httpProvider", function ($provide, $httpProvider) {

//    // Intercept http calls.
//    var MyHttpInterceptor = ["$q", "$cookieStore", function ($q, $cookieStore) {
//        return {
//            // On request success
//            request: function (config) {
               
//                //Set Token to header
                
//                if (config.headers['Content-Type'] == "FILEUPLOAD") {
//                    config.headers = {
//                        'Auth-Token': $cookieStore.get('token') || "NULL",
//                        'Accept': "*/*",
//                        'Content-Type': undefined
//                    };
//                } else {
//                    config.headers = {
//                        'Auth-Token': $cookieStore.get('token') || "NULL",
//                        'Accept': "application/json, text/plain, */*",
//                        'Content-Type': "application/json;charset=utf-8"
//                    };
//                }

//                // Return the config or wrap it in a promise if blank.
//                return config || $q.when(config);
//            },

//            // On request failure
//            requestError: function (rejection) {
              
//                // Return the promise rejection.
//                return $q.reject(rejection);
//            },

//            // On response success
//            response: function (response) {
             
//                // Return the response or promise.
//                return response || $q.when(response);
//            },

//            // On response failture
//            responseError: function (rejection) {
                           
//                if (rejection.status === 401) {
//                    $cookieStore.remove("profile");
//                    $cookieStore.remove("token");
//                }
                                            
//                // Return the promise rejection.
//                return $q.reject(rejection);
//            }
//        };
//    }];

//    // Add the interceptor to the $httpProvider.
//    $httpProvider.interceptors.push(MyHttpInterceptor);

//}]);


//angular.module("Sliit-DDES").service('AuthService', ['$cookieStore', '$location', function($cookieStore, $location){

//    var _profile = "profile",
//        _token   = "token";

//    var userIsAuthenticated = ($cookieStore.get(_profile) && $cookieStore.get(_token)) ? true : false;

//   this.setAuthentication = function (value){

//        if(value === true){
//            userIsAuthenticated = true;
//        } else {
//            //remove cookies
//            $cookieStore.remove(_profile);
//            $cookieStore.remove(_token);
//            userIsAuthenticated = false;

//            //userIsAuthenticated;
//        }
        
//        $location.path('/');

//    };

//    //check authentication
//    this.isAuthenticated = function(){
//        var _return = (($cookieStore.get(_profile) && $cookieStore.get(_token)) ? true : false);
//            if(!_return){ window.location = "index.html"; }
//        return _return;
//    };

//    //get user profile
//    this.getProfile = function(){
//        return $cookieStore.get(_profile);
//    };

//    //set user profile & token
//    this.setProfile = function(profile, token){

     
//        $cookieStore.put(_profile, profile);
//        $cookieStore.put(_token, token);

//        this.setAuthentication(true);

//        setTimeout(function(){
//            if(profile.redirectTo){
//                window.location = "app.html"+profile.redirectTo;
//            } else {
//                window.location = "app.html#/dashboard";
//            }
//        },500);

//    };

//    return this;

//}]);


//angular.module("Sliit-DDES").service("Page", [function () {

//    var Title = "Home",
//        Domain = " :: Billing";

//    this.setTitle = function (newTitle) {
//        Title = newTitle;
//    };

//    this.getTitle = function () {
//        return Title;
//    };

//    this.getHeadTitle = function () {
//        return (Title + Domain);
//    };

//    return this;
//}]);



//angular.module("Sliit-DDES").service("FinderService", ["$http", "appConfig", function ($http, appConfig) {

//    return {
//        getFields: function (credentials) {
//            console.log("cred", credentials);
//            return $http.get(appConfig.API_URL + "Finders/GetInterfaceFinders", {params: credentials});
//        },
//        searchQuery: function (credentials) {
//            return $http.post(appConfig.API_URL + "Finders/PostSearchFinderGrid", credentials);
//        }
//    };

//}]);


//angular.module("Sliit-DDES").controller('MainController',
//    ['$scope', 'Page', 'hotkeys', 'cfpLoadingBar', '$timeout', 'AuthService',
//    function ($scope, Page, hotkeys, cfpLoadingBar, $timeout, AuthService) {

//        //check login
//        $scope.isLoggedIn = function () {
//            return AuthService.isAuthenticated();
//        };

//        //get user info
//        $scope.userInfo = function () {
//            return AuthService.getProfile();
//        };

//        console.log($scope.userInfo());

//        //logout
//        $scope.logoutUser = function () {
//            AuthService.setAuthentication(false);
//        };

//        //LABEL PROPERTIES
//        $scope.label = {
//            search : "Finder",
//            create : "New"
//        };

//        //TOGGLE MENU
//        $scope.panes = [{ collapsible: true, size: "275px",max:"275px" }, { collapsible: false }];
//        var isPanesOpen = true;
//        $scope.togglePanal = function(){

//            if($(".k-splitbar .k-icon").hasClass("k-collapse-prev")){
//                $(".k-splitbar .k-collapse-prev").trigger("click");
//            } else {
//                $(".k-splitbar .k-expand-prev").trigger("click");
//            }

//        };


//        //Loading Bar
//        $scope.start_ = function () {
//            cfpLoadingBar.start();
//        };
//        $scope.complete_ = function () {
//            cfpLoadingBar.complete();
//        };
//        $scope.$on("$locationChangeStart", function (scope, next, current) {
//            $scope.start_();
//        });
//        $scope.$on("$routeChangeSuccess", function (scope, next, current) {
//            $scope.complete_();
//        });

//        //ShortCuts
//        hotkeys.add({
//            combo: 'ctrl+s',
//            description: 'This one goes to 11',
//            callback: function (e, hotkey) {
//               e.preventDefault();
//            }
//        });

//        //Page Header Title
//        $scope.HeadTitle = function () {
//            return Page.getHeadTitle();
//        };

//        //Page Title
//        $scope.Title = function () {
//            return Page.getTitle();
//        };

//        //Field validator types
//        var ErrorTypes = { Email: 1, Max: 2, Maxlength: 3, Min: 4, Minlength: 5, Number: 6, Pattern: 7, Required: 8, Url: 9 };
//        $scope.ErrorTypes = ErrorTypes;

//        //Form field validator
//        $scope.hasError = function (source, type) {
//            var rtnVal = (source.$pristine === false && source.$dirty === true && source.$invalid === true);

//            if (type) {
//                var statusObj = false, errorObj = source.$error;

//                switch (type) {
//                    case ErrorTypes.Email:
//                        statusObj = errorObj.email; break;

//                    case ErrorTypes.Max:
//                        statusObj = errorObj.max; break;

//                    case ErrorTypes.Maxlength:
//                        statusObj = errorObj.maxlength; break;

//                    case ErrorTypes.Min:
//                        statusObj = errorObj.min; break;

//                    case ErrorTypes.Minlength:
//                        statusObj = errorObj.minlength; break;

//                    case ErrorTypes.Number:
//                        statusObj = errorObj.number; break;

//                    case ErrorTypes.Pattern:
//                        statusObj = errorObj.pattern; break;

//                    case ErrorTypes.Required:
//                        statusObj = errorObj.required; break;

//                    case ErrorTypes.Url:
//                        statusObj = errorObj.url; break;

//                    default:
//                        statusObj = false; break;
//                } rtnVal = rtnVal && statusObj;

//            } return rtnVal;
//        };

//        $scope.showErrors = function (form) {
//            if (form && form.$error && form.$error.required) { } else { return; }

//            for (var i = 0; i < form.$error.required.length; i++) {
//                form.$error.required[i].$pristine = false;
//                form.$error.required[i].$dirty = true;
//                form.$error.required[i].$invalid = true;
//            }
//        };

      
//angular.module("Sliit-DDES").controller('ErrorController',['$scope', function ($scope) {


//}]);

////

//angular.module("Sliit-DDES").controller("LoginController", ["$scope", "LoginService", "AuthService", "$location", "appConfig", function ($scope, LoginService, AuthService, $location, appConfig) {

       
//    $scope.checkedDomainUserDetails = false;    //false: domain user not checked yet
//    var domainUserName = null;
//    $scope.needDomainUser = true;                //false: need to enter username
//    $scope.needDomainPassword = true;           //true : need to enter password

//    $scope.user = {
//        UserId : "",
//        Password : ""
         
//    };

//    AuthService.setAuthentication(false);

//    function getDomainUser() {

//        if ($location.hash()) {
//            checkDomainUser($location.hash());
//        }
//        else
//        {
//            window.location.href = appConfig.DOMAIN_URL;
//        }
            
//    } getDomainUser();

//    //Check Domain user
//    function checkDomainUser(DomainUser) {
            

//        if(DomainUser){
//            LoginService.checkDomainUser(DomainUser).then(function(response){

//                console.log(response.data.Result.userName);

//                if(response.data.Code=="0"){
//                    $scope.needDomainUser = false;
//                    $scope.needDomainPassword = response.data.Result.passWordRec;
//                    $scope.user.UserId = response.data.Result.userName;
//                    domainUserName = response.data.Result.userName;
//                    $scope.user.Password = response.data.Result.passWordRec ? "" : response.data.Result.userName; //just for validation
//                    $scope.checkedDomainUserDetails = true;
                       
//                } else {
//                    enableDefaultLogin();
//                }
//            }, function(){
//                enableDefaultLogin();
//            });
//        } else {
//            enableDefaultLogin();
//        }

//    }

//    //this function will enable the default login form
//    function enableDefaultLogin(){
//        $scope.checkedDomainUserDetails = true;
//        $scope.needDomainUser = true;
//        $scope.needDomainPassword = true;
//    }

    


//    angular.module("Sliit-DDES").controller('LogoutController',['$scope', 'AuthService', function ($scope, AuthService) {

//        //AuthService.setAuthentication(false);


//    }]);

//    //

//    angular.module("Sliit-DDES").controller("DashboardController", ["$scope", "LoginService", "AuthService", function ($scope, LoginService, AuthService) {


//    }]);


//    //

//    angular.module("Sliit-DDES").directive('rowSelector', [function () {
//        return {
//            restrict: 'A',
//            scope: true,
//            controller: function ($scope) {

//                $scope.toggleSelectAll = function (ev) {
//                    var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
//                    var items = grid.dataSource.data();
//                    items.forEach(function (item) {
//                        item.IsSelected = ev.target.checked;
//                    });
//                };
//            },
//            link: function ($scope, $element, $attrs) {
//                var options = angular.extend({}, $scope.$eval($attrs.kOptions));

//                options.columns.unshift({
//                    template: "<input type='checkbox' ng-model='dataItem.IsSelected' />",
//                    title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
//                    width: 50
//                });
//            }
//        };


//    }]);

//    angular.module("Sliit-DDES").directive("navigation", [function () {

//        return {
//            restrict: 'E',
//            replace: true,
//            scope: true,
//            templateUrl: './Views/Common/navigation.html',
//            controller: ["$scope", "AuthService", "$location", function ($scope, AuthService, $location) {

//                $scope.locationPath = "#" + $location.path();

//                var _base;
//                $scope.pathCheck = function(base,path){
//                    if($scope.locationPath==(base+path)){
//                        _base = base;
//                        return true;
//                    } else if(_base==base){
//                        return true;
//                    } else {
//                        return false;
//                    }
//                };

//                function InitNav(){

//                    if($scope.permission_){
//                        //--> Main Nav
//                        $scope.navigation = [
                                                
//                           {
//                               "label": "User Management",
//                               "base" : "#/UserManagement/",
//                               "icon": "icon_profile",
//                               "selected": false,
//                               "menu": [
//                                   { "text": "Create User", "path": "CreateUsers", "permission" : "1002" },
//                                   { "text": "Change Password", "path": "ChangePassword", "permission" : "1003" },
//                                   { "text": "Reset Password", "path": "ResetPassword", "permission" : "1004" },
//                                   { "text": "Create Users Groups", "path": "CreateUsersGroups", "permission" : "1005" },
//                               ]
//                           }

//                        ];
//                        //<-- Main Nav
//                    }

//                }

//                $scope.checkPermission = function(code){
//                    return ($scope.permission_.indexOf(code) >= 0) ? true : false;
//                };

//                if(AuthService.getProfile())
//                    $scope.permission_ = AuthService.getProfile().permission || '';

//                //Check Permissione Change
//                $scope.$watch('userInfo', function() {
//                    //
//                    if(AuthService.getProfile())
//                        $scope.permission_ = AuthService.getProfile().permission || '';

//                    InitNav();
//                });



//            }]
//        };

//    }]);


//    angular.module("Sliit-DDES").directive("message", function () {
//        return {
//            restrict: 'E',
//            replace: true,
//            scope: {
//                ngModel: "="
//            },
//            template: '<div class="message" ng-if="ngModel" ng-class="{\'W\':\'message-warning\', \'S\':\'message-success\', \'E\':\'message-error\', \'I\':\'message-info\'}[ngModel.type]"><b>{{ngModel.title}}</b> <div ng-bind-html="ngModel.message"></div> <div class="message-close" ng-click="messageClose()">×</div></div>',
//            link: function ($scope, elem, attr) {
//                $scope.messageClose = function () {
//                    $scope.ngModel = "";
//                };
//            }
//        };
//    });

//    var MessageTypes = { Success: 0, Error: 1, Information: 2, Warning: 3, Empty: 4 };

//    var Message = function (code, message, title) {
//        switch (code) {
//            case 0:
//                this.type = 'S'; break;

//            case 1:
//                this.type = 'E'; break;

//            case 2:
//                this.type = 'I'; break;

//            case 3:
//                this.type = 'W'; break;

//            case 4:
//                return [];

//            default:
//                this.type = ''; break;
//        }
//        this.message = message || ''; this.title = title || '';
//    };


//    angular.module("Sliit-DDES").directive("finder", ['FinderService', function (FinderService) {
//        return {
//            restrict: "E",
//            replace: true,
//            scope: {
//                actionToCall: "&action",
//                param: "=param",
//                title: "@"
//            },
//            templateUrl: "./Views/Common/Finder.html",
//            controller: ["$scope", "$attrs", "FinderService", function ($scope, $attrs, FinderService) {

//                var grid_id = $attrs.id + "_Grid";
//                $scope.gridId_ = grid_id;

//                //finder details object
//                $scope.finderDetailsObj = [];
//                if ($attrs.param) {
//                    $scope.$watch("param", function (newParam) {
//                        $scope.finderDetailsObj = newParam;
//                    });
//                }
//                //Row Toggle
//                $scope.rowHidden = true;
//                $scope.rowHide = function (rowID) {
//                    if ($scope.rowHidden) {
//                        return rowID > 0;
//                    } else {
//                        return false;
//                    }
//                };

//                //Finder Dynamic Options List
//                $scope.searchCount = [0, 1, 2, 3, 4];
//                $scope.finder = [];
//                $scope.typesDropDown = [];
//                angular.forEach($scope.searchCount, function (i) {
//                    var selected = (i == "0");
//                    var operator = i == "0" ? "WHERE" : "";
//                    $scope.finder.push({ "Operator": operator, "ColumnName": "", "FieldType": "", "OperatorType": "", "KeyValue": "", "KeyValue2": "", "Boolean": true, "selected": selected });
//                });

//                //String Type
//                $scope.types = [
//                    { "type_name": "Contains", "type": "String" },
//                    { "type_name": "Starts With", "type": "String" },
//                    { "type_name": "Ends With", "type": "String" },
//                    { "type_name": "Before", "type": "DateTime" },
//                    { "type_name": "After", "type": "DateTime" },
//                    { "type_name": "Between", "type": "DateTime" },
//                    { "type_name": "Equals", "type": "Boolean" },
//                    { "type_name": "Not Equals", "type": "Boolean" },
//                    { "type_name": "Not Equals", "type": "Number" },
//                    { "type_name": "=", "type": "Number" },
//                    { "type_name": ">", "type": "Number" },
//                    { "type_name": "<", "type": "Number" },
//                    { "type_name": "Between", "type": "Number" }
//                ];

//                //String Type == Boolean value
//                $scope.prop = {
//                    "type": "select",
//                    "name": "Service",
//                    "value": "true",
//                    "values": ["", "true", "false"]
//                };

//                //Select & set search option based on string types.
//                $scope.setSearchOptions = function (e) {
//                    $scope.finder[e].KeyValue = "";
//                    angular.forEach($scope.finderFields, function (field) {
//                        if (field.FieldName == $scope.finder[e].ColumnName) {

//                            //Set Types Drop down
//                            var typesDropDown = [];
//                            angular.forEach($scope.types, function (type) {
//                                if (type.type == field.FieldType) {
//                                    typesDropDown.push(type);
//                                }
//                            });
//                            $scope.typesDropDown[e] = typesDropDown;

//                            //Set Field Type
//                            $scope.finder[e].FieldType = field.FieldType;
//                        }
//                    });
//                };

//                //Operators
//                $scope.operator = [
//                    { value: "AND", text: "And" },
//                    { value: "OR", text: "Or" }
//                ];

//                //Load Data on first time
//                FinderService.getFields({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "param": $scope.finderDetailsObj })
//                    .then(function (response) {

//                        if (!response.data.Result) {
//                            return;
//                        }
//                        //set data to grid
//                        var finderScriptFields_ = response.data.Result.finder.finderScriptFields || "";
//                        $scope.finderFields = finderScriptFields_;

//                        // -> GRID
//                        //make columns
//                        var columns_ = [];
//                        angular.forEach(finderScriptFields_, function (data) {
//                            columns_.push({ field: data.FieldName, title: data.FieldHeaderText, width: '150px' });
//                        });

//                        //default grid data
//                        $("#" + grid_id).kendoGrid({
//                            dataSource: {
//                                data: response.data.Result.finder.finderDataGrid.Table,
//                                pageSize: 10
//                            },
//                            sortable: true,
//                            selectable: "multiple row",
//                            pageable: {
//                                refresh: true,
//                                pageSizes: 8,
//                                buttonCount: 8
//                            },
//                            columns: columns_
//                        });

//                    }, function () {
//                    });


//                //GET GRID DATA on SEARCH
//                $scope.finderForm = function () {

//                    $scope.successData = [];
//                    angular.forEach($scope.finder, function (data) {
//                        if (data.selected) { $scope.successData.push(data); }
//                    });

//                    FinderService.searchQuery({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "searchClause": $scope.successData, "param": $scope.finderDetailsObj })
//                        .then(function (response) {

//                            var grid = $("#" + grid_id).data("kendoGrid");
//                            grid.dataSource.data(response.data.Result.finder.finderDataGrid.Table);

//                        }, function () {
//                        });

//                };

//                //UPDATE FIND FIELD
//                $scope.updateModel = function (val) {

//                    var grid = $("#" + grid_id).data("kendoGrid");
//                    var selectedItem = grid.dataItem(grid.select());

//                    if (selectedItem) {
//                        var func = $scope.actionToCall();
//                        func({ "appId": $attrs.appId, "uiId": $attrs.uiId, "mapId": $attrs.mapId, "selectedItem": selectedItem });
//                    } else {
//                    }

//                };

//            }]
//        };
//    }]);
//    angular.module("Sliit-DDES")

//        .directive("modal",[function (){
//            return {
//                restrict : "E",
//                replace : true,
//                transclude: true,
//                template : '<div class="modal fade" tabindex="-1" role="Sliit-DDES" aria-hidden="true"><div class="modal-Sliit-DDES"><div class="modal-content" ng-transclude></div></div></div>'
//            }
//        }])

//        .directive("modalTitle",[function (){
//            return {
//                restrict : "E",
//                replace : true,
//                transclude: true,
//                template : '<div class="modal-header">' +
//                                '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
//                                '<h4 class="modal-title" id="myModalLabel" ng-transclude></h4>' +
//                           '</div>'
//            }
//        }])

//        .directive("modalBody",[function (){
//            return {
//                restrict : "E",
//                replace : true,
//                transclude: true,
//                template : '<div class="modal-body" ng-transclude></div>'
//            }
//        }])

//        .directive("modalFooter",[function (){
//            return {
//                restrict : "E",
//                replace : true,
//                transclude: true,
//                template : '<div class="modal-footer" ng-transclude></div>'
//            }
//        }]);


//    angular.module("Sliit-DDES").directive('fileModel', ['$parse', function($parse) {
//        return {
//            restrict: 'A',
//            link: function(scope, element, attrs) {
//                var model = $parse(attrs.fileModel);
//                var modelSetter = model.assign;

//                element.bind('change', function () {

//                    scope.$apply(function (e) {
//                        modelSetter(scope, element[0].files[0]);

//                    });
//                });
//            }
//        };
//    }]);


//    angular.module("Sliit-DDES").directive('tooltip', function(){
//        return {
//            restrict: 'A',
//            link: function(scope, element, attrs){
//                $(element).hover(function(){
//                    // on mouseenter
//                    $(element).tooltip('show');
//                }, function(){
//                    // on mouseleave
//                    $(element).tooltip('hide');
//                });
//            }
//        };
//    });
//    /*
    
//    /*
//    *   USER MANAGEMENT APP
//    */

//    //

//    angular.module("UserManagement", []);

//    //User Management App Route Config
//    angular.module("UserManagement").config(["$routeProvider", function ($routeProvider) {

//        var _basepath = "./Views/UserManagement/";

//        //Route Navigation
//        $routeProvider
//            .when("/UserManagement", {
//                templateUrl: _basepath + "Index.html",
//                controller: "IndexController",
//                permissionCode: "1001"
//            })
//            .when("/UserManagement/CreateUsers", {
//                templateUrl: _basepath + "CreateUsers.html",
//                controller: "CreateUsersController",
//                permissionCode: "1002"
//            })
//            .when("/UserManagement/ChangePassword", {
//                templateUrl: _basepath + "ChangePassword.html",
//                controller: "ChangePasswordController",
//                permissionCode: "1003"
//            })
//            .when("/UserManagement/ResetPassword", {
//                templateUrl: _basepath + "ResetPassword.html",
//                controller: "ResetPasswordController",
//                permissionCode: "1004"
//            })
//            .when("/UserManagement/CreateUsersGroups", {
//                templateUrl: _basepath + "CreateUsersGroups.html",
//                controller: "CreateUsersGroupsController",
//                permissionCode: "1005"
//            });



//        angular.module("UserManagement").service("ChangePasswordService", ["$http", "appConfig", function ($http, appConfig) {
//            return {

//                //Update User
//                Update: function (credentials) {
//                    return $http.post(appConfig.API_URL + "Users/ChangePassword", credentials);
//                }
//            };

//        }]);
//        angular.module("UserManagement").controller("ChangePasswordController", ["$scope", "Page", "ChangePasswordService", "AuthService", function ($scope, Page, ChangePasswordService, AuthService) {

//            //Set Page Title
//            Page.setTitle("Change Password");



//            // Update Change Password
//            $scope.ChangePasswordSubmit = function (isValid)
//            {
       
//                if (isValid)
//                {

//                    ChangePasswordService.Update($scope.user).then(function (data)
//                    {
//                        if (data.data.Code == "0")
//                        {
//                            $scope.alertMessage = {
//                                message: data.data.Message,
//                                type: "S"
//                            };

//                            if(AuthService.getProfile().redirectTo){
//                                AuthService.setAuthentication(false);
//                            }

//                        } else {
//                            $scope.alertMessage = {
//                                message: data.data.Message,
//                                type: "E"
//                            };
//                        }
//                    }, function () {
//                        $scope.alertMessage = {
//                            message: data.data.Message,
//                            type: "E"
//                        };
//                    });

//                } else {
//                    $scope.alertMessage = {
//                        //title: "Error!",
//                        message: data.data.Message,
//                        type: "E"
//                    };
//                }
//            };

//            //Reset Form
//            $scope.ChangePasswordReset = function (formModel) {
//                angular.copy({}, formModel);
//                $scope.ChangePasswordForm.$setPristine();
//                $scope.alertMessage = [];
//            };
//        }]);
//        //

//        angular.module("UserManagement").service("CreateUsersService", ["$http", "appConfig", function ($http, appConfig)
//        {

//            return {

//                //Save User
//                Create: function (credentials)
//                {
//                    return $http.post(appConfig.API_URL + "Users/PostUser", credentials);
//                },
//                //Update User
//                Update: function (credentials)
//                {
//                    return $http.post(appConfig.API_URL + "Users/PostUpdateUser", credentials);
//                },
//                //Delete User
//                Remove: function (credentials)
//                {
//                    return $http.delete(appConfig.API_URL + "Users/CreateUsers", { params: { userId: credentials.userId } });
//                },
//                //Get User
//                getUser: function (userId, AccountType)
//                {
//                    return $http.get(appConfig.API_URL + "Users/GetUser/" + userId + "/" + AccountType); 
//                },
      
//                //Get Validate Massage ... Chech Valid User and Password
//                Create1: function (UserPassword, UserID)
//                {
//                    return $http.get(appConfig.API_URL + "Users/ValidUsedIdAndPassword/" + UserPassword + "/" + UserID);
//                },

//                getDomainUser: function (userId) {
//                    return $http.get(appConfig.API_URL + "Users/GetDomainUser/" + userId);
            
//                }

        
//            };

//        }]);
//        //

//        angular.module("UserManagement").controller("CreateUsersController", ["$scope", "Page", "CreateUsersService", function ($scope, Page, CreateUsersService) {

//            //Set Page Title
//            Page.setTitle("Create User");
//            $scope.userSP = [];

//            $scope.user = [];
//            $scope.user.accountTypeOption = "Single Sign On";
//            function init(arg) {
        
//                EnableControl();
//            }
//            init("");

//            $scope.isUpdateUser = false;
    


//            //FINDER controler (pop up) 1st finder "UserId"
//            $scope.finderUserID = function(response) {
//                getUserDetails(response.selectedItem.UserId, response.selectedItem.AccountType);
//            };

//            $scope.changeUser = function (userId, AccountType) {
//                getUserDetails(userId, AccountType);
//            };

  
//            var getUserDetails = function (userId, AccountType) {


//                CreateUsersService.getUser(userId, AccountType).then(function (result) {

          

//                    if (result.data.Code == 0) {
                
//                        if (result.data.Result.userInfor.isNewUser === true && result.data.Result.userInfor.isDomainUser === false) {
//                            $scope.isUpdateUser = false;
//                            $scope.clearAllWhenNoRes();
//                            return;
//                        }


//                        if (result.data.Result.userInfor.isDomainUser === true) {
//                            $scope.isUpdateUser = false;

                    

//                            $scope.user = {


//                                UserFullName: result.data.Result.userInfor.UserFullName,
//                                AccountType: result.data.Result.userInfor.AccountType,
//                                UserId: result.data.Result.userInfor.UserId,
//                                email: result.data.Result.userInfor.Email,
//                                MobileNo: result.data.Result.userInfor.Mobile
//                            }
//                        }
//                        else {
//                            if (result.data.Result != null) {
//                                $scope.isUpdateUser = true;
//                                $scope.user = {
//                                    AccountType: result.data.Result.userInfor.AccountType,
//                                    accountTypeOption: result.data.Result.userInfor.AccountTypeOption,
//                                    UserId: result.data.Result.userInfor.UserId,
//                                    UserFullName: result.data.Result.userInfor.UserFullName,
//                                    Inactive: result.data.Result.userInfor.Inactive,
//                                    email: result.data.Result.userInfor.Email,
//                                    MobileNo: result.data.Result.userInfor.Mobile,
//                                    IsPwChangeNextLogin: result.data.Result.userInfor.NextLogin,
//                                    IsSysPwEmail: result.data.Result.userInfor.SystemPwd,
//                                    password: result.data.Result.userInfor.Password
//                                };
                       
//                            } else {
//                                $scope.clearAll();
//                            }
//                        }
//                        if (result.data.Result.userInfor.isDomainUser != true) {
//                            DisableControl();
//                        }
//                        $scope.checkAccountTypeTicketSys();
//                    }

//                    else {
//                        $scope.alertMessage = new Message(result.data.Code, result.data.Message);
//                    }

            
//                }, function () {
//                });
//            };

//            function EnableControl() {
//                $scope.IsNxtLogin = false;
//                $scope.IsSystemPwd = false;
//                $scope.isPassword = false;
//            }
    
//            function DisableControl() {
//                $scope.IsNxtLogin = true;
//                $scope.IsSystemPwd = true ;
//                $scope.isPassword = true;
//            }

   
//            $scope.clearAllWhenNoRes = function () {

//                $scope.user.UserFullName = "";
//                $scope.user.Inactive = false;
//                $scope.user.email = "";
//                $scope.user.MobileNo = "";
//                $scope.user.IsPwChangeNextLogin = "";
//                $scope.user.IsSysPwEmail = "";
//                $scope.user.password = "";
       
        
//                $scope.isUpdateUser = false;
//                EnableControl();
//                $scope.alertMessage = new Message(MessageTypes.Empty);
//                $scope.user.accountTypeOption = "Single Sign On";
//            };

//            $scope.clearAll = function () {
//                $scope.user = {
//                    AccountType: false,
//                    accountTypeOption: "",
//                    UserId: "",
//                    UserFullName: "",
//                    Inactive: false,
//                    email: "",
//                    MobileNo: "",
//                    IsPwChangeNextLogin: "",
//                    IsSysPwEmail: "",
//                    password: ""
//                };
       
//                $scope.isUpdateUser = false;
//                EnableControl();
       
//                $scope.alertMessage = new Message(MessageTypes.Empty);
//                $scope.CreateUserForm.$setPristine();
//                $scope.user.accountTypeOption = "Single Sign On";
//            };

//            //Create User
//            $scope.createUser = function (form)
//            {
//                if (form.$valid) {
//                    var objUser = {                
//                        AccountType: $scope.user.AccountType,
//                        accountTypeOption: $scope.user.accountTypeOption,
//                        UserId: $scope.user.UserId,
//                        UserFullName: $scope.user.UserFullName,
//                        Inactive: $scope.user.Inactive,
//                        email: $scope.user.email,
//                        MobileNo: $scope.user.MobileNo,
//                        IsPwChangeNextLogin: $scope.user.IsPwChangeNextLogin,
//                        IsSysPwEmail: $scope.user.IsSysPwEmail,
//                        Password: $scope.user.password,
               
                
//                    };
//                    if ($scope.isUpdateUser==false) {
//                        CreateUsersService.Create(objUser).then(function (result) {
//                            $scope.alertMessage = new Message(result.data.Code, result.data.Message);
//                            $scope.user.password = "DEFAULT";
//                            $scope.getUser();
//                            // $scope.clearAll();
//                        }, function (result) {
//                            $scope.alertMessage = new Message(result.data.Code, result.data.Message);
//                        });
//                    } else {
//                        CreateUsersService.Update(objUser).then(function (result) {
//                            DisableControl();
//                            $scope.alertMessage = new Message(result.data.Code, result.data.Message);
//                            $scope.user.password = "DEFAULT";
//                        }, function (result) {
//                            $scope.alertMessage = new Message(result.data.Code, result.data.Message);
//                        });
//                    }
//                }
//                else {
//                    $scope.showErrors(form);
//                }
//            };

//            //Delete User 
//            $scope.deleteUser = function (isValid) {
//                if (isValid) {
//                    CreateUsersService.Remove($scope.user).then(function (result) {
//                        $scope.successMessage = 'User deleted Successfully.';
//                    },function (result) {
//                        $scope.ErrorMessage = 'User remove error.';
//                    });
//                }
//                else {
//                    $scope.ErrorMessage = 'User remove error.';
//                }
//            };

//            //Get User 
//            $scope.getUser = function (isValid) {
//                if (isValid) {
//                    CreateUsersService.read($scope.user,$scope.AccType).then(function (result){
//                    },function (result){
//                        $scope.ErrorMessage = 'User getting error.';
//                    });
//                }
//                else{
//                    $scope.ErrorMessage = 'User getting error.';
//                }
//            };

//            //Reset Form
//            $scope.CreateUserReset = function (formModel) {
//                angular.copy({}, formModel);
//                $scope.CreateUserForm.$setPristine();
//                $scope.user.accountTypeOption = "Single Sign On";
//                $scope.alertMessage = new Message(MessageTypes.Empty);
//            };

//            //Check UID
//            $scope.isAccountTypeTicketSys = true;
//            $scope.checkAccountTypeTicketSys = function () {
        
//                $scope.isAccountTypeTicketSys = $scope.user.AccountType != 1;
//                $scope.user.accountTypeOption = "Single Sign On";
//            };


//            $scope.CheckDomainUser = function() {
//                if ($scope.user.AccountType == "DOMAIN") {

//                }
//            };

    

//        }]);
//        //

//        angular.module("UserManagement").service("CreateUsersGroupsService", ["$http", "appConfig", function($http, appConfig) {

//            return {
//                formLoad: function (moduleId) {

//                    if (moduleId=="" || moduleId==undefined) {
//                        moduleId = 0;
//                    }
//                    return $http.get(appConfig.API_URL + "PermissionGroups/FormLoad/" + moduleId);
//                },
       
//                //Update User
//                update: function(credentials) {
//                    return $http.post(appConfig.API_URL + "PermissionGroups", credentials);
//                },
//                //Delete User
//                remove: function(credentials) {
//                    return $http.delete(appConfig.API_URL + "PermissionGroups", { params: { userId: credentials.userId } });
//                },

//                loadGroupsByModuleId: function(credentials) {
//                    return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByModuleId/" + credentials);
//                },

//                loadGroupsByInterfaceId: function (interfaceCode,groupCode) {
//                    return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByInterfaceId/" + interfaceCode + "/" + groupCode);
//                },

//                GetUserGroups: function(interfaceCode) {
//                    return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByInterfaceId/" + interfaceCode);
//                },

//                PostUserGroupPermissions: function(credentials) {
//                    return $http.post(appConfig.API_URL + "Permissions/PostUserGroupPermission", credentials);
//                },

//                getPermissionGroupsByGroupCode: function (credentials) {
//                    return $http.get(appConfig.API_URL + "PermissionGroups/GetPermissionGroupsByGroupCode/"+ credentials);
//                },

//                getSystemModulesByUserGroupId: function (groupId) {
//                    return $http.get(appConfig.API_URL + "Permissions/GetSystemModulesByUserGroupId/" + groupId);
//                },

//                GetPermissionByUserGroupId: function (userGroupId) {

//                    if (userGroupId == "" || userGroupId == undefined) {
//                        userGroupId = 0;
//                    }
//                    return $http.get(appConfig.API_URL + "PermissionGroups/GetPermissionByUserGroupId/" + userGroupId);
//                },

//                GetSelectedPermissionsByUserGroupId: function (userGroupId, moduleId, interfaceId, permissionDescription) {

//                    if (userGroupId == "" || userGroupId == undefined) {
//                        userGroupId = 0;
//                    }
//                    return $http.get(appConfig.API_URL + "PermissionGroups/GetSelectedPermissionsByUserGroupId/" + userGroupId + "/" + moduleId + "/" + interfaceId + "/" + permissionDescription);
//                },

//                GetSystemInterfacesByUserId: function () {
//                    return $http.get(appConfig.API_URL + "PermissionGroups/GetSystemInterfacesByUserId");
//                }
       

       
//            };
//        }]);
//        //
//        angular.module("UserManagement").controller("CreateUsersGroupsController", ["$scope", "Page", "CreateUsersGroupsService", function ($scope, Page, createUsersGroupsService) {

//            //Set Page Title
//            Page.setTitle("Create Users Groups");
//            //FINDER controler (pop up) 1st finder "GroupId"

//            $scope.userGroups = {};
    
//            $scope.disabled = {
//                GroupDesc: true
//            };
//            $scope.finderGropID = function (response) {

//                $scope.userGroups = {
//                    GroupId: response.selectedItem.GroupCode,
//                    status: response.selectedItem.Inactive
//                };
//                $scope.getUserGroupsByGroupCode();
//            };





//            //FINDER controler (pop up) 2st finder "FromUserGroup"
//            $scope.finderUserGrop = function (response) {
//                $scope.userGroups.FromUserGroup = response.selectedItem.GroupCode;
//                $scope.userGroups.GroupDescription1 = response.selectedItem.GroupDescription;
//                $scope.getPermissionFormUserGroupsByGroupCode();
//            };
//            $scope.Init = function (arg) {
//                $scope.dgGrid.Init(arg);
//            };

//            //##############################        Load data to GRID User Group        ####################################
//            //-> Grid Functionality
//            var config = {};
//            var permissionDescriptiontxt = "";
//            $scope.AllPermissionCollection = [];
//            //Create a datagrid object
//            $scope.dgGrid = new DataGrid();

//            config.pageable = {
//                input: true,
//                numeric: false
//            };

//            config.columns = [
//                {
//                    field: "IsSelected",
//                    headerTemplate: '<input type="checkbox" title="Select all" ng-model="selectAll" ng-click="toggleSelect($event)" />',
//                    template: '<input type="checkbox" ng-model="dataItem.IsSelected" ng-click="selectThis($event)" />',
//                    width: "32px",
//                    sortable: false

//                },
//                {
//                    field: "PermissionCode",
//                    title: "Permission Code"
//                },
//                {
//                    field: "PermissionDescription",
//                    title: "Permission Description"
//                }
//            ];

//            config.dataSource = new kendo.data.DataSource({
//                data: [],
//                schema: {
//                    model: {
//                        id: "SubCatCode",
//                        fields: {
//                            'PermissionCode': { editable: false, type: "string" },
//                            'PermissionDescription': { editable: false, type: "string" }
//                        }
//                    }
//                },
//                pageSize: 8

//            });

//            $scope.dgGrid.options(config);

//            $scope.selectThis = function (e) {
//                $scope.selectedRow = e;
//            };

//            $scope.toggleSelect = function (e, gId) {
//                var dataItems = [];

//                dataItems = $scope.dgGrid.data();

//                for (var i = 0; i < dataItems.length; i++) {
//                    dataItems[i].IsSelected = e.target.checked;
//                } $scope.selectThis();
//            };



//            //Form Load Get Modules
//            $scope.ModuleCollections = [];

//            var sort_by = function (field, reverse, primer) {

//                var key = primer ?
//                    function (x) { return primer(x[field]) } :
//                    function (x) { return x[field] };

//                reverse = [-1, 1][+!!reverse];

//                return function (a, b) {
//                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
//                }
//            };

//            createUsersGroupsService.formLoad(0).success(function (response) {


//                if (response.Code == 0) {
//                    $scope.ModuleCollections = response.Result;

//                } else {
//                    $scope.alertMessage = {
//                        //   title: "Error!",
//                        message: response.Message,
//                        type: "E"
//                    };
//                }
//            }).error(function (response) {
//                $scope.alertMessage = {
//                    // title: "Error!",
//                    message: response.Message,
//                    type: "E"
//                };
//            });

//            //Get All Groups by Module ID

//            var groupId = 0;
//            try {
//                if (angular.isUndefined($scope.userGroups.GroupId) || $scope.userGroups.GroupId === null) {
//                    groupId = $scope.userGroups.GroupId;
//                }
//            } catch (e) {
//                groupId = 0;
//            }
//            createUsersGroupsService.GetPermissionByUserGroupId(groupId).success(function (response) {
//                //var grid = $("[kendo-grid]").data("kendoGrid");
//                //grid.dataSource.data(response.Result);
//                $scope.dgGrid.data(response.Result);
//                $scope.AllPermissionCollection = response.Result;
//            }).error(function (response) {
//                $scope.alertMessage = {
//                    // title: "Error!",
//                    message: response.Message,
//                    type: "E"
//                };
//            });

//            var moduleId = 0;
//            var interfaceId = 0;

//            //Blur in Form group TextBox
//            $scope.getPermissionFormUserGroupsByGroupCode = function () {

//                if (angular.isUndefined($scope.userGroups.FromUserGroup) || $scope.userGroups.FromUserGroup === null) {
//                    $scope.alertMessage = {
//                        // title: "Error!",
//                        message: "User Group Id not found!",
//                        type: "E"
//                    };
//                    return;
//                }
//                if ($scope.userGroups.FromUserGroup != "") {
//                    //Load Permission Data
//                    createUsersGroupsService.getPermissionGroupsByGroupCode($scope.userGroups.FromUserGroup).success(function (response) {
//                        $scope.userGroups.GroupDescription1 = response.Result.GroupDescription;

//                        //Load permission
//                        if (!angular.isUndefined($scope.UserGroup.ModuleName)) {
//                            moduleId = $scope.UserGroup.ModuleName;
//                        }
//                        if (!angular.isUndefined($scope.UserGroup.UIReport)) {
//                            interfaceId = $scope.UserGroup.UIReport;
//                        }
//                        if (!angular.isUndefined($scope.UserGroup.permissionDescription) && $scope.UserGroup.permissionDescription != "") {
//                            permissionDescriptiontxt = $scope.UserGroup.permissionDescription;
//                        } else {
//                            permissionDescriptiontxt = "0";
//                        }

//                        createUsersGroupsService.GetSelectedPermissionsByUserGroupId($scope.userGroups.FromUserGroup, moduleId, interfaceId, permissionDescriptiontxt).success(function (response) {
//                            if (response.Code == 0) {
//                                $scope.dgGrid.data(response.Result);
//                                //var grid = $("[kendo-grid]").data("kendoGrid");
//                                //grid.dataSource.data(response.Result);
//                                $scope.AllPermissionCollection = response.Result;
//                            }
//                            else {
//                                $scope.alertMessage = {
//                                    //  title: "Error!",
//                                    message: response.Message,
//                                    type: "E"
//                                };
//                            }
//                            //Bind to grid


//                        }).error(function (response) {
//                            $scope.alertMessage = {
//                                //  title: "Error!",
//                                message: response.Message,
//                                type: "E"
//                            };
//                        });

//                    }).error(function (response) {
//                        $scope.alertMessage = {
//                            //  title: "Error!",
//                            message: response.Message,
//                            type: "E"
//                        };
//                    });
//                }
//            };

//            //Blur in group TextBox
//            $scope.getUserGroupsByGroupCode = function () {
//                if (!angular.isUndefined($scope.userGroups)) {
//                    if (angular.isUndefined($scope.userGroups.GroupId)) {
                
//                        return;
//                        //$scope.userGroups.GroupId = 0;
//                    } 
//                }
//                if ($scope.userGroups.GroupId != "") {
//                    createUsersGroupsService.getPermissionGroupsByGroupCode($scope.userGroups.GroupId).success(function (response) {
//                        $scope.userGroups.GroupDescription = response.Result.GroupDescription;

//                        //Load permission
//                        if (!angular.isUndefined($scope.UserGroup.ModuleName)) {
//                            moduleId = $scope.UserGroup.ModuleName;
//                        }
//                        if (!angular.isUndefined($scope.UserGroup.UIReport)) {
//                            interfaceId = $scope.UserGroup.UIReport;
//                        }
//                        if (!angular.isUndefined($scope.UserGroup.permissionDescription) && $scope.UserGroup.permissionDescription != "") {
//                            permissionDescriptiontxt = $scope.UserGroup.permissionDescription;
//                        } else {
//                            permissionDescriptiontxt = "0";
//                        }

//                        createUsersGroupsService.GetSelectedPermissionsByUserGroupId($scope.userGroups.GroupId, moduleId, interfaceId, permissionDescriptiontxt).success(function (response) {
//                            //Bind to grid
//                            if (response.Code == 0) {
                       
//                                $scope.aa = [];
//                                $scope.aa = response.Result;
//                                $scope.aa.sort(sort_by('IsSelected', false, ''));
//                                $scope.dgGrid.data($scope.aa);
//                                $scope.AllPermissionCollection = response.Result;
//                            }

//                            else {
//                                $scope.alertMessage = {
//                                    //  title: "Error!",
//                                    message: response.Message,
//                                    type: "E"
//                                };
//                            }
//                        }).error(function (response) {
//                            $scope.alertMessage = {
//                                //   title: "Error!",
//                                message: response.Message,
//                                type: "E"
//                            };
//                        });


//                    }).error(function (response) {
//                        $scope.alertMessage = {
//                            //  title: "Error!",
//                            message: response.Message,
//                            type: "E"
//                        };
//                    });
//                }
//            };
//            //   $scope.UiReportCollections = [];
//            $scope.loadGroupsByModuleId = function () {

       
//                $scope.getUserGroupsByGroupCode();
    
//            };

    
//            createUsersGroupsService.GetSystemInterfacesByUserId().success(function (response) {


//                if (response.Code == 0) {
//                    $scope.UiReportCollections = response.Result;
//                    $scope.alertMessage = new Message(MessageTypes.Empty);
//                } else {
//                    $scope.alertMessage = {
//                        //   title: "Error!",
//                        message: response.Message,
//                        type: "E"
//                    };
//                }
//            }).error(function (response) {
//                $scope.alertMessage = {
//                    //  title: "Error!",
//                    message: response.Message,
//                    type: "E"
//                };
//            });
//            //reset button
//            $scope.reset = function () {
//                $scope.userGroups.GroupId = "";
//                $scope.userGroups.GroupDescription = "";
//                $scope.userGroups.status = "";
//                angular.forEach($scope.AllPermissionCollection, function (row) {
//                    row.IsSelected = false;
//                });
//                $scope.dgGrid.data($scope.AllPermissionCollection);
//                $scope.UserGroup.ModuleName = 0;
//                $scope.UserGroup.UIReport = 0;
//                $scope.UserGroup.permissionDescription = "";
//                $scope.disabled = {
//                    GroupDesc: false
//                };
//                $scope.alertMessage = [];
//            };


//            $scope.resetcopy = function () {
//                //if (isValid == undefined) {

//                $scope.userGroups.FromUserGroup = "";
//                $scope.userGroups.GroupDescription1 = "";
//                $scope.alertMessage = "";
//                // $scope.userGroups.GroupDescription = "";
//                // $scope.userGroups.status = "";
//                //}
//            };





//            //SAVE USER GROUP DATA

//            $scope.createUserGroupFormSubmit = function (isValid) {
//                if (isValid) {
//                    var items = $scope.dgGrid.data();
//                    var gId = 0;
//                    if (angular.isUndefined($scope.userGroups.GroupId)) {
//                        gId = 0;
//                    } else {
//                        gId=$scope.userGroups.GroupId;
//                    }
//                    $scope.formdata = {
//                        GroupCode: gId,
//                        gridData: items,
//                        GroupDescription: $scope.userGroups.GroupDescription,
//                        Inactive: $scope.userGroups.status
//                    };
//                    createUsersGroupsService.PostUserGroupPermissions($scope.formdata).then(function (data) {
//                        $scope.userGroups.GroupId = data.data.Result;
//                        $scope.alertMessage = {
//                            //title: "Success!",
//                            message: "Successfully saved.",
//                            type: "S"
//                        };
//                    }, function () {
//                        $scope.alertMessage = {
//                            //title: "Error!",
//                            message: response.Message,
//                            type: "E"
//                        };
//                    });
//                } else {
//                    $scope.alertMessage = {
//                        //title: "Error!",
//                        message: response.Message,
//                        type: "E"
//                    };
//                }
//            };

//            $scope.loadUserGrops = function () {
//                //if ($scope.UserGroup.UIReport == 0) {
//                $scope.getUserGroupsByGroupCode();
//                //}

     

//            };

//            $scope.CreateUsersGroupFilterReset = function () {
//                //Load permission
//                var gCode = 0;

//                if (!angular.isUndefined($scope.UserGroup.GroupId)) {
//                    gCode = $scope.UserGroup.GroupId;
//                }
//                if (!angular.isUndefined($scope.UserGroup.ModuleName)) {
//                    moduleId = $scope.UserGroup.ModuleName;
//                }
//                if (!angular.isUndefined($scope.UserGroup.UIReport)) {
//                    interfaceId = $scope.UserGroup.UIReport;
//                }
       
//                if (!angular.isUndefined($scope.UserGroup.permissionDescription) && $scope.UserGroup.permissionDescription != "") {
//                    permissionDescriptiontxt = $scope.UserGroup.permissionDescription;
//                } else {
//                    permissionDescriptiontxt = "0";
//                }


//                createUsersGroupsService.GetSelectedPermissionsByUserGroupId(gCode, moduleId, interfaceId, permissionDescriptiontxt).success(function (response) {
//                    //Bind to grid
//                    //=========================================
//                    if (response.Code == 0) {
              
//                        $scope.dgGrid.data(response.Result);
//                        $scope.AllPermissionCollection = response.Result;
//                    }
//                    else {
//                        $scope.alertMessage = {
//                            //  title: "Error!",
//                            message: response.Message,
//                            type: "E"
//                        };
//                    }
//                    //=======================================


//                }).error(function (response) {
//                    $scope.alertMessage = {
//                        // title: "Error!",
//                        message: response.Message,
//                        type: "E"
//                    };
//                });
//            };



//            $scope.FilterPermissionGroupByKeyword = function(type) {
//                var criteria = '';
//                var currentGrid = [];

//                $scope.CurrentPermissionCollection = [];
//                var originalSelectedItemList = [];
//                criteria = $scope.UserGroup.permissionDescription.toLowerCase();
//                originalSelectedItemList = $scope.AllPermissionCollection;
//                currentGrid = $scope.dgGrid.data();

//                angular.forEach(originalSelectedItemList, function (row) {
//                    angular.forEach(currentGrid, function (row1) {
//                        if (row.PermissionCode == row1.PermissionCode) {
//                            row.IsSelected = row1.IsSelected;
//                        }
//                    });
//                });

//                angular.forEach(originalSelectedItemList, function(row) {

//                    if (row.PermissionDescription.toLowerCase().indexOf(criteria) > -1) {
//                        $scope.CurrentPermissionCollection.push(row);
//                    }
//                });
//                $scope.dgGrid.data($scope.CurrentPermissionCollection);

//            };
//        }]);




//        angular.module("UserManagement").service("ResetPasswordService", ["$http", "appConfig", function($http, appConfig) {
//            return {
//                //Save User
//                create: function(credentials) {
//                    return $http.post(appConfig.API_URL + "Users/ResetPassword", credentials);
//                },
//                //Update User
//                update: function(credentials) {
//                    return $http.post(appConfig.API_URL + "Users/ResetPassword", credentials);
//                },
//                //Delete User
//                remove: function(credentials) {
//                    return $http.delete(appConfig.API_URL + "Users/ResetPassword", { params: { userId: "002" } });//credentials.userId
//                },
//                //Get User
//                read: function (credentials) {
//                    return $http.post(appConfig.API_URL + "Users/ResetPassword", { params: { userId: credentials.userId } });
//                },

//                isAvailable: function() {
//                    return !(!$scope.resetPasswordForm.userId || $scope.resetPasswordForm.userId.length === 0);
//                },
//                GetUserNameByuserId: function (userId) {
//                    return $http.get(appConfig.API_URL + "Users/GetUserByUserId/" + userId);
//                }
//            };

//        }]);
//        //

//        angular.module("UserManagement").controller("ResetPasswordController", ["$scope", "Page", "ResetPasswordService", function($scope, Page, ResetPasswordService) {

//            //Set Page Title
//            Page.setTitle("Reset Password");

//            //FINDER controler (pop up) 1st finder "userId"
//            $scope.finderUserID = function (response) {

//                $scope.field = {
//                    userId: response.selectedItem.UserId,
//                    UserFullName: response.selectedItem.UserFullName,
//                    email: response.selectedItem.email
//                };
//                $scope.field.passwordgeneratetype = "SystemPassword";
//            };

//            $scope.pageTitle = "ResetPasswordController";

//            //Save User 
//            $scope.field = {};
//            $scope.field.passwordgeneratetype = "SystemPassword";
//            $scope.resetPasswordSubmit = function (isValid) {
//                if (isValid) {
//                    ResetPasswordService.update($scope.field).then(function (data)
//                    {

              
//                        if (data.data.Code == 0) {
//                            $scope.alertMessage = {
//                                //title: "success saving!",
//                                message: data.data.Message,
//                                type: "S"
//                            };
//                        }
//                        else
//                            $scope.alertMessage = {
//                                //title: "Fail..!",
//                                message: data.data.Message,
//                                type: "E"
//                            };
          
//                    },
//                        function (result) {
//                            $scope.alertMessage = {
//                                // title: "Fail..!",
//                                message: "Password Reset Fail.",
//                                type: "E"
//                            };
                   
//                        }
//                    );

//                } else {
//                    $scope.ErrorMessage = ' permission getting error.';
//                }
//            };

//            $scope.loadUserNameByUserId = function () {

//                if ($scope.field.userId != undefined) {

//                    //Assign Data to Grid
//                    ResetPasswordService.GetUserNameByuserId($scope.field.userId).success(function (response) {

//                        $scope.field.UserFullName = response.Result.UserFullName;
//                        $scope.field.userId = response.Result.UserId;
//                        $scope.field.email = response.Result.email;
                
                
//                    }).error(function (response) {
//                    });

//                }


//            };

//            //Reset Form
//            $scope.ResetPasswordReset = function(formModel) {
//                angular.copy({}, formModel);
//                $scope.resetPasswordForm.$setPristine();
//            };
//        }]);


   
//        config.pageable = {
//            input: true,
//            numeric: false
//        };

//        config.columns = [
//            {
//                field: "IsSelected",
//                headerTemplate: '<input type="checkbox" title="Select all" ng-model="selectAll" ng-click="toggleSelect($event)" ng-disabled="true"/>',
//                template: '<input type="checkbox" ng-model="dataItem.IsSelected" ng-click="selectThis($event)"/>',
//                width: "32px",
//                sortable: false

//            }
//        ];

   

//        //Create a datagrid object
//        $scope.dgGrid = new DataGrid();
//        $scope.dgGrid.options(config);

//        //Init
//        $scope.Init = function (arg) {
//            $scope.dgGrid.Init(arg);
//        };

        
//        //Inite Page State
//        $scope.changePageState("NEW");

//        var pageState = true; //NEW:SEARCH

//    }