/*
*   KPI MANAGEMENT APP
*/

//

angular.module("KPIManagement", []);

//Kpis Management App Route Config
angular.module("KPIManagement").config(["$routeProvider", function ($routeProvider) {

    var _basepath = "./Views/KPIManagement/";

    //Route Navigation
    $routeProvider
         .when("/KPIManagement", {
             templateUrl: _basepath + "Index.html",
             controller: "IndexController",
             permissionCode: "1001"
         })
        .when("/KPIManagement/Kpi", {
            templateUrl: _basepath + "kpi.html",
            controller: "kpiController",
            permissionCode: "1002"
        })
         .when("/KPIManagement/directPrint", {
             templateUrl: _basepath + "printDemo.html",
             controller: "PrintDemoController",
             permissionCode: "1002"
         })
        .when("/KPIManagement/KpiDetails", {           
            templateUrl: _basepath + "KpiDetails.html",
            controller: "KpiDetailsController",
            permissionCode: "1002"
        })
        .when("/KPIManagement/pdfPrint", {
            templateUrl: _basepath + "pdfPrintDemo.html",
            controller: "PdfPrintDemoController",
            permissionCode: "1002"
        })
        .when("/KPIManagement/printDemo", {
            templateUrl: _basepath + "printDemo.html",
            controller: "PrintDemoController",
            permissionCode: "1002"
        })
    ;

}]);