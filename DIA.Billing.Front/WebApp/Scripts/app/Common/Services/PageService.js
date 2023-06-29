//

angular.module("DialogBilling").service("Page", [function () {

    var Title = "Home",
        Domain = " :: Billing";

    this.setTitle = function (newTitle) {
        Title = newTitle;
    };

    this.getTitle = function () {
        return Title;
    };

    this.getHeadTitle = function () {
        return (Title + Domain);
    };

    return this;

}]);