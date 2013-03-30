var threecircles = threecircles || {};
threecircles.model = threecircles.model || {};

threecircles.model.checkinmodel = function() {
    var that = grails.mobile.mvc.model();

    that.logged = grails.mobile.event(that);
    that.loggedOut = grails.mobile.event(that);

    that.listItems = function (items, notifyView) {
        processList(items);
        if (notifyView) {
            that.listedItems.notify({'items': that.items});
        }
    };

    that.login = function (item, context) {
        if (!item.errors && !item.error && !item.message) {
            processList(item);
        }
        that.logged.notify({items: item}, context);
        return true;
    };

    that.logout = function (item, context) {
        that.username = null;
        that.loggedOut.notify({items: item}, context);
        return true;
    };


    var processList = function(item) {
        if (item.errors || item.message) {
            return false;
        }
        that.username = item.firstname;
        var items = JSON.parse(item.checkins);
        $.each(items, function(key, value){
            that.items[value.id] = value;
        });
    };

    return that;
};