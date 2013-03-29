var threecircles = threecircles || {};
threecircles.view = threecircles.view || {};

threecircles.view.placeview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    var mapServiceList = grails.mobile.map.googleMapService();
    var mapServiceForm = grails.mobile.map.googleMapService();

    // Register events
    that.model.listedItems.attach(function (data) {
        mapServiceList.emptyMap('map-canvas-list-place');
        $('#list-place').empty();
        var key, items = model.getItems();
        $.each(items, function(key, value) {
            renderElement(value);
        });
        $('#list-place').listview('refresh');
    });

    that.model.createdItem.attach(function (data, event) {
        $(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-place-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            renderElement(data.item);
            $('#list-place').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-place'));
            }
		}
    });

    that.model.updatedItem.attach(function (data, event) {
        $(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-place-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            updateElement(data.item);
            $('#list-place').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-place'));
            }
        }
    });

    that.model.deletedItem.attach(function (data, event) {
        $(that.elements.remove).removeClass('ui-disabled');
        if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (data.item.offlineStatus === 'NOT-SYNC') {
                $('#place-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
            } else {
                $('#place-list-' + data.item.id).parents('li').remove();
                mapServiceList.removeMarker(data.item.id);
            }
            $('#list-place').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-place'));
            }
        }
    });

    // user interface actions
    $('#section-list-place').on('pageshow', function() {
        mapServiceList.refreshCenterZoomMap();
    });

    $('#section-show-place').on('pageshow', function() {
        if($('#input-place-id').val() === ''){
            navigator.geolocation.getCurrentPosition(function (position) {
                var coord = {
                    latitude : $('#input-place-latitude'),
                    longitude :$('#input-place-longitude')
                };
                mapServiceForm.showMap('map-canvas-form-place', position.coords.latitude, position.coords.longitude, coord);
                mapServiceForm.refreshCenterZoomMap();
            });
        } else {
            mapServiceForm.refreshCenterZoomMap();
        }
    });

    $('#list-all-place').on('vclick', function (e, ui) {
        hideMapDisplay();
        showListDisplay();
    });

    $('#map-all-place').on('vclick', function (e, ui) {
        hideListDisplay();
        showMapDisplay();
    });
    that.elements.list.on('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.on('vclick', function (event) {
        event.stopPropagation();
        $('#form-update-place').validationEngine('hide');
        if($('#form-update-place').validationEngine('validate')) {
            $(this).addClass('ui-disabled');
            var obj = grails.mobile.helper.toObject($('#form-update-place').find('input, select'));
            var newElement = {
                place: JSON.stringify(obj)
            };
            if (obj.id === '') {
                that.createButtonClicked.notify(newElement, event);
            } else {
                that.updateButtonClicked.notify(newElement, event);
            }
        }
    });

    that.elements.remove.on('vclick', function (event) {
        $(this).addClass('ui-disabled');
        event.stopPropagation();
        that.deleteButtonClicked.notify({ id: $('#input-place-id').val() }, event);
    });

    that.elements.add.on('vclick', function (event) {
        $(this).addClass('ui-disabled');
        event.stopPropagation();
        $('#form-update-place').validationEngine('hide');
        $('#form-update-place').validationEngine({promptPosition: 'bottomLeft'});
        createElement();
    });

    var show = function(dataId, event) {
        event.stopPropagation();
        $('#form-update-place').validationEngine('hide');
        $('#form-update-place').validationEngine({promptPosition: 'bottomLeft'});
        showElement(dataId);
    };

    var createElement = function () {
        resetForm('form-update-place');
        $.mobile.changePage($('#section-show-place'));
        $('#delete-place').css('display', 'none');
    };

    var showElement = function (id) {
        resetForm('form-update-place');
        var element = that.model.items[id];
        $.each(element, function (name, value) {
            var input = $('#input-place-' + name);
            if (input.attr('type') != 'file') {
                input.val(value);
            } else {
                var img = encode(value);
                input.parent().css('background-image', 'url("' + img + '")');
            }
            if (input.attr('data-type') == 'date') {
                input.scroller('setDate', (value === '') ? '' : new Date(value), true);
            }
        });
        var coord = {
            latitude : $('#input-place-latitude'),
            longitude :$('#input-place-longitude')
        };
        mapServiceForm.showMap('map-canvas-form-place', element.latitude, element.longitude, coord);
        $('#delete-place').show();
        $.mobile.changePage($('#section-show-place'));
    };

    var resetForm = function (form) {
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
        if(div) {
            if (div[0]) {
                div[0].reset();
            }
            $.each(div.find('input:hidden'), function(id, input) {
                if ($(input).attr('type') != 'file') {
                    $(input).val('');
                } else {
                    $(input).parent().css('background-image', 'url("images/camera.png")');
                }
            });
        }
    };
    
    var hideListDisplay = function () {
        $('#list-place-parent').css('display', 'none');
    };

    var showMapDisplay = function () {
        $('#map-place-parent').css('display', '');
        mapServiceList.refreshCenterZoomMap();
    };

    var  showListDisplay = function () {
        $('#list-place-parent').css('display', '');
    };

    var hideMapDisplay = function () {
        $('#map-place-parent').css('display', 'none');
    };
    
    var createListItem = function (element) {
        var li, a = $('<a>');
        a.attr({
            id : 'place-list-' + element.id,
            'data-id' : element.id,
            'data-transition': 'fade'
        });
        a.text(getText(element));
        a.on('vclick', function(event) {
            show(element.id, event);
        });
        
        if (element.offlineStatus === 'NOT-SYNC') {
            li =  $('<li>').attr({'data-theme': 'e'});
            li.append(a);
        } else {
            li = $('<li>').append(a);
        }
        var id = element.id;
        mapServiceList.addMarker(element, getText(element), function () {
            $('#place-list-' + id).click();
        });
        return li;
    };

    var renderElement = function (element) {
        $('#list-place').append(createListItem(element));
    };

    var updateElement = function (element) {
        mapServiceList.removeMarker(element.id);
        $('#place-list-' + element.id).parents('li').replaceWith(createListItem(element));
    };

    var getText = function (data) {
        var textDisplay = '';
        $.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus'
                && name !== 'status' && name !== 'version' && name != 'longitude' && name != 'latitude'
                && name != 'NOTIFIED') {
                if (typeof value !== 'object') {   // do not display relation in list view
                    textDisplay += value + ' - ';
                }
            }
        });
        return textDisplay.substring(0, textDisplay.length - 2);
    };

    var showGeneralMessage = function(data, event) {
        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.item.message, true );
        setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
        event.stopPropagation();
    };

    return that;
};