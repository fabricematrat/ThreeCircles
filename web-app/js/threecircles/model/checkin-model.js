var threecircles = threecircles || {};
threecircles.model = threecircles.model || {};

threecircles.model.checkinmodel = function() {
    var that = grails.mobile.mvc.model();

    that.logged = grails.mobile.event(that);


    that.login = function (item, context) {
        that.logged.notify({item: item}, context);
        if (item.errors || item.message) {
            return false;
        }
        return true;
    };

    return that;
};