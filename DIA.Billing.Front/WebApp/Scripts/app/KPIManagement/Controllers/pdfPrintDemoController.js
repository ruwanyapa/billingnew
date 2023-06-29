(function () {
    'use strict';
    angular.module('DialogBilling')
      .controller('PdfPrintDemoController', function (DirectPrintService, $scope, $timeout, $http) {
          var vm = $scope.vm = {};
          PrintService.getPrinters(function (data) {
              data = data || [];
              $scope.$apply(function () {
                  vm.printers = data;
                  vm.selectedPrinter = data[0];
              });
          });
          $scope.savePrinter = function (printer) {
              localStorage.setItem('directPrinter', printer);
              alert('Printer Saved');
          };
          $scope.printPdf = function () {
              vm.printInProgress = true;
              $http.get('/get-pdf-base-64')
                .then(function (res) {
                    var base64String = res.data.data;
                    PrintService.printPdf(function () {
                        $scope.$apply(function () {
                            console.log('Print Completed');
                            vm.printInProgress = false;
                            vm.printCompleted = true;
                            $timeout(function () {
                                vm.printCompleted = false;
                            }, 4000);
                        });
                    }, base64String);
                });
          };
      });
}());
