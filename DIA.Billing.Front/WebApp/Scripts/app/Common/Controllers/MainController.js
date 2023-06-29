//

angular.module("DialogBilling").controller('MainController',
    ['$scope', 'Page', 'hotkeys', 'cfpLoadingBar', '$timeout', 'AuthService',
    function ($scope, Page, hotkeys, cfpLoadingBar, $timeout, AuthService) {

        //check login
        $scope.isLoggedIn = function () {
            return AuthService.isAuthenticated();
        };

        //get user info
        $scope.userInfo = function () {
            return AuthService.getProfile();
        };

        //logout
        $scope.logoutUser = function () {
            AuthService.setAuthentication(false);
        };

        //LABEL PROPERTIES
        $scope.label = {
            search : "Finder",
            create : "New"
        };

        //TOGGLE MENU
        $scope.panes = [{ collapsible: true, size: "275px",max:"275px" }, { collapsible: false }];
        var isPanesOpen = true;
        $scope.togglePanal = function(){

            if($(".k-splitbar .k-icon").hasClass("k-collapse-prev")){
                $(".k-splitbar .k-collapse-prev").trigger("click");
            } else {
                $(".k-splitbar .k-expand-prev").trigger("click");
            }

        };

        //Loading Bar
        $scope.start_ = function () {
            cfpLoadingBar.start();
        };
        $scope.complete_ = function () {
            cfpLoadingBar.complete();
        };
        $scope.$on("$locationChangeStart", function (scope, next, current) {
            $scope.start_();
        });
        $scope.$on("$routeChangeSuccess", function (scope, next, current) {
            $scope.complete_();
        });

        //ShortCuts
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'This one goes to 11',
            callback: function (e, hotkey) {
                e.preventDefault();
            }
        });

        //Page Header Title
        $scope.HeadTitle = function () {
            return Page.getHeadTitle();
        };

        //Page Title
        $scope.Title = function () {
            return Page.getTitle();
        };

        //Field validator types
        var ErrorTypes = { Email: 1, Max: 2, Maxlength: 3, Min: 4, Minlength: 5, Number: 6, Pattern: 7, Required: 8, Url: 9 };
        $scope.ErrorTypes = ErrorTypes;

        //Form field validator
        $scope.hasError = function (source, type) {
            if (!source) {
                return false;
            }

            var rtnVal = (source.$pristine === false && source.$dirty === true && source.$invalid === true);

            if (type) {
                var statusObj = false, errorObj = source.$error;

                switch (type) {
                    case ErrorTypes.Email:
                        statusObj = errorObj.email; break;

                    case ErrorTypes.Max:
                        statusObj = errorObj.max; break;

                    case ErrorTypes.Maxlength:
                        statusObj = errorObj.maxlength; break;

                    case ErrorTypes.Min:
                        statusObj = errorObj.min; break;

                    case ErrorTypes.Minlength:
                        statusObj = errorObj.minlength; break;

                    case ErrorTypes.Number:
                        statusObj = errorObj.number; break;

                    case ErrorTypes.Pattern:
                        statusObj = errorObj.pattern; break;

                    case ErrorTypes.Required:
                        statusObj = errorObj.required; break;

                    case ErrorTypes.Url:
                        statusObj = errorObj.url; break;

                    default:
                        statusObj = false; break;
                } rtnVal = rtnVal && statusObj;

            } return rtnVal;
        };

        $scope.showErrors = function (form) {
            if (form && form.$error && form.$error.required) { } else { return; }

            for (var i = 0; i < form.$error.required.length; i++) {
                form.$error.required[i].$pristine = false;
                form.$error.required[i].$dirty = true;
                form.$error.required[i].$invalid = true;
            }
        };

    }]);