var threecircles = threecircles || {};
threecircles.view = threecircles.view || {};

threecircles.view.checkinview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    var timeline = threecirclesconfess.view.timeline();
    var geolocationSearch = threecirclesconfess.view.geolocation();
    var geolocationCheckin = threecirclesconfess.view.geolocation();
    var geolocationBackground = threecirclesconfess.view.geolocation()

    // Register events
    that.model.listedItems.attach(function (data) {
        $('#list-checkin').empty();
        var key, items = model.getItems();
        addAndSort(items);
        $('#list-checkin').listview('refresh');
    });

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
    }

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
        //-----------------------------------------------------------------------------
        //  TODO picture
        //-----------------------------------------------------------------------------
        if(element.photo) {

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
            showGeneralMessage(data, event);
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

    that.model.updatedItem.attach(function (data, event) {
        $(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-checkin-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            updateElement(data.item);
            $('#list-checkin').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    });

    that.model.deletedItem.attach(function (data, event) {
        $(that.elements.remove).removeClass('ui-disabled');
        if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (data.item.offlineStatus === 'NOT-SYNC') {
                $('#checkin-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
            } else {
                $('#checkin-list-' + data.item.id).parents('li').remove();
            }
            $('#list-checkin').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    });
    that.model.listedDependentItems.attach(function (data) {
        if (data.relationType === 'many-to-one') {
            renderDependentList(data.dependentName, data.items);
        }
        if (data.relationType === 'one-to-many') {
            renderMultiChoiceDependentList(data.dependentName, data.items);
        }
    });

    // user interface actions
    that.elements.list.on('pageinit', function (e) {
        that.listButtonClicked.notify();
        geolocationBackground.showMapBackground('map_canvas', {}) ;
    });

    that.elements.list.on('pageshow', function (e) {
        geolocationBackground.showMapBackground('map_canvas', {}) ;
    });


    that.elements.save.on('vclick', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        if($('#form-update-checkin').validationEngine('validate')) {
            $(this).addClass('ui-disabled');
            var obj = grails.mobile.helper.toObject($('#form-update-checkin').find('input, select'));
            var newElement = {
                checkin: JSON.stringify(obj)
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
        that.deleteButtonClicked.notify({ id: $('#input-checkin-id').val() }, event);
    });

    that.elements.add.on('vclick', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        $('#form-update-checkin').validationEngine({promptPosition: 'bottomLeft'});
        that.editButtonClicked.notify();
        createElement();
    });

    var show = function(dataId, event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        $('#form-update-checkin').validationEngine({promptPosition: 'bottomLeft'});
        that.editButtonClicked.notify();
        showElement(dataId);
    };

    var createElement = function () {
        resetForm('form-update-checkin');
        $.mobile.changePage($('#section-show-checkin'));
        $('#delete-checkin').css('display', 'none');
    };

    var storeLatLng = function(place) {
        that.selectedPlace = place;
    };

    $('#section-show-checkin').on( 'pageshow', function (event) {
        geolocationSearch.showMapWithPlaces('map_canvas2', 'list-place', storeLatLng);
    });

    $('#checkin').on( 'pageshow', function (event) {
        geolocationCheckin.showMap('map_canvas3', that.selectedPlace);
    });

    $('#checkin-submit').on( 'vclick', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        if($('#form-update-checkin').validationEngine('validate')) {
            //$(this).addClass('ui-disabled');
            var placeObj = {name: that.selectedPlace.name, address: that.selectedPlace.address, latitude: that.selectedPlace.lat, longitude: that.selectedPlace.lng};
            var description = $('#textarea-1').val();
            //-----------------------------------------------------------------------------
            //  TODO picture
            //-----------------------------------------------------------------------------
            var obj = {
                description: description,
                'owner.id': "1",
                place: placeObj,
                when: new Date().getTime()
            };
            var newElement = {
                checkin: JSON.stringify(obj)
            };
            that.createButtonClicked.notify(newElement, event);
        }
    });

    var showElement = function (id) {
        resetForm('form-update-checkin');
        var element = that.model.items[id];
        var value = element['owner.id'];
        if (!value) {
            value = element['owner'];
        }
        if (!value || (value === Object(value))) {
           value = element.owner.id;
        }
        $('select[data-gorm-relation="many-to-one"][name="owner"]').val(value).trigger("change");
        
        var value = element['place.id'];
        if (!value) {
            value = element['place'];
        }
        if (!value || (value === Object(value))) {
           value = element.place.id;
        }
        $('select[data-gorm-relation="many-to-one"][name="place"]').val(value).trigger("change");
        
        var commentsSelected = element.comments;
        $.each(commentsSelected, function (key, value) {
            var selector;
            if (value === Object(value)) {
              selector= '#checkbox-comments-' + value.id;
            } else {
              selector= '#checkbox-comments-' + value;
            }
            $(selector).attr('checked','checked').checkboxradio('refresh');
        });
        var friendsSelected = element.friends;
        $.each(friendsSelected, function (key, value) {
            var selector;
            if (value === Object(value)) {
              selector= '#checkbox-friends-' + value.id;
            } else {
              selector= '#checkbox-friends-' + value;
            }
            $(selector).attr('checked','checked').checkboxradio('refresh');
        });
        $.each(element, function (name, value) {
            var input = $('#input-checkin-' + name);
            if (input.attr('type') != 'file') {
                input.val(value);
            } else {
                var img = grails.mobile.camera.encode(value);
                input.parent().css('background-image', 'url("' + img + '")');
            }
            if (input.attr('data-type') == 'date') {
                input.scroller('setDate', (value === '') ? '' : new Date(value), true);
            }
        });
        $('#delete-checkin').show();
        $.mobile.changePage($('#section-show-checkin'));
    };

    var resetForm = function (form) {
        $('#textarea-1').val('');

        $('#div-for-upload').css('background-image', 'url("images/camera.png")');
        $('#input-checkin-photo').attr('data-value', '');

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
                }
            });
        }
    };
    

    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        } else {
            options = select.attr('options');
        }
        if (options) {
            $('option', select).remove();
            $.each(newOptions, function(val, text) {
                options[options.length] = new Option(text, val);
            });
            select.val(options[0]);
        }
    };

    var renderDependentList = function (dependentName, items) {
        var manyToOneSelectForDependent = $('select[data-gorm-relation="many-to-one"][name=' + dependentName + ']');
        var options = {};
        $.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshSelectDropDown(manyToOneSelectForDependent, options);
    };

    var refreshMultiChoices = function (oneToMany, dependentName, newOptions) {
        oneToMany.empty();
        $.each(newOptions, function(key, val) {
            oneToMany.append('<input type="checkbox" data-gorm-relation="one-to-many" name="'+ dependentName +'" id="checkbox-'+ dependentName +'-' + key + '"/><label for="checkbox-'+ dependentName +'-'+key+'">'+val+'</label>');
        });
        oneToMany.parent().trigger('create');
    };

    var renderMultiChoiceDependentList = function (dependentName, items) {
        var oneToMany = $('#multichoice-' + dependentName);
        var options = {};
        $.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshMultiChoices(oneToMany, dependentName, options);
    };
    
    var createListItem = function (element) {
        var li, a = $('<a>');
        a.attr({
            id : 'checkin-list-' + element.id,
            'data-id' : element.id,
            'data-transition': 'fade'
        });
        a.text(getText(element));
        a.on('vclick', function(event) {
            show(element.id, event);
        });
        
        var image = '<img src="'+ grails.mobile.camera.encode(element.photo) +'"/>';
        a.append(image);

        if (element.offlineStatus === 'NOT-SYNC') {
            li =  $('<li>').attr({'data-theme': 'e'});
            li.append(a);
        } else {
            li = $('<li>').append(a);
        }
        return li;
    };

    var renderElement = function (element) {
        $('#list-checkin').append(createListItem(element));
    };

    var updateElement = function (element) {
        $('#checkin-list-' + element.id).parents('li').replaceWith(createListItem(element));
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
