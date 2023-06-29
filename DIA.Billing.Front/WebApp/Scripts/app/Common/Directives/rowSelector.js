//

angular.module("DialogBilling").directive('rowSelector', [function () {
    return {
        restrict: 'A',
        scope: true,
        controller: function ($scope) {

            $scope.toggleSelectAll = function (ev) {
                var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
                var items = grid.dataSource.data();
                items.forEach(function (item) {
                    item.IsSelected = ev.target.checked;
                });
            };
        },
        link: function ($scope, $element, $attrs) {
            var options = angular.extend({}, $scope.$eval($attrs.kOptions));

            options.columns.unshift({
                template: "<input type='checkbox' ng-model='dataItem.IsSelected' />",
                title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
                width: 50
            });
        }
    };


}]);
