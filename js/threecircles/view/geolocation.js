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
    };

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
        var init = ($('#textarea-1').size() == 0);
        if(init) {
            html = $('<div>');
            html.attr({
                style: "display: table",
                id: "div-bubble",
                style: "display:inline;"
            });
            var span = $('<span>');
            span.attr({
                style:"display: table-cell;width: 60%;"
            });
            var textarea = $('<textarea>');
            textarea.attr({
                name: "textarea-1",
                id: "textarea-1",
                style:'width: 60%; height: 60px; font-size:12px;',
                placeholder: "What are you up to?"
            });
            span.append(textarea);
            html.append(span);
            span = $('<span>');
            span.attr({
                id: "div-for-upload",
                style:"display: table-cell;width: 30%;"
            });
            var input = $('<input>');
            input.attr({
                type: "file",
                accept:"image/*",
                "data-role": "none",
                class: "upload ui-input-text",
                name: "photo",
                id: "input-checkin-photo"
            });
            span.append(input);
            html.append(span);
        } else {
            html = $('#div-bubble');
        }

        that.infowindow = new google.maps.InfoWindow({
            map: that.map,
            position: pos,
            pixelOffset: new google.maps.Size(-10, 80),
            maxWidth:200,
            content: html.html()
        });

        if(init) {
            grails.mobile.camera.getPicture($("#input-checkin-photo"));
        }
    };


    that.showMapWithPlaces = function(canvas, pois, myFunction) {
        if (!that.map) {
            that.map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        }

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                that.map.setCenter(pos);

                var request = {
                    bounds: that.map.getBounds()
                };

                removeMarkers();

                var service = new google.maps.places.PlacesService(that.map);
                service.nearbySearch(request, function (results, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        console.log('Error getting Google Place Service');
                        return;
                    }
                    for (var i = 0, result; result = results[i]; i++) {

                        var img = result.icon;
                        var name = result.name;
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(pos, result.geometry.location);
                        var lat = result.geometry.location.lat();
                        var lng = result.geometry.location.lng();
                        var name = result.name;
                        var address = result.vicinity;
                        var li = $('<li>');
                        var a = $('<a>')
                        a.on('click tap', function(event) {
                           myFunction({lat: lat, lng: lng, name: name, address: address});
                        });

                        a.attr({
                            href: "#checkin",
                            'data-transition': "slide"
                        });

                        a.append('<img src="'+ img+'"/><h2>'+ name + '</h2><p>' + distance + ' km</p>');

                        li.append(a);
                        $("#" + pois).append(li);
                        var marker = new google.maps.Marker({
                            map: that.map,
                            position: result.geometry.location
                        });

                        markers.push(marker);
                    }
                    $("#" + pois).listview("refresh");
                });
            }, onError);
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    };
    return that;
};