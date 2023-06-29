/**
 * Created by SAMi on 20150608.
 * Zillione Business Solutions.
 */

angular.module("DialogBilling").service("PrintService", [function () {
    return {
        OpenPrint: function(verb, url, data, target) {
            var form = document.createElement("form");
            form.action = url;
            form.method = verb;
            form.target = target || "_self";
            if (data) {
                for (var key in data) {
                    var input = document.createElement("textarea");
                    input.name = key;
                    input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                    form.appendChild(input);
                }
            }
            form.style.display = 'none';

            //form.style.left = '100';
            //form.style.top = '100';
            //form.style.height = '750';
            //form.style.width = '1000';
            //form.style.display = 'left=100, top=100, height=750, width= 1000, status=no, resizable= yes, scrollbars= no, toolbar= no,location=no, menubar= no';

            document.body.appendChild(form);
            form.submit();
        }
    }
}]);
