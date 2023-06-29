//

angular.module("DialogBilling").directive('spValidation', function () {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            var _type = attrs["spValidation"];

            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return;

                //integers-number-text-double

                var transformedInput;

                //console.log(inputValue);

                if(_type=="number"){
                    transformedInput = inputValue.replace(/[^0-9]/g, '');
                } else if(_type=="text"){
                    transformedInput = inputValue.replace(/[^a-zA-Z]/g, '');
                } else if(_type=="double"){
                    transformedInput = inputValue.replace(/[a-zA-Z]/,'');
                } else if(_type=="integers"){
                    transformedInput = inputValue.replace(/[^\-{1}0-9]/,'');
                } else if (_type == "rupees") {
                    transformedInput = inputValue.replace(/[^0-9]/g, '');
                }

                //
                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;

            });

        }
    };
});