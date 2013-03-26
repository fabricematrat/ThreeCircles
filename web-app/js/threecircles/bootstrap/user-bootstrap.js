var threecircles = threecircles || {};

threecircles.loaduser = (function () {
    threecircles.configuration.domain.push({
        name: 'user',
        view: {
            'list': $('#section-list-user'),
            'save': $('#submit-user'),
            'add': $('#add-user'),
            'show': $('a[id^="user-list-"]'),
            'remove': $('#delete-user')
        },
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
