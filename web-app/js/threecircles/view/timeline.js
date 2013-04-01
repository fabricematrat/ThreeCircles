var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.timeline = function () {
    var that = {};
    var TEN_MINUTES = 600000;
    var ONE_DAY = 86400000;
    var ONE_MINUTE = 60000;
    var ONE_HOUR = 3600000;
    var ONE_MONTH = 30 * ONE_DAY;
    var ONE_YEAR = 12 * ONE_MONTH;

    that.getWhenInformation = function (date) {
        return whenAsTimeline = that.getWhenInformationFromDate(date);
    }

    that.getWhenInformationFromDate = function (date) {
        var now = new Date().getTime();
        var earlier = date;
        var diff = now - earlier;
        if (diff < TEN_MINUTES) {    // less than 10 mins
           return "just now";
        }
        if (TEN_MINUTES <diff && diff < ONE_DAY) {  // between 10 mins to one day
            var minutes = integerDivision(diff, ONE_MINUTE);
            var hours = integerDivision(diff, ONE_HOUR);
            if (hours.quotient) {
                var minutesLeft = integerDivision(hours.remainder, ONE_MINUTE);
                return hours.quotient + " h " + minutesLeft.quotient + " min ago";
            } else {
                return minutes.quotient + " min ago";
            }
        }
        if (ONE_DAY < diff && diff < ONE_MONTH) {
            var days = integerDivision(diff, ONE_DAY);
            if (days.quotient) {
                return days.quotient + " days ago";
            }
        }

        if (ONE_MONTH < diff && diff < ONE_YEAR) {
            var months = integerDivision(diff, ONE_MONTH);
            if (months) {
                return months.quotient + " months ago";
            }
        }
        return "over a year ago";
    }

    var integerDivision = function (numerator, denominator) {
        var remainder = numerator % denominator;
        var quotient = ( numerator - remainder ) / denominator;
        if ( quotient >= 0 ) {
            quotient = Math.floor( quotient );
        }
        else { // negative
            quotient = Math.ceil( quotient );
        }
        return {remainder: remainder, quotient: quotient};
    }

    return that;
};