var threecircles = threecircles || {};
threecircles.controller = threecircles.controller || {};

threecircles.controller.checkincontroller = function(feed, model, view, cfg) {
    var that = grails.mobile.mvc.controller(feed, model, view, cfg);

    var baseURL = cfg.baseURL;
    //var baseURL = "http://localhost:8080/ThreeCircles/Checkin/";
    //var baseURL = "http://ThreeCircles.cloudfoundry.com/Checkin/";

    // TODO attached a bahavior when loginButtonClicked is raised
    // call to login function
    view.loginButtonClicked.attach(function (item, context) {
        login(item, context);
    });

    // TODO login function: do an ajax call to CheckinController.login
    // on success save firstname (returned by server) in data model
    var login = function (data, context) {

        var logged = function (data) {
            return that.model.login(data, context);
        };

        var callback = function (response) {
            if (logged(response)) {
                var success = true;
            } else {
                var error = false;
            }
        };
        send(data, baseURL + "login" , callback);
    };

    var send = function (item, url, callback) {
        $.ajax({
            cache: false,
            type: "POST",
            async: false,
            data: item,
            dataType: "json",
            url: url,
            success: function (data) {
                callback(data, item);
            },
            error: function (xhr) {
                var data = [];
                data['message'] = xhr.responseText;
                callback(data, item);
            }
        });
    };

    return that;
};

