
angular.module("DialogBilling").directive("message", function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: "="
        },
        template: '<div class="message" ng-if="ngModel" ng-class="{\'W\':\'message-warning\', \'S\':\'message-success\', \'E\':\'message-error\', \'I\':\'message-info\'}[ngModel.type]"><b>{{ngModel.title}}</b> <div ng-bind-html="ngModel.message"></div> <div class="message-close" ng-click="messageClose()">×</div></div>',
        link: function ($scope, elem, attr) {
            $scope.messageClose = function () {
                $scope.ngModel = "";
            };
        }
    };
});

var MessageTypes = { Success: 0, Error: 1, Information: 2, Warning: 3, Empty: 4 };

var Message = function (code, message, title) {
    switch (code) {
        case 0:
            this.type = 'S'; break;

        case 1:
            this.type = 'E'; break;

        case 2:
            this.type = 'I'; break;

        case 3:
            this.type = 'W'; break;

        case 4:
            return [];

        default:
            this.type = ''; break;
    }
    this.message = message || ''; this.title = title || '';
};

