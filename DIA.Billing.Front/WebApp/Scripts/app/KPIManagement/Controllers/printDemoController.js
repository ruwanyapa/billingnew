(function()  {
    'use strict';
    angular.module('DialogBilling')
      .controller('PrintDemoController', function (DirectPrintService, $scope, $timeout) {
          var vm = $scope.vm = {};

          DirectPrintService.start();

          $scope.data = [{
              name: 'A',
              info: 'aaaaaaa'
          }, {
              name: 'B',
              info: 'bbbbbbb'
          }, {
              name: 'C',
              info: 'ccccccc'
          }, {
              name: 'D',
              info: 'ddddddd'
          }, {
              name: 'E',
              info: 'eeeeeee'
          }, {
              name: 'F',
              info: 'fffffff'
          }, {
              name: 'G',
              info: 'ggggggg'
          }, {
              name: 'H',
              info: 'hhhhhhh'
          }];

          $scope.printTable = function () {
              for (var i = 0; i < $scope.data.length; i++) {
                  var componentId = $scope.data[i].name;
                  DirectPrintService.print(function () {
                      $scope.$apply(function () {
                          console.log('Print Completed');
                          vm.printCompleted = true;
                          $timeout(function () {
                              vm.printCompleted = false;
                          }, 3000);
                      });
                  },
                  $('#' + componentId + '').html());
              }
          };

          $scope.printHtml = function () {
                  DirectPrintService.print(function () {
                      $scope.$apply(function () {
                          console.log('Print Completed');
                          vm.printCompleted = true;
                          $timeout(function () {
                              vm.printCompleted = false;
                          }, 3000);
                      });
                  },
                  "<br><br><br><body> <div id='page_1'> <table cellpadding='0' cellspacing='0' class='t0'> <tbody><tr> <td class='tr0 td0'><p class='p0 ft0'>Con Ref</p></td> <td class='tr0 td1'><p class='p1 ft0'>: 0114376494</p></td> <td class='tr0 td2'><p class='p0 ft1'>&nbsp;</p></td> </tr> <tr> <td class='tr1 td0'><p class='p0 ft1'>&nbsp;</p></td> <td class='tr1 td1'><p class='p2 ft0'><nobr>TEST-QA-NAME</nobr></p></td> <td class='tr1 td2'><p class='p0 ft1'>&nbsp;</p></td> </tr> <tr> <td class='tr2 td0'><p class='p0 ft0'>Receipt No</p></td> <td class='tr2 td1'><p class='p1 ft0'>: DBBPDSC00058063</p></td> <td class='tr2 td2'><p class='p0 ft2'><nobr>29-Jun-2017</nobr> 1:33 pm</p></td> </tr> <tr> <td class='tr2 td0'><p class='p0 ft0'>Amount</p></td> <td class='tr2 td1'><p class='p1 ft0'>: 10.00</p></td> <td class='tr2 td2'><p class='p0 ft1'>&nbsp;</p></td> </tr> <tr> <td class='tr2 td0'><p class='p0 ft0'>Pay Mode</p></td> <td class='tr2 td1'><p class='p1 ft0'>: CASH</p></td> <td class='tr2 td2'><p class='p0 ft1'>&nbsp;</p></td> </tr><br/> <tr> <td rowspan='2' class='tr3 td0'><p class='p0 ft0'>Printed On</p></td> <td class='tr4 td1'><p class='p1 ft0'>: 0</p></td> <td rowspan='2' class='tr3 td2'><p class='p3 ft0'>By : 002</p></td> </tr> <tr> <td class='tr4 td1'><p class='p1 ft0'>: <nobr>29-Jun-2017</nobr> 1:33 pm</p></td> </tr> </tbody></table> <p class='p4 ft2'>DIALOG BROADBAND NETWORKS No. 57, Dharamapala Mawatha,Colombo 03. Sri Lanka.</p> </div> <div style='padding: 50px 0px 15px 20px; font-family: Arial, Helvetica, sans-serif; font-size: 8px; color: #c8c8c8;'> </div> </body>");
          };



          $scope.dataRecipt = [{
              conRef: '0114376494',
              name: 'TEST-QA-NAME',
              receiptNo: 'DBBPDSC00058063',
              receiptDate: '29-Jun-2017',
              receiptTime: '1:33 pm',
              amount: '10.00',
              payMode: 'CASH',
              printedOnDate: '29-Jun-2017',
              printedOnTime: '1:33 pm',
              by: '002',
              address: 'DIALOG BROADBAND NETWORKS (NPoV. T5)7 L, TDDh.a r(aPmVa 2p6a1la) Mawatha,Colombo 03. Sri Lanka.'
          },
          {
              conRef: '2222222222',
              name: 'TEST-ABC-NAME',
              receiptNo: 'DBBPDSC00058063',
              receiptDate: '29-Jun-2017',
              receiptTime: '1:33 pm',
              amount: '10.00',
              payMode: 'CASH',
              printedOnDate: '29-Jun-2017',
              printedOnTime: '1:33 pm',
              by: '002',
              address: 'DIALOG BROADBAND NETWORKS (NPoV. T5)7 L, TDDh.a r(aPmVa 2p6a1la) Mawatha,Colombo 03. Sri Lanka.'

          }];

          $scope.printHtmlListArray = function () {
              for (var i = 0; i < $scope.dataRecipt.length; i++) {
                   DirectPrintService.print(function () {
                      $scope.$apply(function () {
                          console.log('Print Completed');
                          vm.printCompleted = true;
                          $timeout(function () {
                              vm.printCompleted = false;
                          }, 3000);
                      });
                  },
                  "<br><br><br>" +
                  "<body>" +
                  "<div id='page_1'> " +
                      "<table cellpadding='0' cellspacing='0' class='t0'> " +
                            "<tbody>" +
                                "<tr> " +
                                "<td><p>Con Ref</p></td> " +
                                "<td><p>: " + $scope.dataRecipt[i].conRef + "</p></td>" +
                                "<td><p>&nbsp;</p></td> " +
                                "</tr> <tr> " +
                                "<td><p>&nbsp;</p></td> " +
                                "<td><p><nobr>" + $scope.dataRecipt[i].name + "</nobr></p></td> " +
                                "<td><p>&nbsp;</p></td> " +
                                "</tr> <tr> " +
                                "<td><p>Receipt No</p></td> " +
                                "<td><p>: DBBPDSC00058063</p></td> " +
                                "<td><p><nobr>29-Jun-2017</nobr> 1:33 pm</p></td>" +
                                "</tr> <tr>" +
                                "<td><p>Amount</p></td> " +
                                "<td><p>: 10.00</p></td> " +
                                "<td><p>&nbsp;</p></td> " +
                                "</tr> <tr> " +
                                "<td class='tr2'><p>Pay Mode</p></td> " +
                                "<td class='tr2'><p>: CASH</p></td> " +
                                "<td class='tr2'><p>&nbsp;</p></td> " +
                                "</tr> <tr> " +
                                "<td rowspan='2'><p class='p0 ft0'>Printed On</p></td> " +
                                "<td class='tr4 td1'><p>: 0</p></td> " +
                                "<td rowspan='2'><p class='p3 ft0'>By : 002</p></td> " +
                                "</tr> <tr> " +
                                "<td class='tr4 td1'><p>: <nobr>29-Jun-2017</nobr> 1:33 pm</p>" +
                                "</td> </tr> " +
                             "</tbody>" +
                         "</table> " +
                     "<p class='p4 ft2'>DIALOG BROADBAND NETWORKS No. 57, Dharamapala Mawatha,Colombo 03. Sri Lanka.</p> " +
                     "</div> " +
                        "<div style='padding: 50px 0px 15px 20px; font-family: Arial, Helvetica, sans-serif; font-size: 8px; color: #c8c8c8;'>" +
                        "</div>" +
                     "</body>");
              };
          }
     });
}());
