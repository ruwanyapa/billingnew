angular.module("DialogBilling").controller('BillInvoiceCancellationController', ["$scope", "Page", "$routeParams", "$filter", "toaster", "BillInvoiceCancellationService", function ($scope, Page, $routeParams, $filter, toaster, BillInvoiceCancellationService) {

    //Set Page Title
    Page.setTitle("Bill Invoice Cancellation"); 
    $scope.BillInvoiceCancellation = {}; 

    //============================
    // Mistake Done By dropdown
    $scope.OptionsMistakeDoneBy = [
      { text: "Customer", value: "1" },
      { text: "Cashier", value: "2" },
      { text: "Other", value: "3" }
    ];

    //===================================================================
    //-> Grid Start
    var commonGridConfig = {
        input: true,
        numeric: false,
        pageSize: 10,
        pageSizes: [15, 50, 75, 100]
    };

    //-> Grid Configurations

    //////////====================== Bill Invoice Cancellation   ===================

    var configBillInvoiceCancellation = {};
    var configBillInvoiceCancellation = {
        columns: [
                   
                  
                    { field: "ReceiptStatus", title: "Receipt Status", width: "80px" },
                    { field: "ReceiptDate", title: "Receipt Date", width: "100px" },
                    { field: "ReceiptNumber", title: "Receipt Number", width: "150px" },
                    { field: "AccountNo", title: "Reference No", width: "100px" },
                    {
                        field: "CustomerName",
                        title: 'Customer Name',
                        width: "110px"
                    }, {
                        field: "BillInvoiceNo",
                        title: 'Bill Invoice No',
                        width: "110px"
                    },
                    {
                        field: "Amount", title: "Amount", width: "100px"
                    },
                    { field: "ReceiptGeneratedUser", title: "Receipt Generated User", width: "130px" }
                 
        ],

        pageable: commonGridConfig,
        navigatable: true,
        editable: "inline",
        scrollable: true

    };

    configBillInvoiceCancellation.dataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "ID",
                fields: {
                    'ReceiptStatus': { editable: false, type: "string" },
                    'ReceiptDate': { editable: false, type: "date" },
                    'ReceiptNumber': { editable: false, type: "number" },
                    'AccountNo': { editable: false, type: "number" },
                    'CustomerName': { editable: false, type: "string" },
                    'BillInvoiceNo': { editable: false, type: "boolean" },
                    'Amount': { editable: false, type: "boolean" },
                    'ReceiptGeneratedUser': { editable: false, type: "string" }
                    
                }
            }
        },
        pageSize: 10

    });

    $scope.dgGridBillInvoiceCancellation = new DataGrid();
    $scope.dgGridBillInvoiceCancellation.options(configBillInvoiceCancellation);

    $scope.InitA = function (arg) {
        $scope.dgGridBillInvoiceCancellation.Init(arg);
    };

    //======================   Bill Invoice Cancellation Finder      =====================

    $scope.BillInvoiceCancellationBatchID =
    {

        title: "Search by Bill Invoice Cancellation Batch ID",
        info: {
            appId: "ZBC-DCPOS",
            uiId: "POS-FLOAT-FLOATMSTER",
            mapId: "FLOAT-TRANSFER-FLOATMSTER",
            modalId: "BillInvoiceCancellationBatchID",
            onLoad: false

        },
        params: [],
        callback: function (data) {


        },
        open: function () {
            this.info.onLoad = true;

            //$scope.alertMessage = new Message(MessageTypes.Empty, '');
            $("#" + this.info.modalId).modal('show');

        }
    };

    //============================================== 


}]);