/*
Posting Status Modal Directive

*/

angular.module("DialogBilling").directive("postingStatus", [function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            params: "=",
            callback: "&",
            data: "@",
            title: "@"
        },
        templateUrl: "./Views/Common/postingStatus.html",
        controller: ["$scope", "$attrs", function ($scope, $attrs) {

            //Init


            //watch params and initiate directives
            $scope.$watchCollection("params", function (_val) {
              //  if ($scope.params.onLoad) {
                   // init();
               // }
            });

            $scope.$watchCollection("data", function (_val) {
                // console.log("datacollection", _val);

            });

        }]
    }

}]);