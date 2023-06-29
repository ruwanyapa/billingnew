angular.module("UserManagement").controller("ChangePasswordController", ["$scope", "Page", "ChangePasswordService", "AuthService", function ($scope, Page, ChangePasswordService, AuthService) {

    //Set Page Title
    Page.setTitle("Change Password23456");

   
    $scope.user = {};
     
     

    // validate user
    $scope.ValidateUserType = function () {

       
        ChangePasswordService.ValidateUserType().then(function (response) {

            if (response.data.Code == MessageTypes.Success) {
                console.log(response.data.Result);
                if (response.data.Result == 0) {
                    $scope.user.validateUsr = false;
                }
                else {
                    $scope.user.validateUsr = true;
                    $scope.alertMessage = new Message(3, "Domain users are not allowed to changed password through system!!");
                }
            }
           

        }, function (response) {
            $scope.alertMessage = new Message(response.data.Code, response.data.Message);

        });
    };

    // Update Change Password
    $scope.ChangePasswordSubmit = function (isValid)
    {
       
        if (isValid)
        {

            ChangePasswordService.Update($scope.user).then(function (data)
            {
                if (data.data.Code == "0")
                {
                    $scope.alertMessage = {
                        message: data.data.Message,
                        type: "S"
                    };

                    if(AuthService.getProfile().redirectTo){
                        AuthService.setAuthentication(false);
                    }

                } else {
                    $scope.alertMessage = {
                        message: data.data.Message,
                        type: "E"
                    };
                }
            }, function () {
                $scope.alertMessage = {
                    message: data.data.Message,
                    type: "E"
                };
            });

        } else {
            $scope.alertMessage = {
                //title: "Error!",
                message: data.data.Message,
                type: "E"
            };
        }
    };

    //Reset Form
    $scope.ChangePasswordReset = function (formModel) {
        angular.copy({}, formModel);
        $scope.ChangePasswordForm.$setPristine();
        $scope.alertMessage = [];
    };

    $scope.user.validateUsr = true;
    $scope.ValidateUserType();
}]);