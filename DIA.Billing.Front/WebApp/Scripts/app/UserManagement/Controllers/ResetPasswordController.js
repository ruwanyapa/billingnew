//

angular.module("UserManagement").controller("ResetPasswordController", ["$scope", "Page", "ResetPasswordService", function($scope, Page, ResetPasswordService) {

    //Set Page Title
    Page.setTitle("Reset Password1");

    $scope.user = {};

    //FINDER controler (pop up) 1st finder "userId"
    $scope.finderUserID = function (response) {

        $scope.field = {
            userId: response.selectedItem.UserId,
            UserFullName: response.selectedItem.UserFullName,
            email: response.selectedItem.email
        };
        $scope.field.passwordgeneratetype = "SystemPassword";
    };

    $scope.pageTitle = "ResetPasswordController";

    //Save User 
    $scope.field = {};
    $scope.field.passwordgeneratetype = "SystemPassword";
    $scope.resetPasswordSubmit = function (isValid) {
        if (isValid) {
            if ($scope.field.passwordgeneratetype == "ManualPassword" && (($scope.field.Password == undefined) || $scope.field.Password.replace(/[\s]/g, '').length<1)) {
               
                $scope.alertMessage = {
                    //title: "success saving!",
                    message: "Password can not be empty!",
                    type: "E"
                };
                return;
            }


            ResetPasswordService.update($scope.field).then(function (data)
            {

               if (data.data.Code == 0) {
                    $scope.alertMessage = {
                        //title: "success saving!",
                        message: data.data.Message,
                        type: "S"
                    };
                }
                else
                    $scope.alertMessage = {
                        //title: "Fail..!",
                        message: data.data.Message,
                        type: "E"
                    };
             },
                function (result) {
                    $scope.alertMessage = {
                       // title: "Fail..!",
                        message: "Password Reset Fail.",
                        type: "E"
                    };
                   
                }
            );

        } else {
            $scope.ErrorMessage = 'permission getting error.';
        }
    };

    $scope.loadUserNameByUserId = function () {

        if ($scope.field.userId != undefined) {

            //Assign Data to Grid
            ResetPasswordService.GetUserNameByuserId($scope.field.userId).success(function (response) {

                $scope.field.UserFullName = response.Result.UserFullName;
                $scope.field.userId = response.Result.UserId;
                $scope.field.email = response.Result.email;
                
                
            }).error(function (response) {
            });

        }


    };

    //Reset Form
    $scope.ResetPasswordReset = function(formModel) {
        angular.copy({}, formModel);
        $scope.alertMessage = new Message(MessageTypes.Empty);
        $scope.resetPasswordForm.$setPristine();
    };



    // validate user
    $scope.ValidateUserType = function () {


        ResetPasswordService.ValidateUserType().then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                console.log(response.data.Result);
                if (response.data.Result == 0) {
                    $scope.user.validateUsr = false;
                }
                else {
                    $scope.user.validateUsr = true;
                    $scope.alertMessage = new Message(3, "Domain users are not allowed to changed password through system");
                }
            }


        }, function (response) {
            $scope.alertMessage = new Message(response.data.Code, response.data.Message);

        });
    };

    $scope.user.validateUsr = true;
    $scope.ValidateUserType();
}]);

