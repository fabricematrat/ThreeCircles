var threecircles = threecircles || {};
threecircles.controller = threecircles.controller || {};

threecircles.controller.checkincontroller = function(feed, model, view) {
    var that = grails.mobile.mvc.controller(feed, model, view);

    view.loginButtonClicked.attach(function (item, context) {
        login(item, context);
    });

    view.logoutButtonClicked.attach(function (item, context) {
        logout(item, context);
    });

    var logout = function (data, context) {
        var loggedOut = function (data) {
            return that.model.logout(data, context);
        };

        var callback = function (response) {
            if (loggedOut(response)) {
                var success = true;
            }  else {
                var error = false;
            }
        };
        send(data, "j_spring_security_logout", callback);
    };

    var login = function (data, context) {
        var logged = function (data) {
            return that.model.login(data, context);
        };

        var callback = function (response) {
            if (logged(response)) {
                var success = true;
            }  else {
                var error = false;
            }
        };
        send(data, "j_spring_security_check" , callback);
    };

    var send = function (item, url, callback) {
        $.ajax({
            cache: false,
            type: "POST",
            async: false,
            data: item,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Ajax-call", "true");
            },
            dataType: "json",
            url: url,
            success: function (data) {
                callback(data, item);
            },
            error: function (xhr) {
                if(xhr.status  == 200) {
                    callback(data, item);
                } else {
                    var data = [];
                    data['item'] = [];
                    data['item']['message'] = xhr.responseText;
                    callback(data, item);
                }
            }
        });
    };

    return that;
};
