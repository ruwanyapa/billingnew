'use strict';

angular.module('DialogBilling')
  .directive('addBillInvoicePayments', function (toaster) {
      return {
          restrict: 'E',
          replace: true,
          scope: {
              callback: "&"
          },
          templateUrl: './Views/Common/addBillInvoicePayments.html',
          link: function (scope, element) {
              var table = element.find('table');
              var templateTr = table.find('#template');
              var cumilaltiveTr = element.find('#cumilaltive'),
                totalAmountInput = cumilaltiveTr.find('input')[1];

              scope.$on('popAddBillInvoicePayments.CustomEvent', function (event, data) {
                  var rowItems = [];
                  scope.totAmount = 0;
                  scope.correctRecCount = 0;
                  scope.rowItems = data;
              });

              //filter('number')(number, fractionSize);

              scope.submitData = function () {
                  var correctItemsList = [];
                  
                  var rowItems = scope.rowItems;
                  if (window.paymentsDirectiveCb) {
                      for (var i = 0; i < rowItems.length; i++) {
                          if ((rowItems[i].ConnectionReference == '' || rowItems[i].ConnectionReference == null) &&
                               (rowItems[i].ContractNumber == '' || rowItems[i].ContractNumber == null)) {

                              if ((rowItems[i].ConnectionReference == '') && (rowItems[i].ContractNumber == '') && (rowItems[i].Amount == 0) && (rowItems[i].ReferenceNumber == '')) {
                                  continue;
                              }

                              if (rowItems[i].ConnectionReference == undefined) {
                                  continue;
                              }

                              toaster.error({ type: 'error', title: 'Error', body: 'Amount should be entered with Connection Reference or Contract Number!', showCloseButton: true });
                              return;

                          } else {                              
                              if (rowItems[i].Amount == "" || rowItems[i].Amount == null)
                                  rowItems[i].IsSelected = false;
                              
                              rowItems[i].ContractNumberGridDisabled = true;
                              rowItems[i].ConnectionReferenceGridDisabled = true;

                              rowItems[i].ReferenceNumberGridDisabled = false;
                              rowItems[i].RemarksGridDisabled = false;

                              correctItemsList.push(rowItems[i]);
                          }
                      }

                      setTimeout(function () {
                          console.log(new Date().toLocaleString());
                          window.paymentsDirectiveCb(scope.rowItems.length, scope.totAmount, correctItemsList);
                          rowItems = [];
                      }, 1000);
                      $("#popAddBillInvoicePayments").modal('hide');
                  }
              };

              scope.enterAmount = function () {
                  var sum = 0;
                  scope.correctRecCount = 0;
                  scope.rowItems.forEach(function (item) {

                      if ((item.ConnectionReference == '' || item.ConnectionReference == null) &&
                               (item.ContractNumber == '' || item.ContractNumber == null) ||
                               (item.Amount == '' || item.Amount <= 0 || item.Amount == null)) {


                      } else {
                          sum += item.Amount;
                          scope.correctRecCount += 1;
                      }
                  });
                  scope.totAmount = sum;

              };

              scope.enterEvent = function (row, e) {
                  var key = e.keyCode ? e.keyCode : e.which;
                  if (key === 13) {
                      var focusedElement = $(e.target);
                      //if ((nextElement.next().length) == 0) {
                      var nextElement = focusedElement.closest('tr').next().children().eq(2);//next row's first column;
                      nextElement.find('input').focus();
                      if ($(e.target).closest('td').is(':last-child') && $(e.target).closest('tr').is(':last-child')) {
                          setTimeout(function () {
                              var index = 0;
                              $('.dd').eq(index).focus();
                          }, 10);
                      }
                      //}
                  }
              }


              ///////////////****** Auto focus input  when modal loads ******///////////////

              $('#popAddBillInvoicePayments').on('shown.bs.modal', function () {

                  setTimeout(function () {
                      $('#amount').focus();
                      //$("#BillInvoicePaymentsForm").find("tr(:first)").children().eq(2).find('input').focus();
                  }, 10);
                  ///////////////////// 

              });
          }
      };
  });

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
          args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
