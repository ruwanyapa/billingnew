/*
 *   Bulk Payment
 */

//

angular.module("BulkPayment", []);

angular.module("BulkPayment").config(["$routeProvider", function ($routeProvider) {

    var _basepath = "./Views/BulkPayment/";

    //Route Navigation
    $routeProvider
        .when("/BulkPayment/BulkPayment", {
            templateUrl: _basepath + "BulkPayment.html",
            controller: "BulkPaymentController",
            permissionCode: "50001"
        })

     .when("/BulkPayment/PaymentMethod", {
         templateUrl: _basepath + "PaymentMethod.html",
         controller: "PaymentMethodController",
         permissionCode: "50010"
     })
    .when("/BulkPayment/PaymentSource", {
        templateUrl: _basepath + "PaymentSource.html",
        controller: "PaymentSourceController",
        permissionCode: "50011"
    })
    .when("/BulkPayment/PaymentType", {
        templateUrl: _basepath + "PaymentType.html",
        controller: "PaymentTypeController",
        permissionCode: "50012"
    })
    .when("/BulkPayment/SuspenseAccountConfig", {
        templateUrl: _basepath + "SuspenseAccountConfig.html",
        controller: "SuspenseAccountConfigController",
        permissionCode: "50016"
    })
     .when("/BulkPayment/PaymentInquiry", {
         templateUrl: _basepath + "PaymentInquiry.html",
         controller: "PaymentInquiryController",
         permissionCode: "50002"
     })
     .when("/BulkPayment/PaymentCancellation", {
         templateUrl: _basepath + "PaymentCancellation.html",
         controller: "PaymentCancellationController",
         permissionCode: "50003" 
     })
    .when("/BulkPayment/PaymentTransfer", { 
        templateUrl: _basepath + "PaymentTransfer.html",
        controller: "PaymentTransferController",
        permissionCode: "50004"
    })
    .when("/BulkPayment/BulkReceiptPrinting", {
        templateUrl: _basepath + "BulkReceiptPrinting.html",
        controller: "BulkReceiptPrintingController",
        permissionCode: "50005"
    })
     .when("/BulkPayment/ForcefulRealizationOfCheque", {
         templateUrl: _basepath + "ForcefulRealizationOfCheque.html",
         controller: "ForcefulRealizationOfChequeController",
         permissionCode: "50006"
     })
    .when("/BulkPayment/ChequeReturn", {
        templateUrl: _basepath + "ChequeReturn.html",
        controller: "ChequeReturnController",
        permissionCode: "50007"
    })
    .when("/BulkPayment/ChequeReturnReasons", {
        templateUrl: _basepath + "ChequeReturnReasons.html",
        controller: "ChequeReturnReasonsController",
        permissionCode: "50008"
    })
    .when("/BulkPayment/CancellationAndTransferReasons", {
        templateUrl: _basepath + "CancellationTransferReasons.html",
        controller: "CancellationTransferReasonsController",
        permissionCode: "50009"
    })
    .when("/BulkPayment/ProductCategory", {
        templateUrl: _basepath + "ProductCategory.html",
        controller: "ProductCategoryController",
        permissionCode: "50013"
    })
    .when("/BulkPayment/ProductType", {
        templateUrl: _basepath + "ProductType.html",
        controller: "ProductTypeController",
        permissionCode: "50014"
    })
    .when("/BulkPayment/AllowedPaymentModes", {
        templateUrl: _basepath + "AllowedPaymentModes.html",
        controller: "AllowedPaymentModesController",
        permissionCode: "50001"
    })
    .when("/BulkPayment/TransferProduct", {
        templateUrl: _basepath + "TransferProduct.html",
        controller: "TransferProductController",
        permissionCode: "50015"
    })
    .when("/BulkPayment/TransferLogic", {
        templateUrl: _basepath + "TransferLogic.html",
        controller: "TransferLogicController",
        permissionCode: "50018"
    })
    .when("/BulkPayment/BillInvoicePayment", {
        templateUrl: _basepath + "BillInvoicePayment.html",
        controller: "BillInvoicePaymentController",
        permissionCode: "50018"
    })
    .when("/BulkPayment/BillInvoiceCancellation", {
        templateUrl: _basepath + "BillInvoiceCancellation.html",
        controller: "BillInvoiceCancellationController",
        permissionCode: "50018"
    })
    .when("/BulkPayment/BatchProcessPayments", {
        templateUrl: _basepath + "BatchProcessPayments.html",
        controller: "BatchProcessPaymentsController",
        permissionCode: "50019"
    });


}]);