var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.geolocation = function () {
    var that = {};
    that.map = null;

    var markers = [];

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var removeMarker = function (id) {
        var marker = markers[id];
        if (marker) {
            marker.setMap(null);
            delete markers[id];
        }
    };

    var removeMarkers = function () {
        $.each(markers, function (key, marker) {
            if(marker) {
                marker.setMap(null);
            }
            delete markers[key];
        });
    };

    var onError = function() {
        handleNoGeolocation(true);
    };

    var handleNoGeolocation = function(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }
        var options = {
            map: that.map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };
        that.map.setCenter(options.position);
    }

    that.showMapBackground = function(canvas, place) {
        var pos = new google.maps.LatLng(43.7, 7.2);
        if (!that.map) {
            that.map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        }

        that.map.setCenter(pos);

        that.infowindow = new google.maps.InfoWindow({
            map: that.map,
            position: pos
        });
    };

    that.showMap = function(canvas, place) {
        var pos = new google.maps.LatLng(place.lat, place.lng);
        if (!that.map) {
            that.map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        }

        that.map.setCenter(new google.maps.LatLng(place.lat, place.lng));
        var html = null;
        if($('#textarea-1').size() == 0) {
            html = $('<div>');
            html.attr({
                id: "div-bubble",
                style: "width:500px%; display:inline;"
            });
            var span = $('<span>');
            var textarea = $('<textarea>');
            textarea.attr({
                name: "textarea-1",
                id: "textarea-1",
                placeholder: "What are you up to?"
            });
            span.append(textarea);
            html.append(span);
            span = $('<span>');
            span.attr({
                id: "div-for-upload"
            });
            var input = $('<input>');
            input.attr({
                type: "file",
                accept:"image/*",
                "data-role": "none",
                class: "null upload ui-input-text",
                name: "photo",
                id: "input-checkin-photo",
                onchange: "readURL(this);",
                onclick: "readURL(this);"
            });
            span.append(input);
            html.append(span);
        } else {
            html = $('#div-bubble');
        }
        that.infowindow = new google.maps.InfoWindow({
            map: that.map,
            position: pos,
            content: html.html()
        });
    };


    that.showMapWithPlaces = function(canvas, pois, myFunction) {
        //-----------------------------------------------------------------------------
        //  TODO search places nearby with google places
        //-----------------------------------------------------------------------------

    };
    return that;
};