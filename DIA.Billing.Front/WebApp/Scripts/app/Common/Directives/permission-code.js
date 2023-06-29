

angular.module("DialogBilling").directive("permissionCode", function () {
    return {
        restrict: 'A',
        scope: {
            permissionCode: "="
        },
        controller: ["$scope", "$element", "AuthService", function ($scope, $element, AuthService) {

            var permissionCodes = AuthService.getProfile().permission;

          //  console.log($scope.permissionCode, permissionCodes, $element[0].innerHTML);


            if (permissionCodes.indexOf($scope.permissionCode) == -1) {
                angular.element($element).remove();
            }

        }]
    };
});