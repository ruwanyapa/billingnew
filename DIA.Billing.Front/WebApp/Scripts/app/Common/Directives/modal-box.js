//angular.module("DialogBilling")

//    .directive("modal",[function (){
//        return {
//            restrict : "E",
//            replace : true,
//            transclude: true,
//            template : '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content" ng-transclude></div></div></div>'
//        }
//    }])

//    .directive("modalTitle",[function (){
//        return {
//            restrict : "E",
//            replace : true,
//            transclude: true,
//            template : '<div class="modal-header">' +
//                            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
//                            '<h4 class="modal-title" id="myModalLabel" ng-transclude></h4>' +
//                       '</div>'
//        }
//    }])

//    .directive("modalBody",[function (){
//        return {
//            restrict : "E",
//            replace : true,
//            transclude: true,
//            template : '<div class="modal-body" ng-transclude></div>'
//        }
//    }])

//    .directive("modalFooter",[function (){
//        return {
//            restrict : "E",
//            replace : true,
//            transclude: true,
//            template : '<div class="modal-footer" ng-transclude></div>'
//        }
//    }]);