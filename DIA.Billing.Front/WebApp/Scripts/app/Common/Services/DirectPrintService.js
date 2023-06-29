(function () {
    'use strict';

    angular.module('DialogBilling')
      .service('DirectPrintService', function () {
          var printerConnected = false;
          var qz = window.qz;
          
          var service = {};
          service.start = function () {
              qz.websocket.connect().then(function () {
                  printerConnected = true;
                  console.log('Printer Connected.', arguments);
              })
                .catch(function (error) {
                    catchError(error);
                });
          };
          service.print = function (callback, htmlData, printer) {
              if (!!printer) {
                  return printHtml(callback, htmlData, printer);
              }
              service.getDefaultPrinter(function (defaultPrinter) {
                  if (!defaultPrinter) {
                      return catchError('Default Printer not found.');
                  }
                  printHtml(callback, htmlData, defaultPrinter);
              });
          };

          service.printPdf = function (callback, pdfBase64String, printer) {
              if (!!printer) {
                  return printPdf(callback, pdfBase64String, printer);
              }
              service.getDefaultPrinter(function (defaultPrinter) {
                  if (!defaultPrinter) {
                      return catchError('Default Printer noto found.');
                  }
                  printPdf(callback, pdfBase64String, defaultPrinter);
              });
          };

          service.getDefaultPrinter = function (callback) {
              getDefaultPrinter(callback);
          };
          service.getPrinters = getPrinters;

          function printHtml(callback, html, printer) {
              startServiceIfNotStarted(function () {
                  var config = qz.configs.create(printer,
                  {
                      size: { width: 4.50, height: 5.50 }, units: 'in',
                      //colorType: 'grayscale',
                      //interpolation: "nearest-neighbor"
                      margins: { top: 1.7 } //margins: { top: 0.25, right: 0.25, bottom: 0.25, left: 0.25 } 
                  });
                  var data = [{
                      type: 'html',
                      format: 'plain',
                      data: html
                  }];

                  qz.print(config, data)
                    .then(function () {
                        if (callback) {
                            callback();
                        }
                    }).catch(function (e) {
                        catchError(e);
                    });
              });
          }

          function printPdf(callback, pdfBase64String, printer) {
              startServiceIfNotStarted(function () {
                  var config = qz.configs.create(printer);
                  var data = [{
                      type: 'pdf',
                      format: 'base64',
                      data: pdfBase64String
                  }];
                  qz.print(config, data)
                    .then(function () {
                        if (callback) {
                            callback();
                        }
                    }).catch(function (e) {
                        catchError(e);
                    });
              });
          }

          function getPrinters(callback, search) {
              startServiceIfNotStarted(function () {
                  qz.printers.find(search).then(function (defaultPrinter) {
                      if (callback) {
                          callback(defaultPrinter);
                      }
                  }).catch(catchError);
              });
          }

          function getDefaultPrinter(callback) {
              startServiceIfNotStarted(function () {
                  qz.printers.getDefault().then(function (defaultPrinter) {
                      if (callback) {
                          callback(defaultPrinter);
                      }
                  }).catch(catchError);
              });
          }

          function startServiceIfNotStarted(callback) {
              if (qz.websocket.isActive()) {
                  callback();
              } else {
                  qz.websocket.connect().then(callback, function () {
                      window.location.assign('qz:launch');
                      qz.websocket.connect({
                          retries: 5,
                          delay: 1
                      }).then(callback, function () {
                          alert('Client Service is not started or installed.');
                          catchError('Client Service is not started or installed.');
                      });
                  });
              }
          }

          function catchError(err) {
              console.error(err);
          }
          return service;
      });
}());
