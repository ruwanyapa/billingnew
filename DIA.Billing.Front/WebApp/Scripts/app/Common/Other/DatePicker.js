//Jquery Kendo Date Picker

var DatePicker = function (isNull) {
    isNull = isNull || false;

    //
    var config = null;
    this.options = function (arg) {
        if (arg) { config = arg; }
        else { return config; }
    };

    var elementId = null;
    this.Id = function () { return elementId; };


    var internal = {
        getHandle: function () { return jHandle.data("kendoDatePicker"); }
    };

    var jHandle = null, isinitialized = false;
    this.Init = function (arg, force) {
        force = force || false;

        if (isinitialized === true
            && force === false) { return; }

        elementId = arg;
        jHandle = $('#' + arg + '').kendoDatePicker({
            format: "yyyy/MM/dd"
        });

        isinitialized = true;
    };

    this.open = function () {
        var kHandle = internal.getHandle();
        kHandle.open();
    };

    this.close = function () {
        var kHandle = internal.getHandle();
        kHandle.close();
    };

    this.destroy = function () {
        var kHandle = internal.getHandle();
        kHandle.destroy();
    };

    this.enable = function (arg) {
        arg = arg || false;

        var kHandle = internal.getHandle();
        kHandle.enable(arg);
    };

    this.readonly = function (arg) {
        if (!isinitialized) { return; }

        arg = arg || false;

        var kHandle = internal.getHandle();
        kHandle.readonly(arg);
    };

    this.max = function (arg) {
        var kHandle = internal.getHandle();
        if (arg) { kHandle.max(arg); }
    };

    this.min = function (arg) {
        var kHandle = internal.getHandle();
        if (arg) { kHandle.min(arg); }
    };

    this.setOptions = function (arg) {
        var kHandle = internal.getHandle();
        if (arg) { kHandle.setOptions(arg); }
    };

    this.value = function (arg) {
        var kHandle = internal.getHandle();

        if (arg) { kHandle.value(arg); }
        else { return kHandle.value(); }
    };
};