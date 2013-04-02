var threecircles = threecircles || {};
threecircles.model = threecircles.model || {};

threecircles.model.checkinmodel = function() {
    var that = grails.mobile.mvc.model();
    //-----------------------------------------------------------------------------
    // TODO register logged event
    //-----------------------------------------------------------------------------
    that.logged = grails.mobile.event(that);
    //-----------------------------------------------------------------------------
    // end of TODO register logged event
    //-----------------------------------------------------------------------------

    //-----------------------------------------------------------------------------
    // TODO login method on model to save firstname and list of checkins and notify view
    //-----------------------------------------------------------------------------
    that.login = function (item, context) {
        if (!item.errors && !item.error && !item.message) {
            processList(item);
        }
        that.logged.notify({items: item}, context);
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
    //-----------------------------------------------------------------------------
    // end of TODO login method on model to save firstname and list of checkins and notify view
    //-----------------------------------------------------------------------------
    return that;
};