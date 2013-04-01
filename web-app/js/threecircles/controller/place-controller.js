var threecircles = threecircles || {};
threecircles.controller = threecircles.controller || {};

threecircles.controller.placecontroller = function (feed, model, view) {
    var that = grails.mobile.mvc.controller(feed, model, view);

    //Place here your custom event
//    view.somethingButtonClicked.attach(function (item, context) {
//          // ....
//          // Notify the model
//          that.model.somethingHappened(data, context);
//    });

    return that;
};
