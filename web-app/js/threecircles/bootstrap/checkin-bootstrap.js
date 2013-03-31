var threecircles = threecircles || {};

threecircles.loadcheckin = (function () {
    threecircles.configuration.domain.push({
        name: 'checkin',
        view: {
            'list': $('#section-list-checkin'),
            'save': $('#submit-checkin'),
            'add': $('#add-checkin'),
            'show': $('a[id^="checkin-list-"]'),
            'remove': $('#delete-checkin')
        },
        hasOneRelations: [ {type: 'user', name: 'owner'} , {type: 'place', name: 'place'} ],
        oneToManyRelations: [ {type: 'user', name: 'friends'} ] ,
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
