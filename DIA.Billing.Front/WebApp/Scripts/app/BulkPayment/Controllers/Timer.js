

angular.module("DialogBilling").directive("abcd", "$interval", function ($interval) {
    return {
                scope: true, // isolate
                transclude: true, // bring in any text or elements
                template: "<span class='clock'><span class='clock-text' ng-transclude></span><span class='clock-time'>{{date.now() | date: timeFormat}}</span></span>",
                /**
                 * $s scopee
                 * $e element
                 * $a attributes
                 */
                link: function ($s, $e, $a) {
                    console.log($s, $e, $a);
                    $s.timeFormat = ($a.format === '12') ? 'hh:mm:ss a' : 'HH:mm:ss';
                    $s.date = Date;
                   $interval(null, 1000);
                }
            };
});