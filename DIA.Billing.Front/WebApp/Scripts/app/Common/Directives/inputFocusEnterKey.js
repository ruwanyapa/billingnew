/*
//FOCUS INPUT on enter keypress DIRECTIVE for input attribute
*/

/** Usage:
  <input next-focus id="field1">
  <input next-focus id="field2">
  <input id="field3">
  Upon pressing ENTER key the directive will switch focus to
  the next field id e.g field2 
  Works for Web, iOS (Go button) & Android (Next button) browsers, 
**/

//
angular.module('DialogBilling').directive('nextFocus', [function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {

            elem.bind('keydown', function (e) {

                var code = e.keyCode || e.which;
                if (code === 13) {

                    console.log(elem);
                    elem.next()[0].focus();
                    // e.preventDefault();
                    //elem.next().focus();
                }
            });
        }
    }
}]);


// ###############################
/*
// Moving a focus when the input text field reaches a max length attribute
*/

angular.module('DialogBilling').directive('autoNext', [function () {
 
    return {
        restrict: 'A',
        link: function (scope, element, attr, form) {
            var tabindex = parseInt(attr.tabindex);
            var maxLength = parseInt(attr.ngMaxlength);
            element.on('keydown', function (e) {
                if (element.val().length == maxLength) {
                    var next = angular.element(document.body).find('[tabindex=' + (tabindex + 1) + ']');
                    if (next.length > 0) {
                        next.focus();
                        return next.triggerHandler('keydown', { which: e.which });
                    }
                    else {
                        return false;
                    }
                }
                return true;
            });

        }
    }



}]);



