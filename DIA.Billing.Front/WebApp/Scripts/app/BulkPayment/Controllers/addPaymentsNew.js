'use strict';

angular.module('DialogBilling')
  .directive('addPaymentsNew', function (toaster) {
      return {
          restrict: 'E',
          replace: true,
          scope: { 
              callback: "&"
          },

          templateUrl: './Views/Common/addPaymentsNew.html',
          link: function (scope, element) {
              var table = element.find('table');
              var templateTr = table.find('#template');
              var cumilaltiveTr = element.find('#cumilaltive'),
                totalNoOfRecordsInput = cumilaltiveTr.find('input')[0],
                totalAmountInput = cumilaltiveTr.find('input')[1];
              var rowItems = [];
              var totRecords = 0;
              var totAmount = 0;
              var rowElements = [];
              var proCategory = JSON.parse(localStorage.getItem("CurrentProductCategory"));
              var inputConRefMinLength = proCategory == 2 && 0 || 8;
              var inputConRefMaxLength = proCategory == 2 && 20 || 9;
              scope.aa = function () {
                  alert();
              }

              scope.submitData = function () {
                  var correctItemsList = [];
                  
                  if (window.paymentsDirectiveCb) {
                      for (var i = 0; i < rowItems.length; i++) {
                          if ((rowItems[i].ConnectionReference == '' || rowItems[i].ConnectionReference == null) &&
                               (rowItems[i].ContractNumber == '' || rowItems[i].ContractNumber == null) ||
                               (rowItems[i].Amount == '' || rowItems[i].Amount <= 0 || rowItems[i].Amount == null)) {

                              if ((rowItems[i].ConnectionReference == '') && (rowItems[i].ContractNumber == '') && (rowItems[i].Amount == 0) && (rowItems[i].ReferenceNumber == '')) {
                                  continue;
                              }

                              if (rowItems[i].ConnectionReference == undefined) {
                                  continue;
                              }

                              toaster.error({ type: 'error', title: 'Error', body: 'Amount should be entered with Connection Reference or Contract Number!', showCloseButton: true });
                              return;

                          } else {
                                  correctItemsList.push(rowItems[i]);
                          }
                      }

                      setTimeout(function () {
                          console.log(new Date().toLocaleString());
                          window.paymentsDirectiveCb(totRecords, totAmount, correctItemsList);
                          $("#AddPaymentsForm").find("tr:not(:first)").remove();
                          totalNoOfRecordsInput.value = 0;
                          rowItems = [];
                          totRecords = 0;
                          addNewRow();
                      },1000);
                      $("#myAddPaymentsNew").modal('hide');
                  } 
              };

              scope.changeAddPaymentPageState = function ()
              {
                  $("#AddPaymentsForm").find("tr:not(:first)").remove();
                  totalNoOfRecordsInput.value = 0;
                  rowItems = [];
                  totRecords = 0;
                  addNewRow();
              };

              var debouncedCalcTotal = debounce(function () {
                  
                  var sum = 0;
                  var correctRecCount = 0;
                  rowItems.forEach(function (item) {

                      if ((item.ConnectionReference == '' || item.ConnectionReference == null) &&
                               (item.ContractNumber == '' || item.ContractNumber == null) ||
                               (item.Amount == '' || item.Amount <= 0 || item.Amount == null)) {
                          
                          
                      } else {
                          sum += item.Amount;
                          correctRecCount += 1;
                      }
                  });

                  totalAmountInput.value = sum.toFixed(2);
                  totAmount = sum.toFixed(2);

                  totalNoOfRecordsInput.value = correctRecCount;
                  totRecords = correctRecCount;

              }, 600);

              addNewRow();

              debouncedCalcTotal();

              function bindEvents(tr, rowItem, rowElement) {
                  var inputs = tr.find('input');
                  var inputConRef = inputs[0],
                    inputConNo = inputs[1],
                    inputAmount = inputs[2],
                    inputRefNo = inputs[3];
                  rowElement.inputConRef = inputConRef;
                  rowElement.inputConNo = inputConNo;
                  rowElement.inputAmount = inputAmount;
                  rowElement.inputRefNo = inputRefNo;

                  //inputConRef.focus();
                  $(inputRefNo).add(inputConRef).add(inputAmount).add(inputConNo).on('input', function () {
                      if (this === inputConRef && inputConRef.value) {
                          inputConNo.value = '';
                      } else if (this === inputConNo && inputConNo.value) {
                          inputConRef.value = '';
                      }
                      rowItem.ReferenceNumber = inputRefNo.value;
                      rowItem.ConnectionReference = inputConRef.value;
                      rowItem.ContractNumber = inputConNo.value;
                      rowItem.Amount = parseFloat(inputAmount.value) || 0;
                      debouncedCalcTotal();
                  });

                  onEnterKey(inputRefNo, function () {
                      if (isValidRow()) {
                        
                          if (inputConRef.value) {
                              if (inputConRef.value.length > 0 && (inputConRef.value.length < 8 || inputConRef.value.length > 9)) {

                                  scope.$apply(function () {
                                      toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between 8 and 9!', showCloseButton: true });
                                      return;

                                  })

                              } else {
                                  if (
                                     // proCategory == 2 &&
                                      inputConRef.value != null && inputConRef.value.length > 20) {

                                      scope.$apply(function () { 

                                          toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference Length should be 0 < length <= 20!', showCloseButton: true });
                                          return;

                                      })

                                  }
                                  else {}

                              }

                          }
                          else {
                              whenValidRow();
                              return;
                          }
                  
                      }
                      else {

                          if (inputConRef.value || inputConNo.value) {

                              scope.$apply(function () { 
                                  toaster.error({ type: 'error', title: 'Error', body: 'Amount should be entered with Connection Reference or Contract Number!', showCloseButton: true });
                              })

                              inputAmount.focus();
                          } else if (!inputConRef.value) {
                              inputConRef.focus();
                          } else if (!inputConNo.value) {
                              inputConNo.focus();
                          } else {
                              inputAmount.focus();
                          }

                        

                      }

                    
                  });

                  onEnterKey(inputConRef, function () {
                      

                      var conRefVal = inputConRef.value;
                      if (conRefVal == "") {
                          inputConNo.focus();
                      } else {

                          var proCategory = JSON.parse(localStorage.getItem("CurrentProductCategory"));
                          //inputConRefMinLength = proCategory == 2 && 0 || 8;
                          //inputConRefMaxLength = proCategory == 2 && 20 || 9;

                          if (proCategory==2) {
                              inputConRefMinLength = 0;
                          }
                              //added to sort an error
                          else if (proCategory == null) {
                              inputConRefMinLength = 0;
                          }
                          else {
                              inputConRefMinLength = 8;
                          }

                          if (proCategory==2) {
                              inputConRefMaxLength = 20;
                          }
                              //added to sort an error
                          else if (proCategory == null) {
                              inputConRefMaxLength = 20;
                          }
                          else {
                              inputConRefMaxLength = 9;
                          }

                          if (conRefVal) {

                                  if (conRefVal.length >= inputConRefMinLength) {

                                      if (conRefVal.length <= inputConRefMaxLength) {
                                          if (isValidRow()) {
                                              whenValidRow();
                                                 return;
                                          }
                                      } else {
                                          scope.$apply(function () {
                                              toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between ' + inputConRefMinLength + ' and ' + inputConRefMaxLength + '!', showCloseButton: true });
                                          });
                                      }
                                      
                                  } else {
                                      scope.$apply(function () {
                                          toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between ' + inputConRefMinLength + ' and ' + inputConRefMaxLength + '!', showCloseButton: true });
                                      });
                                  }
                              
                          } else {
                              scope.$apply(function () {
                                  toaster.error({ type: 'error', title: 'Error', body: 'Please enter connection ref or contract no', showCloseButton: true });
                              });
                          }

                          //if (!conRefVal || conRefVal.length < inputConRefMinLength || conRefVal.length > inputConRefMaxLength) {
                          //    scope.$apply(function () {
                          //        toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between 8 and 9!', showCloseButton: true });
                          //    });
                          //    return;
                          //} else if (isValidRow()) {
                          //    whenValidRow();
                          //    return;
                          //}



                          if (!inputConRef.value) {
                              inputConNo.focus();
                          } else {
                              inputAmount.focus();
                          }
                      }
                  });

                  onEnterKey(inputConNo, function () {
                      if (isValidRow()) {
                          whenValidRow();
                          return;
                      }
                      if (!inputConNo.value) {
                          inputConRef.focus();
                      } else {
                          inputAmount.focus();
                      }
                  });

                  onEnterKey(inputAmount, function () {
                      if (isValidRow()) {
                          whenValidRow();
                          focusLastRow();
                          return;
                      }
                      inputConRef.focus();
                  });

                  function onEnterKey(el, callBack) {
                      el.addEventListener('keypress', function (e) {
                          if (e.keyCode === 13 && callBack) {
                              callBack();
                          }
                      });
                  }

                  function whenValidRow() {
                      if (isLastRow()) {
                          addNewRow();
                      } else {
                          focusLastRow();
                      }
                  }

                  function isValidRow() { 
                      var conRefVal = inputConRef.value; 
                      if (conRefVal.length && (conRefVal.length < inputConRefMinLength || conRefVal.length > inputConRefMaxLength)) {
                          scope.$apply(function () {
                              toaster.error({ type: 'error', title: 'Error', body: 'Error Connection Reference length should be between 8 and 9!', showCloseButton: true });
                          });
                          return false;
                      }
                      return inputAmount.value && (inputConNo.value || inputConRef.value);
                  }

                  function isLastRow() {
                      return rowElement === rowElements[rowElements.length - 1];
                  }

                  function focusLastRow() {
                      return rowElements[rowElements.length - 1].inputConRef.focus();
                  }
           
              }


              function addNewRow() {
                  var rowItem = {
                      Amount: 0
                  };
                  rowItems.push(rowItem);
                  var rowElement = {};
                  rowElements.push(rowElement);
                  bindEvents(templateTr.clone().removeAttr('id').css('display', 'table-row').appendTo(table), rowItem, rowElement);
                  debouncedCalcTotal();
              }

                
              ///////////////****** Auto focus input  when modal loads ******///////////////

              $('#myAddPaymentsNew').on('shown.bs.modal', function () {

                  setTimeout(function () {
                      $('.conn-reference').focus();
                  }, 2);
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
