var KeyValuePair = function () { 
    this.Key = null;
    this.Value = null;
}; 

String.prototype.padLeft = function (padStr, len) {
    var str = this; while (str.length < len) { str = padStr + str; } return str;
};
var PaymentModesTypes = {
    Cash: 'CA',
    CreditCard: 'CC',
    Cheque: 'CHE',
    StarPoints: 'SP',
    eZCash: 'EZC',
    SMSVoucher: 'SMS',
    GiftVoucher: 'GV',
    BTR: 'BTR',
    IBUY: 'BUY',
    Miscellaneous: 'MIS',
    Voucher: 'VOU',
    PreVoucher: "PRE",
    RS: "RE",
    RSO: "RSO",
    MS2: "MS2",
    DDB: "DDB",
    Genie: "GN"
};

var IdTypes = {
    NIC: 1,
    PP: 2,
    TIN: 3
};

var CardTypes = {
    VISA: 2,
    MASTER: 3,
    AMEX: 4,
    NEXUS: 5
};

var ProductTypes = {
    Other: 0,
    Wifi: 1,
    NFC: 2,
    CDMA: 3,
    LTE: 4,
    VOLTE: 5,
    Fixed:6,

};

var  SwitchStatus  = {
    Connected: 1,
    Disconnected: 2,
    Suspended: 3,
    NotConnected: 4
};

var PaymentMethod = {
    Paymentreceived: 10,
};

var PaymentType = {
    Franchises:2,
    DAPOutlets: 1,
};