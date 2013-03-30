var threecircles = threecircles || {};
threecircles.controller = threecircles.controller || {};

threecircles.controller.usercontroller = function(feed, model, view) {
    var controller = grails.mobile.mvc.controller(feed, model, view);

    return controller;
};
