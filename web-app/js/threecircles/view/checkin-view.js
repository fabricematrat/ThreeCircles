var threecircles = threecircles || {};
threecircles.view = threecircles.view || {};

threecircles.view.checkinview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    that.loginButtonClicked = grails.mobile.event();
    that.logoutButtonClicked = grails.mobile.event();

    var timeline = threecirclesconfess.view.timeline();
    var geolocationSearch = threecirclesconfess.view.geolocation();
    var geolocationCheckin = threecirclesconfess.view.geolocation();
    var geolocationBackground = threecirclesconfess.view.geolocation();

    var displayTimeline = function (data, event) {
        if (data.items.errors) {
            $.each(data.items.errors, function(index, error) {
                $('#input-user-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.items.message || data.items.error) {
            showGeneralMessage(data.items.message ? data.items.message : data.items.error, event);
        } else {
            if (!data.items.NOTIFIED) {
                var a = $('<a>');
                a.attr({
                    id: 'logged-username',
                    'data-role': 'button',
                    'data-transition': 'fade'
                });
                a.on('vclick', function(event) {
                    logout(event);
                });
                a.text('Logout '+ model.username);

                $('#logged-username').replaceWith(a);
                $('#logged-username').button();
                $('#list-checkin').empty();
                var key, items = model.getItems();
                addAndSort(items);
                $('#list-checkin').listview('refresh');
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    };

    that.model.logged.attach(displayTimeline);

    that.model.loggedOut.attach(function(event) {
        //event.stopPropagation();
        top.location='';
    });

    $('#submit-login').on('click', function (event) {
        event.stopPropagation();
        $('#form-update-user').validationEngine('hide');
        if($('#form-update-user').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-user').find('input, select'));
            var newElement = obj;
            that.loginButtonClicked.notify(newElement, event);
        }
    });

    var logout = function (event) {
        event.stopPropagation();
        that.logoutButtonClicked.notify({}, event);
    };


    // Register events
    that.model.listedItems.attach(displayTimeline);

    var addAndSort = function(items, item) {
        $('#list-checkin-parent').empty();

        var arr = [];
        $.each(items, function () { arr.push(this); });
        if (item) {
            arr.push(item);
        }
        var itemsSortedWhen = arr.sort(function(a,b){return a.when - b.when}).reverse();
        $.each(itemsSortedWhen, function(key, value) {
            var whenInfo = timeline.getWhenInformation(value.when);
            $('#list-checkin-parent').append(createListItemCustom(value, whenInfo)).trigger("create");
        });
    };

    $('#section-list-checkin').on('swiperight', function(event) {
        $('#mypanel').panel('open');
    });

    $('#section-list-checkin').on('swipeleft', function(event) {
        $('#mypanel').panel('close');
    });

    var createListItemCustom = function (element, timelineDate) {
        var html = '<div class="fs-object"><div class="header"><span class="ownerimage" ><img src="http://placehold.it/100x150/8e8"/></span>' +
            '<span class="placeimage" ><img src="http://placehold.it/80x150/e88"/></span>' +
            '<span class="description">' +
            '<span class="name">' + element.owner.firstname + ' ' + element.owner.lastname  + '</span> at <span class="place">' +
            element.place.name + '</span>' +
            '<span class="address">' + element.place.address + '</span>' +
            '</span></div>';

        html += '<div class="comment">' + element.description;

        $.each(element.friends, function(key, value) {
            html += '<br/>with <span class="name">' + value.firstname +
                '</span>';

        });
        html += '</div>';
        if(element.photo) {
            var base64 = grails.mobile.camera.encode(element.photo);
            html += '<img class="mainimage" src="' + base64 + '"/>';
        }
        html +='<span class="date">' + timelineDate + '</span><a class="commentbutton"><img src="img/comments.png"/></a><a class="likebutton"><img src="img/like.png"/></a>' +
            '</div>';

        html += '<ul class="fs-list">' +
            '<li><img src="img/ico-fire.png" />Back here after 5 months.</li>' +
            '<li><img src="img/ico-fire.png" />First Bar in 2 months!</li></ul>';
        return html;
    };

    that.model.createdItem.attach(function (data, event) {
        $(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-checkin-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data.item.message, event);

        } else {
            resetForm('form-update-checkin');

            if (!data.item.NOTIFIED) {
                addAndSort(model.getItems(), data.item);
                $.mobile.changePage($('#section-list-checkin'));
            } else {
                addAndSort(model.getItems(), data.item);
            }
		}
    });

    // user interface actions
    that.elements.list.on('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.list.on('pageshow', function (e) {
        geolocationBackground.showMapBackground('map_canvas', {}) ;
    });

    var storeLatLng = function(place) {
        that.selectedPlace = place;
    };

    $("#section-show-checkin").on('pageshow', function (event) {
        geolocationSearch.showMapWithPlaces('map_canvas2', "list-place", storeLatLng);
    });

    $("#checkin").on('pageshow', function (event) {
        geolocationCheckin.showMap('map_canvas3', that.selectedPlace);
    });

    $("#checkin-submit").on('vclick', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        if($('#form-update-checkin').validationEngine('validate')) {
            var placeObj = {name: that.selectedPlace.name, address: that.selectedPlace.address, latitude: that.selectedPlace.lat, longitude: that.selectedPlace.lng};
            var description = $('#textarea-1').val();
            var photo = $('#input-checkin-photo');
            var photoValue = "";
            if (photo.attr('data-value')) {
                photoValue = photo.attr('data-value');
            }
            var obj = {
                description: description,
                'owner.id': "1",
                place: placeObj,
                when: new Date().getTime(),
                photo: photoValue
            };
            var newElement = {
                checkin: JSON.stringify(obj)
            };
            that.createButtonClicked.notify(newElement, event);
        }
    });

    var resetForm = function (form) {
        $('#textarea-1').val('');
        $('#input-checkin-photo').parent().css('background-image', 'url("images/camera.png")');
        $('input[data-type="date"]').each(function() {
            $(this).scroller('destroy').scroller({
                preset: 'date',
                theme: 'default',
                display: 'modal',
                mode: 'scroller',
                dateOrder: 'mmD ddyy'
            });
        });
        var div = $("#" + form);
        if(div && div[0]) {
            div[0].reset();
            $.each(div.find('input:hidden'), function(id, input) {
                if ($(input).attr('type') != 'file') {
                    $(input).val('');
                } else {
                    $(input).parent().css('background-image', 'url("images/camera.png")');
                    $(input).attr('data-value', '');
                }
            });
        }
    };

    var showGeneralMessage = function(data, event) {
        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data, true );
        setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
        event.stopPropagation();
    };

    return that;
};