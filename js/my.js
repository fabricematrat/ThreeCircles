var showMap = function(id, info, ids) { 
	var map;
	var mapOptions = {
	zoom: 14,
	center: new google.maps.LatLng(-34.397, 150.644),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			if (info) {
				var html = '<div style="width:500px%; display:inline;"><span><textarea name="textarea-1" id="textarea-1" placeholder="What are you up to?"></textarea></span><div><img src="http://placehold.it/100x50/8e8"/><img src="http://placehold.it/100x50/8e8"/></div></div>'
				var infowindow = new google.maps.InfoWindow({
					map: map,
					position: pos,
					content: html
				});
			}

			map.setCenter(pos);

			if (ids) {
				var request = {
    				bounds: map.getBounds()/*,
    				rankBy: google.maps.places.RankBy.DISTANCE*/
  				};
				var service = new google.maps.places.PlacesService(map);
				service.nearbySearch(request, function (results, status) {
				  	if (status != google.maps.places.PlacesServiceStatus.OK) {
				    	alert(status);
				    	return;
				  	}
					for (var i = 0, result; result = results[i]; i++) {

					  	var img = result.icon;
					  	var name = result.name;
						var distance = google.maps.geometry.spherical.computeDistanceBetween(pos, result.geometry.location);
						var html = '<li><a href="#checkin" data-transition="slide"><img src="'+ img+'"/><h2>'+ name + '</h2><p>' + distance + ' km</p></a></li>';
						$("#" + ids).append(html);
					    var marker = new google.maps.Marker({
					      map: map,
					      position: result.geometry.location
					    });
					}
				    $("#" + ids).listview("refresh");			  
				});
			}

		}, function() {
			handleNoGeolocation(true);
		});
	} else {
	// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}

	function handleNoGeolocation(errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}
		var options = {
			map: map,
			position: new google.maps.LatLng(60, 105),
			content: content
		};
		var infowindow = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	}

	map = new google.maps.Map(document.getElementById(id), mapOptions);
};


$("#page1").live( "pageshow", function (event) {
    	showMap('map_canvas', false);
    }
);

$("#find").live( "pageshow", function (event) {
    	showMap('map_canvas2', false, "list-place");
    }
);

$("#checkin").live( "pageshow", function (event) {
    	showMap('map_canvas3', true);
    }
);