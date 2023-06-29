angular.module("UserManagement").controller("CreateUsersController", ["$scope", "Page", "CreateUsersService", function ($scope, Page, CreateUsersService) {

    //Set Page Title
    Page.setTitle("Create Userssd12eer");
    $scope.userSP = [];

    var search = false;

    $scope.user = [];
    function init(arg) {

        EnableControl();
    }
    init("ssss");

    $scope.isUpdateUser = false;
   

    //FINDER controler (pop up) 1st finder "UserId"
    $scope.finderUserID = function (response) {
        console.log(response.selectedItem.UserId, response.selectedItem.AccountType, "fromfinder");
        getUserDetails(response.selectedItem.UserId, response.selectedItem.AccountType);
    };

    $scope.changeUser = function (userId, AccountType) {
        $scope.alertMessage = "";
        getUserDetails(userId, AccountType);
    };


    var getUserDetails = function (userId, AccountType) {
        console.log("getUserDetails", userId, AccountType);
        $scope.alertMessage = "";

        if (!userId) {
            return;
        }

        search = true;

        CreateUsersService.getUser(userId, AccountType).then(function (result) {

            console.log(result);
            if (result.data.Code == 0) {
                console.log(result.data.Result, "result.data.Result");
                if (result.data.Result == null) {
                    console.log("in null");
                    return;
                }

                if (result.data.Result.userInfor.isNewUser === true && result.data.Result.userInfor.isDomainUser === false) {
                    $scope.isUpdateUser = false;
                    $scope.clearAllWhenNoRes();
                    return;
                }


                if (result.data.Result.userInfor.isDomainUser === true) {
                    $scope.isUpdateUser = false;
                    $scope.user.UserFullName = result.data.Result.userInfor.UserFullName;
                    $scope.user.AccountType = result.data.Result.userInfor.AccountType;
                    $scope.user.UserId = result.data.Result.userInfor.UserId;
                    $scope.user.email = result.data.Result.userInfor.Email;
                    $scope.user.MobileNo = result.data.Result.userInfor.Mobile;
                }
                else {
                    if (result.data.Result != null) {
                        
                        $scope.isUpdateUser = true;
                        $scope.user = {
                            AccountType: result.data.Result.userInfor.AccountType,
                            accountTypeOption: result.data.Result.userInfor.AccountTypeOption,
                            UserId: result.data.Result.userInfor.UserId,
                            UserFullName: result.data.Result.userInfor.UserFullName,
                            Inactive: result.data.Result.userInfor.Inactive,
                            email: result.data.Result.userInfor.Email,
                            MobileNo: result.data.Result.userInfor.Mobile,
                            IsPwChangeNextLogin: result.data.Result.userInfor.NextLogin,
                            IsSysPwEmail: result.data.Result.userInfor.SystemPwd,
                            GroupId: result.data.Result.userInfor.GroupId,
                            password: result.data.Result.userInfor.Password
                        };
                        
                    } else {
                        $scope.clearAll();
                    }
                }
                if (result.data.Result.userInfor.isDomainUser != true) {
                    DisableControl();
                }
                $scope.checkAccountTypeTicketSys();
            
            }

            else {
                console.log("result", result.data.Code);
                $scope.alertMessage = new Message(result.data.Code, result.data.Message);
                $scope.user = {
                    UserFullName: "",
                    AccountType: "",
                    UserId: "",
                    email: "",
                    MobileNo: ""
                };
            }


        }, function () {
        });
    };



    function EnableControl() {
        $scope.IsNxtLogin = false;
        $scope.IsSystemPwd = false;
        $scope.isPassword = false;
    }

    function DisableControl() {
        $scope.IsNxtLogin = true;
        $scope.IsSystemPwd = true;
        $scope.isPassword = true;
    }



    $scope.clearAllWhenNoRes = function () {

        $scope.user.UserFullName = "";
        $scope.user.Inactive = false;
        $scope.user.email = "";
        $scope.user.MobileNo = "";
        $scope.user.IsPwChangeNextLogin = "";
        $scope.user.IsSysPwEmail = "";
        $scope.user.password = "";

        $scope.isUpdateUser = false;
        EnableControl();
        $scope.alertMessage = new Message(MessageTypes.Empty);
    };

    $scope.clearAll = function () {
        search = false;
        $scope.user = {
            AccountType: false,
            accountTypeOption: "",
            UserId: "",
            UserFullName: "",
            Inactive: false,
            email: "",
            MobileNo: "",
            IsPwChangeNextLogin: "",
            IsSysPwEmail: "",
            password: ""
        };
  
        $scope.isUpdateUser = false;
        EnableControl();

        $scope.alertMessage = new Message(MessageTypes.Empty);
        $scope.CreateUserForm.$setPristine();
        $scope.user.accountTypeOption = "Single Sign On";
    };

    //Create User
    $scope.createUser = function (form) {
        $scope.alertMessage = "";
        if (form.$valid) {

            var objUser = {
                AccountType: $scope.user.AccountType,
                accountTypeOption: $scope.user.accountTypeOption,
                UserId: $scope.user.UserId,
                UserFullName: $scope.user.UserFullName,
                Inactive: $scope.user.Inactive,
                email: $scope.user.email,
                MobileNo: $scope.user.MobileNo,
                IsPwChangeNextLogin: $scope.user.IsPwChangeNextLogin,
                IsSysPwEmail: $scope.user.IsSysPwEmail,
                Password: $scope.user.password,
                GroupId: $scope.user.GroupId

            };

            console.log($scope.user.AccountType, "user.AccountType");
            console.log(objUser.AccountType, "objUser.AccountType");
                
            if ($scope.user.AccountType == 0 && ($scope.user.password == "") && !$scope.user.IsSysPwEmail && !$scope.user.Inactive) {
                console.log("in");
                $scope.alertMessage = new Message(1, "Please enter valid password");
                return;
            }

            if ($scope.user.AccountType == 1 && (!$scope.user.email)) {
                $scope.alertMessage = new Message(1, "Please enter valid email. Email is mandatory for domain accounts.");
                return;
            }

            if ($scope.user.AccountType == 1 && ((!$scope.user.MobileNo) || ($scope.user.MobileNo == "") || ($scope.user.MobileNo == " "))) {
                $scope.alertMessage = new Message(1, "Please enter valid mobile number. Mobile number is mandatory for domain accounts.");
                return;
            }

            if ($scope.user.AccountType == 0 && (!$scope.user.email) && ($scope.user.IsSysPwEmail)) {
                $scope.alertMessage = new Message(1, "Please enter valid email to send user password");
                return;
            }

            if ($scope.user.GroupId == "") {
                $scope.alertMessage = new Message(1, "Please select a User Group");
                return;
            }

            if ($scope.isUpdateUser == false) {
                CreateUsersService.Create(objUser).then(function (result) {

                    $scope.alertMessage = new Message(result.data.Code, result.data.Message);
                    $scope.getUser();
                    //REFRESH FINDER
                    $scope.finderUserID.info.onLoad = false;
                }, function (result) {
                    $scope.alertMessage = new Message(result.data.Code, result.data.Message);
                });
            } else {
                CreateUsersService.Update(objUser).then(function (result) {

                    DisableControl();
                    $scope.alertMessage = new Message(result.data.Code, result.data.Message);
                    //REFRESH FINDER
                    $scope.finderUserID.info.onLoad = false;
                }, function (result) {
                    $scope.alertMessage = new Message(result.data.Code, result.data.Message);
                });
            }
        }
        else {
            $scope.showErrors(form);
        }
    };

    //Delete User 
    $scope.deleteUser = function (isValid) {
        if (isValid) {
            CreateUsersService.Remove($scope.user).then(function (result) {
                $scope.successMessage = 'User deleted Successfully.';
            }, function (result) {
                $scope.ErrorMessage = 'User remove error.';
            });
        }
        else {
            $scope.ErrorMessage = 'User remove error.';
        }
    };

    //Get User 
    $scope.getUser = function (isValid) {
        if (isValid) {
            CreateUsersService.read($scope.user, $scope.AccType).then(function (result) {
            }, function (result) {
                $scope.ErrorMessage = 'User getting error.';
            });
        }
        else {
            $scope.ErrorMessage = 'User getting error.';
        }
    };

    //Reset Form
    $scope.CreateUserReset = function (formModel) {
        //    angular.copy({}, formModel);
        $scope.CreateUserForm.$setPristine();
        $scope.clearAll();
        //     $scope.user.accountTypeOption = "Single Sign On";
        $scope.alertMessage = new Message(MessageTypes.Empty);
    };

    //Check UID
    $scope.isAccountTypeSystem = true;
    $scope.checkAccountTypeTicketSys = function () {
        $scope.alertMessage = "";
      
        if ($scope.user.AccountType == 0 && !search) {
            $scope.user.IsPwChangeNextLogin = true;
        }

        $scope.user.IsSysPwEmail = false;
        $scope.user.password = "";
       
        $scope.isAccountTypeSystem = $scope.user.AccountType != 1;
        // $scope.user.accountTypeOption = "Single Sign On";
    };


    $scope.CheckDomainUser = function () {
        if ($scope.user.AccountType == "DOMAIN") {

        }
    };


    $scope.ClearPw = function () {

        $scope.user.password = "";
    };

    
    var objTemp = new Array();
   
    $scope.aa = function () {
        $scope.finderUserID.info.onLoad = false;
        objTemp = [];
        this.params = objTemp;
        $scope.finderUserID.open();
    }


    $scope.finderUserID = {
        title: "User ID",
        info: {
            appId: "",
            uiId: "",
            mapId: "USER-001",
            modalId: "finderUserID", 
            onLoad: false
        },
        params: [],

        callback: function (data) {
            $scope.user.UserId = data.selectedItem.UserId;
            console.log(data.selectedItem.UserId, data.selectedItem.AccountType,"data");
            getUserDetails(data.selectedItem.UserId, data.selectedItem.AccountType);

        },
        open: function () {
            search = true;
            window._focuse(this.info.modalId);
            this.params = objTemp;

            $scope.alertMessage = new Message(MessageTypes.Empty, '');

            this.info.onLoad = true;
            $('#finderUserID').modal('show');


        }
    };

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

            $scope.user.GroupId = data.selectedItem.GroupCode
            
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

}]);
