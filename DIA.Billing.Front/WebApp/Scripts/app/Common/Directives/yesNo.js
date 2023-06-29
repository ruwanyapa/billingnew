/*
Yes No Confirmation Modal Directive

*/

angular.module("DialogBilling").directive("yesNo", [function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            params: "=",
            callback: "&",
            data: "@",
            title: "@",
            options: "=",
            message:"="
        },
        templateUrl: "./Views/Common/yesNo.html",
        controller: ["$scope", "$attrs", function ($scope, $attrs) {     


            $scope.$watchCollection("options", function (yesNoMessageParams) {
                $scope.options = yesNoMessageParams;
               // console.log(yesNoMessageParams.numericValue);  
            });

            $scope.$watchCollection("message", function (customMessage) {
                $scope.message = customMessage;
               // console.log(customMessage.Message);
            });
         
            $scope.objYesNo = [];
       
            $scope.finalCallBack = function (objYesNo) {
                var response = $scope.callback();
              //  console.log(response, 'in call back');   
                response({ "YesNoResponse": objYesNo, "Id": $scope.options.Id });
              
            };

            }]
    }

}]);