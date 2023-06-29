//

angular.module("DialogBilling").service("PaymentModeService", ["$http", "appConfig", function ($http, appConfig) {

    return {
        initCreditNexusCard: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/InitCreditNexusCard");
            } else {
                return $http.get(appConfig.API_URL + "PaymentMode/InitCreditNexusCard");
            }
        },
        initCheque: function () {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.get(appConfig.POSTPAID_MODULE_URL + "/InitCheque");
            } else {
                return $http.get(appConfig.API_URL + "PaymentMode/InitCheque");
            }
        },
        chequeReslove: function (data) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/chequeReslove", data);
            } else {
                return $http.post(appConfig.API_URL + "PaymentMode/chequeReslove", data);
            }
        },
        EzCashVerifyStatus: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/EzCashVerifyStatus", data);
        },
        VerifyReedemtion: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/VerifyEzCashRedeemedStatus", data);
        },
        EzCashRetrieveAccRef: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/EzCashRetrieveAccRef", data);
        },
        EzCashRedemption: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/EzCashRedemption", data);
        },

        PostEzCashRedemption: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/PostEzCashRedemption", data);
        },

        StShowBalance: function (data) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/StShowBalance", data);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/StShowBalance", data);
            }
        },

        StRequestNfcPin: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/StRequestNfcPin", data);
        },

        StRequestQuestion: function (data) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/StRequestQuestion", data);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/StRequestQuestion", data);
            }
        },

        StarPointsRedemption: function (data) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/StarPointsRedemption", data);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/StarPointsRedemption", data);
            }
        },

        SmRequestVoucher: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/SmRequestVoucher", data);
        },

        GfRequestVoucher: function (data) {
            if (appConfig.IsVoucherCloud == "1") {
                return $http.post(appConfig.VOUCHER_MODULE_URL + "/GfRequestVoucher", data);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/GfRequestVoucher", data);
            }
        },

        initMiscellaneous: function () {
            return $http.get(appConfig.POSTPAID_MODULE_URL + "/InitMiscellaneous");
        },

        VoRetrieveVoucher: function (data) {
            return $http.post(appConfig.API_URL + "PaymentMode/VoRetrieveVoucher", data);
        },

        VerifySerialNumbers: function (data) {
            return $http.get(appConfig.API_URL + "PaymentMode/VerifySerialNumbers/" + data);
        },

        UpdateSerials: function (detailItem) {
            return $http.post(appConfig.API_URL + "PaymentMode/UpdateSerials", detailItem);
        },

        sendPayRequest: function (sendPayRequestRequest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/sendPayRequest", sendPayRequestRequest);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/sendPayRequest", sendPayRequestRequest);
            }
        },

        genieVerifyStatus: function (genieVerifyStatusRequest) {
            if (appConfig.IsPostpaidCloud == "1") {
                return $http.post(appConfig.POSTPAID_MODULE_URL + "/genieVerifyStatus", genieVerifyStatusRequest);
            }
            else {
                return $http.post(appConfig.API_URL + "PaymentMode/genieVerifyStatus", genieVerifyStatusRequest);
            }
        },

        PostPamentModeReferences: function (data, payMode) {
            if (payMode == PaymentModesTypes.CreditCard) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/CreditNexusCardPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/CreditNexusCardPaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.Cheque) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/ChequePaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/ChequePaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.SMSVoucher) {
                return $http.post(appConfig.API_URL + "PaymentMode/SmsGiftVoucherPaymentReference", data);
            }
            else if (payMode == PaymentModesTypes.GiftVoucher) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/GiftVoucherPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/GiftVoucherPaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.BTR) {
                return $http.post(appConfig.API_URL + "PaymentMode/BtrPaymentReference", data);
            }
            else if (payMode == PaymentModesTypes.IBUY) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/IbuyPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/IbuyPaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.Miscellaneous) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/MiscellaneousPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/MiscellaneousPaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.Voucher) {
                return $http.post(appConfig.API_URL + "PaymentMode/VoucherPaymentReference", data);
            } else if (payMode == PaymentModesTypes.DDB) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/IbuyPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/IbuyPaymentReference", data);
                }
            }
            else if (payMode == PaymentModesTypes.MS2) {
                if (appConfig.IsPostpaidCloud == "1") {
                    return $http.post(appConfig.POSTPAID_MODULE_URL + "/IbuyPaymentReference", data);
                }
                else {
                    return $http.post(appConfig.API_URL + "PaymentMode/IbuyPaymentReference", data);
                }
            }
        },

        GetPaymentReferenceDetailsByReferenceId: function (refId, paymentMode) {
            return $http.get(appConfig.API_URL + "PaymentMode/GetPaymentReferenceDetailsByReferenceId/" + refId + "/" + paymentMode);
        },
        getValidator: function () {
            var ErrorTypes = { Email: 1, Max: 2, Maxlength: 3, Min: 4, Minlength: 5, Number: 6, Pattern: 7, Required: 8, Url: 9 };

            return {
                ErrorTypes: ErrorTypes,

                hasError: function (source, type) {
                    var rtnVal = (source.$pristine === false && source.$dirty === true && source.$invalid === true);

                    if (type) {
                        var statusObj = false, errorObj = source.$error;

                        switch (type) {
                            case ErrorTypes.Email:
                                statusObj = errorObj.email; break;

                            case ErrorTypes.Max:
                                statusObj = errorObj.max; break;

                            case ErrorTypes.Maxlength:
                                statusObj = errorObj.maxlength; break;

                            case ErrorTypes.Min:
                                statusObj = errorObj.min; break;

                            case ErrorTypes.Minlength:
                                statusObj = errorObj.minlength; break;

                            case ErrorTypes.Number:
                                statusObj = errorObj.number; break;

                            case ErrorTypes.Pattern:
                                statusObj = errorObj.pattern; break;

                            case ErrorTypes.Required:
                                statusObj = errorObj.required; break;

                            case ErrorTypes.Url:
                                statusObj = errorObj.url; break;

                            default:
                                statusObj = false; break;
                        } rtnVal = rtnVal && statusObj;

                    } return rtnVal;
                },

                showErrors: function (form) {
                    if (form && form.$error && form.$error.required) { } else { return; }

                    for (var i = 0; i < form.$error.required.length; i++) {
                        form.$error.required[i].$pristine = false;
                        form.$error.required[i].$dirty = true;
                        form.$error.required[i].$invalid = true;
                    }
                }
            };
        }
    };
}]);
