angular.module("DialogBilling").directive("navigation", [function () {

    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: './Views/Common/navigation.html',
        controller: ["$scope", "AuthService", "$location", function ($scope, AuthService, $location) {

            $scope.locationPath = "#" + $location.path();

            var _base;
            $scope.pathCheck = function(base,path){
                if($scope.locationPath==(base+path)){
                    _base = base;
                    return true;
                } else if(_base==base){
                    return true;
                } else {
                    return false;
                }
            };

            function InitNav(){

                if($scope.permission_){
                    //--> Main Nav. 
                    var navigationList = [
                        {
                            "label": "DIA-CPOS",
                            "base": "#/CPOS/",
                            "icon": "arrow_left-right_alt",
                            "selected": false,
                            "menu": [
                                { "text": "Navigate to CPOS App", "path": "DashBord", "permission": "1201" },

                            ]
                        },
                        //{
                        //    "label": "User Management",
                        //    "base" : "#/UserManagement/",
                        //    "icon": "icon_profile",
                        //    "selected": false,
                        //    "menu": [
                        //        { "text": "Create User 1", "path": "CreateUsers", "permission" : "1002" },
                        //        { "text": "Change Password", "path": "ChangePassword", "permission" : "1003" },
                        //        { "text": "Reset Password", "path": "ResetPassword", "permission" : "1004" },
                        //        { "text": "Create Users Groups", "path": "CreateUsersGroups", "permission" : "1005" }
                        //    ]
                        //},





                         //{
                         //     "label": "Print Samples",
                         //     "base": "#/KPIManagement/",
                         //     "icon": "icon_profile",
                         //     "selected": false,
                         //     "menu": [
                         //         { "text": "Sample messages", "path": "Kpi", "permission": "50001" },
                         //         { "text": "Direct Print Demo", "path": "printDemo", "permission": "50001" },
                         //         { "text": "PDF Print Demo", "path": "pdfPrint", "permission": "50001" }
                                 
                         //     ]
                         //},

                         {
                             "label": "Bulk Payment", 
                             "base": "#/BulkPayment/",
                             "icon": "icon_check_alt2",
                             "selected": false,
                             "menu": [
                                 { "text": "Bulk Payment", "path": "BulkPayment", "permission": "50001" },
                                 { "text": "Batch Process Payments", "path": "BatchProcessPayments", "permission": "50019" },
                                 { "text": "Payment Inquiry", "path": "PaymentInquiry", "permission": "50002" },
                                 { "text": "Payment Cancellation", "path": "PaymentCancellation", "permission": "50003" },
                                 { "text": "Payment Transfer", "path": "PaymentTransfer", "permission": "50004" },
                                 { "text": "Bulk Receipt Printing", "path": "BulkReceiptPrinting", "permission": "50005" },
                                 { "text": "Forceful Realization Of Cheque", "path": "ForcefulRealizationOfCheque", "permission": "50006" },
                                 { "text": "Cheque Return", "path": "ChequeReturn", "permission": "50007" },
                                 { "text": "Cheque Return Reasons", "path": "ChequeReturnReasons", "permission": "50008" },
                                 { "text": "Cancellation & Transfer Reasons", "path": "CancellationAndTransferReasons", "permission": "50009" },
                                 { "text": "Payment Method", "path": "PaymentMethod", "permission": "50010" },
                                 { "text": "Payment Source", "path": "PaymentSource", "permission": "50011" },
                                 { "text": "Payment Type", "path": "PaymentType", "permission": "50012" },
                                 { "text": "Product Category", "path": "ProductCategory", "permission": "50013" },
                                 { "text": "Product Type", "path": "ProductType", "permission": "50014" },
                                 { "text": "Transfer Product", "path": "TransferProduct", "permission": "50015" },
                                 { "text": "Suspense Account Config", "path": "SuspenseAccountConfig", "permission": "50016" },
                                 { "text": "Allowed Payment Modes", "path": "AllowedPaymentModes", "permission": "50017" },
                                 { "text": "Transfer Logic", "path": "TransferLogic", "permission": "50018" },                 { "text": "Bill Invoice Payment", "path": "BillInvoicePayment", "permission": "50018" },
                                 //{ "text": "Bill Invoice Cancellation", "path": "BillInvoiceCancellation", "permission": "50018" }
                             ]
                         },
                         
                    {
                              "label": "Help", 
                              "base": "../../Views/Help/",
                              "icon": "icon_book",
                              "selected": false,
                              "menu": [
                                { "text": "User Manual", "path": "UserManual/index.htm#t=First_Topic.htm", "permission": "50001", "target":"_blank" },
                                { "text": "Bulk Payment Excel", "path": "Templates/BulkPaymentExcel.xlsx", "permission": "50001", "target": "_blank" },
                                { "text": "Bulk Cancellation Excel", "path": "Templates/BulkCancellationExcel.xlsx", "permission": "50001", "target": "_blank" },
                                { "text": "Bulk Print Excel", "path": "Templates/BulkPrintExcel.xlsx", "permission": "50001", "target": "_blank" },
                                { "text": "Batch Process", "path": "Templates/BatchProcess.xlsx", "permission": "50001", "target": "_blank" }
                              ]
                }

                          



                    ];
                    //<-- Main Nav 

                    angular.forEach(navigationList, function (item) {

                        var haveSubnav = false;

                        angular.forEach(item.menu, function (menu) {

                            if ($scope.checkPermission(menu.permission)) {
                                haveSubnav = true;
                            }

                        });

                        item["haveSubnav"] = haveSubnav;

                    });


                    console.log(navigationList);

                    $scope.navigation = navigationList;


                }

            }

            $scope.checkPermission = function(code){
                return ($scope.permission_.indexOf(code) >= 0) ? true : false;
            };

            if(AuthService.getProfile())
                $scope.permission_ = AuthService.getProfile().permission || '';

            //Check Permissione Change
            $scope.$watch('userInfo', function() {
                //
                if(AuthService.getProfile())
                    $scope.permission_ = AuthService.getProfile().permission || '';

                InitNav();
            });

 

        }]
    };

}]);
