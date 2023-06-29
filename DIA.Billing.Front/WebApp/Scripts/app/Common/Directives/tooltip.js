/**
 * Created by Jeyarathnem on 11/3/2014.
 * Zillione Business Solutions.
 */


angular.module("DialogBilling").directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});


angular.module("DialogBilling").directive('autofocus', ['$document', function ($document) {
    return {
        link: function($scope, $element, attrs) {
            setTimeout(function() {
                $element[0].focus();
            }, 100);
        }
    };
}])