var threecircles = threecircles || {};

threecircles.loadplace = (function () {
    threecircles.configuration.domain.push({
        name: 'place',
        view: {
            'list': $('#section-list-place'),
            'save': $('#submit-place'),
            'add': $('#add-place'),
            'show': $('a[id^="place-list-"]'),
            'remove': $('#delete-place')
        },
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
