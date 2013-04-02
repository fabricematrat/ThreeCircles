var threecircles = threecircles || {};
threecircles.controller = threecircles.controller || {};

threecircles.controller.checkincontroller = function(feed, model, view) {
    var that = grails.mobile.mvc.controller(feed, model, view);

    //var baseURL = "http://localhost:8080/ThreeCircles/Checkin/";
    var baseURL = "http://ThreeCircles.cloudfoundry.com/Checkin/";

    //-----------------------------------------------------------------------------
    // TODO attached a bahavior when loginButtonClicked is raised
    // Do an ajax call (using send method provided)
    //-----------------------------------------------------------------------------

    //-----------------------------------------------------------------------------
    // end of TODO attached a bahavior when loginButtonClicked is raised
    //-----------------------------------------------------------------------------

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
                data['item'] = [];
                data['item']['message'] = xhr.responseText;
                callback(data, item);
            }
        });
    };

    return that;
};

