'use strict';

//App Start
angular.module("DialogBilling", [
        "ngRoute",
        "ngSanitize",
        "ngCookies",
      //  "ngAnimate",
      

    //HELPERS
        "kendo.directives",
        "angular-loading-bar",

    //APP
        "UserManagement",         
        "KPIManagement",
        "DiaBillingNav",
        "BulkPayment",
   
        "cfp.hotkeys",
     
        "toaster",
       
    ]);

   
