angular.module("DialogBilling").constant("appConfig", {

    "BASE_URL": "http://localhost:49514/",
    "API_URL": "http://localhost:45695/api/",
    //"API_URL": "http://172.26.66.58:1001/api/",
    "REPORT_URL": "http://localhost:45696/",
    "DOMAIN_URL": "http://172.26.66.105:1001/Default.aspx",
    //"Billing_URL": "http://localhost:45696/api/",
    "Billing_URL": "http://172.26.66.57:2001/api/",
    //"POSTPAID_MODULE_URL": "https://cposcloud-dev.dialog.lk/postpaidbilling",
    "POSTPAID_MODULE_URL": "http://localhost:4000/postpaidbilling",
    "IsPostpaidCloud": "1",
    //"POSTPAID_REPORT_MODULE_URL": "https://cposcloud-qa.dialog.lk/postpaidbillingbatchprocessbgworker",
    //"POSTPAID_REPORT_MODULE_URL": "http://localhost:4000/postpaidbillingbatchprocessbgworker",

    "USER_MODULE_URL": "https://cposcloud-qa.dialog.lk/usermanagement",
    //"USER_MODULE_URL": "http://localhost:4000/usermanagement",
    "IsUserCloud": "1",

    //"WF_MODULE_URL": "https://cposcloud-qa.dialog.lk/workflowapproval",
    "WF_MODULE_URL": "http://localhost:4000/workflowapproval",
    "IsWFCloud": "1",

    "IsVoucherCloud": "1",
    "VOUCHER_MODULE_URL": "https://cposcloud-qa.dialog.lk/voucher-management",
    //"VOUCHER_MODULE_URL": "http://localhost:4000/voucher-management",

    "IsPrepaidCloud": "1",
    //"PREPAID_MODULE_URL": "https://cposcloud-qa.dialog.lk/prepaidbilling",
    "PREPAID_MODULE_URL": "http://localhost:4000/prepaidbilling",

    "GENERAL_MODULE_URL": "https://cposcloud-qa.dialog.lk/generalservice",
    // "GENERAL_MODULE_URL": "http://localhost:4000/generalservice",
    "IsGeneralCloud": "1",
});