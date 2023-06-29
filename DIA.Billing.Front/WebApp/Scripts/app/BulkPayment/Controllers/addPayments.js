/*
Add Payments Modal Directive
*/
angular.module("DialogBilling").directive("addPayments", [function () { 
    return {
        restrict: "E", 
        replace: true, 
        scope: {
            params: "=",
            callback: "&",
            data: "@",
            title: "@",
            disable:"="
        },

        templateUrl: "./Views/Common/addPayments.html",
        controller: ["$scope", "$attrs", "BulkPaymentService", "toaster", function ($scope, $attrs, BulkPaymentService, toaster) {
            $scope.RandomBill = {};
            $scope.RowsId = 0;
            //watch params and initiate directives
            $scope.$watchCollection("params", function (_val) {
                if ($scope.params.onLoad) {
                    $scope.RowsId = 0;
                    init();
                }
            });

            $scope.$watchCollection("disable", function (_val) {
                $scope.RandomBill.AddPaymentButton = true;
            });
         
            var totalRows = '';
            $scope.$watchCollection("data12", function (_val) {
                $scope.RowsId = 0;
            });
            //-> Grid Sample data for demo purposes
            var s1 = [];
            var d2 = [];
            //@@@@@@@@@@@@@@@@@@@@@@@@@@
            //-> Grid Start
            var configAddPaymentsEnter = {};
            configAddPaymentsEnter.resizable = true;

            configAddPaymentsEnter.sortable = false;

            configAddPaymentsEnter.navigatable = false;

            configAddPaymentsEnter.pageable = false;

            configAddPaymentsEnter.editable = false;

            configAddPaymentsEnter.scrollable = true;

            configAddPaymentsEnter.columns = [

                  {
                      field: "ConnectionReference",
                      attributes: {
                          "navi-text": ""
                      },
                      headerTemplate: 'Connection Reference',
                      template: '<input ng-keydown="AA(this,$event)"  type="text" class="k-fill text-right aa conn-ref-count"  ng-change="dataItem.ContractNumber = null"  ng-model="dataItem.ConnectionReference"/>'

                  },
                   {
                       field: "ContractNumber",
                       attributes: {
                           "navi-text": ""
                       },
                       headerTemplate: 'Contract Number',
                       template: '<input ng-keydown="AA(this,$event)"  type="text"   class="k-fill text-right aa contr-num-count"   ng-change="dataItem.ConnectionReference = null" ng-model="dataItem.ContractNumber"/>'

                   },
                    {
                        field: "Amount",
                        attributes: {
                            "navi-text": ""
                        },
                        headerTemplate: 'Amount',
                        template: '<input ng-keydown="AA(this,$event)" type="text"  class="k-fill text-right aa amount"  ng-model="dataItem.Amount" format-number ng-pattern="/^[0-9]+(\.[0-9]{2})?$/"    />'

                         
                    },
                    {
                        field: "ReferenceNumber",
                        attributes: {
                            "navi-text": ""
                        },
                        headerTemplate: 'Reference Number',
                        template: '<input ng-keydown="AA(this,$event)"  type="text"  class="k-fill text-right aa"  ng-model="dataItem.ReferenceNumber"/>'

                    }

            ];


            configAddPaymentsEnter.dataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                            'RowId': { editable: true, type: "number" },
                            'ConnectionReference': { editable: true, type: "number" },
                            'ContractNumber': { editable: true, type: "number" },
                            'Amount': { editable: true, type: "number" },
                            'ReferenceNumber': { editable: true, type: "number" },
                            'BillTyppe': { editable: true, type: "number" }
                        }
                    }
                },
                pageSize: 7000,

            });

            $scope.dgGridAddPaymentsEnter = new DataGrid();
            $scope.dgGridAddPaymentsEnter.options(configAddPaymentsEnter);

            $scope.Init = function (arg) {
                $scope.dgGridAddPaymentsEnter.Init(arg);
            };

            $scope.submitForm = function () {
             //   $scope.RandomBill.AddPaymentButton = true; 
                var fun = $scope.callback();
                var d = $scope.dgGridAddPaymentsEnter.data();
                //d.splice(0, 1);
                $scope.RowsId = 0;
                fun($scope.RandomBill.totRec, $scope.RandomBill.totalAmt, $scope.dgGridAddPaymentsEnter.data());

               
            }

            //@@@@@@@@@@@@@@@@@@@@@@@@@@
            //-> Data Entry Grid Start
            var configDataEntry = {};

            configDataEntry.resizable = true

            configDataEntry.sortable = false;

            configDataEntry.navigatable = false;

            configDataEntry.pageable = false;

            configDataEntry.editable = false;

            configDataEntry.columns = [

                    {
                        field: "ConnectionReference",
                        attributes: {
                            "navi-text": ""
                        },
                        headerTemplate: 'Connection Reference',
                        headerAttributes: {
                            style: "display: none"
                        },
                        template: '<input ng-keydown="DD(this,$event)" type="text" class="k-fill text-right dd conn-ref conn-ref-count"  ng-change="dataItem.ContractNumber = null" ng-model="dataItem.ConnectionReference" />'
                         //ng-change="dataItem.ContractNumber = null"
                    },
                     {
                         field: "ContractNumber",
                         attributes: {
                             "navi-text": ""
                         },
                         headerTemplate: 'Contract Number',
                         headerAttributes: {
                             style: "display: none"
                         },
                         template: ' <input ng-keydown="DD(this,$event)"  type="text" class="k-fill text-right dd contr-num contr-num-count"  ng-change="dataItem.ConnectionReference = null" ng-model="dataItem.ContractNumber"/>'//ng-change="dataItem.ConnectionReference = null"

                     },
                      {
                          field: "Amount",
                          attributes: {
                              "navi-text": ""
                          },
                          headerTemplate: 'Amount',
                          headerAttributes: {
                              style: "display: none"
                          },
                          template: '<input ng-keydown="DD(this,$event)"  type="text" class="k-fill text-right dd amount" ng-model="dataItem.Amount" ng-pattern="/^[0-9]+(\.[0-9]{2})?$/" />'

                      },
                      {
                          field: "ReferenceNumber",
                          attributes: {
                              "navi-text": ""
                          },
                          headerTemplate: 'Reference Number',
                          headerAttributes: {
                              style: "display: none"
                          },
                          template: '<input ng-keydown="DD(this,$event)"  type="text" class="k-fill text-right dd" ng-model="dataItem.ReferenceNumber" ng-pattern="/^[0-9]+(\.[0-9]{2})?$/" />'

                      } 
            ];

              
            configDataEntry.scrollable = true;



            configDataEntry.dataSource = new kendo.data.DataSource({
                data: [d2],

                schema: {
                    model: {
                        id: "ID",
                        fields: {

                            'ConnectionReference': { editable: true, type: "string" },
                            'ContractNumber': { editable: true, type: "string" },
                            'Amount': { editable: true, type: "number" },
                            'ReferenceNumber': { editable: true, type: "string" }


                        }
                    }
                },
                pageSize: 2,

            });




            $scope.dgGridDataEntry = new DataGrid();
            $scope.dgGridDataEntry.options(configDataEntry);

            $scope.Init2 = function (arg) {
                $scope.dgGridDataEntry.Init(arg);
            };

            //@@@@@@@@@@@@@@@@@@@@@@@@@@

            /////////////////////////////////////////////////////////////////////////////


            $scope.AA = function (row, e) {
                var key = e.keyCode ? e.keyCode : e.which;
                if (key === 13) {

                    var focusedElement = $(e.target);
                    var nextElement = focusedElement.closest('td').next();


                    if (nextElement.find('input').length > 0) {
                        setTimeout(function () {
                            nextElement.find('input').focus();
                        }, 10);


                    } else if ((nextElement.next().length) == 0) {


                        var nextElement = focusedElement.closest('tr').next().children().eq(0);//next row's first column;
                        nextElement.find('input').focus();

                        if ($(e.target).closest('td').is(':last-child') && $(e.target).closest('tr').is(':last-child')) {

                            setTimeout(function () {
                                var index = 0;
                                $('.dd').eq(index).focus();

                            }, 10);


                        }

                    }
                }
            }


            /////////////////////////////////////////////////////////////////////////////
            $scope.DD = function (row, e) {
                var key = e.keyCode ? e.keyCode : e.which;
                if (key === 13) {
                    var s = row.dataItem;
                    var focusedElement = $(e.target);
                    var nextElement = focusedElement.closest('td').next();
                    
                    var $nonempty = $('.conn-ref').filter(function () {
                        return this.value != ''
                    });
                    //proCategory != 2 && s.ConnectionReference.length > 0 && s.ConnectionReference.length != 9
                        ///////////////////////////////////
                        if ($(e.target).closest('td').is(':last-child') || $(e.target).closest('td').is(':nth-last-child(2)')) {

                                s1 = $scope.dgGridAddPaymentsEnter.data();

                                if ((angular.isUndefined(s.ConnectionReference) || s.ConnectionReference == '' || s.ConnectionReference == null) &&
                                (angular.isUndefined(s.ContractNumber) || s.ContractNumber == '' || s.ContractNumber == null) ||
                                (angular.isUndefined(s.Amount) || s.Amount == '' || s.Amount <= 0 || s.Amount ==null)) {
                                    toaster.error({ type: 'error', title: 'Error', body: 'Amount should be entered with Connection Reference or Contract Number!', showCloseButton: true });
                                    return;
                                } else {
                                    var proCategory = JSON.parse(localStorage.getItem("CurrentProductCategory"));
                                    if (s.ConnectionReference != null)
                                    {
                                        if (s != undefined) {
                                            if (proCategory != 2 && s.ConnectionReference.length > 0 && (s.ConnectionReference.length < 8 || s.ConnectionReference.length > 9)) {
                                                toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between 8 and 9!', showCloseButton: true });
                                                return;
                                            } else {
                                                if (proCategory == 2 && s.ConnectionReference != null && s.ConnectionReference.length > 20) {
                                                    toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference Length should be 0 < length <= 20!', showCloseButton: true });
                                                    return;
                                                } else {
                                                }
                                            }
                                        }
                                    }
                                        $scope.RowsId = $scope.RowsId + 1;
                                        s1.push({ 'RowId': $scope.RowsId, 'ConnectionReference': s.ConnectionReference, 'ContractNumber': s.ContractNumber, 'Amount': s.Amount, 'ReferenceNumber': s.ReferenceNumber });
                                        s.ConnectionReference = '';
                                        s.ContractNumber = '';
                                        s.Amount = '';
                                        s.ReferenceNumber = '';
                                }


                             

                                //$scope.CalcTotal();

                                $scope.RandomBill.AddPaymentButton = false;

                               $('#dgAddPaymentsEnterId .k-grid-content').scrollTop($('#dgAddPaymentsEnterId .k-grid-content')[0].scrollHeight);


                               setTimeout(function () {
                                   var index = 0;
                                   $('.dd').eq(index).focus();

                               }, 2);

                        }

                        else {

                            if ($nonempty.length == 0) {

                                setTimeout(function () {
                                    nextElement.find('input').focus();
                                }, 2);

                            } else {

                                nextElement = focusedElement.closest('td').next().next();

                                nextElement.find('input').focus();

                                }
                  }

               }
            }
            ////////////////////////////////////////////////////////
            //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    changeAddPaymentPageState     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
            $scope.changeAddPaymentPageState = function (status) {

                if (status = "NEW") {

                    $scope.dgGridDataEntry.data([d2]);
                    $scope.dgGridAddPaymentsEnter.data([]);
                    $scope.RandomBill.totRec = Number(0).toFixed(2);
                    $scope.RandomBill.totalAmt = Number(0).toFixed(2);               
                   
                    $('#myAddPayments').on('hidden.bs.modal', function (e) {
                        $scope.RandomBill.AddPaymentButton = true; 
                      
                    });

                } else {

                    $scope.dgGridDataEntry.data([]);
                    $scope.dgGridAddPaymentsEnter.data([]);
                    $scope.RandomBill.totRec = Number(0).toFixed(2);
                    $scope.RandomBill.totalAmt = Number(0).toFixed(2);
                    
                }

               
            
            }
            //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    checkForBlankWidget     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

          $scope.checkForBlankWidget = function () {                    
            //  toaster.error({ type: 'error', title: 'warning', body: "You are about to close the popup without submitting any data.", showCloseButton: true });
              // $('#myaddPayments').modal('hide');     
          }

        
  
            //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            $("#dgDataEntryId tr").css("background-color", "#fcd0c6");
            ///////////////****** Auto focus input  when modal loads ******///////////////

            $('#myAddPayments').on('shown.bs.modal', function () {

                setTimeout(function () {
                    $('.conn-ref').focus();
                }, 2);
                /////////////////////

            })
            //////////////////////////////////
           
            $scope.CalcTotal = function () {

                //$scope.dgGridAddPaymentsEnter.data(s1);
                //var d = $scope.dgGridAddPaymentsEnter.data();

                var totRec = 0;
                var totalAmt = 0;

                angular.forEach($scope.dgGridAddPaymentsEnter.data(), function (row) {
                    totalAmt = (Number(row.Amount) + Number(totalAmt)).toFixed(2);                                    
                    totRec++;
                });

                $scope.RandomBill.totalAmt = totalAmt;
                $scope.RandomBill.totRec = totRec;

                setTimeout(function () {
                    var index = 0;
                    $('.dd').eq(index).focus();

                }, 2); 

                
            }

            //////////////////////////////////
        }]
    }

}]);


