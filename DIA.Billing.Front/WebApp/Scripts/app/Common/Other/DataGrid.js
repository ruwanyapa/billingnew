//Jquery Kendo Grid

var DataGrid = function () {
    var jHandle = null;
    var isInitialized = false;

    var config = null;
    this.options = function (arg) {
        if (arg) { config = arg; config.resizable = true; }
        else { return config; }
    };

    var elementId = null;
    this.Id = function () { return elementId; };

    var internal = {
        getHandle: function () { return jHandle.data("kendoGrid"); }
    };

    this.getDataSource = function () { return jHandle.data("kendoGrid"); };

    this.removeSelectedRow = function (e) {
        var row = $(e.currentTarget).closest("tr");
        var z = "tr:eq(" + row.index() + ")";
        var grid = jHandle.data("kendoGrid");

        grid.removeRow(grid.tbody.find(z));
    };

    this.Init = function (arg, force) {
        force = force || false;

        if (isInitialized == true
            && force == false) { return; }

        elementId = arg;
        jHandle = $('#' + arg + '').kendoGrid();

        isInitialized = true;
    };

    this.dataItem = function (arg) {
        var kHandle = internal.getHandle();

        if (arg) { return kHandle.dataItem(arg); }
        else { return null; }
    };

    this.findByGuid = function (uid) {
        var dataItems = this.data();

        for (var i = 0; i < dataItems.length; i++) {
            if (dataItems[i].uid == uid) { return i; }
        } return -1;
    };

    this.removeByGuid = function (uid) {
        var rwIndex = this.findByGuid(uid);

        if (rwIndex < 0) { return null; }

        var dataItems = this.data();
        var objTemp = dataItems.splice(rwIndex, 1);

        if (objTemp && objTemp.length && objTemp.length > 0) {
            return objTemp[0];
        } else { return null; }
    };

    this.currentCell = function (arg) {
        var kHandle = internal.getHandle();

        if (arg) { kHandle.current(arg); }
        else { return kHandle.current(); }
    };

    this.refresh = function () {
       var kHandle = internal.getHandle();
        kHandle.refresh();
    };

    this.showColumn = function (arg) {
        if (!isInitialized) { return; }

        var kHandle = internal.getHandle();
        kHandle.showColumn(arg);
    };

    this.hideColumn = function (arg) {
        if (!isInitialized) { return; }

        var kHandle = internal.getHandle();        
        kHandle.hideColumn(arg);
    };

    this.data = function (arg) {
        var kHandle = internal.getHandle();

        if (arg) { kHandle.dataSource.data(arg); }
        else { return kHandle.dataSource.data(); }
    };

    this.select = function (arg) {
        var kHandle = internal.getHandle();
        if (arg) { kHandle.select(arg); }
    };
};