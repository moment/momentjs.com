// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.0.0",
        round = Math.round, i,
        // internal storage for language config files
        languages = {},

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(\d*)?\.?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing tokens
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO seperator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        // preliminary iso regex
        // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
        isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.S', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            w : 'week',
            M : 'month',
            y : 'year'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return this.weekYear();
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return this.isoWeekYear();
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return ~~(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(~~(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(10 * a / 6), 4);
            },
            X    : function () {
                return this.unix();
            }
        };

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var data = this._data = {},
            years = duration.years || duration.year || duration.y || 0,
            months = duration.months || duration.month || duration.M || 0,
            weeks = duration.weeks || duration.week || duration.w || 0,
            days = duration.days || duration.day || duration.d || 0,
            hours = duration.hours || duration.hour || duration.h || 0,
            minutes = duration.minutes || duration.minute || duration.m || 0,
            seconds = duration.seconds || duration.second || duration.s || 0,
            milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;

        // representation for dateAddRemove
        this._milliseconds = milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months +
            years * 12;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;
        seconds += absRound(milliseconds / 1000);

        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);

        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);

        data.hours = hours % 24;
        days += absRound(hours / 24);

        days += weeks * 7;
        data.days = days % 30;

        months += absRound(days / 30);

        data.months = months % 12;
        years += absRound(months / 12);

        data.years = years;
    }


    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours,
            currentDate;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            currentDate = mom.date();
            mom.date(1)
                .month(mom.month() + months * isAdding)
                .date(Math.min(currentDate, mom.daysInMonth()));
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        return units ? unitAliases[units] || units.toLowerCase().replace(/(.)s$/, '$1') : units;
    }


    /************************************
        Languages
    ************************************/


    Language.prototype = {
        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },
        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        }
    };

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        if (!key) {
            return moment.fn._lang;
        }
        if (!languages[key] && hasModule) {
            require('./lang/' + key);
        }
        return languages[key];
    }


    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat(input) || input;
        }

        while (i-- && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        }

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token) {
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
            return parseTokenFourDigits;
        case 'YYYYY':
            return parseTokenSixDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'a':
        case 'A':
            return parseTokenWord;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
            return parseTokenOneOrTwoDigits;
        default :
            return new RegExp(token.replace('\\', ''));
        }
    }

    function timezoneMinutesFromString(string) {
        var tzchunk = (parseTokenTimezone.exec(string) || [])[0],
            parts = (tzchunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + ~~parts[2];

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, b,
            datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[1] = a;
            } else {
                config._isValid = false;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DDDD
        case 'DD' : // fall through to DDDD
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                datePartArray[2] = ~~input;
            }
            break;
        // YEAR
        case 'YY' :
            datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
            datePartArray[0] = ~~input;
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = ((input + '').toLowerCase() === 'pm');
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[3] = ~~input;
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[4] = ~~input;
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[5] = ~~input;
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
            datePartArray[6] = ~~ (('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        }

        // if the input is null, the date is not valid
        if (input == null) {
            config._isValid = false;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(config) {
        var i, date, input = [];

        if (config._d) {
            return;
        }

        for (i = 0; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[3] += ~~((config._tzm || 0) / 60);
        input[4] += ~~((config._tzm || 0) % 60);

        date = new Date(0);

        if (config._useUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }

        config._d = date;
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var tokens = config._f.match(formattingTokens),
            string = config._i,
            i, parsedInput;

        config._a = [];

        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            if (parsedInput) {
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            }
            // don't parse if its not a known token
            if (formatTokenFunctions[tokens[i]]) {
                addTimeToArrayFromToken(tokens[i], parsedInput, config);
            }
        }
        // handle am pm
        if (config._isPm && config._a[3] < 12) {
            config._a[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[3] === 12) {
            config._a[3] = 0;
        }
        // return
        dateFromArray(config);
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            tempMoment,
            bestMoment,

            scoreToBeat = 99,
            i,
            currentScore;

        for (i = config._f.length; i > 0; i--) {
            tempConfig = extend({}, config);
            tempConfig._f = config._f[i - 1];
            makeDateFromStringAndFormat(tempConfig);
            tempMoment = new Moment(tempConfig);

            if (tempMoment.isValid()) {
                bestMoment = tempMoment;
                break;
            }

            currentScore = compareArrays(tempConfig._a, tempMoment.toArray());

            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempMoment;
            }
        }

        extend(config, bestMoment);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i,
            string = config._i;
        if (isoRegex.exec(string)) {
            config._f = 'YYYY-MM-DDT';
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (parseTokenTimezone.exec(string)) {
                config._f += " Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromArray(config);
        } else {
            config._d = input instanceof Date ? new Date(+input) : new Date(input);
        }
    }


    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }


    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || input === '') {
            return null;
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = extend({}, input);
            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang) {
        return makeMoment({
            _i : input,
            _f : format,
            _l : lang,
            _isUTC : false
        });
    };

    // creating with utc
    moment.utc = function (input, format, lang) {
        return makeMoment({
            _useUTC : true,
            _isUTC : true,
            _l : lang,
            _i : input,
            _f : format
        });
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._data : (isNumber ? {} : input)),
            matched = aspNetTimeSpanJsonRegex.exec(input),
            sign,
            ret;

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (matched) {
            sign = (matched[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: ~~matched[2] * sign,
                h: ~~matched[3] * sign,
                m: ~~matched[4] * sign,
                s: ~~matched[5] * sign,
                ms: ~~matched[6] * sign
            };
        }

        ret = new Duration(duration);

        if (isDuration && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var i;

        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(key, values);
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };


    /************************************
        Moment Prototype
    ************************************/


    moment.fn = Moment.prototype = {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toJSON : function () {
            return formatMoment(moment(this).utc(), 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            if (this._isValid == null) {
                if (this._a) {
                    this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
                } else {
                    this._isValid = !isNaN(this._d.getTime());
                }
            }
            return !!this._isValid;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = this._isUTC ? moment(input).zone(this._offset || 0) : moment(input).local(),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                output += ((this - moment(this).startOf('month')) - (that - moment(that).startOf('month'))) / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that) - zoneDiff;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                    units === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().startOf('day'), 'days', true),
                format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().weekdaysParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }
                this._d['set' + utc + 'Month'](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            }

            return this;
        },

        endOf: function (units) {
            return this.startOf(units).add(units, 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) === +moment(input).startOf(units);
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        daysInMonth : function () {
            return moment.utc([this.year(), this.month() + 1, 0]).date();
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this._d.getDay() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // iso weeks start on monday, which is 1, so we subtract 1 (and add
            // 7 for negative mod to work).
            var weekday = (this._d.getDay() + 6) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    };

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    /************************************
        Duration Prototype
    ************************************/


    moment.duration.fn = Duration.prototype = {
        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              ~~(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang
    };

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });


    /************************************
        Exposing Moment
    ************************************/


    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['moment'] = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
}).call(this);

(function(){
    function onload (moment) {
(function(){
// moment.js language configuration
// language : Moroccan Arabic (ar-ma)
// author : ElFadili Yassine : https://github.com/ElFadiliY
// author : Abdel Said : https://github.com/abdelsaid

moment.lang('ar-ma', {
    months : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
    monthsShort : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
    weekdays : "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
    weekdaysShort : "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
    weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[اليوم على الساعة] LT",
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "في %s",
        past : "منذ %s",
        s : "ثوان",
        m : "دقيقة",
        mm : "%d دقائق",
        h : "ساعة",
        hh : "%d ساعات",
        d : "يوم",
        dd : "%d أيام",
        M : "شهر",
        MM : "%d أشهر",
        y : "سنة",
        yy : "%d سنوات"
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Arabic (ar)
// author : Abdel Said : https://github.com/abdelsaid
// changes in months, weekdays : Ahmed Elkhatib

moment.lang('ar', {
    months : "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
    monthsShort : "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
    weekdays : "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
    weekdaysShort : "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
    weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[اليوم على الساعة] LT",
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "في %s",
        past : "منذ %s",
        s : "ثوان",
        m : "دقيقة",
        mm : "%d دقائق",
        h : "ساعة",
        hh : "%d ساعات",
        d : "يوم",
        dd : "%d أيام",
        M : "شهر",
        MM : "%d أشهر",
        y : "سنة",
        yy : "%d سنوات"
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : bulgarian (bg)
// author : Krasen Borisov : https://github.com/kraz

moment.lang('bg', {
    months : "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
    monthsShort : "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
    weekdays : "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
    weekdaysShort : "нед_пон_вто_сря_чет_пет_съб".split("_"),
    weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
    longDateFormat : {
        LT : "h:mm",
        L : "D.MM.YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[Днес в] LT',
        nextDay : '[Утре в] LT',
        nextWeek : 'dddd [в] LT',
        lastDay : '[Вчера в] LT',
        lastWeek : function () {
            switch (this.day()) {
            case 0:
            case 3:
            case 6:
                return '[В изминалата] dddd [в] LT';
            case 1:
            case 2:
            case 4:
            case 5:
                return '[В изминалия] dddd [в] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "след %s",
        past : "преди %s",
        s : "няколко секунди",
        m : "минута",
        mm : "%d минути",
        h : "час",
        hh : "%d часа",
        d : "ден",
        dd : "%d дни",
        M : "месец",
        MM : "%d месеца",
        y : "година",
        yy : "%d години"
    },
    ordinal : function (number) {
        var lastDigit = number % 10,
            last2Digits = number % 100;
        if (number === 0) {
            return number + '-ев';
        } else if (last2Digits === 0) {
            return number + '-ен';
        } else if (last2Digits > 10 && last2Digits < 20) {
            return number + '-ти';
        } else if (lastDigit === 1) {
            return number + '-ви';
        } else if (lastDigit === 2) {
            return number + '-ри';
        } else if (lastDigit === 7 || lastDigit === 8) {
            return number + '-ми';
        } else {
            return number + '-ти';
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : catalan (ca)
// author : Juan G. Hurtado : https://github.com/juanghurtado

moment.lang('ca', {
    months : "Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre".split("_"),
    monthsShort : "Gen._Febr._Mar._Abr._Mai._Jun._Jul._Ag._Set._Oct._Nov._Des.".split("_"),
    weekdays : "Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte".split("_"),
    weekdaysShort : "Dg._Dl._Dt._Dc._Dj._Dv._Ds.".split("_"),
    weekdaysMin : "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay : function () {
            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextDay : function () {
            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastDay : function () {
            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "en %s",
        past : "fa %s",
        s : "uns segons",
        m : "un minut",
        mm : "%d minuts",
        h : "una hora",
        hh : "%d hores",
        d : "un dia",
        dd : "%d dies",
        M : "un mes",
        MM : "%d mesos",
        y : "un any",
        yy : "%d anys"
    },
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : czech (cs)
// author : petrbela : https://github.com/petrbela

var months = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
    monthsShort = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");

function plural(n) {
    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
}

function translate(number, withoutSuffix, key, isFuture) {
    var result = number + " ";
    switch (key) {
    case 's':  // a few seconds / in a few seconds / a few seconds ago
        return (withoutSuffix || isFuture) ? 'pár vteřin' : 'pár vteřinami';
    case 'm':  // a minute / in a minute / a minute ago
        return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
    case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'minuty' : 'minut');
        } else {
            return result + 'minutami';
        }
        break;
    case 'h':  // an hour / in an hour / an hour ago
        return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
    case 'hh': // 9 hours / in 9 hours / 9 hours ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'hodiny' : 'hodin');
        } else {
            return result + 'hodinami';
        }
        break;
    case 'd':  // a day / in a day / a day ago
        return (withoutSuffix || isFuture) ? 'den' : 'dnem';
    case 'dd': // 9 days / in 9 days / 9 days ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'dny' : 'dní');
        } else {
            return result + 'dny';
        }
        break;
    case 'M':  // a month / in a month / a month ago
        return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
    case 'MM': // 9 months / in 9 months / 9 months ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'měsíce' : 'měsíců');
        } else {
            return result + 'měsíci';
        }
        break;
    case 'y':  // a year / in a year / a year ago
        return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
    case 'yy': // 9 years / in 9 years / 9 years ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'roky' : 'let');
        } else {
            return result + 'lety';
        }
        break;
    }
}

moment.lang('cs', {
    months : months,
    monthsShort : monthsShort,
    monthsParse : (function (months, monthsShort) {
        var i, _monthsParse = [];
        for (i = 0; i < 12; i++) {
            // use custom parser to solve problem with July (červenec)
            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
        }
        return _monthsParse;
    }(months, monthsShort)),
    weekdays : "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
    weekdaysShort : "ne_po_út_st_čt_pá_so".split("_"),
    weekdaysMin : "ne_po_út_st_čt_pá_so".split("_"),
    longDateFormat : {
        LT: "H:mm",
        L : "DD.MM.YYYY",
        LL : "D. MMMM YYYY",
        LLL : "D. MMMM YYYY LT",
        LLLL : "dddd D. MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[dnes v] LT",
        nextDay: '[zítra v] LT',
        nextWeek: function () {
            switch (this.day()) {
            case 0:
                return '[v neděli v] LT';
            case 1:
            case 2:
                return '[v] dddd [v] LT';
            case 3:
                return '[ve středu v] LT';
            case 4:
                return '[ve čtvrtek v] LT';
            case 5:
                return '[v pátek v] LT';
            case 6:
                return '[v sobotu v] LT';
            }
        },
        lastDay: '[včera v] LT',
        lastWeek: function () {
            switch (this.day()) {
            case 0:
                return '[minulou neděli v] LT';
            case 1:
            case 2:
                return '[minulé] dddd [v] LT';
            case 3:
                return '[minulou středu v] LT';
            case 4:
            case 5:
                return '[minulý] dddd [v] LT';
            case 6:
                return '[minulou sobotu v] LT';
            }
        },
        sameElse: "L"
    },
    relativeTime : {
        future : "za %s",
        past : "před %s",
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : chuvash (cv)
// author : Anatoly Mironov : https://github.com/mirontoli


moment.lang('cv', {
    months : "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),
    monthsShort : "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),
    weekdays : "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),
    weekdaysShort : "выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),
    weekdaysMin : "вр_тн_ыт_юн_кç_эр_шм".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD-MM-YYYY",
        LL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",
        LLL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",
        LLLL : "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"
    },
    calendar : {
        sameDay: '[Паян] LT [сехетре]',
        nextDay: '[Ыран] LT [сехетре]',
        lastDay: '[Ĕнер] LT [сехетре]',
        nextWeek: '[Çитес] dddd LT [сехетре]',
        lastWeek: '[Иртнĕ] dddd LT [сехетре]',
        sameElse: 'L'
    },
    relativeTime : {
        future : function (output) {
            var affix = /сехет$/i.exec(output) ? "рен" : /çул$/i.exec(output) ? "тан" : "ран";
            return output + affix;
        },
        past : "%s каялла",
        s : "пĕр-ик çеккунт",
        m : "пĕр минут",
        mm : "%d минут",
        h : "пĕр сехет",
        hh : "%d сехет",
        d : "пĕр кун",
        dd : "%d кун",
        M : "пĕр уйăх",
        MM : "%d уйăх",
        y : "пĕр çул",
        yy : "%d çул"
    },
    ordinal : '%d-мĕш',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : danish (da)
// author : Ulrik Nielsen : https://github.com/mrbase

moment.lang('da', {
    months : "Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),
    monthsShort : "Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec".split("_"),
    weekdays : "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
    weekdaysShort : "Søn_Man_Tir_Ons_Tor_Fre_Lør".split("_"),
    weekdaysMin : "Sø_Ma_Ti_On_To_Fr_Lø".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D. MMMM, YYYY LT"
    },
    calendar : {
        sameDay : '[I dag kl.] LT',
        nextDay : '[I morgen kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[I går kl.] LT',
        lastWeek : '[sidste] dddd [kl] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "om %s",
        past : "%s siden",
        s : "få sekunder",
        m : "et minut",
        mm : "%d minutter",
        h : "en time",
        hh : "%d timer",
        d : "en dag",
        dd : "%d dage",
        M : "en måned",
        MM : "%d måneder",
        y : "et år",
        yy : "%d år"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : german (de)
// author : lluchs : https://github.com/lluchs

moment.lang('de', {
    months : "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
    monthsShort : "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
    weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
    weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
    weekdaysMin : "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
    longDateFormat : {
        LT: "H:mm [Uhr]",
        L : "DD.MM.YYYY",
        LL : "D. MMMM YYYY",
        LLL : "D. MMMM YYYY LT",
        LLLL : "dddd, D. MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Heute um] LT",
        sameElse: "L",
        nextDay: '[Morgen um] LT',
        nextWeek: 'dddd [um] LT',
        lastDay: '[Gestern um] LT',
        lastWeek: '[letzten] dddd [um] LT'
    },
    relativeTime : {
        future : "in %s",
        past : "vor %s",
        s : "ein paar Sekunden",
        m : "einer Minute",
        mm : "%d Minuten",
        h : "einer Stunde",
        hh : "%d Stunden",
        d : "einem Tag",
        dd : "%d Tagen",
        M : "einem Monat",
        MM : "%d Monaten",
        y : "einem Jahr",
        yy : "%d Jahren"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : modern greek (el)
// author : Aggelos Karalias : https://github.com/mehiel

moment.lang('el', {
    monthsNominativeEl : "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
    monthsGenitiveEl : "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
    months : function (momentToFormat, format) {
        if (/D/.test(format.substring(0, format.indexOf("MMMM")))) { // if there is a day number before 'MMMM'
            return this._monthsGenitiveEl[momentToFormat.month()];
        } else {
            return this._monthsNominativeEl[momentToFormat.month()];
        }
    },
    monthsShort : "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
    weekdays : "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
    weekdaysShort : "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
    weekdaysMin : "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'μμ' : 'ΜΜ';
        } else {
            return isLower ? 'πμ' : 'ΠΜ';
        }
    },
    longDateFormat : {
        LT : "h:mm A",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendarEl : {
        sameDay : '[Σήμερα {}] LT',
        nextDay : '[Αύριο {}] LT',
        nextWeek : 'dddd [{}] LT',
        lastDay : '[Χθες {}] LT',
        lastWeek : '[την προηγούμενη] dddd [{}] LT',
        sameElse : 'L'
    },
    calendar : function (key, mom) {
        var output = this._calendarEl[key],
            hours = mom && mom.hours();

        return output.replace("{}", (hours % 12 === 1 ? "στη" : "στις"));
    },
    relativeTime : {
        future : "σε %s",
        past : "%s πριν",
        s : "δευτερόλεπτα",
        m : "ένα λεπτό",
        mm : "%d λεπτά",
        h : "μία ώρα",
        hh : "%d ώρες",
        d : "μία μέρα",
        dd : "%d μέρες",
        M : "ένας μήνας",
        MM : "%d μήνες",
        y : "ένας χρόνος",
        yy : "%d χρόνια"
    },
    ordinal : function (number) {
        return number + 'η';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : canadian english (en-ca)
// author : Jonathan Abourbih : https://github.com/jonbca

moment.lang('en-ca', {
    months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
    longDateFormat : {
        LT : "h:mm A",
        L : "YYYY-MM-DD",
        LL : "D MMMM, YYYY",
        LLL : "D MMMM, YYYY LT",
        LLLL : "dddd, D MMMM, YYYY LT"
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "%s ago",
        s : "a few seconds",
        m : "a minute",
        mm : "%d minutes",
        h : "an hour",
        hh : "%d hours",
        d : "a day",
        dd : "%d days",
        M : "a month",
        MM : "%d months",
        y : "a year",
        yy : "%d years"
    },
    ordinal : function (number) {
        var b = number % 10,
            output = (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});
})();
(function(){
// moment.js language configuration
// language : great britain english (en-gb)
// author : Chris Gedrim : https://github.com/chrisgedrim

moment.lang('en-gb', {
    months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
    longDateFormat : {
        LT : "h:mm A",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "%s ago",
        s : "a few seconds",
        m : "a minute",
        mm : "%d minutes",
        h : "an hour",
        hh : "%d hours",
        d : "a day",
        dd : "%d days",
        M : "a month",
        MM : "%d months",
        y : "a year",
        yy : "%d years"
    },
    ordinal : function (number) {
        var b = number % 10,
            output = (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : esperanto (eo)
// author : Colin Dean : https://github.com/colindean
// komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
//          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

moment.lang('eo', {
    months : "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
    monthsShort : "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
    weekdays : "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
    weekdaysShort : "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "D[-an de] MMMM, YYYY",
        LLL : "D[-an de] MMMM, YYYY LT",
        LLLL : "dddd, [la] D[-an de] MMMM, YYYY LT"
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'p.t.m.' : 'P.T.M.';
        } else {
            return isLower ? 'a.t.m.' : 'A.T.M.';
        }
    },
    calendar : {
        sameDay : '[Hodiaŭ je] LT',
        nextDay : '[Morgaŭ je] LT',
        nextWeek : 'dddd [je] LT',
        lastDay : '[Hieraŭ je] LT',
        lastWeek : '[pasinta] dddd [je] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "je %s",
        past : "antaŭ %s",
        s : "sekundoj",
        m : "minuto",
        mm : "%d minutoj",
        h : "horo",
        hh : "%d horoj",
        d : "tago",//ne 'diurno', ĉar estas uzita por proksimumo
        dd : "%d tagoj",
        M : "monato",
        MM : "%d monatoj",
        y : "jaro",
        yy : "%d jaroj"
    },
    ordinal : "%da",
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : spanish (es)
// author : Julio Napurí : https://github.com/julionc

moment.lang('es', {
    months : "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
    monthsShort : "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
    weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
    weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
    weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD/MM/YYYY",
        LL : "D [de] MMMM [de] YYYY",
        LLL : "D [de] MMMM [de] YYYY LT",
        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "en %s",
        past : "hace %s",
        s : "unos segundos",
        m : "un minuto",
        mm : "%d minutos",
        h : "una hora",
        hh : "%d horas",
        d : "un día",
        dd : "%d días",
        M : "un mes",
        MM : "%d meses",
        y : "un año",
        yy : "%d años"
    },
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : estonian (et)
// author : Henry Kehlmann : https://github.com/madhenry

function translateSeconds(number, withoutSuffix, key, isFuture) {
    return (isFuture || withoutSuffix) ? 'paari sekundi' : 'paar sekundit';
}

moment.lang('et', {
    months        : "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
    monthsShort   : "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
    weekdays      : "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
    weekdaysShort : "P_E_T_K_N_R_L".split("_"),
    weekdaysMin   : "P_E_T_K_N_R_L".split("_"),
    longDateFormat : {
        LT   : "H:mm",
        L    : "DD.MM.YYYY",
        LL   : "D. MMMM YYYY",
        LLL  : "D. MMMM YYYY LT",
        LLLL : "dddd, D. MMMM YYYY LT"
    },
    calendar : {
        sameDay  : '[Täna,] LT',
        nextDay  : '[Homme,] LT',
        nextWeek : '[Järgmine] dddd LT',
        lastDay  : '[Eile,] LT',
        lastWeek : '[Eelmine] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s pärast",
        past   : "%s tagasi",
        s      : translateSeconds,
        m      : "minut",
        mm     : "%d minutit",
        h      : "tund",
        hh     : "%d tundi",
        d      : "päev",
        dd     : "%d päeva",
        M      : "kuu",
        MM     : "%d kuud",
        y      : "aasta",
        yy     : "%d aastat"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : euskara (eu)
// author : Eneko Illarramendi : https://github.com/eillarra

moment.lang('eu', {
    months : "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
    monthsShort : "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
    weekdays : "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
    weekdaysShort : "ig._al._ar._az._og._ol._lr.".split("_"),
    weekdaysMin : "ig_al_ar_az_og_ol_lr".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "YYYY[ko] MMMM[ren] D[a]",
        LLL : "YYYY[ko] MMMM[ren] D[a] LT",
        LLLL : "dddd, YYYY[ko] MMMM[ren] D[a] LT",
        l : "YYYY-M-D",
        ll : "YYYY[ko] MMM D[a]",
        lll : "YYYY[ko] MMM D[a] LT",
        llll : "ddd, YYYY[ko] MMM D[a] LT"
    },
    calendar : {
        sameDay : '[gaur] LT[etan]',
        nextDay : '[bihar] LT[etan]',
        nextWeek : 'dddd LT[etan]',
        lastDay : '[atzo] LT[etan]',
        lastWeek : '[aurreko] dddd LT[etan]',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s barru",
        past : "duela %s",
        s : "segundo batzuk",
        m : "minutu bat",
        mm : "%d minutu",
        h : "ordu bat",
        hh : "%d ordu",
        d : "egun bat",
        dd : "%d egun",
        M : "hilabete bat",
        MM : "%d hilabete",
        y : "urte bat",
        yy : "%d urte"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : finnish (fi)
// author : Tarmo Aidantausta : https://github.com/bleadof

var numbers_past = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
    numbers_future = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
                      numbers_past[7], numbers_past[8], numbers_past[9]];

function translate(number, withoutSuffix, key, isFuture) {
    var result = "";
    switch (key) {
    case 's':
        return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
    case 'm':
        return isFuture ? 'minuutin' : 'minuutti';
    case 'mm':
        result = isFuture ? 'minuutin' : 'minuuttia';
        break;
    case 'h':
        return isFuture ? 'tunnin' : 'tunti';
    case 'hh':
        result = isFuture ? 'tunnin' : 'tuntia';
        break;
    case 'd':
        return isFuture ? 'päivän' : 'päivä';
    case 'dd':
        result = isFuture ? 'päivän' : 'päivää';
        break;
    case 'M':
        return isFuture ? 'kuukauden' : 'kuukausi';
    case 'MM':
        result = isFuture ? 'kuukauden' : 'kuukautta';
        break;
    case 'y':
        return isFuture ? 'vuoden' : 'vuosi';
    case 'yy':
        result = isFuture ? 'vuoden' : 'vuotta';
        break;
    }
    result = verbal_number(number, isFuture) + " " + result;
    return result;
}

function verbal_number(number, isFuture) {
    return number < 10 ? (isFuture ? numbers_future[number] : numbers_past[number]) : number;
}

moment.lang('fi', {
    months : "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
    monthsShort : "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
    weekdays : "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
    weekdaysShort : "su_ma_ti_ke_to_pe_la".split("_"),
    weekdaysMin : "su_ma_ti_ke_to_pe_la".split("_"),
    longDateFormat : {
        LT : "HH.mm",
        L : "DD.MM.YYYY",
        LL : "Do MMMM[ta] YYYY",
        LLL : "Do MMMM[ta] YYYY, [klo] LT",
        LLLL : "dddd, Do MMMM[ta] YYYY, [klo] LT",
        l : "D.M.YYYY",
        ll : "Do MMM YYYY",
        lll : "Do MMM YYYY, [klo] LT",
        llll : "ddd, Do MMM YYYY, [klo] LT"
    },
    calendar : {
        sameDay : '[tänään] [klo] LT',
        nextDay : '[huomenna] [klo] LT',
        nextWeek : 'dddd [klo] LT',
        lastDay : '[eilen] [klo] LT',
        lastWeek : '[viime] dddd[na] [klo] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s päästä",
        past : "%s sitten",
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    ordinal : "%d.",
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : canadian french (fr-ca)
// author : Jonathan Abourbih : https://github.com/jonbca

moment.lang('fr-ca', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "un an",
        yy : "%d ans"
    },
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : '');
    }
});
})();
(function(){
// moment.js language configuration
// language : french (fr)
// author : John Fischer : https://github.com/jfroffice

moment.lang('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "un an",
        yy : "%d ans"
    },
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : '');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : galician (gl)
// author : Juan G. Hurtado : https://github.com/juanghurtado

moment.lang('gl', {
    months : "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Octubro_Novembro_Decembro".split("_"),
    monthsShort : "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
    weekdays : "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
    weekdaysShort : "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
    weekdaysMin : "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay : function () {
            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        nextDay : function () {
            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        lastDay : function () {
            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
        },
        lastWeek : function () {
            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "en %s",
        past : "fai %s",
        s : "uns segundo",
        m : "un minuto",
        mm : "%d minutos",
        h : "unha hora",
        hh : "%d horas",
        d : "un día",
        dd : "%d días",
        M : "un mes",
        MM : "%d meses",
        y : "un ano",
        yy : "%d anos"
    },
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Hebrew (he)
// author : Tomer Cohen : https://github.com/tomer
// author : Moshe Simantov : https://github.com/DevelopmentIL

moment.lang('he', {
    months : "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
    monthsShort : "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
    weekdays : "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
    weekdaysShort : "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
    weekdaysMin : "א_ב_ג_ד_ה_ו_ש".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D [ב]MMMM YYYY",
        LLL : "D [ב]MMMM YYYY LT",
        LLLL : "dddd, D [ב]MMMM YYYY LT",
        l : "D/M/YYYY",
        ll : "D MMM YYYY",
        lll : "D MMM YYYY LT",
        llll : "ddd, D MMM YYYY LT"
    },
    calendar : {
        sameDay : '[היום ב־]LT',
        nextDay : '[מחר ב־]LT',
        nextWeek : 'dddd [בשעה] LT',
        lastDay : '[אתמול ב־]LT',
        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "בעוד %s",
        past : "לפני %s",
        s : "מספר שניות",
        m : "דקה",
        mm : "%d דקות",
        h : "שעה",
        hh : "%d שעות",
        d : "יום",
        dd : "%d ימים",
        M : "חודש",
        MM : "%d חודשים",
        y : "שנה",
        yy : "%d שנים"
    }
});
})();
(function(){
// moment.js language configuration
// language : hindi (hi)
// author : Mayank Singhal : https://github.com/mayanksinghal

var symbolMap = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
},
numberMap = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

moment.lang('hi', {
    months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split("_"),
    monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split("_"),
    weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split("_"),
    weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split("_"),
    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split("_"),
    longDateFormat : {
        LT : "A h:mm बजे",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY, LT",
        LLLL : "dddd, D MMMM YYYY, LT"
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[कल] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[कल] LT',
        lastWeek : '[पिछले] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s में",
        past : "%s पहले",
        s : "कुछ ही क्षण",
        m : "एक मिनट",
        mm : "%d मिनट",
        h : "एक घंटा",
        hh : "%d घंटे",
        d : "एक दिन",
        dd : "%d दिन",
        M : "एक महीने",
        MM : "%d महीने",
        y : "एक वर्ष",
        yy : "%d वर्ष"
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return "रात";
        } else if (hour < 10) {
            return "सुबह";
        } else if (hour < 17) {
            return "दोपहर";
        } else if (hour < 20) {
            return "शाम";
        } else {
            return "रात";
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : hungarian (hu)
// author : Adam Brunner : https://github.com/adambrunner

var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

function translate(number, withoutSuffix, key, isFuture) {
    var num = number,
        suffix;

    switch (key) {
    case 's':
        return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
    case 'm':
        return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
    case 'mm':
        return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
    case 'h':
        return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
    case 'hh':
        return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
    case 'd':
        return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
    case 'dd':
        return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
    case 'M':
        return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    case 'MM':
        return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
    case 'y':
        return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
    case 'yy':
        return num + (isFuture || withoutSuffix ? ' év' : ' éve');
    }

    return '';
}

function week(isFuture) {
    return (isFuture ? '' : 'múlt ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
}

moment.lang('hu', {
    months : "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
    monthsShort : "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
    weekdays : "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
    weekdaysShort : "v_h_k_sze_cs_p_szo".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "YYYY.MM.DD.",
        LL : "YYYY. MMMM D.",
        LLL : "YYYY. MMMM D., LT",
        LLLL : "YYYY. MMMM D., dddd LT"
    },
    calendar : {
        sameDay : '[ma] LT[-kor]',
        nextDay : '[holnap] LT[-kor]',
        nextWeek : function () {
            return week.call(this, true);
        },
        lastDay : '[tegnap] LT[-kor]',
        lastWeek : function () {
            return week.call(this, false);
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s múlva",
        past : "%s",
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Bahasa Indonesia (id)
// author : Mohammad Satrio Utomo : https://github.com/tyok
// reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

moment.lang('id', {
    months : "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
    monthsShort : "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
    weekdays : "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
    weekdaysShort : "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
    weekdaysMin : "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
    longDateFormat : {
        LT : "HH.mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY [pukul] LT",
        LLLL : "dddd, D MMMM YYYY [pukul] LT"
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'siang';
        } else if (hours < 19) {
            return 'sore';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Besok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kemarin pukul] LT',
        lastWeek : 'dddd [lalu pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "dalam %s",
        past : "%s yang lalu",
        s : "beberapa detik",
        m : "semenit",
        mm : "%d menit",
        h : "sejam",
        hh : "%d jam",
        d : "sehari",
        dd : "%d hari",
        M : "sebulan",
        MM : "%d bulan",
        y : "setahun",
        yy : "%d tahun"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : icelandic (is)
// author : Hinrik Örn Sigurðsson : https://github.com/hinrik

function plural(n) {
    if (n % 100 === 11) {
        return true;
    } else if (n % 10 === 1) {
        return false;
    }
    return true;
}

function translate(number, withoutSuffix, key, isFuture) {
    var result = number + " ";
    switch (key) {
    case 's':
        return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
    case 'm':
        return withoutSuffix ? 'mínúta' : 'mínútu';
    case 'mm':
        if (plural(number)) {
            return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
        } else if (withoutSuffix) {
            return result + 'mínúta';
        }
        return result + 'mínútu';
    case 'hh':
        if (plural(number)) {
            return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
        }
        return result + 'klukkustund';
    case 'd':
        if (withoutSuffix) {
            return 'dagur';
        }
        return isFuture ? 'dag' : 'degi';
    case 'dd':
        if (plural(number)) {
            if (withoutSuffix) {
                return result + 'dagar';
            }
            return result + (isFuture ? 'daga' : 'dögum');
        } else if (withoutSuffix) {
            return result + 'dagur';
        }
        return result + (isFuture ? 'dag' : 'degi');
    case 'M':
        if (withoutSuffix) {
            return 'mánuður';
        }
        return isFuture ? 'mánuð' : 'mánuði';
    case 'MM':
        if (plural(number)) {
            if (withoutSuffix) {
                return result + 'mánuðir';
            }
            return result + (isFuture ? 'mánuði' : 'mánuðum');
        } else if (withoutSuffix) {
            return result + 'mánuður';
        }
        return result + (isFuture ? 'mánuð' : 'mánuði');
    case 'y':
        return withoutSuffix || isFuture ? 'ár' : 'ári';
    case 'yy':
        if (plural(number)) {
            return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
        }
        return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
    }
}

moment.lang('is', {
    months : "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
    monthsShort : "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
    weekdays : "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
    weekdaysShort : "sun_mán_þri_mið_fim_fös_lau".split("_"),
    weekdaysMin : "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD/MM/YYYY",
        LL : "D. MMMM YYYY",
        LLL : "D. MMMM YYYY [kl.] LT",
        LLLL : "dddd, D. MMMM YYYY [kl.] LT"
    },
    calendar : {
        sameDay : '[í dag kl.] LT',
        nextDay : '[á morgun kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[í gær kl.] LT',
        lastWeek : '[síðasta] dddd [kl.] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "eftir %s",
        past : "fyrir %s síðan",
        s : translate,
        m : translate,
        mm : translate,
        h : "klukkustund",
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : italian (it)
// author : Lorenzo : https://github.com/aliem

moment.lang('it', {
    months : "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split("_"),
    monthsShort : "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
    weekdays : "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
    weekdaysShort : "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
    weekdaysMin : "D_L_Ma_Me_G_V_S".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[Oggi alle] LT',
        nextDay: '[Domani alle] LT',
        nextWeek: 'dddd [alle] LT',
        lastDay: '[Ieri alle] LT',
        lastWeek: '[lo scorso] dddd [alle] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "%s fa",
        s : "secondi",
        m : "un minuto",
        mm : "%d minuti",
        h : "un'ora",
        hh : "%d ore",
        d : "un giorno",
        dd : "%d giorni",
        M : "un mese",
        MM : "%d mesi",
        y : "un anno",
        yy : "%d anni"
    },
    ordinal: '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : japanese (ja)
// author : LI Long : https://github.com/baryon

moment.lang('ja', {
    months : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
    weekdays : "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
    weekdaysShort : "日_月_火_水_木_金_土".split("_"),
    weekdaysMin : "日_月_火_水_木_金_土".split("_"),
    longDateFormat : {
        LT : "Ah時m分",
        L : "YYYY/MM/DD",
        LL : "YYYY年M月D日",
        LLL : "YYYY年M月D日LT",
        LLLL : "YYYY年M月D日LT dddd"
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return "午前";
        } else {
            return "午後";
        }
    },
    calendar : {
        sameDay : '[今日] LT',
        nextDay : '[明日] LT',
        nextWeek : '[来週]dddd LT',
        lastDay : '[昨日] LT',
        lastWeek : '[前週]dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s後",
        past : "%s前",
        s : "数秒",
        m : "1分",
        mm : "%d分",
        h : "1時間",
        hh : "%d時間",
        d : "1日",
        dd : "%d日",
        M : "1ヶ月",
        MM : "%dヶ月",
        y : "1年",
        yy : "%d年"
    }
});
})();
(function(){
// moment.js language configuration
// language : Georgian (ka)
// author : Irakli Janiashvili : https://github.com/irakli-janiashvili

function monthsCaseReplace(m, format) {
    var months = {
        'nominative': 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
        'accusative': 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
    },

    nounCase = (/D[oD] *MMMM?/).test(format) ?
        'accusative' :
        'nominative';

    return months[nounCase][m.month()];
}

function weekdaysCaseReplace(m, format) {
    var weekdays = {
        'nominative': 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
        'accusative': 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_')
    },

    nounCase = (/(წინა|შემდეგ)/).test(format) ?
        'accusative' :
        'nominative';

    return weekdays[nounCase][m.day()];
}

moment.lang('ka', {
    months : monthsCaseReplace,
    monthsShort : "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
    weekdays : weekdaysCaseReplace,
    weekdaysShort : "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
    weekdaysMin : "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
    longDateFormat : {
        LT : "h:mm A",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[დღეს] LT[-ზე]',
        nextDay : '[ხვალ] LT[-ზე]',
        lastDay : '[გუშინ] LT[-ზე]',
        nextWeek : '[შემდეგ] dddd LT[-ზე]',
        lastWeek : '[წინა] dddd LT-ზე',
        sameElse : 'L'
    },
    relativeTime : {
        future : function (s) {
            return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                s.replace(/ი$/, "ში") :
                s + "ში";
        },
        past : function (s) {
            if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                return s.replace(/(ი|ე)$/, "ის წინ");
            }
            if ((/წელი/).test(s)) {
                return s.replace(/წელი$/, "წლის წინ");
            }
        },
        s : "რამდენიმე წამი",
        m : "წუთი",
        mm : "%d წუთი",
        h : "საათი",
        hh : "%d საათი",
        d : "დღე",
        dd : "%d დღე",
        M : "თვე",
        MM : "%d თვე",
        y : "წელი",
        yy : "%d წელი"
    },
    ordinal : function (number) {
        if (number === 0) {
            return number;
        }

        if (number === 1) {
            return number + "-ლი";
        }

        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
            return "მე-" + number;
        }

        return number + "-ე";
    },
    week : {
        dow : 1,
        doy : 7
    }
});
})();
(function(){
// moment.js language configuration
// language : korean (ko)
// author : Kyungwook, Park : https://github.com/kyungw00k

moment.lang('ko', {
    months : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
    monthsShort : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
    weekdays : "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
    weekdaysShort : "일_월_화_수_목_금_토".split("_"),
    weekdaysMin : "일_월_화_수_목_금_토".split("_"),
    longDateFormat : {
        LT : "A h시 mm분",
        L : "YYYY.MM.DD",
        LL : "YYYY년 MMMM D일",
        LLL : "YYYY년 MMMM D일 LT",
        LLLL : "YYYY년 MMMM D일 dddd LT"
    },
    meridiem : function (hour, minute, isUpper) {
        return hour < 12 ? '오전' : '오후';
    },
    calendar : {
        sameDay : '오늘 LT',
        nextDay : '내일 LT',
        nextWeek : 'dddd LT',
        lastDay : '어제 LT',
        lastWeek : '지난주 dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s 후",
        past : "%s 전",
        s : "몇초",
        ss : "%d초",
        m : "일분",
        mm : "%d분",
        h : "한시간",
        hh : "%d시간",
        d : "하루",
        dd : "%d일",
        M : "한달",
        MM : "%d달",
        y : "일년",
        yy : "%d년"
    },
    ordinal : '%d일'
});
})();
(function(){
// moment.js language configuration
// language : latvian (lv)
// author : Kristaps Karlsons : https://github.com/skakri

var units = {
    'mm': 'minūti_minūtes_minūte_minūtes',
    'hh': 'stundu_stundas_stunda_stundas',
    'dd': 'dienu_dienas_diena_dienas',
    'MM': 'mēnesi_mēnešus_mēnesis_mēneši',
    'yy': 'gadu_gadus_gads_gadi'
};

function format(word, number, withoutSuffix) {
    var forms = word.split('_');
    if (withoutSuffix) {
        return number % 10 === 1 && number !== 11 ? forms[2] : forms[3];
    } else {
        return number % 10 === 1 && number !== 11 ? forms[0] : forms[1];
    }
}

function relativeTimeWithPlural(number, withoutSuffix, key) {
    return number + ' ' + format(units[key], number, withoutSuffix);
}

moment.lang('lv', {
    months : "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
    monthsShort : "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
    weekdays : "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
    weekdaysShort : "Sv_P_O_T_C_Pk_S".split("_"),
    weekdaysMin : "Sv_P_O_T_C_Pk_S".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD.MM.YYYY",
        LL : "YYYY. [gada] D. MMMM",
        LLL : "YYYY. [gada] D. MMMM, LT",
        LLLL : "YYYY. [gada] D. MMMM, dddd, LT"
    },
    calendar : {
        sameDay : '[Šodien pulksten] LT',
        nextDay : '[Rīt pulksten] LT',
        nextWeek : 'dddd [pulksten] LT',
        lastDay : '[Vakar pulksten] LT',
        lastWeek : '[Pagājušā] dddd [pulksten] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s vēlāk",
        past : "%s agrāk",
        s : "dažas sekundes",
        m : "minūti",
        mm : relativeTimeWithPlural,
        h : "stundu",
        hh : relativeTimeWithPlural,
        d : "dienu",
        dd : relativeTimeWithPlural,
        M : "mēnesi",
        MM : relativeTimeWithPlural,
        y : "gadu",
        yy : relativeTimeWithPlural
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Bahasa Malaysia (ms-MY)
// author : Weldan Jamili : https://github.com/weldan

moment.lang('ms-my', {
    months : "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
    monthsShort : "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
    weekdays : "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
    weekdaysShort : "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
    weekdaysMin : "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
    longDateFormat : {
        LT : "HH.mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY [pukul] LT",
        LLLL : "dddd, D MMMM YYYY [pukul] LT"
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'tengahari';
        } else if (hours < 19) {
            return 'petang';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Esok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kelmarin pukul] LT',
        lastWeek : 'dddd [lepas pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "dalam %s",
        past : "%s yang lepas",
        s : "beberapa saat",
        m : "seminit",
        mm : "%d minit",
        h : "sejam",
        hh : "%d jam",
        d : "sehari",
        dd : "%d hari",
        M : "sebulan",
        MM : "%d bulan",
        y : "setahun",
        yy : "%d tahun"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : norwegian bokmål (nb)
// author : Espen Hovlandsdal : https://github.com/rexxars

moment.lang('nb', {
    months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
    monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
    weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
    weekdaysShort : "søn_man_tir_ons_tor_fre_lør".split("_"),
    weekdaysMin : "sø_ma_ti_on_to_fr_lø".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[I dag klokken] LT',
        nextDay: '[I morgen klokken] LT',
        nextWeek: 'dddd [klokken] LT',
        lastDay: '[I går klokken] LT',
        lastWeek: '[Forrige] dddd [klokken] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "om %s",
        past : "for %s siden",
        s : "noen sekunder",
        m : "ett minutt",
        mm : "%d minutter",
        h : "en time",
        hh : "%d timer",
        d : "en dag",
        dd : "%d dager",
        M : "en måned",
        MM : "%d måneder",
        y : "ett år",
        yy : "%d år"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : nepali/nepalese
// author : suvash : https://github.com/suvash

var symbolMap = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
},
numberMap = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

moment.lang('ne', {
    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split("_"),
    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split("_"),
    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split("_"),
    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split("_"),
    weekdaysMin : 'आइ._सो._मङ्_बु._बि._शु._श.'.split("_"),
    longDateFormat : {
        LT : "Aको h:mm बजे",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY, LT",
        LLLL : "dddd, D MMMM YYYY, LT"
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 3) {
            return "राती";
        } else if (hour < 10) {
            return "बिहान";
        } else if (hour < 15) {
            return "दिउँसो";
        } else if (hour < 18) {
            return "बेलुका";
        } else if (hour < 20) {
            return "साँझ";
        } else {
            return "राती";
        }
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[भोली] LT',
        nextWeek : '[आउँदो] dddd[,] LT',
        lastDay : '[हिजो] LT',
        lastWeek : '[गएको] dddd[,] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%sमा",
        past : "%s अगाडी",
        s : "केही समय",
        m : "एक मिनेट",
        mm : "%d मिनेट",
        h : "एक घण्टा",
        hh : "%d घण्टा",
        d : "एक दिन",
        dd : "%d दिन",
        M : "एक महिना",
        MM : "%d महिना",
        y : "एक बर्ष",
        yy : "%d बर्ष"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : dutch (nl)
// author : Joris Röling : https://github.com/jjupiter

var monthsShortWithDots = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
    monthsShortWithoutDots = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");

moment.lang('nl', {
    months : "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
    monthsShort : function (m, format) {
        if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots[m.month()];
        } else {
            return monthsShortWithDots[m.month()];
        }
    },
    weekdays : "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
    weekdaysShort : "zo._ma._di._wo._do._vr._za.".split("_"),
    weekdaysMin : "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD-MM-YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[Vandaag om] LT',
        nextDay: '[Morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[Gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "over %s",
        past : "%s geleden",
        s : "een paar seconden",
        m : "één minuut",
        mm : "%d minuten",
        h : "één uur",
        hh : "%d uur",
        d : "één dag",
        dd : "%d dagen",
        M : "één maand",
        MM : "%d maanden",
        y : "één jaar",
        yy : "%d jaar"
    },
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : norwegian nynorsk (nn)
// author : https://github.com/mechuwind

moment.lang('nn', {
    months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
    monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
    weekdays : "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
    weekdaysShort : "sun_mån_tys_ons_tor_fre_lau".split("_"),
    weekdaysMin : "su_må_ty_on_to_fr_lø".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[I dag klokka] LT',
        nextDay: '[I morgon klokka] LT',
        nextWeek: 'dddd [klokka] LT',
        lastDay: '[I går klokka] LT',
        lastWeek: '[Føregående] dddd [klokka] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "om %s",
        past : "for %s siden",
        s : "noen sekund",
        m : "ett minutt",
        mm : "%d minutt",
        h : "en time",
        hh : "%d timar",
        d : "en dag",
        dd : "%d dagar",
        M : "en månad",
        MM : "%d månader",
        y : "ett år",
        yy : "%d år"
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : polish (pl)
// author : Rafal Hirsz : https://github.com/evoL

function plural(n) {
    return (n % 10 < 5) && (n % 10 > 1) && (~~(n / 10) !== 1);
}

function translate(number, withoutSuffix, key) {
    var result = number + " ";
    switch (key) {
    case 'm':
        return withoutSuffix ? 'minuta' : 'minutę';
    case 'mm':
        return result + (plural(number) ? 'minuty' : 'minut');
    case 'h':
        return withoutSuffix  ? 'godzina'  : 'godzinę';
    case 'hh':
        return result + (plural(number) ? 'godziny' : 'godzin');
    case 'MM':
        return result + (plural(number) ? 'miesiące' : 'miesięcy');
    case 'yy':
        return result + (plural(number) ? 'lata' : 'lat');
    }
}

moment.lang('pl', {
    months : "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
    monthsShort : "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
    weekdays : "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
    weekdaysShort : "nie_pon_wt_śr_czw_pt_sb".split("_"),
    weekdaysMin : "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD-MM-YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[Dziś o] LT',
        nextDay: '[Jutro o] LT',
        nextWeek: '[W] dddd [o] LT',
        lastDay: '[Wczoraj o] LT',
        lastWeek: function () {
            switch (this.day()) {
            case 0:
                return '[W zeszłą niedzielę o] LT';
            case 3:
                return '[W zeszłą środę o] LT';
            case 6:
                return '[W zeszłą sobotę o] LT';
            default:
                return '[W zeszły] dddd [o] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "za %s",
        past : "%s temu",
        s : "kilka sekund",
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : "1 dzień",
        dd : '%d dni',
        M : "miesiąc",
        MM : translate,
        y : "rok",
        yy : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : brazilian portuguese (pt-br)
// author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

moment.lang('pt-br', {
    months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
    weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
    weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D [de] MMMM [de] YYYY",
        LLL : "D [de] MMMM [de] YYYY LT",
        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "em %s",
        past : "%s atrás",
        s : "segundos",
        m : "um minuto",
        mm : "%d minutos",
        h : "uma hora",
        hh : "%d horas",
        d : "um dia",
        dd : "%d dias",
        M : "um mês",
        MM : "%d meses",
        y : "um ano",
        yy : "%d anos"
    },
    ordinal : '%dº'
});
})();
(function(){
// moment.js language configuration
// language : portuguese (pt)
// author : Jefferson : https://github.com/jalex79

moment.lang('pt', {
    months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
    weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
    weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D [de] MMMM [de] YYYY",
        LLL : "D [de] MMMM [de] YYYY LT",
        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "em %s",
        past : "%s atrás",
        s : "segundos",
        m : "um minuto",
        mm : "%d minutos",
        h : "uma hora",
        hh : "%d horas",
        d : "um dia",
        dd : "%d dias",
        M : "um mês",
        MM : "%d meses",
        y : "um ano",
        yy : "%d anos"
    },
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : romanian (ro)
// author : Vlad Gurdiga : https://github.com/gurdiga
// author : Valentin Agachi : https://github.com/avaly

moment.lang('ro', {
    months : "Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie".split("_"),
    monthsShort : "Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Noi_Dec".split("_"),
    weekdays : "Duminică_Luni_Marţi_Miercuri_Joi_Vineri_Sâmbătă".split("_"),
    weekdaysShort : "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
    weekdaysMin : "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY H:mm",
        LLLL : "dddd, D MMMM YYYY H:mm"
    },
    calendar : {
        sameDay: "[azi la] LT",
        nextDay: '[mâine la] LT',
        nextWeek: 'dddd [la] LT',
        lastDay: '[ieri la] LT',
        lastWeek: '[fosta] dddd [la] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "peste %s",
        past : "%s în urmă",
        s : "câteva secunde",
        m : "un minut",
        mm : "%d minute",
        h : "o oră",
        hh : "%d ore",
        d : "o zi",
        dd : "%d zile",
        M : "o lună",
        MM : "%d luni",
        y : "un an",
        yy : "%d ani"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : russian (ru)
// author : Viktorminator : https://github.com/Viktorminator
// Author : Menelion Elensúle : https://github.com/Oire

function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}

function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': 'минута_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дня_дней',
        'MM': 'месяц_месяца_месяцев',
        'yy': 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}

function monthsCaseReplace(m, format) {
    var months = {
        'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
        'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
    },

    nounCase = (/D[oD]? *MMMM?/).test(format) ?
        'accusative' :
        'nominative';

    return months[nounCase][m.month()];
}

function weekdaysCaseReplace(m, format) {
    var weekdays = {
        'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
        'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
    },

    nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/).test(format) ?
        'accusative' :
        'nominative';

    return weekdays[nounCase][m.day()];
}

moment.lang('ru', {
    months : monthsCaseReplace,
    monthsShort : "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
    weekdays : weekdaysCaseReplace,
    weekdaysShort : "вск_пнд_втр_срд_чтв_птн_сбт".split("_"),
    weekdaysMin : "вс_пн_вт_ср_чт_пт_сб".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD.MM.YYYY",
        LL : "D MMMM YYYY г.",
        LLL : "D MMMM YYYY г., LT",
        LLLL : "dddd, D MMMM YYYY г., LT"
    },
    calendar : {
        sameDay: '[Сегодня в] LT',
        nextDay: '[Завтра в] LT',
        lastDay: '[Вчера в] LT',
        nextWeek: function () {
            return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
        },
        lastWeek: function () {
            switch (this.day()) {
            case 0:
                return '[В прошлое] dddd [в] LT';
            case 1:
            case 2:
            case 4:
                return '[В прошлый] dddd [в] LT';
            case 3:
            case 5:
            case 6:
                return '[В прошлую] dddd [в] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "через %s",
        past : "%s назад",
        s : "несколько секунд",
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : "час",
        hh : relativeTimeWithPlural,
        d : "день",
        dd : relativeTimeWithPlural,
        M : "месяц",
        MM : relativeTimeWithPlural,
        y : "год",
        yy : relativeTimeWithPlural
    },
    // FIXME: this is not Russian ordinals format
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : slovak (sk)
// author : Martin Minka : https://github.com/k2s
// based on work of petrbela : https://github.com/petrbela

var months = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),
    monthsShort = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");

function plural(n) {
    return (n > 1) && (n < 5);
}

function translate(number, withoutSuffix, key, isFuture) {
    var result = number + " ";
    switch (key) {
    case 's':  // a few seconds / in a few seconds / a few seconds ago
        return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
    case 'm':  // a minute / in a minute / a minute ago
        return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
    case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'minúty' : 'minút');
        } else {
            return result + 'minútami';
        }
        break;
    case 'h':  // an hour / in an hour / an hour ago
        return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
    case 'hh': // 9 hours / in 9 hours / 9 hours ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'hodiny' : 'hodín');
        } else {
            return result + 'hodinami';
        }
        break;
    case 'd':  // a day / in a day / a day ago
        return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
    case 'dd': // 9 days / in 9 days / 9 days ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'dni' : 'dní');
        } else {
            return result + 'dňami';
        }
        break;
    case 'M':  // a month / in a month / a month ago
        return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
    case 'MM': // 9 months / in 9 months / 9 months ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'mesiace' : 'mesiacov');
        } else {
            return result + 'mesiacmi';
        }
        break;
    case 'y':  // a year / in a year / a year ago
        return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
    case 'yy': // 9 years / in 9 years / 9 years ago
        if (withoutSuffix || isFuture) {
            return result + (plural(number) ? 'roky' : 'rokov');
        } else {
            return result + 'rokmi';
        }
        break;
    }
}

moment.lang('sk', {
    months : months,
    monthsShort : monthsShort,
    monthsParse : (function (months, monthsShort) {
        var i, _monthsParse = [];
        for (i = 0; i < 12; i++) {
            // use custom parser to solve problem with July (červenec)
            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
        }
        return _monthsParse;
    }(months, monthsShort)),
    weekdays : "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
    weekdaysShort : "ne_po_ut_st_št_pi_so".split("_"),
    weekdaysMin : "ne_po_ut_st_št_pi_so".split("_"),
    longDateFormat : {
        LT: "H:mm",
        L : "DD.MM.YYYY",
        LL : "D. MMMM YYYY",
        LLL : "D. MMMM YYYY LT",
        LLLL : "dddd D. MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[dnes o] LT",
        nextDay: '[zajtra o] LT',
        nextWeek: function () {
            switch (this.day()) {
            case 0:
                return '[v nedeľu o] LT';
            case 1:
            case 2:
                return '[v] dddd [o] LT';
            case 3:
                return '[v stredu o] LT';
            case 4:
                return '[vo štvrtok o] LT';
            case 5:
                return '[v piatok o] LT';
            case 6:
                return '[v sobotu o] LT';
            }
        },
        lastDay: '[včera o] LT',
        lastWeek: function () {
            switch (this.day()) {
            case 0:
                return '[minulú nedeľu o] LT';
            case 1:
            case 2:
                return '[minulý] dddd [o] LT';
            case 3:
                return '[minulú stredu o] LT';
            case 4:
            case 5:
                return '[minulý] dddd [o] LT';
            case 6:
                return '[minulú sobotu o] LT';
            }
        },
        sameElse: "L"
    },
    relativeTime : {
        future : "za %s",
        past : "pred %s",
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : slovenian (sl)
// author : Robert Sedovšek : https://github.com/sedovsek

function translate(number, withoutSuffix, key) {
    var result = number + " ";
    switch (key) {
    case 'm':
        return withoutSuffix ? 'ena minuta' : 'eno minuto';
    case 'mm':
        if (number === 1) {
            result += 'minuta';
        } else if (number === 2) {
            result += 'minuti';
        } else if (number === 3 || number === 4) {
            result += 'minute';
        } else {
            result += 'minut';
        }
        return result;
    case 'h':
        return withoutSuffix ? 'ena ura' : 'eno uro';
    case 'hh':
        if (number === 1) {
            result += 'ura';
        } else if (number === 2) {
            result += 'uri';
        } else if (number === 3 || number === 4) {
            result += 'ure';
        } else {
            result += 'ur';
        }
        return result;
    case 'dd':
        if (number === 1) {
            result += 'dan';
        } else {
            result += 'dni';
        }
        return result;
    case 'MM':
        if (number === 1) {
            result += 'mesec';
        } else if (number === 2) {
            result += 'meseca';
        } else if (number === 3 || number === 4) {
            result += 'mesece';
        } else {
            result += 'mesecev';
        }
        return result;
    case 'yy':
        if (number === 1) {
            result += 'leto';
        } else if (number === 2) {
            result += 'leti';
        } else if (number === 3 || number === 4) {
            result += 'leta';
        } else {
            result += 'let';
        }
        return result;
    }
}

moment.lang('sl', {
    months : "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
    monthsShort : "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
    weekdays : "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
    weekdaysShort : "ned._pon._tor._sre._čet._pet._sob.".split("_"),
    weekdaysMin : "ne_po_to_sr_če_pe_so".split("_"),
    longDateFormat : {
        LT : "H:mm",
        L : "DD. MM. YYYY",
        LL : "D. MMMM YYYY",
        LLL : "D. MMMM YYYY LT",
        LLLL : "dddd, D. MMMM YYYY LT"
    },
    calendar : {
        sameDay  : '[danes ob] LT',
        nextDay  : '[jutri ob] LT',

        nextWeek : function () {
            switch (this.day()) {
            case 0:
                return '[v] [nedeljo] [ob] LT';
            case 3:
                return '[v] [sredo] [ob] LT';
            case 6:
                return '[v] [soboto] [ob] LT';
            case 1:
            case 2:
            case 4:
            case 5:
                return '[v] dddd [ob] LT';
            }
        },
        lastDay  : '[včeraj ob] LT',
        lastWeek : function () {
            switch (this.day()) {
            case 0:
            case 3:
            case 6:
                return '[prejšnja] dddd [ob] LT';
            case 1:
            case 2:
            case 4:
            case 5:
                return '[prejšnji] dddd [ob] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : "čez %s",
        past   : "%s nazaj",
        s      : "nekaj sekund",
        m      : translate,
        mm     : translate,
        h      : translate,
        hh     : translate,
        d      : "en dan",
        dd     : translate,
        M      : "en mesec",
        MM     : translate,
        y      : "eno leto",
        yy     : translate
    },
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : swedish (sv)
// author : Jens Alm : https://github.com/ulmus

moment.lang('sv', {
    months : "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
    monthsShort : "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
    weekdays : "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
    weekdaysShort : "sön_mån_tis_ons_tor_fre_lör".split("_"),
    weekdaysMin : "sö_må_ti_on_to_fr_lö".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "YYYY-MM-DD",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: '[Idag klockan] LT',
        nextDay: '[Imorgon klockan] LT',
        lastDay: '[Igår klockan] LT',
        nextWeek: 'dddd [klockan] LT',
        lastWeek: '[Förra] dddd[en klockan] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "om %s",
        past : "för %s sedan",
        s : "några sekunder",
        m : "en minut",
        mm : "%d minuter",
        h : "en timme",
        hh : "%d timmar",
        d : "en dag",
        dd : "%d dagar",
        M : "en månad",
        MM : "%d månader",
        y : "ett år",
        yy : "%d år"
    },
    ordinal : function (number) {
        var b = number % 10,
            output = (~~ (number % 100 / 10) === 1) ? 'e' :
            (b === 1) ? 'a' :
            (b === 2) ? 'a' :
            (b === 3) ? 'e' : 'e';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : thai (th)
// author : Kridsada Thanabulpong : https://github.com/sirn

moment.lang('th', {
    months : "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
    monthsShort : "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
    weekdays : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
    weekdaysShort : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"), // yes, three characters difference
    weekdaysMin : "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
    longDateFormat : {
        LT : "H นาฬิกา m นาที",
        L : "YYYY/MM/DD",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY เวลา LT",
        LLLL : "วันddddที่ D MMMM YYYY เวลา LT"
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return "ก่อนเที่ยง";
        } else {
            return "หลังเที่ยง";
        }
    },
    calendar : {
        sameDay : '[วันนี้ เวลา] LT',
        nextDay : '[พรุ่งนี้ เวลา] LT',
        nextWeek : 'dddd[หน้า เวลา] LT',
        lastDay : '[เมื่อวานนี้ เวลา] LT',
        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "อีก %s",
        past : "%sที่แล้ว",
        s : "ไม่กี่วินาที",
        m : "1 นาที",
        mm : "%d นาที",
        h : "1 ชั่วโมง",
        hh : "%d ชั่วโมง",
        d : "1 วัน",
        dd : "%d วัน",
        M : "1 เดือน",
        MM : "%d เดือน",
        y : "1 ปี",
        yy : "%d ปี"
    }
});
})();
(function(){
// moment.js language configuration
// language : turkish (tr)
// authors : Erhan Gundogan : https://github.com/erhangundogan,
//           Burak Yiğit Kaya: https://github.com/BYK

var suffixes = {
    1: "'inci",
    5: "'inci",
    8: "'inci",
    70: "'inci",
    80: "'inci",

    2: "'nci",
    7: "'nci",
    20: "'nci",
    50: "'nci",

    3: "'üncü",
    4: "'üncü",
    100: "'üncü",

    6: "'ncı",

    9: "'uncu",
    10: "'uncu",
    30: "'uncu",

    60: "'ıncı",
    90: "'ıncı"
};

moment.lang('tr', {
    months : "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
    monthsShort : "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
    weekdays : "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
    weekdaysShort : "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
    weekdaysMin : "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD.MM.YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[bugün saat] LT',
        nextDay : '[yarın saat] LT',
        nextWeek : '[haftaya] dddd [saat] LT',
        lastDay : '[dün] LT',
        lastWeek : '[geçen hafta] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "%s sonra",
        past : "%s önce",
        s : "birkaç saniye",
        m : "bir dakika",
        mm : "%d dakika",
        h : "bir saat",
        hh : "%d saat",
        d : "bir gün",
        dd : "%d gün",
        M : "bir ay",
        MM : "%d ay",
        y : "bir yıl",
        yy : "%d yıl"
    },
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + "'ıncı";
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;

        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Morocco Central Atlas Tamaziɣt in Latin (tzm-la)
// author : Abdel Said : https://github.com/abdelsaid

moment.lang('tzm-la', {
    months : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
    monthsShort : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
    weekdays : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
    weekdaysShort : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
    weekdaysMin : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[asdkh g] LT",
        nextDay: '[aska g] LT',
        nextWeek: 'dddd [g] LT',
        lastDay: '[assant g] LT',
        lastWeek: 'dddd [g] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dadkh s yan %s",
        past : "yan %s",
        s : "imik",
        m : "minuḍ",
        mm : "%d minuḍ",
        h : "saɛa",
        hh : "%d tassaɛin",
        d : "ass",
        dd : "%d ossan",
        M : "ayowr",
        MM : "%d iyyirn",
        y : "asgas",
        yy : "%d isgasn"
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : Morocco Central Atlas Tamaziɣt (tzm)
// author : Abdel Said : https://github.com/abdelsaid

moment.lang('tzm', {
    months : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
    monthsShort : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
    weekdays : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
    weekdaysShort : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
    weekdaysMin : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
        nextWeek: 'dddd [ⴴ] LT',
        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
        lastWeek: 'dddd [ⴴ] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
        past : "ⵢⴰⵏ %s",
        s : "ⵉⵎⵉⴽ",
        m : "ⵎⵉⵏⵓⴺ",
        mm : "%d ⵎⵉⵏⵓⴺ",
        h : "ⵙⴰⵄⴰ",
        hh : "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
        d : "ⴰⵙⵙ",
        dd : "%d oⵙⵙⴰⵏ",
        M : "ⴰⵢoⵓⵔ",
        MM : "%d ⵉⵢⵢⵉⵔⵏ",
        y : "ⴰⵙⴳⴰⵙ",
        yy : "%d ⵉⵙⴳⴰⵙⵏ"
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : ukrainian (uk)
// author : zemlanin : https://github.com/zemlanin
// Author : Menelion Elensúle : https://github.com/Oire

function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}

function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': 'хвилина_хвилини_хвилин',
        'hh': 'година_години_годин',
        'dd': 'день_дня_днів',
        'MM': 'місяць_місяця_місяців',
        'yy': 'рік_роки_років'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвилина' : 'хвилину';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}

function monthsCaseReplace(m, format) {
    var months = {
        'nominative': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
        'accusative': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_')
    },

    nounCase = (/D[oD]? *MMMM?/).test(format) ?
        'accusative' :
        'nominative';

    return months[nounCase][m.month()];
}

function weekdaysCaseReplace(m, format) {
    var weekdays = {
        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
        'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
    },

    nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ? 
        'accusative' :
        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
            'genitive' :
            'nominative');

    return weekdays[nounCase][m.day()];
}

moment.lang('uk', {
    months : monthsCaseReplace,
    monthsShort : "січ_лют_бер_кві_тра_чер_лип_сер_вер_жов_лис_гру".split("_"),
    weekdays : weekdaysCaseReplace,
    weekdaysShort : "нед_пон_вів_срд_чет_птн_суб".split("_"),
    weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD.MM.YYYY",
        LL : "D MMMM YYYY р.",
        LLL : "D MMMM YYYY р., LT",
        LLLL : "dddd, D MMMM YYYY р., LT"
    },
    calendar : {
        sameDay: '[Сьогодні о] LT',
        nextDay: '[Завтра о] LT',
        lastDay: '[Вчора о] LT',
        nextWeek: '[У] dddd [о] LT',
        lastWeek: function () {
            switch (this.day()) {
            case 0:
            case 3:
            case 5:
            case 6:
                return '[Минулої] dddd [о] LT';
            case 1:
            case 2:
            case 4:
                return '[Минулого] dddd [о] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : "за %s",
        past : "%s тому",
        s : "декілька секунд",
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : "годину",
        hh : relativeTimeWithPlural,
        d : "день",
        dd : relativeTimeWithPlural,
        M : "місяць",
        MM : relativeTimeWithPlural,
        y : "рік",
        yy : relativeTimeWithPlural
    },
    // FIXME: this is not Ukrainian ordinals format
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});
})();
(function(){
// moment.js language configuration
// language : chinese
// author : suupic : https://github.com/suupic

moment.lang('zh-cn', {
    months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
    weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
    weekdaysShort : "周日_周一_周二_周三_周四_周五_周六".split("_"),
    weekdaysMin : "日_一_二_三_四_五_六".split("_"),
    longDateFormat : {
        LT : "Ah点mm",
        L : "YYYY年MMMD日",
        LL : "YYYY年MMMD日",
        LLL : "YYYY年MMMD日LT",
        LLLL : "YYYY年MMMD日ddddLT",
        l : "YYYY年MMMD日",
        ll : "YYYY年MMMD日",
        lll : "YYYY年MMMD日LT",
        llll : "YYYY年MMMD日ddddLT"
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 9) {
            return "早上";
        } else if (hour < 11 && minute < 30) {
            return "上午";
        } else if (hour < 13 && minute < 30) {
            return "中午";
        } else if (hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    ordinal : function (number, period) {
        switch (period) {
        case "d" :
        case "D" :
        case "DDD" :
            return number + "日";
        case "M" :
            return number + "月";
        case "w" :
        case "W" :
            return number + "周";
        default :
            return number;
        }
    },
    relativeTime : {
        future : "%s内",
        past : "%s前",
        s : "几秒",
        m : "1分钟",
        mm : "%d分钟",
        h : "1小时",
        hh : "%d小时",
        d : "1天",
        dd : "%d天",
        M : "1个月",
        MM : "%d个月",
        y : "1年",
        yy : "%d年"
    }
});
})();
(function(){
// moment.js language configuration
// language : traditional chinese (zh-tw)
// author : Ben : https://github.com/ben-lin

moment.lang('zh-tw', {
    months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
    weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
    weekdaysShort : "週日_週一_週二_週三_週四_週五_週六".split("_"),
    weekdaysMin : "日_一_二_三_四_五_六".split("_"),
    longDateFormat : {
        LT : "Ah點mm",
        L : "YYYY年MMMD日",
        LL : "YYYY年MMMD日",
        LLL : "YYYY年MMMD日LT",
        LLLL : "YYYY年MMMD日ddddLT",
        l : "YYYY年MMMD日",
        ll : "YYYY年MMMD日",
        lll : "YYYY年MMMD日LT",
        llll : "YYYY年MMMD日ddddLT"
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 9) {
            return "早上";
        } else if (hour < 11 && minute < 30) {
            return "上午";
        } else if (hour < 13 && minute < 30) {
            return "中午";
        } else if (hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    ordinal : function (number, period) {
        switch (period) {
        case "d" :
        case "D" :
        case "DDD" :
            return number + "日";
        case "M" :
            return number + "月";
        case "w" :
        case "W" :
            return number + "週";
        default :
            return number;
        }
    },
    relativeTime : {
        future : "%s內",
        past : "%s前",
        s : "幾秒",
        m : "一分鐘",
        mm : "%d分鐘",
        h : "一小時",
        hh : "%d小時",
        d : "一天",
        dd : "%d天",
        M : "一個月",
        MM : "%d個月",
        y : "一年",
        yy : "%d年"
    }
});
})();

moment.lang('en');

    }
    if (typeof define === "function" && define.amd) {
        define(["moment"], onload);
    }
    if (typeof window !== "undefined" && window.moment) {
        onload(window.moment);
    }
})();

// moment-timezone.js
// version : 0.0.1
// author : Tim Wood
// license : MIT
// github.com/timrwood/moment-timezone

(function () {
	function onload(moment) {
		var oldZoneName = moment.fn.zoneName,
			oldZoneAbbr = moment.fn.zoneAbbr,

			defaultRule,
			rules = {},
			ruleSets = {},
			zones = {},
			zoneSets = {},

			TIME_RULE_WALL_CLOCK = 0,
			TIME_RULE_UTC        = 1,
			TIME_RULE_STANDARD   = 2,

			DAY_RULE_DAY_OF_MONTH   = 7,
			DAY_RULE_LAST_WEEKDAY   = 8;

		// converts time in the HH:mm:ss format to absolute number of minutes
		function parseMinutes (input) {
			input = input + '';
			var output = input.split(':'),
				sign = ~input.indexOf('-') ? -1 : 1,
				hour = Math.abs(+output[0]),
				minute = parseInt(output[1], 10) || 0,
				second = parseInt(output[2], 10) || 0;

			return sign * ((hour * 60) + (minute) + (second / 60));
		}

		/************************************
			Rules
		************************************/

		function Rule (name, startYear, endYear, month, day, dayRule, time, timeRule, offset, letters) {
			this.name      = name;
			this.startYear = +startYear;
			this.endYear   = +endYear;
			this.month     = +month;
			this.day       = +day;
			this.dayRule   = +dayRule;
			this.time      = parseMinutes(time);
			this.timeRule  = +timeRule;
			this.offset    = parseMinutes(offset);
			this.letters   = letters || '';
		}

		Rule.prototype = {
			contains : function (year) {
				return (year >= this.startYear && year <= this.endYear);
			},

			start : function (year) {
				year = Math.min(Math.max(year, this.startYear), this.endYear);
				return moment.utc([year, this.month, this.date(year), 0, this.time]);
			},

			date : function (year) {
				if (this.dayRule === DAY_RULE_DAY_OF_MONTH) {
					return this.day;
				} else if (this.dayRule === DAY_RULE_LAST_WEEKDAY) {
					return this.lastWeekday(year);
				}
				return this.weekdayAfter(year);
			},

			weekdayAfter : function (year) {
				var day = this.day,
					firstDayOfWeek = moment([year, this.month, 1]).day(),
					output = this.dayRule + 1 - firstDayOfWeek;

				while (output < day) {
					output += 7;
				}

				return output;
			},

			lastWeekday : function (year) {
				var day = this.day,
					dow = day % 7,
					lastDowOfMonth = moment([year, this.month + 1, 1]).day(),
					daysInMonth = moment([year, this.month, 1]).daysInMonth(),
					output = daysInMonth + (dow - (lastDowOfMonth - 1)) - (~~(day / 7) * 7);

				if (dow >= lastDowOfMonth) {
					output -= 7;
				}
				return output;
			}
		};

		/************************************
			Rule Year
		************************************/

		function RuleYear (year, rule) {
			this.rule = rule;
			this.start = rule.start(year);
		}

		RuleYear.prototype = {
			equals : function (other) {
				if (!other || other.rule !== this.rule) {
					return false;
				}
				return Math.abs(other.start - this.start) < 86400000; // 24 * 60 * 60 * 1000
			}
		};

		function sortRuleYears (a, b) {
			if (a.isLast) {
				return -1;
			}
			if (b.isLast) {
				return 1;
			}
			return b.start - a.start;
		}

		/************************************
			Rule Sets
		************************************/

		function RuleSet (name) {
			this.name = name;
			this.rules = [];
		}

		RuleSet.prototype = {
			add : function (rule) {
				this.rules.push(rule);
			},

			ruleYears : function (mom, lastZone) {
				var i, j,
					year = mom.year(),
					rule,
					lastZoneRule,
					rules = [];

				for (i = 0; i < this.rules.length; i++) {
					rule = this.rules[i];
					if (rule.contains(year)) {
						rules.push(new RuleYear(year, rule));
					} else if (rule.contains(year + 1)) {
						rules.push(new RuleYear(year + 1, rule));
					}
				}
				rules.push(new RuleYear(year - 1, this.lastYearRule(year - 1)));

				if (lastZone) {
					lastZoneRule = new RuleYear(year - 1, lastZone.lastRule());
					lastZoneRule.start = lastZone.until.clone().utc();
					lastZoneRule.isLast = lastZone.ruleSet !== this;
					rules.push(lastZoneRule);
				}

				rules.sort(sortRuleYears);
				return rules;
			},

			rule : function (mom, offset, lastZone) {
				var rules = this.ruleYears(mom, lastZone),
					lastOffset = 0,
					rule,
					lastZoneOffset,
					lastZoneOffsetAbs,
					lastRule,
					i;

				if (lastZone) {
					lastZoneOffset = lastZone.offset + lastZone.lastRule().offset;
					lastZoneOffsetAbs = Math.abs(lastZoneOffset) * 90000;
				}

				// make sure to include the previous rule's offset
				for (i = rules.length - 1; i > -1; i--) {
					lastRule = rule;
					rule = rules[i];

					if (rule.equals(lastRule)) {
						continue;
					}

					if (lastZone && !rule.isLast && Math.abs(rule.start - lastZone.until) <= lastZoneOffsetAbs) {
						lastOffset += lastZoneOffset - offset;
					}

					if (rule.rule.timeRule === TIME_RULE_STANDARD) {
						lastOffset = offset;
					}

					if (rule.rule.timeRule !== TIME_RULE_UTC) {
						rule.start.add('m', -lastOffset);
					}

					lastOffset = rule.rule.offset + offset;
				}

				for (i = 0; i < rules.length; i++) {
					rule = rules[i];
					if (mom >= rule.start && !rule.isLast) {
						return rule.rule;
					}
				}

				return defaultRule;
			},

			lastYearRule : function (year) {
				var i,
					rule,
					start,
					bestRule = defaultRule,
					largest = -1e30;

				for (i = 0; i < this.rules.length; i++) {
					rule = this.rules[i];
					if (year >= rule.startYear) {
						start = rule.start(year);
						if (start > largest) {
							largest = start;
							bestRule = rule;
						}
					}
				}

				return bestRule;
			}
		};

		/************************************
			Zone
		************************************/

		function Zone (name, offset, ruleSet, letters, until, untilOffset) {
			var i,
				untilArray = typeof until === 'string' ? until.split('_') : [9999];

			this.name = name;
			this.offset = parseMinutes(offset);
			this.ruleSet = ruleSet;
			this.letters = letters;

			for (i = 0; i < untilArray.length; i++) {
				untilArray[i] = +untilArray[i];
			}
			this.until = moment.utc(untilArray).subtract('m', parseMinutes(untilOffset));
		}

		Zone.prototype = {
			rule : function (mom, lastZone) {
				return this.ruleSet.rule(mom, this.offset, lastZone);
			},

			lastRule : function () {
				if (!this._lastRule) {
					this._lastRule = this.rule(this.until);
				}
				return this._lastRule;
			},

			format : function (rule) {
				return this.letters.replace("%s", rule.letters);
			}
		};

		/************************************
			Zone Set
		************************************/

		function sortZones (a, b) {
			return a.until - b.until;
		}

		function ZoneSet (name) {
			this.name = name;
			this.zones = [];
		}

		ZoneSet.prototype = {
			zoneAndRule : function (mom) {
				var i,
					zone,
					lastZone;

				mom = mom.clone().utc();
				for (i = 0; i < this.zones.length; i++) {
					zone = this.zones[i];
					if (mom < zone.until) {
						break;
					}
					lastZone = zone;
				}

				return [zone, zone.rule(mom, lastZone)];
			},

			add : function (zone) {
				this.zones.push(zone);
				this.zones.sort(sortZones);
			},

			format : function (mom) {
				var zoneAndRule = this.zoneAndRule(mom);
				return zoneAndRule[0].format(zoneAndRule[1]);
			},

			offset : function (mom) {
				var zoneAndRule = this.zoneAndRule(mom);
				return -(zoneAndRule[0].offset + zoneAndRule[1].offset);
			}
		};

		/************************************
			Global Methods
		************************************/

		function addRules (rules) {
			var i, j, rule;
			for (i in rules) {
				rule = rules[i];
				for (j = 0; j < rule.length; j++) {
					addRule(i + '\t' + rule[j]);
				}
			}
		}

		function addRule (ruleString) {
			// don't duplicate rules
			if (rules[ruleString]) {
				return rules[ruleString];
			}

			var p = ruleString.split(/\s/),
				name = normalizeName(p[0]),
				rule = new Rule(name, p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10]);

			// cache the rule so we don't add it again
			rules[ruleString] = rule;

			// add to the ruleset
			getRuleSet(name).add(rule);

			return rule;
		}

		function normalizeName (name) {
			return (name || '').toLowerCase().replace(/\//g, '_');
		}

		function addZones (zones) {
			var i, j, zone;
			for (i in zones) {
				zone = zones[i];
				for (j = 0; j < zone.length; j++) {
					addZone(i + '\t' + zone[j]);
				}
			}
		}

		function addZone (zoneString) {
			// don't duplicate zones
			if (zones[zoneString]) {
				return zones[zoneString];
			}

			var p = zoneString.split(/\s/),
				name = normalizeName(p[0]),
				zone = new Zone(name, p[1], getRuleSet(p[2]), p[3], p[4], p[5]);

			// cache the zone so we don't add it again
			zones[zoneString] = zone;

			// add to the zoneset
			getZoneSet(name).add(zone);

			return zone;
		}

		function getRuleSet (name) {
			name = normalizeName(name);
			if (!ruleSets[name]) {
				ruleSets[name] = new RuleSet(name);
			}
			return ruleSets[name];
		}

		function getZoneSet (name) {
			name = normalizeName(name);
			if (!zoneSets[name]) {
				zoneSets[name] = new ZoneSet(name);
			}
			return zoneSets[name];
		}

		// overwrite moment.updateOffset
		moment.updateOffset = function (mom) {
			var offset;
			if (mom._z) {
				offset = mom._z.offset(mom);
				if (Math.abs(offset) < 16) {
					offset = offset / 60;
				}
				mom.zone(offset);
			}
		};

		moment.fn.tz = function (name) {
			this._z = getZoneSet(name);
			moment.updateOffset(this);
			return this;
		};

		moment.fn.zoneName = function () {
			if (this._z) {
				return this._z.format(this);
			}
			return oldZoneName.call(this);
		};

		moment.fn.zoneAbbr = function () {
			if (this._z) {
				return this._z.format(this);
			}
			return oldZoneAbbr.call(this);
		};

		moment.tz = {
			addRules   : addRules,
			addRule    : addRule,
			getRuleSet : getRuleSet,
			addZones   : addZones,
			addZone    : addZone,
			getZoneSet : getZoneSet
		};

		// add default rule
		defaultRule = addRule("- 0 9999 0 0 0 0 0 0");

		return moment;
	}

	if (typeof define === "function" && define.amd) {
		define(["moment"], onload);
	} else if (typeof window !== "undefined" && window.moment) {
		onload(window.moment);
	} else if (typeof module !== 'undefined') {
		module.exports = onload(require('./moment'));
	}
}).apply(this);

(function(){
    window.momentTZData =

{
	"meta": {
		"Africa/Abidjan": {
			"lat": 519,
			"lon": -402,
			"rules": ""
		},
		"Africa/Accra": {
			"lat": 533,
			"lon": -13,
			"rules": "Ghana"
		},
		"Africa/Addis_Ababa": {
			"lat": 902,
			"lon": 3842,
			"rules": ""
		},
		"Africa/Algiers": {
			"lat": 3647,
			"lon": 303,
			"rules": "Algeria"
		},
		"Africa/Asmara": {
			"lat": 1520,
			"lon": 3853,
			"rules": ""
		},
		"Africa/Bamako": {
			"lat": 1239,
			"lon": -800,
			"rules": ""
		},
		"Africa/Bangui": {
			"lat": 422,
			"lon": 1835,
			"rules": ""
		},
		"Africa/Banjul": {
			"lat": 1328,
			"lon": -1639,
			"rules": ""
		},
		"Africa/Bissau": {
			"lat": 1151,
			"lon": -1535,
			"rules": ""
		},
		"Africa/Blantyre": {
			"lat": -1547,
			"lon": 3500,
			"rules": ""
		},
		"Africa/Brazzaville": {
			"lat": -416,
			"lon": 1517,
			"rules": ""
		},
		"Africa/Bujumbura": {
			"lat": -323,
			"lon": 2922,
			"rules": ""
		},
		"Africa/Cairo": {
			"lat": 3003,
			"lon": 3115,
			"rules": "Egypt"
		},
		"Africa/Casablanca": {
			"lat": 3339,
			"lon": -735,
			"rules": "Morocco"
		},
		"Africa/Ceuta": {
			"lat": 3553,
			"lon": -519,
			"rules": "Spain SpainAfrica EU"
		},
		"Africa/Conakry": {
			"lat": 931,
			"lon": -1343,
			"rules": ""
		},
		"Africa/Dakar": {
			"lat": 1440,
			"lon": -1726,
			"rules": ""
		},
		"Africa/Dar_es_Salaam": {
			"lat": -648,
			"lon": 3917,
			"rules": ""
		},
		"Africa/Djibouti": {
			"lat": 1136,
			"lon": 4309,
			"rules": ""
		},
		"Africa/Douala": {
			"lat": 403,
			"lon": 942,
			"rules": ""
		},
		"Africa/El_Aaiun": {
			"lat": 2709,
			"lon": -1312,
			"rules": ""
		},
		"Africa/Freetown": {
			"lat": 830,
			"lon": -1315,
			"rules": "SL"
		},
		"Africa/Gaborone": {
			"lat": -2439,
			"lon": 2555,
			"rules": ""
		},
		"Africa/Harare": {
			"lat": -1750,
			"lon": 3103,
			"rules": ""
		},
		"Africa/Johannesburg": {
			"lat": -2615,
			"lon": 2800,
			"rules": "SA"
		},
		"Africa/Juba": {
			"lat": 451,
			"lon": 3136,
			"rules": "Sudan"
		},
		"Africa/Kampala": {
			"lat": 19,
			"lon": 3225,
			"rules": ""
		},
		"Africa/Khartoum": {
			"lat": 1536,
			"lon": 3232,
			"rules": "Sudan"
		},
		"Africa/Kigali": {
			"lat": -157,
			"lon": 3004,
			"rules": ""
		},
		"Africa/Kinshasa": {
			"lat": -418,
			"lon": 1518,
			"rules": ""
		},
		"Africa/Lagos": {
			"lat": 627,
			"lon": 324,
			"rules": ""
		},
		"Africa/Libreville": {
			"lat": 23,
			"lon": 927,
			"rules": ""
		},
		"Africa/Lome": {
			"lat": 608,
			"lon": 113,
			"rules": ""
		},
		"Africa/Luanda": {
			"lat": -848,
			"lon": 1314,
			"rules": ""
		},
		"Africa/Lubumbashi": {
			"lat": -1140,
			"lon": 2728,
			"rules": ""
		},
		"Africa/Lusaka": {
			"lat": -1525,
			"lon": 2817,
			"rules": ""
		},
		"Africa/Malabo": {
			"lat": 345,
			"lon": 847,
			"rules": ""
		},
		"Africa/Maputo": {
			"lat": -2558,
			"lon": 3235,
			"rules": ""
		},
		"Africa/Maseru": {
			"lat": -2928,
			"lon": 2730,
			"rules": ""
		},
		"Africa/Mbabane": {
			"lat": -2618,
			"lon": 3106,
			"rules": ""
		},
		"Africa/Mogadishu": {
			"lat": 204,
			"lon": 4522,
			"rules": ""
		},
		"Africa/Monrovia": {
			"lat": 618,
			"lon": -1047,
			"rules": ""
		},
		"Africa/Nairobi": {
			"lat": -117,
			"lon": 3649,
			"rules": ""
		},
		"Africa/Ndjamena": {
			"lat": 1207,
			"lon": 1503,
			"rules": ""
		},
		"Africa/Niamey": {
			"lat": 1331,
			"lon": 207,
			"rules": ""
		},
		"Africa/Nouakchott": {
			"lat": 1806,
			"lon": -1557,
			"rules": ""
		},
		"Africa/Ouagadougou": {
			"lat": 1222,
			"lon": -131,
			"rules": ""
		},
		"Africa/Porto-Novo": {
			"lat": 629,
			"lon": 237,
			"rules": ""
		},
		"Africa/Sao_Tome": {
			"lat": 20,
			"lon": 644,
			"rules": ""
		},
		"Africa/Tripoli": {
			"lat": 3254,
			"lon": 1311,
			"rules": "Libya"
		},
		"Africa/Tunis": {
			"lat": 3648,
			"lon": 1011,
			"rules": "Tunisia"
		},
		"Africa/Windhoek": {
			"lat": -2234,
			"lon": 1706,
			"rules": "Namibia"
		},
		"America/Adak": {
			"lat": 515248,
			"lon": -1763929,
			"rules": "US"
		},
		"America/Anchorage": {
			"lat": 611305,
			"lon": -1495401,
			"rules": "US"
		},
		"America/Anguilla": {
			"lat": 1812,
			"lon": -6304,
			"rules": ""
		},
		"America/Antigua": {
			"lat": 1703,
			"lon": -6148,
			"rules": ""
		},
		"America/Araguaina": {
			"lat": -712,
			"lon": -4812,
			"rules": "Brazil"
		},
		"America/Argentina/Buenos_Aires": {
			"lat": -3436,
			"lon": -5827,
			"rules": "Arg"
		},
		"America/Argentina/Catamarca": {
			"lat": -2828,
			"lon": -6547,
			"rules": "Arg"
		},
		"America/Argentina/Cordoba": {
			"lat": -3124,
			"lon": -6411,
			"rules": "Arg"
		},
		"America/Argentina/Jujuy": {
			"lat": -2411,
			"lon": -6518,
			"rules": "Arg"
		},
		"America/Argentina/La_Rioja": {
			"lat": -2926,
			"lon": -6651,
			"rules": "Arg"
		},
		"America/Argentina/Mendoza": {
			"lat": -3253,
			"lon": -6849,
			"rules": "Arg"
		},
		"America/Argentina/Rio_Gallegos": {
			"lat": -5138,
			"lon": -6913,
			"rules": "Arg"
		},
		"America/Argentina/Salta": {
			"lat": -2447,
			"lon": -6525,
			"rules": "Arg"
		},
		"America/Argentina/San_Juan": {
			"lat": -3132,
			"lon": -6831,
			"rules": "Arg"
		},
		"America/Argentina/San_Luis": {
			"lat": -3319,
			"lon": -6621,
			"rules": "Arg SanLuis"
		},
		"America/Argentina/Tucuman": {
			"lat": -2649,
			"lon": -6513,
			"rules": "Arg"
		},
		"America/Argentina/Ushuaia": {
			"lat": -5448,
			"lon": -6818,
			"rules": "Arg"
		},
		"America/Aruba": {
			"lat": 1230,
			"lon": -6958,
			"rules": ""
		},
		"America/Asuncion": {
			"lat": -2516,
			"lon": -5740,
			"rules": "Para"
		},
		"America/Atikokan": {
			"lat": 484531,
			"lon": -913718,
			"rules": "Canada"
		},
		"America/Bahia": {
			"lat": -1259,
			"lon": -3831,
			"rules": "Brazil"
		},
		"America/Bahia_Banderas": {
			"lat": 2048,
			"lon": -10515,
			"rules": "Mexico"
		},
		"America/Barbados": {
			"lat": 1306,
			"lon": -5937,
			"rules": "Barb"
		},
		"America/Belem": {
			"lat": -127,
			"lon": -4829,
			"rules": "Brazil"
		},
		"America/Belize": {
			"lat": 1730,
			"lon": -8812,
			"rules": "Belize"
		},
		"America/Blanc-Sablon": {
			"lat": 5125,
			"lon": -5707,
			"rules": "Canada"
		},
		"America/Boa_Vista": {
			"lat": 249,
			"lon": -6040,
			"rules": "Brazil"
		},
		"America/Bogota": {
			"lat": 436,
			"lon": -7405,
			"rules": "CO"
		},
		"America/Boise": {
			"lat": 433649,
			"lon": -1161209,
			"rules": "US"
		},
		"America/Cambridge_Bay": {
			"lat": 690650,
			"lon": -1050310,
			"rules": "NT_YK Canada"
		},
		"America/Campo_Grande": {
			"lat": -2027,
			"lon": -5437,
			"rules": "Brazil"
		},
		"America/Cancun": {
			"lat": 2105,
			"lon": -8646,
			"rules": "Mexico"
		},
		"America/Caracas": {
			"lat": 1030,
			"lon": -6656,
			"rules": ""
		},
		"America/Cayenne": {
			"lat": 456,
			"lon": -5220,
			"rules": ""
		},
		"America/Cayman": {
			"lat": 1918,
			"lon": -8123,
			"rules": ""
		},
		"America/Chicago": {
			"lat": 415100,
			"lon": -873900,
			"rules": "US Chicago"
		},
		"America/Chihuahua": {
			"lat": 2838,
			"lon": -10605,
			"rules": "Mexico"
		},
		"America/Costa_Rica": {
			"lat": 956,
			"lon": -8405,
			"rules": "CR"
		},
		"America/Creston": {
			"lat": 4906,
			"lon": -11631,
			"rules": ""
		},
		"America/Cuiaba": {
			"lat": -1535,
			"lon": -5605,
			"rules": "Brazil"
		},
		"America/Curacao": {
			"lat": 1211,
			"lon": -6900,
			"rules": ""
		},
		"America/Danmarkshavn": {
			"lat": 7646,
			"lon": -1840,
			"rules": "EU"
		},
		"America/Dawson": {
			"lat": 6404,
			"lon": -13925,
			"rules": "NT_YK Canada"
		},
		"America/Dawson_Creek": {
			"lat": 5946,
			"lon": -12014,
			"rules": "Canada Vanc"
		},
		"America/Denver": {
			"lat": 394421,
			"lon": -1045903,
			"rules": "US Denver"
		},
		"America/Detroit": {
			"lat": 421953,
			"lon": -830245,
			"rules": "US Detroit"
		},
		"America/Dominica": {
			"lat": 1518,
			"lon": -6124,
			"rules": ""
		},
		"America/Edmonton": {
			"lat": 5333,
			"lon": -11328,
			"rules": "Edm Canada"
		},
		"America/Eirunepe": {
			"lat": -640,
			"lon": -6952,
			"rules": "Brazil"
		},
		"America/El_Salvador": {
			"lat": 1342,
			"lon": -8912,
			"rules": "Salv"
		},
		"America/Fortaleza": {
			"lat": -343,
			"lon": -3830,
			"rules": "Brazil"
		},
		"America/Glace_Bay": {
			"lat": 4612,
			"lon": -5957,
			"rules": "Canada Halifax"
		},
		"America/Godthab": {
			"lat": 6411,
			"lon": -5144,
			"rules": "EU"
		},
		"America/Goose_Bay": {
			"lat": 5320,
			"lon": -6025,
			"rules": "Canada StJohns"
		},
		"America/Grand_Turk": {
			"lat": 2128,
			"lon": -7108,
			"rules": "TC"
		},
		"America/Grenada": {
			"lat": 1203,
			"lon": -6145,
			"rules": ""
		},
		"America/Guadeloupe": {
			"lat": 1614,
			"lon": -6132,
			"rules": ""
		},
		"America/Guatemala": {
			"lat": 1438,
			"lon": -9031,
			"rules": "Guat"
		},
		"America/Guayaquil": {
			"lat": -210,
			"lon": -7950,
			"rules": ""
		},
		"America/Guyana": {
			"lat": 648,
			"lon": -5810,
			"rules": ""
		},
		"America/Halifax": {
			"lat": 4439,
			"lon": -6336,
			"rules": "Halifax Canada"
		},
		"America/Havana": {
			"lat": 2308,
			"lon": -8222,
			"rules": "Cuba"
		},
		"America/Hermosillo": {
			"lat": 2904,
			"lon": -11058,
			"rules": "Mexico"
		},
		"America/Indiana/Indianapolis": {
			"lat": 394606,
			"lon": -860929,
			"rules": "US Indianapolis"
		},
		"America/Indiana/Knox": {
			"lat": 411745,
			"lon": -863730,
			"rules": "US Starke"
		},
		"America/Indiana/Marengo": {
			"lat": 382232,
			"lon": -862041,
			"rules": "US Marengo"
		},
		"America/Indiana/Petersburg": {
			"lat": 382931,
			"lon": -871643,
			"rules": "US Pike"
		},
		"America/Indiana/Tell_City": {
			"lat": 375711,
			"lon": -864541,
			"rules": "US Perry"
		},
		"America/Indiana/Vevay": {
			"lat": 384452,
			"lon": -850402,
			"rules": "US"
		},
		"America/Indiana/Vincennes": {
			"lat": 384038,
			"lon": -873143,
			"rules": "US Vincennes"
		},
		"America/Indiana/Winamac": {
			"lat": 410305,
			"lon": -863611,
			"rules": "US Pulaski"
		},
		"America/Inuvik": {
			"lat": 682059,
			"lon": -1334300,
			"rules": "NT_YK Canada"
		},
		"America/Iqaluit": {
			"lat": 6344,
			"lon": -6828,
			"rules": "NT_YK Canada"
		},
		"America/Jamaica": {
			"lat": 1800,
			"lon": -7648,
			"rules": "US"
		},
		"America/Juneau": {
			"lat": 581807,
			"lon": -1342511,
			"rules": "US"
		},
		"America/Kentucky/Louisville": {
			"lat": 381515,
			"lon": -854534,
			"rules": "US Louisville"
		},
		"America/Kentucky/Monticello": {
			"lat": 364947,
			"lon": -845057,
			"rules": "US"
		},
		"America/Kralendijk": {
			"lat": 120903,
			"lon": -681636,
			"rules": ""
		},
		"America/La_Paz": {
			"lat": -1630,
			"lon": -6809,
			"rules": ""
		},
		"America/Lima": {
			"lat": -1203,
			"lon": -7703,
			"rules": "Peru"
		},
		"America/Los_Angeles": {
			"lat": 340308,
			"lon": -1181434,
			"rules": "US CA"
		},
		"America/Lower_Princes": {
			"lat": 180305,
			"lon": -630250,
			"rules": ""
		},
		"America/Maceio": {
			"lat": -940,
			"lon": -3543,
			"rules": "Brazil"
		},
		"America/Managua": {
			"lat": 1209,
			"lon": -8617,
			"rules": "Nic"
		},
		"America/Manaus": {
			"lat": -308,
			"lon": -6001,
			"rules": "Brazil"
		},
		"America/Marigot": {
			"lat": 1804,
			"lon": -6305,
			"rules": ""
		},
		"America/Martinique": {
			"lat": 1436,
			"lon": -6105,
			"rules": ""
		},
		"America/Matamoros": {
			"lat": 2550,
			"lon": -9730,
			"rules": "US Mexico"
		},
		"America/Mazatlan": {
			"lat": 2313,
			"lon": -10625,
			"rules": "Mexico"
		},
		"America/Menominee": {
			"lat": 450628,
			"lon": -873651,
			"rules": "US Menominee"
		},
		"America/Merida": {
			"lat": 2058,
			"lon": -8937,
			"rules": "Mexico"
		},
		"America/Metlakatla": {
			"lat": 550737,
			"lon": -1313435,
			"rules": "US"
		},
		"America/Mexico_City": {
			"lat": 1924,
			"lon": -9909,
			"rules": "Mexico"
		},
		"America/Miquelon": {
			"lat": 4703,
			"lon": -5620,
			"rules": "Canada"
		},
		"America/Moncton": {
			"lat": 4606,
			"lon": -6447,
			"rules": "Canada Moncton"
		},
		"America/Monterrey": {
			"lat": 2540,
			"lon": -10019,
			"rules": "US Mexico"
		},
		"America/Montevideo": {
			"lat": -3453,
			"lon": -5611,
			"rules": "Uruguay"
		},
		"America/Montreal": {
			"lat": 4531,
			"lon": -7334,
			"rules": "Mont Canada"
		},
		"America/Montserrat": {
			"lat": 1643,
			"lon": -6213,
			"rules": ""
		},
		"America/Nassau": {
			"lat": 2505,
			"lon": -7721,
			"rules": "Bahamas US"
		},
		"America/New_York": {
			"lat": 404251,
			"lon": -740023,
			"rules": "US NYC"
		},
		"America/Nipigon": {
			"lat": 4901,
			"lon": -8816,
			"rules": "Canada"
		},
		"America/Nome": {
			"lat": 643004,
			"lon": -1652423,
			"rules": "US"
		},
		"America/Noronha": {
			"lat": -351,
			"lon": -3225,
			"rules": "Brazil"
		},
		"America/North_Dakota/Beulah": {
			"lat": 471551,
			"lon": -1014640,
			"rules": "US"
		},
		"America/North_Dakota/Center": {
			"lat": 470659,
			"lon": -1011757,
			"rules": "US"
		},
		"America/North_Dakota/New_Salem": {
			"lat": 465042,
			"lon": -1012439,
			"rules": "US"
		},
		"America/Ojinaga": {
			"lat": 2934,
			"lon": -10425,
			"rules": "Mexico US"
		},
		"America/Panama": {
			"lat": 858,
			"lon": -7932,
			"rules": ""
		},
		"America/Pangnirtung": {
			"lat": 6608,
			"lon": -6544,
			"rules": "NT_YK Canada"
		},
		"America/Paramaribo": {
			"lat": 550,
			"lon": -5510,
			"rules": ""
		},
		"America/Phoenix": {
			"lat": 332654,
			"lon": -1120424,
			"rules": "US"
		},
		"America/Port-au-Prince": {
			"lat": 1832,
			"lon": -7220,
			"rules": "Haiti"
		},
		"America/Port_of_Spain": {
			"lat": 1039,
			"lon": -6131,
			"rules": ""
		},
		"America/Porto_Velho": {
			"lat": -846,
			"lon": -6354,
			"rules": "Brazil"
		},
		"America/Puerto_Rico": {
			"lat": 182806,
			"lon": -660622,
			"rules": "US"
		},
		"America/Rainy_River": {
			"lat": 4843,
			"lon": -9434,
			"rules": "Canada"
		},
		"America/Rankin_Inlet": {
			"lat": 624900,
			"lon": -920459,
			"rules": "NT_YK Canada"
		},
		"America/Recife": {
			"lat": -803,
			"lon": -3454,
			"rules": "Brazil"
		},
		"America/Regina": {
			"lat": 5024,
			"lon": -10439,
			"rules": "Regina"
		},
		"America/Resolute": {
			"lat": 744144,
			"lon": -944945,
			"rules": "NT_YK Canada"
		},
		"America/Rio_Branco": {
			"lat": -958,
			"lon": -6748,
			"rules": "Brazil"
		},
		"America/Santa_Isabel": {
			"lat": 3018,
			"lon": -11452,
			"rules": "CA US Mexico"
		},
		"America/Santarem": {
			"lat": -226,
			"lon": -5452,
			"rules": "Brazil"
		},
		"America/Santiago": {
			"lat": -3327,
			"lon": -7040,
			"rules": "Chile"
		},
		"America/Santo_Domingo": {
			"lat": 1828,
			"lon": -6954,
			"rules": "DR US"
		},
		"America/Sao_Paulo": {
			"lat": -2332,
			"lon": -4637,
			"rules": "Brazil"
		},
		"America/Scoresbysund": {
			"lat": 7029,
			"lon": -2158,
			"rules": "C-Eur EU"
		},
		"America/Shiprock": {
			"lat": 364708,
			"lon": -1084111,
			"rules": ""
		},
		"America/Sitka": {
			"lat": 571035,
			"lon": -1351807,
			"rules": "US"
		},
		"America/St_Barthelemy": {
			"lat": 1753,
			"lon": -6251,
			"rules": ""
		},
		"America/St_Johns": {
			"lat": 4734,
			"lon": -5243,
			"rules": "StJohns Canada"
		},
		"America/St_Kitts": {
			"lat": 1718,
			"lon": -6243,
			"rules": ""
		},
		"America/St_Lucia": {
			"lat": 1401,
			"lon": -6100,
			"rules": ""
		},
		"America/St_Thomas": {
			"lat": 1821,
			"lon": -6456,
			"rules": ""
		},
		"America/St_Vincent": {
			"lat": 1309,
			"lon": -6114,
			"rules": ""
		},
		"America/Swift_Current": {
			"lat": 5017,
			"lon": -10750,
			"rules": "Canada Regina Swift"
		},
		"America/Tegucigalpa": {
			"lat": 1406,
			"lon": -8713,
			"rules": "Hond"
		},
		"America/Thule": {
			"lat": 7634,
			"lon": -6847,
			"rules": "Thule"
		},
		"America/Thunder_Bay": {
			"lat": 4823,
			"lon": -8915,
			"rules": "Canada Mont"
		},
		"America/Tijuana": {
			"lat": 3232,
			"lon": -11701,
			"rules": "CA US Mexico"
		},
		"America/Toronto": {
			"lat": 4339,
			"lon": -7923,
			"rules": "Canada Toronto"
		},
		"America/Tortola": {
			"lat": 1827,
			"lon": -6437,
			"rules": ""
		},
		"America/Vancouver": {
			"lat": 4916,
			"lon": -12307,
			"rules": "Vanc Canada"
		},
		"America/Whitehorse": {
			"lat": 6043,
			"lon": -13503,
			"rules": "NT_YK Canada"
		},
		"America/Winnipeg": {
			"lat": 4953,
			"lon": -9709,
			"rules": "Winn Canada"
		},
		"America/Yakutat": {
			"lat": 593249,
			"lon": -1394338,
			"rules": "US"
		},
		"America/Yellowknife": {
			"lat": 6227,
			"lon": -11421,
			"rules": "NT_YK Canada"
		},
		"Antarctica/Casey": {
			"lat": -6617,
			"lon": 11031,
			"rules": ""
		},
		"Antarctica/Davis": {
			"lat": -6835,
			"lon": 7758,
			"rules": ""
		},
		"Antarctica/DumontDUrville": {
			"lat": -6640,
			"lon": 14001,
			"rules": ""
		},
		"Antarctica/Macquarie": {
			"lat": -5430,
			"lon": 15857,
			"rules": "Aus AT"
		},
		"Antarctica/Mawson": {
			"lat": -6736,
			"lon": 6253,
			"rules": ""
		},
		"Antarctica/McMurdo": {
			"lat": -7750,
			"lon": 16636,
			"rules": "NZAQ"
		},
		"Antarctica/Palmer": {
			"lat": -6448,
			"lon": -6406,
			"rules": "ArgAQ ChileAQ"
		},
		"Antarctica/Rothera": {
			"lat": -6734,
			"lon": -6808,
			"rules": ""
		},
		"Antarctica/South_Pole": {
			"lat": -9000,
			"lon": 0,
			"rules": ""
		},
		"Antarctica/Syowa": {
			"lat": -690022,
			"lon": 393524,
			"rules": ""
		},
		"Antarctica/Vostok": {
			"lat": -7824,
			"lon": 10654,
			"rules": ""
		},
		"Arctic/Longyearbyen": {
			"lat": 7800,
			"lon": 1600,
			"rules": ""
		},
		"Asia/Aden": {
			"lat": 1245,
			"lon": 4512,
			"rules": ""
		},
		"Asia/Almaty": {
			"lat": 4315,
			"lon": 7657,
			"rules": "RussiaAsia"
		},
		"Asia/Amman": {
			"lat": 3157,
			"lon": 3556,
			"rules": "Jordan"
		},
		"Asia/Anadyr": {
			"lat": 6445,
			"lon": 17729,
			"rules": "Russia"
		},
		"Asia/Aqtau": {
			"lat": 4431,
			"lon": 5016,
			"rules": "RussiaAsia"
		},
		"Asia/Aqtobe": {
			"lat": 5017,
			"lon": 5710,
			"rules": "RussiaAsia"
		},
		"Asia/Ashgabat": {
			"lat": 3757,
			"lon": 5823,
			"rules": "RussiaAsia"
		},
		"Asia/Baghdad": {
			"lat": 3321,
			"lon": 4425,
			"rules": "Iraq"
		},
		"Asia/Bahrain": {
			"lat": 2623,
			"lon": 5035,
			"rules": ""
		},
		"Asia/Baku": {
			"lat": 4023,
			"lon": 4951,
			"rules": "RussiaAsia EUAsia Azer"
		},
		"Asia/Bangkok": {
			"lat": 1345,
			"lon": 10031,
			"rules": ""
		},
		"Asia/Beirut": {
			"lat": 3353,
			"lon": 3530,
			"rules": "Lebanon"
		},
		"Asia/Bishkek": {
			"lat": 4254,
			"lon": 7436,
			"rules": "RussiaAsia Kyrgyz"
		},
		"Asia/Brunei": {
			"lat": 456,
			"lon": 11455,
			"rules": ""
		},
		"Asia/Choibalsan": {
			"lat": 4804,
			"lon": 11430,
			"rules": "Mongol"
		},
		"Asia/Chongqing": {
			"lat": 2934,
			"lon": 10635,
			"rules": "PRC"
		},
		"Asia/Colombo": {
			"lat": 656,
			"lon": 7951,
			"rules": ""
		},
		"Asia/Damascus": {
			"lat": 3330,
			"lon": 3618,
			"rules": "Syria"
		},
		"Asia/Dhaka": {
			"lat": 2343,
			"lon": 9025,
			"rules": "Dhaka"
		},
		"Asia/Dili": {
			"lat": -833,
			"lon": 12535,
			"rules": ""
		},
		"Asia/Dubai": {
			"lat": 2518,
			"lon": 5518,
			"rules": ""
		},
		"Asia/Dushanbe": {
			"lat": 3835,
			"lon": 6848,
			"rules": "RussiaAsia"
		},
		"Asia/Gaza": {
			"lat": 3130,
			"lon": 3428,
			"rules": "Zion EgyptAsia Jordan Palestine"
		},
		"Asia/Harbin": {
			"lat": 4545,
			"lon": 12641,
			"rules": "PRC"
		},
		"Asia/Hebron": {
			"lat": 313200,
			"lon": 350542,
			"rules": "Zion EgyptAsia Jordan Palestine"
		},
		"Asia/Ho_Chi_Minh": {
			"lat": 1045,
			"lon": 10640,
			"rules": ""
		},
		"Asia/Hong_Kong": {
			"lat": 2217,
			"lon": 11409,
			"rules": "HK"
		},
		"Asia/Hovd": {
			"lat": 4801,
			"lon": 9139,
			"rules": "Mongol"
		},
		"Asia/Irkutsk": {
			"lat": 5216,
			"lon": 10420,
			"rules": "Russia"
		},
		"Asia/Jakarta": {
			"lat": -610,
			"lon": 10648,
			"rules": ""
		},
		"Asia/Jayapura": {
			"lat": -232,
			"lon": 14042,
			"rules": ""
		},
		"Asia/Jerusalem": {
			"lat": 3146,
			"lon": 3514,
			"rules": "Zion"
		},
		"Asia/Kabul": {
			"lat": 3431,
			"lon": 6912,
			"rules": ""
		},
		"Asia/Kamchatka": {
			"lat": 5301,
			"lon": 15839,
			"rules": "Russia"
		},
		"Asia/Karachi": {
			"lat": 2452,
			"lon": 6703,
			"rules": "Pakistan"
		},
		"Asia/Kashgar": {
			"lat": 3929,
			"lon": 7559,
			"rules": "PRC"
		},
		"Asia/Kathmandu": {
			"lat": 2743,
			"lon": 8519,
			"rules": ""
		},
		"Asia/Khandyga": {
			"lat": 623923,
			"lon": 1353314,
			"rules": "Russia"
		},
		"Asia/Kolkata": {
			"lat": 2232,
			"lon": 8822,
			"rules": ""
		},
		"Asia/Krasnoyarsk": {
			"lat": 5601,
			"lon": 9250,
			"rules": "Russia"
		},
		"Asia/Kuala_Lumpur": {
			"lat": 310,
			"lon": 10142,
			"rules": ""
		},
		"Asia/Kuching": {
			"lat": 133,
			"lon": 11020,
			"rules": "NBorneo"
		},
		"Asia/Kuwait": {
			"lat": 2920,
			"lon": 4759,
			"rules": ""
		},
		"Asia/Macau": {
			"lat": 2214,
			"lon": 11335,
			"rules": "Macau PRC"
		},
		"Asia/Magadan": {
			"lat": 5934,
			"lon": 15048,
			"rules": "Russia"
		},
		"Asia/Makassar": {
			"lat": -507,
			"lon": 11924,
			"rules": ""
		},
		"Asia/Manila": {
			"lat": 1435,
			"lon": 12100,
			"rules": "Phil"
		},
		"Asia/Muscat": {
			"lat": 2336,
			"lon": 5835,
			"rules": ""
		},
		"Asia/Nicosia": {
			"lat": 3510,
			"lon": 3322,
			"rules": "Cyprus EUAsia"
		},
		"Asia/Novokuznetsk": {
			"lat": 5345,
			"lon": 8707,
			"rules": "Russia"
		},
		"Asia/Novosibirsk": {
			"lat": 5502,
			"lon": 8255,
			"rules": "Russia"
		},
		"Asia/Omsk": {
			"lat": 5500,
			"lon": 7324,
			"rules": "Russia"
		},
		"Asia/Oral": {
			"lat": 5113,
			"lon": 5121,
			"rules": "RussiaAsia"
		},
		"Asia/Phnom_Penh": {
			"lat": 1133,
			"lon": 10455,
			"rules": ""
		},
		"Asia/Pontianak": {
			"lat": -2,
			"lon": 10920,
			"rules": ""
		},
		"Asia/Pyongyang": {
			"lat": 3901,
			"lon": 12545,
			"rules": ""
		},
		"Asia/Qatar": {
			"lat": 2517,
			"lon": 5132,
			"rules": ""
		},
		"Asia/Qyzylorda": {
			"lat": 4448,
			"lon": 6528,
			"rules": "RussiaAsia"
		},
		"Asia/Rangoon": {
			"lat": 1647,
			"lon": 9610,
			"rules": ""
		},
		"Asia/Riyadh": {
			"lat": 2438,
			"lon": 4643,
			"rules": ""
		},
		"Asia/Sakhalin": {
			"lat": 4658,
			"lon": 14242,
			"rules": "Russia"
		},
		"Asia/Samarkand": {
			"lat": 3940,
			"lon": 6648,
			"rules": "RussiaAsia"
		},
		"Asia/Seoul": {
			"lat": 3733,
			"lon": 12658,
			"rules": "ROK"
		},
		"Asia/Shanghai": {
			"lat": 3114,
			"lon": 12128,
			"rules": "Shang PRC"
		},
		"Asia/Singapore": {
			"lat": 117,
			"lon": 10351,
			"rules": ""
		},
		"Asia/Taipei": {
			"lat": 2503,
			"lon": 12130,
			"rules": "Taiwan"
		},
		"Asia/Tashkent": {
			"lat": 4120,
			"lon": 6918,
			"rules": "RussiaAsia"
		},
		"Asia/Tbilisi": {
			"lat": 4143,
			"lon": 4449,
			"rules": "RussiaAsia E-EurAsia"
		},
		"Asia/Tehran": {
			"lat": 3540,
			"lon": 5126,
			"rules": "Iran"
		},
		"Asia/Thimphu": {
			"lat": 2728,
			"lon": 8939,
			"rules": ""
		},
		"Asia/Tokyo": {
			"lat": 353916,
			"lon": 1394441,
			"rules": "Japan"
		},
		"Asia/Ulaanbaatar": {
			"lat": 4755,
			"lon": 10653,
			"rules": "Mongol"
		},
		"Asia/Urumqi": {
			"lat": 4348,
			"lon": 8735,
			"rules": "PRC"
		},
		"Asia/Ust-Nera": {
			"lat": 643337,
			"lon": 1431336,
			"rules": "Russia"
		},
		"Asia/Vientiane": {
			"lat": 1758,
			"lon": 10236,
			"rules": ""
		},
		"Asia/Vladivostok": {
			"lat": 4310,
			"lon": 13156,
			"rules": "Russia"
		},
		"Asia/Yakutsk": {
			"lat": 6200,
			"lon": 12940,
			"rules": "Russia"
		},
		"Asia/Yekaterinburg": {
			"lat": 5651,
			"lon": 6036,
			"rules": "Russia"
		},
		"Asia/Yerevan": {
			"lat": 4011,
			"lon": 4430,
			"rules": "RussiaAsia"
		},
		"Atlantic/Azores": {
			"lat": 3744,
			"lon": -2540,
			"rules": "Port W-Eur EU"
		},
		"Atlantic/Bermuda": {
			"lat": 3217,
			"lon": -6446,
			"rules": "Bahamas US"
		},
		"Atlantic/Canary": {
			"lat": 2806,
			"lon": -1524,
			"rules": "EU"
		},
		"Atlantic/Cape_Verde": {
			"lat": 1455,
			"lon": -2331,
			"rules": ""
		},
		"Atlantic/Faroe": {
			"lat": 6201,
			"lon": -646,
			"rules": "EU"
		},
		"Atlantic/Madeira": {
			"lat": 3238,
			"lon": -1654,
			"rules": "Port EU"
		},
		"Atlantic/Reykjavik": {
			"lat": 6409,
			"lon": -2151,
			"rules": "Iceland"
		},
		"Atlantic/South_Georgia": {
			"lat": -5416,
			"lon": -3632,
			"rules": ""
		},
		"Atlantic/St_Helena": {
			"lat": -1555,
			"lon": -542,
			"rules": ""
		},
		"Atlantic/Stanley": {
			"lat": -5142,
			"lon": -5751,
			"rules": "Falk"
		},
		"Australia/Adelaide": {
			"lat": -3455,
			"lon": 13835,
			"rules": "Aus AS"
		},
		"Australia/Brisbane": {
			"lat": -2728,
			"lon": 15302,
			"rules": "Aus AQ"
		},
		"Australia/Broken_Hill": {
			"lat": -3157,
			"lon": 14127,
			"rules": "Aus AN AS"
		},
		"Australia/Currie": {
			"lat": -3956,
			"lon": 14352,
			"rules": "Aus AT"
		},
		"Australia/Darwin": {
			"lat": -1228,
			"lon": 13050,
			"rules": "Aus"
		},
		"Australia/Eucla": {
			"lat": -3143,
			"lon": 12852,
			"rules": "Aus AW"
		},
		"Australia/Hobart": {
			"lat": -4253,
			"lon": 14719,
			"rules": "Aus AT"
		},
		"Australia/Lindeman": {
			"lat": -2016,
			"lon": 14900,
			"rules": "Aus AQ Holiday"
		},
		"Australia/Lord_Howe": {
			"lat": -3133,
			"lon": 15905,
			"rules": "LH"
		},
		"Australia/Melbourne": {
			"lat": -3749,
			"lon": 14458,
			"rules": "Aus AV"
		},
		"Australia/Perth": {
			"lat": -3157,
			"lon": 11551,
			"rules": "Aus AW"
		},
		"Australia/Sydney": {
			"lat": -3352,
			"lon": 15113,
			"rules": "Aus AN"
		},
		"CET": {
			"rules": "C-Eur"
		},
		"CST6CDT": {
			"rules": "US"
		},
		"EET": {
			"rules": "EU"
		},
		"EST": {
			"rules": ""
		},
		"EST5EDT": {
			"rules": "US"
		},
		"Europe/Amsterdam": {
			"lat": 5222,
			"lon": 454,
			"rules": "Neth C-Eur EU"
		},
		"Europe/Andorra": {
			"lat": 4230,
			"lon": 131,
			"rules": "EU"
		},
		"Europe/Athens": {
			"lat": 3758,
			"lon": 2343,
			"rules": "Greece EU"
		},
		"Europe/Belgrade": {
			"lat": 4450,
			"lon": 2030,
			"rules": "C-Eur EU"
		},
		"Europe/Berlin": {
			"lat": 5230,
			"lon": 1322,
			"rules": "C-Eur SovietZone Germany EU"
		},
		"Europe/Bratislava": {
			"lat": 4809,
			"lon": 1707,
			"rules": ""
		},
		"Europe/Brussels": {
			"lat": 5050,
			"lon": 420,
			"rules": "C-Eur Belgium EU"
		},
		"Europe/Bucharest": {
			"lat": 4426,
			"lon": 2606,
			"rules": "Romania C-Eur E-Eur EU"
		},
		"Europe/Budapest": {
			"lat": 4730,
			"lon": 1905,
			"rules": "C-Eur Hungary EU"
		},
		"Europe/Busingen": {
			"lat": 4742,
			"lon": 841,
			"rules": ""
		},
		"Europe/Chisinau": {
			"lat": 4700,
			"lon": 2850,
			"rules": "Romania C-Eur Russia E-Eur EU"
		},
		"Europe/Copenhagen": {
			"lat": 5540,
			"lon": 1235,
			"rules": "Denmark C-Eur EU"
		},
		"Europe/Dublin": {
			"lat": 5320,
			"lon": -615,
			"rules": "GB-Eire EU"
		},
		"Europe/Gibraltar": {
			"lat": 3608,
			"lon": -521,
			"rules": "GB-Eire EU"
		},
		"Europe/Guernsey": {
			"lat": 4927,
			"lon": -232,
			"rules": ""
		},
		"Europe/Helsinki": {
			"lat": 6010,
			"lon": 2458,
			"rules": "Finland EU"
		},
		"Europe/Isle_of_Man": {
			"lat": 5409,
			"lon": -428,
			"rules": ""
		},
		"Europe/Istanbul": {
			"lat": 4101,
			"lon": 2858,
			"rules": "Turkey EU"
		},
		"Europe/Jersey": {
			"lat": 4912,
			"lon": -207,
			"rules": ""
		},
		"Europe/Kaliningrad": {
			"lat": 5443,
			"lon": 2030,
			"rules": "C-Eur Poland Russia"
		},
		"Europe/Kiev": {
			"lat": 5026,
			"lon": 3031,
			"rules": "C-Eur Russia E-Eur EU"
		},
		"Europe/Lisbon": {
			"lat": 3843,
			"lon": -908,
			"rules": "Port W-Eur EU"
		},
		"Europe/Ljubljana": {
			"lat": 4603,
			"lon": 1431,
			"rules": ""
		},
		"Europe/London": {
			"lat": 513030,
			"lon": -731,
			"rules": "GB-Eire EU"
		},
		"Europe/Luxembourg": {
			"lat": 4936,
			"lon": 609,
			"rules": "Lux Belgium C-Eur EU"
		},
		"Europe/Madrid": {
			"lat": 4024,
			"lon": -341,
			"rules": "Spain EU"
		},
		"Europe/Malta": {
			"lat": 3554,
			"lon": 1431,
			"rules": "Italy C-Eur Malta EU"
		},
		"Europe/Mariehamn": {
			"lat": 6006,
			"lon": 1957,
			"rules": ""
		},
		"Europe/Minsk": {
			"lat": 5354,
			"lon": 2734,
			"rules": "C-Eur Russia"
		},
		"Europe/Monaco": {
			"lat": 4342,
			"lon": 723,
			"rules": "France EU"
		},
		"Europe/Moscow": {
			"lat": 5545,
			"lon": 3735,
			"rules": "Russia"
		},
		"Europe/Oslo": {
			"lat": 5955,
			"lon": 1045,
			"rules": "Norway C-Eur EU"
		},
		"Europe/Paris": {
			"lat": 4852,
			"lon": 220,
			"rules": "France C-Eur EU"
		},
		"Europe/Podgorica": {
			"lat": 4226,
			"lon": 1916,
			"rules": ""
		},
		"Europe/Prague": {
			"lat": 5005,
			"lon": 1426,
			"rules": "C-Eur Czech EU"
		},
		"Europe/Riga": {
			"lat": 5657,
			"lon": 2406,
			"rules": "C-Eur Russia Latvia EU"
		},
		"Europe/Rome": {
			"lat": 4154,
			"lon": 1229,
			"rules": "Italy C-Eur EU"
		},
		"Europe/Samara": {
			"lat": 5312,
			"lon": 5009,
			"rules": "Russia"
		},
		"Europe/San_Marino": {
			"lat": 4355,
			"lon": 1228,
			"rules": ""
		},
		"Europe/Sarajevo": {
			"lat": 4352,
			"lon": 1825,
			"rules": ""
		},
		"Europe/Simferopol": {
			"lat": 4457,
			"lon": 3406,
			"rules": "C-Eur Russia E-Eur EU"
		},
		"Europe/Skopje": {
			"lat": 4159,
			"lon": 2126,
			"rules": ""
		},
		"Europe/Sofia": {
			"lat": 4241,
			"lon": 2319,
			"rules": "C-Eur Bulg E-Eur EU"
		},
		"Europe/Stockholm": {
			"lat": 5920,
			"lon": 1803,
			"rules": "EU"
		},
		"Europe/Tallinn": {
			"lat": 5925,
			"lon": 2445,
			"rules": "C-Eur Russia EU"
		},
		"Europe/Tirane": {
			"lat": 4120,
			"lon": 1950,
			"rules": "Albania EU"
		},
		"Europe/Uzhgorod": {
			"lat": 4837,
			"lon": 2218,
			"rules": "C-Eur Russia E-Eur EU"
		},
		"Europe/Vaduz": {
			"lat": 4709,
			"lon": 931,
			"rules": "EU"
		},
		"Europe/Vatican": {
			"lat": 415408,
			"lon": 122711,
			"rules": ""
		},
		"Europe/Vienna": {
			"lat": 4813,
			"lon": 1620,
			"rules": "C-Eur Austria EU"
		},
		"Europe/Vilnius": {
			"lat": 5441,
			"lon": 2519,
			"rules": "C-Eur Russia EU"
		},
		"Europe/Volgograd": {
			"lat": 4844,
			"lon": 4425,
			"rules": "Russia"
		},
		"Europe/Warsaw": {
			"lat": 5215,
			"lon": 2100,
			"rules": "C-Eur Poland W-Eur EU"
		},
		"Europe/Zagreb": {
			"lat": 4548,
			"lon": 1558,
			"rules": ""
		},
		"Europe/Zaporozhye": {
			"lat": 4750,
			"lon": 3510,
			"rules": "C-Eur Russia E-Eur EU"
		},
		"Europe/Zurich": {
			"lat": 4723,
			"lon": 832,
			"rules": "Swiss EU"
		},
		"HST": {
			"rules": ""
		},
		"Indian/Antananarivo": {
			"lat": -1855,
			"lon": 4731,
			"rules": ""
		},
		"Indian/Chagos": {
			"lat": -720,
			"lon": 7225,
			"rules": ""
		},
		"Indian/Christmas": {
			"lat": -1025,
			"lon": 10543,
			"rules": ""
		},
		"Indian/Cocos": {
			"lat": -1210,
			"lon": 9655,
			"rules": ""
		},
		"Indian/Comoro": {
			"lat": -1141,
			"lon": 4316,
			"rules": ""
		},
		"Indian/Kerguelen": {
			"lat": -492110,
			"lon": 701303,
			"rules": ""
		},
		"Indian/Mahe": {
			"lat": -440,
			"lon": 5528,
			"rules": ""
		},
		"Indian/Maldives": {
			"lat": 410,
			"lon": 7330,
			"rules": ""
		},
		"Indian/Mauritius": {
			"lat": -2010,
			"lon": 5730,
			"rules": "Mauritius"
		},
		"Indian/Mayotte": {
			"lat": -1247,
			"lon": 4514,
			"rules": ""
		},
		"Indian/Reunion": {
			"lat": -2052,
			"lon": 5528,
			"rules": ""
		},
		"MET": {
			"rules": "C-Eur"
		},
		"MST": {
			"rules": ""
		},
		"MST7MDT": {
			"rules": "US"
		},
		"PST8PDT": {
			"rules": "US"
		},
		"Pacific/Apia": {
			"lat": -1350,
			"lon": -17144,
			"rules": "WS"
		},
		"Pacific/Auckland": {
			"lat": -3652,
			"lon": 17446,
			"rules": "NZ"
		},
		"Pacific/Chatham": {
			"lat": -4357,
			"lon": -17633,
			"rules": "Chatham"
		},
		"Pacific/Chuuk": {
			"lat": 725,
			"lon": 15147,
			"rules": ""
		},
		"Pacific/Easter": {
			"lat": -2709,
			"lon": -10926,
			"rules": "Chile"
		},
		"Pacific/Efate": {
			"lat": -1740,
			"lon": 16825,
			"rules": "Vanuatu"
		},
		"Pacific/Enderbury": {
			"lat": -308,
			"lon": -17105,
			"rules": ""
		},
		"Pacific/Fakaofo": {
			"lat": -922,
			"lon": -17114,
			"rules": ""
		},
		"Pacific/Fiji": {
			"lat": -1808,
			"lon": 17825,
			"rules": "Fiji"
		},
		"Pacific/Funafuti": {
			"lat": -831,
			"lon": 17913,
			"rules": ""
		},
		"Pacific/Galapagos": {
			"lat": -54,
			"lon": -8936,
			"rules": ""
		},
		"Pacific/Gambier": {
			"lat": -2308,
			"lon": -13457,
			"rules": ""
		},
		"Pacific/Guadalcanal": {
			"lat": -932,
			"lon": 16012,
			"rules": ""
		},
		"Pacific/Guam": {
			"lat": 1328,
			"lon": 14445,
			"rules": ""
		},
		"Pacific/Honolulu": {
			"lat": 211825,
			"lon": -1575130,
			"rules": ""
		},
		"Pacific/Johnston": {
			"lat": 1645,
			"lon": -16931,
			"rules": ""
		},
		"Pacific/Kiritimati": {
			"lat": 152,
			"lon": -15720,
			"rules": ""
		},
		"Pacific/Kosrae": {
			"lat": 519,
			"lon": 16259,
			"rules": ""
		},
		"Pacific/Kwajalein": {
			"lat": 905,
			"lon": 16720,
			"rules": ""
		},
		"Pacific/Majuro": {
			"lat": 709,
			"lon": 17112,
			"rules": ""
		},
		"Pacific/Marquesas": {
			"lat": -900,
			"lon": -13930,
			"rules": ""
		},
		"Pacific/Midway": {
			"lat": 2813,
			"lon": -17722,
			"rules": ""
		},
		"Pacific/Nauru": {
			"lat": -31,
			"lon": 16655,
			"rules": ""
		},
		"Pacific/Niue": {
			"lat": -1901,
			"lon": -16955,
			"rules": ""
		},
		"Pacific/Norfolk": {
			"lat": -2903,
			"lon": 16758,
			"rules": ""
		},
		"Pacific/Noumea": {
			"lat": -2216,
			"lon": 16627,
			"rules": "NC"
		},
		"Pacific/Pago_Pago": {
			"lat": -1416,
			"lon": -17042,
			"rules": ""
		},
		"Pacific/Palau": {
			"lat": 720,
			"lon": 13429,
			"rules": ""
		},
		"Pacific/Pitcairn": {
			"lat": -2504,
			"lon": -13005,
			"rules": ""
		},
		"Pacific/Pohnpei": {
			"lat": 658,
			"lon": 15813,
			"rules": ""
		},
		"Pacific/Port_Moresby": {
			"lat": -930,
			"lon": 14710,
			"rules": ""
		},
		"Pacific/Rarotonga": {
			"lat": -2114,
			"lon": -15946,
			"rules": "Cook"
		},
		"Pacific/Saipan": {
			"lat": 1512,
			"lon": 14545,
			"rules": ""
		},
		"Pacific/Tahiti": {
			"lat": -1732,
			"lon": -14934,
			"rules": ""
		},
		"Pacific/Tarawa": {
			"lat": 125,
			"lon": 17300,
			"rules": ""
		},
		"Pacific/Tongatapu": {
			"lat": -2110,
			"lon": -17510,
			"rules": "Tonga"
		},
		"Pacific/Wake": {
			"lat": 1917,
			"lon": 16637,
			"rules": ""
		},
		"Pacific/Wallis": {
			"lat": -1318,
			"lon": -17610,
			"rules": ""
		},
		"WET": {
			"rules": "EU"
		}
	},
	"rules": {
		"AN": [
			"1971 1985 9 0 8 2 2 1",
			"1972 1972 1 27 7 2 2 0",
			"1973 1981 2 1 0 2 2 0",
			"1982 1982 3 1 0 2 2 0",
			"1983 1985 2 1 0 2 2 0",
			"1986 1989 2 15 0 2 2 0",
			"1986 1986 9 19 7 2 2 1",
			"1987 1999 9 0 8 2 2 1",
			"1990 1995 2 1 0 2 2 0",
			"1996 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 2007 9 0 8 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"AQ": [
			"1971 1971 9 0 8 2 2 1",
			"1972 1972 1 0 8 2 2 0",
			"1989 1991 9 0 8 2 2 1",
			"1990 1992 2 1 0 2 2 0"
		],
		"AS": [
			"1971 1985 9 0 8 2 2 1",
			"1986 1986 9 19 7 2 2 1",
			"1987 2007 9 0 8 2 2 1",
			"1972 1972 1 27 7 2 2 0",
			"1973 1985 2 1 0 2 2 0",
			"1986 1990 2 15 0 2 2 0",
			"1991 1991 2 3 7 2 2 0",
			"1992 1992 2 22 7 2 2 0",
			"1993 1993 2 7 7 2 2 0",
			"1994 1994 2 20 7 2 2 0",
			"1995 2005 2 0 8 2 2 0",
			"2006 2006 3 2 7 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"AT": [
			"1967 1967 9 1 0 2 2 1",
			"1968 1968 2 0 8 2 2 0",
			"1968 1985 9 0 8 2 2 1",
			"1969 1971 2 8 0 2 2 0",
			"1972 1972 1 0 8 2 2 0",
			"1973 1981 2 1 0 2 2 0",
			"1982 1983 2 0 8 2 2 0",
			"1984 1986 2 1 0 2 2 0",
			"1986 1986 9 15 0 2 2 1",
			"1987 1990 2 15 0 2 2 0",
			"1987 1987 9 22 0 2 2 1",
			"1988 1990 9 0 8 2 2 1",
			"1991 1999 9 1 0 2 2 1",
			"1991 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 9999 9 1 0 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0"
		],
		"AV": [
			"1971 1985 9 0 8 2 2 1",
			"1972 1972 1 0 8 2 2 0",
			"1973 1985 2 1 0 2 2 0",
			"1986 1990 2 15 0 2 2 0",
			"1986 1987 9 15 0 2 2 1",
			"1988 1999 9 0 8 2 2 1",
			"1991 1994 2 1 0 2 2 0",
			"1995 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 2007 9 0 8 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"AW": [
			"1974 1974 9 0 8 2 2 1",
			"1975 1975 2 1 0 2 2 0",
			"1983 1983 9 0 8 2 2 1",
			"1984 1984 2 1 0 2 2 0",
			"1991 1991 10 17 7 2 2 1",
			"1992 1992 2 1 0 2 2 0",
			"2006 2006 11 3 7 2 2 1",
			"2007 2009 2 0 8 2 2 0",
			"2007 2008 9 0 8 2 2 1"
		],
		"Albania": [
			"1940 1940 5 16 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 29 7 2 0 1 S",
			"1943 1943 3 10 7 3 0 0",
			"1974 1974 4 4 7 0 0 1 S",
			"1974 1974 9 2 7 0 0 0",
			"1975 1975 4 1 7 0 0 1 S",
			"1975 1975 9 2 7 0 0 0",
			"1976 1976 4 2 7 0 0 1 S",
			"1976 1976 9 3 7 0 0 0",
			"1977 1977 4 8 7 0 0 1 S",
			"1977 1977 9 2 7 0 0 0",
			"1978 1978 4 6 7 0 0 1 S",
			"1978 1978 9 1 7 0 0 0",
			"1979 1979 4 5 7 0 0 1 S",
			"1979 1979 8 30 7 0 0 0",
			"1980 1980 4 3 7 0 0 1 S",
			"1980 1980 9 4 7 0 0 0",
			"1981 1981 3 26 7 0 0 1 S",
			"1981 1981 8 27 7 0 0 0",
			"1982 1982 4 2 7 0 0 1 S",
			"1982 1982 9 3 7 0 0 0",
			"1983 1983 3 18 7 0 0 1 S",
			"1983 1983 9 1 7 0 0 0",
			"1984 1984 3 1 7 0 0 1 S"
		],
		"Algeria": [
			"1916 1916 5 14 7 23 2 1 S",
			"1916 1919 9 1 0 23 2 0",
			"1917 1917 2 24 7 23 2 1 S",
			"1918 1918 2 9 7 23 2 1 S",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 5 21 7 23 2 0",
			"1939 1939 8 11 7 23 2 1 S",
			"1939 1939 10 19 7 1 0 0",
			"1944 1945 3 1 1 2 0 1 S",
			"1944 1944 9 8 7 2 0 0",
			"1945 1945 8 16 7 1 0 0",
			"1971 1971 3 25 7 23 2 1 S",
			"1971 1971 8 26 7 23 2 0",
			"1977 1977 4 6 7 0 0 1 S",
			"1977 1977 9 21 7 0 0 0",
			"1978 1978 2 24 7 1 0 1 S",
			"1978 1978 8 22 7 3 0 0",
			"1980 1980 3 25 7 0 0 1 S",
			"1980 1980 9 31 7 2 0 0"
		],
		"Arg": [
			"1930 1930 11 1 7 0 0 1 S",
			"1931 1931 3 1 7 0 0 0",
			"1931 1931 9 15 7 0 0 1 S",
			"1932 1940 2 1 7 0 0 0",
			"1932 1939 10 1 7 0 0 1 S",
			"1940 1940 6 1 7 0 0 1 S",
			"1941 1941 5 15 7 0 0 0",
			"1941 1941 9 15 7 0 0 1 S",
			"1943 1943 7 1 7 0 0 0",
			"1943 1943 9 15 7 0 0 1 S",
			"1946 1946 2 1 7 0 0 0",
			"1946 1946 9 1 7 0 0 1 S",
			"1963 1963 9 1 7 0 0 0",
			"1963 1963 11 15 7 0 0 1 S",
			"1964 1966 2 1 7 0 0 0",
			"1964 1966 9 15 7 0 0 1 S",
			"1967 1967 3 2 7 0 0 0",
			"1967 1968 9 1 0 0 0 1 S",
			"1968 1969 3 1 0 0 0 0",
			"1974 1974 0 23 7 0 0 1 S",
			"1974 1974 4 1 7 0 0 0",
			"1988 1988 11 1 7 0 0 1 S",
			"1989 1993 2 1 0 0 0 0",
			"1989 1992 9 15 0 0 0 1 S",
			"1999 1999 9 1 0 0 0 1 S",
			"2000 2000 2 3 7 0 0 0",
			"2007 2007 11 30 7 0 0 1 S",
			"2008 2009 2 15 0 0 0 0",
			"2008 2008 9 15 0 0 0 1 S"
		],
		"ArgAQ": [
			"1964 1966 2 1 7 0 0 0",
			"1964 1966 9 15 7 0 0 1 S",
			"1967 1967 3 2 7 0 0 0",
			"1967 1968 9 1 0 0 0 1 S",
			"1968 1969 3 1 0 0 0 0",
			"1974 1974 0 23 7 0 0 1 S",
			"1974 1974 4 1 7 0 0 0"
		],
		"Aus": [
			"1917 1917 0 1 7 0:1 0 1",
			"1917 1917 2 25 7 2 0 0",
			"1942 1942 0 1 7 2 0 1",
			"1942 1942 2 29 7 2 0 0",
			"1942 1942 8 27 7 2 0 1",
			"1943 1944 2 0 8 2 0 0",
			"1943 1943 9 3 7 2 0 1"
		],
		"Austria": [
			"1920 1920 3 5 7 2 2 1 S",
			"1920 1920 8 13 7 2 2 0",
			"1946 1946 3 14 7 2 2 1 S",
			"1946 1948 9 1 0 2 2 0",
			"1947 1947 3 6 7 2 2 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1980 1980 3 6 7 0 0 1 S",
			"1980 1980 8 28 7 0 0 0"
		],
		"Azer": [
			"1997 9999 2 0 8 4 0 1 S",
			"1997 9999 9 0 8 5 0 0"
		],
		"Bahamas": [
			"1964 1975 9 0 8 2 0 0 S",
			"1964 1975 3 0 8 2 0 1 D"
		],
		"Barb": [
			"1977 1977 5 12 7 2 0 1 D",
			"1977 1978 9 1 0 2 0 0 S",
			"1978 1980 3 15 0 2 0 1 D",
			"1979 1979 8 30 7 2 0 0 S",
			"1980 1980 8 25 7 2 0 0 S"
		],
		"Belgium": [
			"1918 1918 2 9 7 0 2 1 S",
			"1918 1919 9 1 6 23 2 0",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 9 25 7 23 2 0",
			"1922 1922 2 25 7 23 2 1 S",
			"1922 1927 9 1 6 23 2 0",
			"1923 1923 3 21 7 23 2 1 S",
			"1924 1924 2 29 7 23 2 1 S",
			"1925 1925 3 4 7 23 2 1 S",
			"1926 1926 3 17 7 23 2 1 S",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1928 1938 9 2 0 2 2 0",
			"1929 1929 3 21 7 2 2 1 S",
			"1930 1930 3 13 7 2 2 1 S",
			"1931 1931 3 19 7 2 2 1 S",
			"1932 1932 3 3 7 2 2 1 S",
			"1933 1933 2 26 7 2 2 1 S",
			"1934 1934 3 8 7 2 2 1 S",
			"1935 1935 2 31 7 2 2 1 S",
			"1936 1936 3 19 7 2 2 1 S",
			"1937 1937 3 4 7 2 2 1 S",
			"1938 1938 2 27 7 2 2 1 S",
			"1939 1939 3 16 7 2 2 1 S",
			"1939 1939 10 19 7 2 2 0",
			"1940 1940 1 25 7 2 2 1 S",
			"1944 1944 8 17 7 2 2 0",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 8 16 7 2 2 0",
			"1946 1946 4 19 7 2 2 1 S",
			"1946 1946 9 7 7 2 2 0"
		],
		"Belize": [
			"1918 1942 9 2 0 0 0 0:30 HD",
			"1919 1943 1 9 0 0 0 0 S",
			"1973 1973 11 5 7 0 0 1 D",
			"1974 1974 1 9 7 0 0 0 S",
			"1982 1982 11 18 7 0 0 1 D",
			"1983 1983 1 12 7 0 0 0 S"
		],
		"Brazil": [
			"1931 1931 9 3 7 11 0 1 S",
			"1932 1933 3 1 7 0 0 0",
			"1932 1932 9 3 7 0 0 1 S",
			"1949 1952 11 1 7 0 0 1 S",
			"1950 1950 3 16 7 1 0 0",
			"1951 1952 3 1 7 0 0 0",
			"1953 1953 2 1 7 0 0 0",
			"1963 1963 11 9 7 0 0 1 S",
			"1964 1964 2 1 7 0 0 0",
			"1965 1965 0 31 7 0 0 1 S",
			"1965 1965 2 31 7 0 0 0",
			"1965 1965 11 1 7 0 0 1 S",
			"1966 1968 2 1 7 0 0 0",
			"1966 1967 10 1 7 0 0 1 S",
			"1985 1985 10 2 7 0 0 1 S",
			"1986 1986 2 15 7 0 0 0",
			"1986 1986 9 25 7 0 0 1 S",
			"1987 1987 1 14 7 0 0 0",
			"1987 1987 9 25 7 0 0 1 S",
			"1988 1988 1 7 7 0 0 0",
			"1988 1988 9 16 7 0 0 1 S",
			"1989 1989 0 29 7 0 0 0",
			"1989 1989 9 15 7 0 0 1 S",
			"1990 1990 1 11 7 0 0 0",
			"1990 1990 9 21 7 0 0 1 S",
			"1991 1991 1 17 7 0 0 0",
			"1991 1991 9 20 7 0 0 1 S",
			"1992 1992 1 9 7 0 0 0",
			"1992 1992 9 25 7 0 0 1 S",
			"1993 1993 0 31 7 0 0 0",
			"1993 1995 9 11 0 0 0 1 S",
			"1994 1995 1 15 0 0 0 0",
			"1996 1996 1 11 7 0 0 0",
			"1996 1996 9 6 7 0 0 1 S",
			"1997 1997 1 16 7 0 0 0",
			"1997 1997 9 6 7 0 0 1 S",
			"1998 1998 2 1 7 0 0 0",
			"1998 1998 9 11 7 0 0 1 S",
			"1999 1999 1 21 7 0 0 0",
			"1999 1999 9 3 7 0 0 1 S",
			"2000 2000 1 27 7 0 0 0",
			"2000 2001 9 8 0 0 0 1 S",
			"2001 2006 1 15 0 0 0 0",
			"2002 2002 10 3 7 0 0 1 S",
			"2003 2003 9 19 7 0 0 1 S",
			"2004 2004 10 2 7 0 0 1 S",
			"2005 2005 9 16 7 0 0 1 S",
			"2006 2006 10 5 7 0 0 1 S",
			"2007 2007 1 25 7 0 0 0",
			"2007 2007 9 8 0 0 0 1 S",
			"2008 9999 9 15 0 0 0 1 S",
			"2008 2011 1 15 0 0 0 0",
			"2012 2012 1 22 0 0 0 0",
			"2013 2014 1 15 0 0 0 0",
			"2015 2015 1 22 0 0 0 0",
			"2016 2022 1 15 0 0 0 0",
			"2023 2023 1 22 0 0 0 0",
			"2024 2025 1 15 0 0 0 0",
			"2026 2026 1 22 0 0 0 0",
			"2027 2033 1 15 0 0 0 0",
			"2034 2034 1 22 0 0 0 0",
			"2035 2036 1 15 0 0 0 0",
			"2037 2037 1 22 0 0 0 0",
			"2038 9999 1 15 0 0 0 0"
		],
		"Bulg": [
			"1979 1979 2 31 7 23 0 1 S",
			"1979 1979 9 1 7 1 0 0",
			"1980 1982 3 1 6 23 0 1 S",
			"1980 1980 8 29 7 1 0 0",
			"1981 1981 8 27 7 2 0 0"
		],
		"C-Eur": [
			"1916 1916 3 30 7 23 0 1 S",
			"1916 1916 9 1 7 1 0 0",
			"1917 1918 3 15 1 2 2 1 S",
			"1917 1918 8 15 1 2 2 0",
			"1940 1940 3 1 7 2 2 1 S",
			"1942 1942 10 2 7 2 2 0",
			"1943 1943 2 29 7 2 2 1 S",
			"1943 1943 9 4 7 2 2 0",
			"1944 1945 3 1 1 2 2 1 S",
			"1944 1944 9 2 7 2 2 0",
			"1945 1945 8 16 7 2 2 0",
			"1977 1980 3 1 0 2 2 1 S",
			"1977 1977 8 0 8 2 2 0",
			"1978 1978 9 1 7 2 2 0",
			"1979 1995 8 0 8 2 2 0",
			"1981 9999 2 0 8 2 2 1 S",
			"1996 9999 9 0 8 2 2 0"
		],
		"CA": [
			"1948 1948 2 14 7 2 0 1 D",
			"1949 1949 0 1 7 2 0 0 S",
			"1950 1966 3 0 8 2 0 1 D",
			"1950 1961 8 0 8 2 0 0 S",
			"1962 1966 9 0 8 2 0 0 S"
		],
		"CO": [
			"1992 1992 4 3 7 0 0 1 S",
			"1993 1993 3 4 7 0 0 0"
		],
		"CR": [
			"1979 1980 1 0 8 0 0 1 D",
			"1979 1980 5 1 0 0 0 0 S",
			"1991 1992 0 15 6 0 0 1 D",
			"1991 1991 6 1 7 0 0 0 S",
			"1992 1992 2 15 7 0 0 0 S"
		],
		"Canada": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1974 1986 3 0 8 2 0 1 D",
			"1974 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Chatham": [
			"1974 1974 10 1 0 2:45 2 1 D",
			"1975 1975 1 0 8 2:45 2 0 S",
			"1975 1988 9 0 8 2:45 2 1 D",
			"1976 1989 2 1 0 2:45 2 0 S",
			"1989 1989 9 8 0 2:45 2 1 D",
			"1990 2006 9 1 0 2:45 2 1 D",
			"1990 2007 2 15 0 2:45 2 0 S",
			"2007 9999 8 0 8 2:45 2 1 D",
			"2008 9999 3 1 0 2:45 2 0 S"
		],
		"Chicago": [
			"1920 1920 5 13 7 2 0 1 D",
			"1920 1921 9 0 8 2 0 0 S",
			"1921 1921 2 0 8 2 0 1 D",
			"1922 1966 3 0 8 2 0 1 D",
			"1922 1954 8 0 8 2 0 0 S",
			"1955 1966 9 0 8 2 0 0 S"
		],
		"Chile": [
			"1927 1932 8 1 7 0 0 1 S",
			"1928 1932 3 1 7 0 0 0",
			"1942 1942 5 1 7 4 1 0",
			"1942 1942 7 1 7 5 1 1 S",
			"1946 1946 6 15 7 4 1 1 S",
			"1946 1946 8 1 7 3 1 0",
			"1947 1947 3 1 7 4 1 0",
			"1968 1968 10 3 7 4 1 1 S",
			"1969 1969 2 30 7 3 1 0",
			"1969 1969 10 23 7 4 1 1 S",
			"1970 1970 2 29 7 3 1 0",
			"1971 1971 2 14 7 3 1 0",
			"1970 1972 9 9 0 4 1 1 S",
			"1972 1986 2 9 0 3 1 0",
			"1973 1973 8 30 7 4 1 1 S",
			"1974 1987 9 9 0 4 1 1 S",
			"1987 1987 3 12 7 3 1 0",
			"1988 1989 2 9 0 3 1 0",
			"1988 1988 9 1 0 4 1 1 S",
			"1989 1989 9 9 0 4 1 1 S",
			"1990 1990 2 18 7 3 1 0",
			"1990 1990 8 16 7 4 1 1 S",
			"1991 1996 2 9 0 3 1 0",
			"1991 1997 9 9 0 4 1 1 S",
			"1997 1997 2 30 7 3 1 0",
			"1998 1998 2 9 0 3 1 0",
			"1998 1998 8 27 7 4 1 1 S",
			"1999 1999 3 4 7 3 1 0",
			"1999 2010 9 9 0 4 1 1 S",
			"2000 2007 2 9 0 3 1 0",
			"2008 2008 2 30 7 3 1 0",
			"2009 2009 2 9 0 3 1 0",
			"2010 2010 3 1 0 3 1 0",
			"2011 2011 4 2 0 3 1 0",
			"2011 2011 7 16 0 4 1 1 S",
			"2012 9999 3 23 0 3 1 0",
			"2012 9999 8 2 0 4 1 1 S"
		],
		"ChileAQ": [
			"1972 1986 2 9 0 3 1 0",
			"1974 1987 9 9 0 4 1 1 S",
			"1987 1987 3 12 7 3 1 0",
			"1988 1989 2 9 0 3 1 0",
			"1988 1988 9 1 0 4 1 1 S",
			"1989 1989 9 9 0 4 1 1 S",
			"1990 1990 2 18 7 3 1 0",
			"1990 1990 8 16 7 4 1 1 S",
			"1991 1996 2 9 0 3 1 0",
			"1991 1997 9 9 0 4 1 1 S",
			"1997 1997 2 30 7 3 1 0",
			"1998 1998 2 9 0 3 1 0",
			"1998 1998 8 27 7 4 1 1 S",
			"1999 1999 3 4 7 3 1 0",
			"1999 2010 9 9 0 4 1 1 S",
			"2000 2007 2 9 0 3 1 0",
			"2008 2008 2 30 7 3 1 0",
			"2009 2009 2 9 0 3 1 0",
			"2010 2010 3 1 0 3 1 0",
			"2011 2011 4 2 0 3 1 0",
			"2011 2011 7 16 0 4 1 1 S",
			"2012 9999 3 23 0 3 1 0",
			"2012 9999 8 2 0 4 1 1 S"
		],
		"Cook": [
			"1978 1978 10 12 7 0 0 0:30 HS",
			"1979 1991 2 1 0 0 0 0",
			"1979 1990 9 0 8 0 0 0:30 HS"
		],
		"Cuba": [
			"1928 1928 5 10 7 0 0 1 D",
			"1928 1928 9 10 7 0 0 0 S",
			"1940 1942 5 1 0 0 0 1 D",
			"1940 1942 8 1 0 0 0 0 S",
			"1945 1946 5 1 0 0 0 1 D",
			"1945 1946 8 1 0 0 0 0 S",
			"1965 1965 5 1 7 0 0 1 D",
			"1965 1965 8 30 7 0 0 0 S",
			"1966 1966 4 29 7 0 0 1 D",
			"1966 1966 9 2 7 0 0 0 S",
			"1967 1967 3 8 7 0 0 1 D",
			"1967 1968 8 8 0 0 0 0 S",
			"1968 1968 3 14 7 0 0 1 D",
			"1969 1977 3 0 8 0 0 1 D",
			"1969 1971 9 0 8 0 0 0 S",
			"1972 1974 9 8 7 0 0 0 S",
			"1975 1977 9 0 8 0 0 0 S",
			"1978 1978 4 7 7 0 0 1 D",
			"1978 1990 9 8 0 0 0 0 S",
			"1979 1980 2 15 0 0 0 1 D",
			"1981 1985 4 5 0 0 0 1 D",
			"1986 1989 2 14 0 0 0 1 D",
			"1990 1997 3 1 0 0 0 1 D",
			"1991 1995 9 8 0 0 2 0 S",
			"1996 1996 9 6 7 0 2 0 S",
			"1997 1997 9 12 7 0 2 0 S",
			"1998 1999 2 0 8 0 2 1 D",
			"1998 2003 9 0 8 0 2 0 S",
			"2000 2004 3 1 0 0 2 1 D",
			"2006 2010 9 0 8 0 2 0 S",
			"2007 2007 2 8 0 0 2 1 D",
			"2008 2008 2 15 0 0 2 1 D",
			"2009 2010 2 8 0 0 2 1 D",
			"2011 2011 2 15 0 0 2 1 D",
			"2011 2011 10 13 7 0 2 0 S",
			"2012 2012 3 1 7 0 2 1 D",
			"2012 9999 10 1 0 0 2 0 S",
			"2013 9999 2 8 0 0 2 1 D"
		],
		"Cyprus": [
			"1975 1975 3 13 7 0 0 1 S",
			"1975 1975 9 12 7 0 0 0",
			"1976 1976 4 15 7 0 0 1 S",
			"1976 1976 9 11 7 0 0 0",
			"1977 1980 3 1 0 0 0 1 S",
			"1977 1977 8 25 7 0 0 0",
			"1978 1978 9 2 7 0 0 0",
			"1979 1997 8 0 8 0 0 0",
			"1981 1998 2 0 8 0 0 1 S"
		],
		"Czech": [
			"1945 1945 3 8 7 2 2 1 S",
			"1945 1945 10 18 7 2 2 0",
			"1946 1946 4 6 7 2 2 1 S",
			"1946 1949 9 1 0 2 2 0",
			"1947 1947 3 20 7 2 2 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 9 7 2 2 1 S"
		],
		"DR": [
			"1966 1966 9 30 7 0 0 1 D",
			"1967 1967 1 28 7 0 0 0 S",
			"1969 1973 9 0 8 0 0 0:30 HD",
			"1970 1970 1 21 7 0 0 0 S",
			"1971 1971 0 20 7 0 0 0 S",
			"1972 1974 0 21 7 0 0 0 S"
		],
		"Denmark": [
			"1916 1916 4 14 7 23 0 1 S",
			"1916 1916 8 30 7 23 0 0",
			"1940 1940 4 15 7 0 0 1 S",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 7 15 7 2 2 0",
			"1946 1946 4 1 7 2 2 1 S",
			"1946 1946 8 1 7 2 2 0",
			"1947 1947 4 4 7 2 2 1 S",
			"1947 1947 7 10 7 2 2 0",
			"1948 1948 4 9 7 2 2 1 S",
			"1948 1948 7 8 7 2 2 0"
		],
		"Denver": [
			"1920 1921 2 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1921 4 22 7 2 0 0 S",
			"1965 1966 3 0 8 2 0 1 D",
			"1965 1966 9 0 8 2 0 0 S"
		],
		"Detroit": [
			"1948 1948 3 0 8 2 0 1 D",
			"1948 1948 8 0 8 2 0 0 S",
			"1967 1967 5 14 7 2 0 1 D",
			"1967 1967 9 0 8 2 0 0 S"
		],
		"Dhaka": [
			"2009 2009 5 19 7 23 0 1 S",
			"2009 2009 11 31 7 23:59 0 0"
		],
		"E-Eur": [
			"1977 1980 3 1 0 0 0 1 S",
			"1977 1977 8 0 8 0 0 0",
			"1978 1978 9 1 7 0 0 0",
			"1979 1995 8 0 8 0 0 0",
			"1981 9999 2 0 8 0 0 1 S",
			"1996 9999 9 0 8 0 0 0"
		],
		"E-EurAsia": [
			"1981 9999 2 0 8 0 0 1 S",
			"1979 1995 8 0 8 0 0 0",
			"1996 9999 9 0 8 0 0 0"
		],
		"EU": [
			"1977 1980 3 1 0 1 1 1 S",
			"1977 1977 8 0 8 1 1 0",
			"1978 1978 9 1 7 1 1 0",
			"1979 1995 8 0 8 1 1 0",
			"1981 9999 2 0 8 1 1 1 S",
			"1996 9999 9 0 8 1 1 0"
		],
		"EUAsia": [
			"1981 9999 2 0 8 1 1 1 S",
			"1979 1995 8 0 8 1 1 0",
			"1996 9999 9 0 8 1 1 0"
		],
		"Edm": [
			"1918 1919 3 8 0 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1919 1919 4 27 7 2 0 0 S",
			"1920 1923 3 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1923 8 0 8 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1947 1947 3 0 8 2 0 1 D",
			"1947 1947 8 0 8 2 0 0 S",
			"1967 1967 3 0 8 2 0 1 D",
			"1967 1967 9 0 8 2 0 0 S",
			"1969 1969 3 0 8 2 0 1 D",
			"1969 1969 9 0 8 2 0 0 S",
			"1972 1986 3 0 8 2 0 1 D",
			"1972 2006 9 0 8 2 0 0 S"
		],
		"Egypt": [
			"1940 1940 6 15 7 0 0 1 S",
			"1940 1940 9 1 7 0 0 0",
			"1941 1941 3 15 7 0 0 1 S",
			"1941 1941 8 16 7 0 0 0",
			"1942 1944 3 1 7 0 0 1 S",
			"1942 1942 9 27 7 0 0 0",
			"1943 1945 10 1 7 0 0 0",
			"1945 1945 3 16 7 0 0 1 S",
			"1957 1957 4 10 7 0 0 1 S",
			"1957 1958 9 1 7 0 0 0",
			"1958 1958 4 1 7 0 0 1 S",
			"1959 1981 4 1 7 1 0 1 S",
			"1959 1965 8 30 7 3 0 0",
			"1966 1994 9 1 7 3 0 0",
			"1982 1982 6 25 7 1 0 1 S",
			"1983 1983 6 12 7 1 0 1 S",
			"1984 1988 4 1 7 1 0 1 S",
			"1989 1989 4 6 7 1 0 1 S",
			"1990 1994 4 1 7 1 0 1 S",
			"1995 2010 3 5 8 0 2 1 S",
			"1995 2005 8 4 8 23 2 0",
			"2006 2006 8 21 7 23 2 0",
			"2007 2007 8 1 4 23 2 0",
			"2008 2008 7 4 8 23 2 0",
			"2009 2009 7 20 7 23 2 0",
			"2010 2010 7 11 7 0 0 0",
			"2010 2010 8 10 7 0 0 1 S",
			"2010 2010 8 4 8 23 2 0"
		],
		"EgyptAsia": [
			"1957 1957 4 10 7 0 0 1 S",
			"1957 1958 9 1 7 0 0 0",
			"1958 1958 4 1 7 0 0 1 S",
			"1959 1967 4 1 7 1 0 1 S",
			"1959 1965 8 30 7 3 0 0",
			"1966 1966 9 1 7 3 0 0"
		],
		"Falk": [
			"1937 1938 8 0 8 0 0 1 S",
			"1938 1942 2 19 0 0 0 0",
			"1939 1939 9 1 7 0 0 1 S",
			"1940 1942 8 0 8 0 0 1 S",
			"1943 1943 0 1 7 0 0 0",
			"1983 1983 8 0 8 0 0 1 S",
			"1984 1985 3 0 8 0 0 0",
			"1984 1984 8 16 7 0 0 1 S",
			"1985 2000 8 9 0 0 0 1 S",
			"1986 2000 3 16 0 0 0 0",
			"2001 2010 3 15 0 2 0 0",
			"2001 2010 8 1 0 2 0 1 S"
		],
		"Fiji": [
			"1998 1999 10 1 0 2 0 1 S",
			"1999 2000 1 0 8 3 0 0",
			"2009 2009 10 29 7 2 0 1 S",
			"2010 2010 2 0 8 3 0 0",
			"2010 9999 9 18 0 2 0 1 S",
			"2011 2011 2 1 0 3 0 0",
			"2012 9999 0 18 0 3 0 0"
		],
		"Finland": [
			"1942 1942 3 3 7 0 0 1 S",
			"1942 1942 9 3 7 0 0 0",
			"1981 1982 2 0 8 2 0 1 S",
			"1981 1982 8 0 8 3 0 0"
		],
		"France": [
			"1916 1916 5 14 7 23 2 1 S",
			"1916 1919 9 1 0 23 2 0",
			"1917 1917 2 24 7 23 2 1 S",
			"1918 1918 2 9 7 23 2 1 S",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 9 25 7 23 2 0",
			"1922 1922 2 25 7 23 2 1 S",
			"1922 1938 9 1 6 23 2 0",
			"1923 1923 4 26 7 23 2 1 S",
			"1924 1924 2 29 7 23 2 1 S",
			"1925 1925 3 4 7 23 2 1 S",
			"1926 1926 3 17 7 23 2 1 S",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1930 1930 3 12 7 23 2 1 S",
			"1931 1931 3 18 7 23 2 1 S",
			"1932 1932 3 2 7 23 2 1 S",
			"1933 1933 2 25 7 23 2 1 S",
			"1934 1934 3 7 7 23 2 1 S",
			"1935 1935 2 30 7 23 2 1 S",
			"1936 1936 3 18 7 23 2 1 S",
			"1937 1937 3 3 7 23 2 1 S",
			"1938 1938 2 26 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 25 7 2 0 1 S",
			"1941 1941 4 5 7 0 0 2 M",
			"1941 1941 9 6 7 0 0 1 S",
			"1942 1942 2 9 7 0 0 2 M",
			"1942 1942 10 2 7 3 0 1 S",
			"1943 1943 2 29 7 2 0 2 M",
			"1943 1943 9 4 7 3 0 1 S",
			"1944 1944 3 3 7 2 0 2 M",
			"1944 1944 9 8 7 1 0 1 S",
			"1945 1945 3 2 7 2 0 2 M",
			"1945 1945 8 16 7 3 0 0",
			"1976 1976 2 28 7 1 0 1 S",
			"1976 1976 8 26 7 1 0 0"
		],
		"GB-Eire": [
			"1916 1916 4 21 7 2 2 1 BST",
			"1916 1916 9 1 7 2 2 0 GMT",
			"1917 1917 3 8 7 2 2 1 BST",
			"1917 1917 8 17 7 2 2 0 GMT",
			"1918 1918 2 24 7 2 2 1 BST",
			"1918 1918 8 30 7 2 2 0 GMT",
			"1919 1919 2 30 7 2 2 1 BST",
			"1919 1919 8 29 7 2 2 0 GMT",
			"1920 1920 2 28 7 2 2 1 BST",
			"1920 1920 9 25 7 2 2 0 GMT",
			"1921 1921 3 3 7 2 2 1 BST",
			"1921 1921 9 3 7 2 2 0 GMT",
			"1922 1922 2 26 7 2 2 1 BST",
			"1922 1922 9 8 7 2 2 0 GMT",
			"1923 1923 3 16 0 2 2 1 BST",
			"1923 1924 8 16 0 2 2 0 GMT",
			"1924 1924 3 9 0 2 2 1 BST",
			"1925 1926 3 16 0 2 2 1 BST",
			"1925 1938 9 2 0 2 2 0 GMT",
			"1927 1927 3 9 0 2 2 1 BST",
			"1928 1929 3 16 0 2 2 1 BST",
			"1930 1930 3 9 0 2 2 1 BST",
			"1931 1932 3 16 0 2 2 1 BST",
			"1933 1933 3 9 0 2 2 1 BST",
			"1934 1934 3 16 0 2 2 1 BST",
			"1935 1935 3 9 0 2 2 1 BST",
			"1936 1937 3 16 0 2 2 1 BST",
			"1938 1938 3 9 0 2 2 1 BST",
			"1939 1939 3 16 0 2 2 1 BST",
			"1939 1939 10 16 0 2 2 0 GMT",
			"1940 1940 1 23 0 2 2 1 BST",
			"1941 1941 4 2 0 1 2 2 BDST",
			"1941 1943 7 9 0 1 2 1 BST",
			"1942 1944 3 2 0 1 2 2 BDST",
			"1944 1944 8 16 0 1 2 1 BST",
			"1945 1945 3 2 1 1 2 2 BDST",
			"1945 1945 6 9 0 1 2 1 BST",
			"1945 1946 9 2 0 2 2 0 GMT",
			"1946 1946 3 9 0 2 2 1 BST",
			"1947 1947 2 16 7 2 2 1 BST",
			"1947 1947 3 13 7 1 2 2 BDST",
			"1947 1947 7 10 7 1 2 1 BST",
			"1947 1947 10 2 7 2 2 0 GMT",
			"1948 1948 2 14 7 2 2 1 BST",
			"1948 1948 9 31 7 2 2 0 GMT",
			"1949 1949 3 3 7 2 2 1 BST",
			"1949 1949 9 30 7 2 2 0 GMT",
			"1950 1952 3 14 0 2 2 1 BST",
			"1950 1952 9 21 0 2 2 0 GMT",
			"1953 1953 3 16 0 2 2 1 BST",
			"1953 1960 9 2 0 2 2 0 GMT",
			"1954 1954 3 9 0 2 2 1 BST",
			"1955 1956 3 16 0 2 2 1 BST",
			"1957 1957 3 9 0 2 2 1 BST",
			"1958 1959 3 16 0 2 2 1 BST",
			"1960 1960 3 9 0 2 2 1 BST",
			"1961 1963 2 0 8 2 2 1 BST",
			"1961 1968 9 23 0 2 2 0 GMT",
			"1964 1967 2 19 0 2 2 1 BST",
			"1968 1968 1 18 7 2 2 1 BST",
			"1972 1980 2 16 0 2 2 1 BST",
			"1972 1980 9 23 0 2 2 0 GMT",
			"1981 1995 2 0 8 1 1 1 BST",
			"1981 1989 9 23 0 1 1 0 GMT",
			"1990 1995 9 22 0 1 1 0 GMT"
		],
		"Germany": [
			"1946 1946 3 14 7 2 2 1 S",
			"1946 1946 9 7 7 2 2 0",
			"1947 1949 9 1 0 2 2 0",
			"1947 1947 3 6 7 3 2 1 S",
			"1947 1947 4 11 7 2 2 2 M",
			"1947 1947 5 29 7 3 0 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 10 7 2 2 1 S"
		],
		"Ghana": [
			"1936 1942 8 1 7 0 0 0:20 GHST",
			"1936 1942 11 31 7 0 0 0 GMT"
		],
		"Greece": [
			"1932 1932 6 7 7 0 0 1 S",
			"1932 1932 8 1 7 0 0 0",
			"1941 1941 3 7 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 30 7 0 0 1 S",
			"1943 1943 9 4 7 0 0 0",
			"1952 1952 6 1 7 0 0 1 S",
			"1952 1952 10 2 7 0 0 0",
			"1975 1975 3 12 7 0 2 1 S",
			"1975 1975 10 26 7 0 2 0",
			"1976 1976 3 11 7 2 2 1 S",
			"1976 1976 9 10 7 2 2 0",
			"1977 1978 3 1 0 2 2 1 S",
			"1977 1977 8 26 7 2 2 0",
			"1978 1978 8 24 7 4 0 0",
			"1979 1979 3 1 7 9 0 1 S",
			"1979 1979 8 29 7 2 0 0",
			"1980 1980 3 1 7 0 0 1 S",
			"1980 1980 8 28 7 0 0 0"
		],
		"Guat": [
			"1973 1973 10 25 7 0 0 1 D",
			"1974 1974 1 24 7 0 0 0 S",
			"1983 1983 4 21 7 0 0 1 D",
			"1983 1983 8 22 7 0 0 0 S",
			"1991 1991 2 23 7 0 0 1 D",
			"1991 1991 8 7 7 0 0 0 S",
			"2006 2006 3 30 7 0 0 1 D",
			"2006 2006 9 1 7 0 0 0 S"
		],
		"HK": [
			"1941 1941 3 1 7 3:30 0 1 S",
			"1941 1941 8 30 7 3:30 0 0",
			"1946 1946 3 20 7 3:30 0 1 S",
			"1946 1946 11 1 7 3:30 0 0",
			"1947 1947 3 13 7 3:30 0 1 S",
			"1947 1947 11 30 7 3:30 0 0",
			"1948 1948 4 2 7 3:30 0 1 S",
			"1948 1951 9 0 8 3:30 0 0",
			"1952 1952 9 25 7 3:30 0 0",
			"1949 1953 3 1 0 3:30 0 1 S",
			"1953 1953 10 1 7 3:30 0 0",
			"1954 1964 2 18 0 3:30 0 1 S",
			"1954 1954 9 31 7 3:30 0 0",
			"1955 1964 10 1 0 3:30 0 0",
			"1965 1976 3 16 0 3:30 0 1 S",
			"1965 1976 9 16 0 3:30 0 0",
			"1973 1973 11 30 7 3:30 0 1 S",
			"1979 1979 4 8 0 3:30 0 1 S",
			"1979 1979 9 16 0 3:30 0 0"
		],
		"Haiti": [
			"1983 1983 4 8 7 0 0 1 D",
			"1984 1987 3 0 8 0 0 1 D",
			"1983 1987 9 0 8 0 0 0 S",
			"1988 1997 3 1 0 1 2 1 D",
			"1988 1997 9 0 8 1 2 0 S",
			"2005 2006 3 1 0 0 0 1 D",
			"2005 2006 9 0 8 0 0 0 S",
			"2012 9999 2 8 0 2 0 1 D",
			"2012 9999 10 1 0 2 0 0 S"
		],
		"Halifax": [
			"1916 1916 3 1 7 0 0 1 D",
			"1916 1916 9 1 7 0 0 0 S",
			"1920 1920 4 9 7 0 0 1 D",
			"1920 1920 7 29 7 0 0 0 S",
			"1921 1921 4 6 7 0 0 1 D",
			"1921 1922 8 5 7 0 0 0 S",
			"1922 1922 3 30 7 0 0 1 D",
			"1923 1925 4 1 0 0 0 1 D",
			"1923 1923 8 4 7 0 0 0 S",
			"1924 1924 8 15 7 0 0 0 S",
			"1925 1925 8 28 7 0 0 0 S",
			"1926 1926 4 16 7 0 0 1 D",
			"1926 1926 8 13 7 0 0 0 S",
			"1927 1927 4 1 7 0 0 1 D",
			"1927 1927 8 26 7 0 0 0 S",
			"1928 1931 4 8 0 0 0 1 D",
			"1928 1928 8 9 7 0 0 0 S",
			"1929 1929 8 3 7 0 0 0 S",
			"1930 1930 8 15 7 0 0 0 S",
			"1931 1932 8 24 1 0 0 0 S",
			"1932 1932 4 1 7 0 0 1 D",
			"1933 1933 3 30 7 0 0 1 D",
			"1933 1933 9 2 7 0 0 0 S",
			"1934 1934 4 20 7 0 0 1 D",
			"1934 1934 8 16 7 0 0 0 S",
			"1935 1935 5 2 7 0 0 1 D",
			"1935 1935 8 30 7 0 0 0 S",
			"1936 1936 5 1 7 0 0 1 D",
			"1936 1936 8 14 7 0 0 0 S",
			"1937 1938 4 1 0 0 0 1 D",
			"1937 1941 8 24 1 0 0 0 S",
			"1939 1939 4 28 7 0 0 1 D",
			"1940 1941 4 1 0 0 0 1 D",
			"1946 1949 3 0 8 2 0 1 D",
			"1946 1949 8 0 8 2 0 0 S",
			"1951 1954 3 0 8 2 0 1 D",
			"1951 1954 8 0 8 2 0 0 S",
			"1956 1959 3 0 8 2 0 1 D",
			"1956 1959 8 0 8 2 0 0 S",
			"1962 1973 3 0 8 2 0 1 D",
			"1962 1973 9 0 8 2 0 0 S"
		],
		"Holiday": [
			"1992 1993 9 0 8 2 2 1",
			"1993 1994 2 1 0 2 2 0"
		],
		"Hond": [
			"1987 1988 4 1 0 0 0 1 D",
			"1987 1988 8 0 8 0 0 0 S",
			"2006 2006 4 1 0 0 0 1 D",
			"2006 2006 7 1 1 0 0 0 S"
		],
		"Hungary": [
			"1918 1918 3 1 7 3 0 1 S",
			"1918 1918 8 29 7 3 0 0",
			"1919 1919 3 15 7 3 0 1 S",
			"1919 1919 8 15 7 3 0 0",
			"1920 1920 3 5 7 3 0 1 S",
			"1920 1920 8 30 7 3 0 0",
			"1945 1945 4 1 7 23 0 1 S",
			"1945 1945 10 3 7 0 0 0",
			"1946 1946 2 31 7 2 2 1 S",
			"1946 1949 9 1 0 2 2 0",
			"1947 1949 3 4 0 2 2 1 S",
			"1950 1950 3 17 7 2 2 1 S",
			"1950 1950 9 23 7 2 2 0",
			"1954 1955 4 23 7 0 0 1 S",
			"1954 1955 9 3 7 0 0 0",
			"1956 1956 5 1 0 0 0 1 S",
			"1956 1956 8 0 8 0 0 0",
			"1957 1957 5 1 0 1 0 1 S",
			"1957 1957 8 0 8 3 0 0",
			"1980 1980 3 6 7 1 0 1 S"
		],
		"Iceland": [
			"1917 1918 1 19 7 23 0 1 S",
			"1917 1917 9 21 7 1 0 0",
			"1918 1918 10 16 7 1 0 0",
			"1939 1939 3 29 7 23 0 1 S",
			"1939 1939 10 29 7 2 0 0",
			"1940 1940 1 25 7 2 0 1 S",
			"1940 1940 10 3 7 2 0 0",
			"1941 1941 2 2 7 1 2 1 S",
			"1941 1941 10 2 7 1 2 0",
			"1942 1942 2 8 7 1 2 1 S",
			"1942 1942 9 25 7 1 2 0",
			"1943 1946 2 1 0 1 2 1 S",
			"1943 1948 9 22 0 1 2 0",
			"1947 1967 3 1 0 1 2 1 S",
			"1949 1949 9 30 7 1 2 0",
			"1950 1966 9 22 0 1 2 0",
			"1967 1967 9 29 7 1 2 0"
		],
		"Indianapolis": [
			"1941 1941 5 22 7 2 0 1 D",
			"1941 1954 8 0 8 2 0 0 S",
			"1946 1954 3 0 8 2 0 1 D"
		],
		"Iran": [
			"1978 1980 2 21 7 0 0 1 D",
			"1978 1978 9 21 7 0 0 0 S",
			"1979 1979 8 19 7 0 0 0 S",
			"1980 1980 8 23 7 0 0 0 S",
			"1991 1991 4 3 7 0 0 1 D",
			"1992 1995 2 22 7 0 0 1 D",
			"1991 1995 8 22 7 0 0 0 S",
			"1996 1996 2 21 7 0 0 1 D",
			"1996 1996 8 21 7 0 0 0 S",
			"1997 1999 2 22 7 0 0 1 D",
			"1997 1999 8 22 7 0 0 0 S",
			"2000 2000 2 21 7 0 0 1 D",
			"2000 2000 8 21 7 0 0 0 S",
			"2001 2003 2 22 7 0 0 1 D",
			"2001 2003 8 22 7 0 0 0 S",
			"2004 2004 2 21 7 0 0 1 D",
			"2004 2004 8 21 7 0 0 0 S",
			"2005 2005 2 22 7 0 0 1 D",
			"2005 2005 8 22 7 0 0 0 S",
			"2008 2008 2 21 7 0 0 1 D",
			"2008 2008 8 21 7 0 0 0 S",
			"2009 2011 2 22 7 0 0 1 D",
			"2009 2011 8 22 7 0 0 0 S",
			"2012 2012 2 21 7 0 0 1 D",
			"2012 2012 8 21 7 0 0 0 S",
			"2013 2015 2 22 7 0 0 1 D",
			"2013 2015 8 22 7 0 0 0 S",
			"2016 2016 2 21 7 0 0 1 D",
			"2016 2016 8 21 7 0 0 0 S",
			"2017 2019 2 22 7 0 0 1 D",
			"2017 2019 8 22 7 0 0 0 S",
			"2020 2020 2 21 7 0 0 1 D",
			"2020 2020 8 21 7 0 0 0 S",
			"2021 2023 2 22 7 0 0 1 D",
			"2021 2023 8 22 7 0 0 0 S",
			"2024 2024 2 21 7 0 0 1 D",
			"2024 2024 8 21 7 0 0 0 S",
			"2025 2027 2 22 7 0 0 1 D",
			"2025 2027 8 22 7 0 0 0 S",
			"2028 2029 2 21 7 0 0 1 D",
			"2028 2029 8 21 7 0 0 0 S",
			"2030 2031 2 22 7 0 0 1 D",
			"2030 2031 8 22 7 0 0 0 S",
			"2032 2033 2 21 7 0 0 1 D",
			"2032 2033 8 21 7 0 0 0 S",
			"2034 2035 2 22 7 0 0 1 D",
			"2034 2035 8 22 7 0 0 0 S",
			"2036 2037 2 21 7 0 0 1 D",
			"2036 2037 8 21 7 0 0 0 S"
		],
		"Iraq": [
			"1982 1982 4 1 7 0 0 1 D",
			"1982 1984 9 1 7 0 0 0 S",
			"1983 1983 2 31 7 0 0 1 D",
			"1984 1985 3 1 7 0 0 1 D",
			"1985 1990 8 0 8 1 2 0 S",
			"1986 1990 2 0 8 1 2 1 D",
			"1991 2007 3 1 7 3 2 1 D",
			"1991 2007 9 1 7 3 2 0 S"
		],
		"Italy": [
			"1916 1916 5 3 7 0 2 1 S",
			"1916 1916 9 1 7 0 2 0",
			"1917 1917 3 1 7 0 2 1 S",
			"1917 1917 8 30 7 0 2 0",
			"1918 1918 2 10 7 0 2 1 S",
			"1918 1919 9 1 0 0 2 0",
			"1919 1919 2 2 7 0 2 1 S",
			"1920 1920 2 21 7 0 2 1 S",
			"1920 1920 8 19 7 0 2 0",
			"1940 1940 5 15 7 0 2 1 S",
			"1944 1944 8 17 7 0 2 0",
			"1945 1945 3 2 7 2 0 1 S",
			"1945 1945 8 15 7 0 2 0",
			"1946 1946 2 17 7 2 2 1 S",
			"1946 1946 9 6 7 2 2 0",
			"1947 1947 2 16 7 0 2 1 S",
			"1947 1947 9 5 7 0 2 0",
			"1948 1948 1 29 7 2 2 1 S",
			"1948 1948 9 3 7 2 2 0",
			"1966 1968 4 22 0 0 0 1 S",
			"1966 1969 8 22 0 0 0 0",
			"1969 1969 5 1 7 0 0 1 S",
			"1970 1970 4 31 7 0 0 1 S",
			"1970 1970 8 0 8 0 0 0",
			"1971 1972 4 22 0 0 0 1 S",
			"1971 1971 8 0 8 1 0 0",
			"1972 1972 9 1 7 0 0 0",
			"1973 1973 5 3 7 0 0 1 S",
			"1973 1974 8 0 8 0 0 0",
			"1974 1974 4 26 7 0 0 1 S",
			"1975 1975 5 1 7 0 2 1 S",
			"1975 1977 8 0 8 0 2 0",
			"1976 1976 4 30 7 0 2 1 S",
			"1977 1979 4 22 0 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1979 1979 8 30 7 0 2 0"
		],
		"Japan": [
			"1948 1948 4 1 0 2 0 1 D",
			"1948 1951 8 8 6 2 0 0 S",
			"1949 1949 3 1 0 2 0 1 D",
			"1950 1951 4 1 0 2 0 1 D"
		],
		"Jordan": [
			"1973 1973 5 6 7 0 0 1 S",
			"1973 1975 9 1 7 0 0 0",
			"1974 1977 4 1 7 0 0 1 S",
			"1976 1976 10 1 7 0 0 0",
			"1977 1977 9 1 7 0 0 0",
			"1978 1978 3 30 7 0 0 1 S",
			"1978 1978 8 30 7 0 0 0",
			"1985 1985 3 1 7 0 0 1 S",
			"1985 1985 9 1 7 0 0 0",
			"1986 1988 3 1 5 0 0 1 S",
			"1986 1990 9 1 5 0 0 0",
			"1989 1989 4 8 7 0 0 1 S",
			"1990 1990 3 27 7 0 0 1 S",
			"1991 1991 3 17 7 0 0 1 S",
			"1991 1991 8 27 7 0 0 0",
			"1992 1992 3 10 7 0 0 1 S",
			"1992 1993 9 1 5 0 0 0",
			"1993 1998 3 1 5 0 0 1 S",
			"1994 1994 8 15 5 0 0 0",
			"1995 1998 8 15 5 0 2 0",
			"1999 1999 6 1 7 0 2 1 S",
			"1999 2002 8 5 8 0 2 0",
			"2000 2001 2 4 8 0 2 1 S",
			"2002 9999 2 4 8 24 0 1 S",
			"2003 2003 9 24 7 0 2 0",
			"2004 2004 9 15 7 0 2 0",
			"2005 2005 8 5 8 0 2 0",
			"2006 2011 9 5 8 0 2 0",
			"2013 9999 9 5 8 0 2 0"
		],
		"Kyrgyz": [
			"1992 1996 3 7 0 0 2 1 S",
			"1992 1996 8 0 8 0 0 0",
			"1997 2005 2 0 8 2:30 0 1 S",
			"1997 2004 9 0 8 2:30 0 0"
		],
		"LH": [
			"1981 1984 9 0 8 2 0 1",
			"1982 1985 2 1 0 2 0 0",
			"1985 1985 9 0 8 2 0 0:30",
			"1986 1989 2 15 0 2 0 0",
			"1986 1986 9 19 7 2 0 0:30",
			"1987 1999 9 0 8 2 0 0:30",
			"1990 1995 2 1 0 2 0 0",
			"1996 2005 2 0 8 2 0 0",
			"2000 2000 7 0 8 2 0 0:30",
			"2001 2007 9 0 8 2 0 0:30",
			"2006 2006 3 1 0 2 0 0",
			"2007 2007 2 0 8 2 0 0",
			"2008 9999 3 1 0 2 0 0",
			"2008 9999 9 1 0 2 0 0:30"
		],
		"Latvia": [
			"1989 1996 2 0 8 2 2 1 S",
			"1989 1996 8 0 8 2 2 0"
		],
		"Lebanon": [
			"1920 1920 2 28 7 0 0 1 S",
			"1920 1920 9 25 7 0 0 0",
			"1921 1921 3 3 7 0 0 1 S",
			"1921 1921 9 3 7 0 0 0",
			"1922 1922 2 26 7 0 0 1 S",
			"1922 1922 9 8 7 0 0 0",
			"1923 1923 3 22 7 0 0 1 S",
			"1923 1923 8 16 7 0 0 0",
			"1957 1961 4 1 7 0 0 1 S",
			"1957 1961 9 1 7 0 0 0",
			"1972 1972 5 22 7 0 0 1 S",
			"1972 1977 9 1 7 0 0 0",
			"1973 1977 4 1 7 0 0 1 S",
			"1978 1978 3 30 7 0 0 1 S",
			"1978 1978 8 30 7 0 0 0",
			"1984 1987 4 1 7 0 0 1 S",
			"1984 1991 9 16 7 0 0 0",
			"1988 1988 5 1 7 0 0 1 S",
			"1989 1989 4 10 7 0 0 1 S",
			"1990 1992 4 1 7 0 0 1 S",
			"1992 1992 9 4 7 0 0 0",
			"1993 9999 2 0 8 0 0 1 S",
			"1993 1998 8 0 8 0 0 0",
			"1999 9999 9 0 8 0 0 0"
		],
		"Libya": [
			"1951 1951 9 14 7 2 0 1 S",
			"1952 1952 0 1 7 0 0 0",
			"1953 1953 9 9 7 2 0 1 S",
			"1954 1954 0 1 7 0 0 0",
			"1955 1955 8 30 7 0 0 1 S",
			"1956 1956 0 1 7 0 0 0",
			"1982 1984 3 1 7 0 0 1 S",
			"1982 1985 9 1 7 0 0 0",
			"1985 1985 3 6 7 0 0 1 S",
			"1986 1986 3 4 7 0 0 1 S",
			"1986 1986 9 3 7 0 0 0",
			"1987 1989 3 1 7 0 0 1 S",
			"1987 1989 9 1 7 0 0 0",
			"1997 1997 3 4 7 0 0 1 S",
			"1997 1997 9 4 7 0 0 0",
			"2013 9999 2 5 8 1 0 1 S",
			"2013 9999 9 5 8 2 0 0"
		],
		"Louisville": [
			"1921 1921 4 1 7 2 0 1 D",
			"1921 1921 8 1 7 2 0 0 S",
			"1941 1961 3 0 8 2 0 1 D",
			"1941 1941 8 0 8 2 0 0 S",
			"1946 1946 5 2 7 2 0 0 S",
			"1950 1955 8 0 8 2 0 0 S",
			"1956 1960 9 0 8 2 0 0 S"
		],
		"Lux": [
			"1916 1916 4 14 7 23 0 1 S",
			"1916 1916 9 1 7 1 0 0",
			"1917 1917 3 28 7 23 0 1 S",
			"1917 1917 8 17 7 1 0 0",
			"1918 1918 3 15 1 2 2 1 S",
			"1918 1918 8 15 1 2 2 0",
			"1919 1919 2 1 7 23 0 1 S",
			"1919 1919 9 5 7 3 0 0",
			"1920 1920 1 14 7 23 0 1 S",
			"1920 1920 9 24 7 2 0 0",
			"1921 1921 2 14 7 23 0 1 S",
			"1921 1921 9 26 7 2 0 0",
			"1922 1922 2 25 7 23 0 1 S",
			"1922 1922 9 2 0 1 0 0",
			"1923 1923 3 21 7 23 0 1 S",
			"1923 1923 9 2 0 2 0 0",
			"1924 1924 2 29 7 23 0 1 S",
			"1924 1928 9 2 0 1 0 0",
			"1925 1925 3 5 7 23 0 1 S",
			"1926 1926 3 17 7 23 0 1 S",
			"1927 1927 3 9 7 23 0 1 S",
			"1928 1928 3 14 7 23 0 1 S",
			"1929 1929 3 20 7 23 0 1 S"
		],
		"Macau": [
			"1961 1962 2 16 0 3:30 0 1 S",
			"1961 1964 10 1 0 3:30 0 0",
			"1963 1963 2 16 0 0 0 1 S",
			"1964 1964 2 16 0 3:30 0 1 S",
			"1965 1965 2 16 0 0 0 1 S",
			"1965 1965 9 31 7 0 0 0",
			"1966 1971 3 16 0 3:30 0 1 S",
			"1966 1971 9 16 0 3:30 0 0",
			"1972 1974 3 15 0 0 0 1 S",
			"1972 1973 9 15 0 0 0 0",
			"1974 1977 9 15 0 3:30 0 0",
			"1975 1977 3 15 0 3:30 0 1 S",
			"1978 1980 3 15 0 0 0 1 S",
			"1978 1980 9 15 0 0 0 0"
		],
		"Malta": [
			"1973 1973 2 31 7 0 2 1 S",
			"1973 1973 8 29 7 0 2 0",
			"1974 1974 3 21 7 0 2 1 S",
			"1974 1974 8 16 7 0 2 0",
			"1975 1979 3 15 0 2 0 1 S",
			"1975 1980 8 15 0 2 0 0",
			"1980 1980 2 31 7 2 0 1 S"
		],
		"Marengo": [
			"1951 1951 3 0 8 2 0 1 D",
			"1951 1951 8 0 8 2 0 0 S",
			"1954 1960 3 0 8 2 0 1 D",
			"1954 1960 8 0 8 2 0 0 S"
		],
		"Mauritius": [
			"1982 1982 9 10 7 0 0 1 S",
			"1983 1983 2 21 7 0 0 0",
			"2008 2008 9 0 8 2 0 1 S",
			"2009 2009 2 0 8 2 0 0"
		],
		"Menominee": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1966 1966 3 0 8 2 0 1 D",
			"1966 1966 9 0 8 2 0 0 S"
		],
		"Mexico": [
			"1939 1939 1 5 7 0 0 1 D",
			"1939 1939 5 25 7 0 0 0 S",
			"1940 1940 11 9 7 0 0 1 D",
			"1941 1941 3 1 7 0 0 0 S",
			"1943 1943 11 16 7 0 0 1 W",
			"1944 1944 4 1 7 0 0 0 S",
			"1950 1950 1 12 7 0 0 1 D",
			"1950 1950 6 30 7 0 0 0 S",
			"1996 2000 3 1 0 2 0 1 D",
			"1996 2000 9 0 8 2 0 0 S",
			"2001 2001 4 1 0 2 0 1 D",
			"2001 2001 8 0 8 2 0 0 S",
			"2002 9999 3 1 0 2 0 1 D",
			"2002 9999 9 0 8 2 0 0 S"
		],
		"Moncton": [
			"1933 1935 5 8 0 1 0 1 D",
			"1933 1935 8 8 0 1 0 0 S",
			"1936 1938 5 1 0 1 0 1 D",
			"1936 1938 8 1 0 1 0 0 S",
			"1939 1939 4 27 7 1 0 1 D",
			"1939 1941 8 21 6 1 0 0 S",
			"1940 1940 4 19 7 1 0 1 D",
			"1941 1941 4 4 7 1 0 1 D",
			"1946 1972 3 0 8 2 0 1 D",
			"1946 1956 8 0 8 2 0 0 S",
			"1957 1972 9 0 8 2 0 0 S",
			"1993 2006 3 1 0 0:1 0 1 D",
			"1993 2006 9 0 8 0:1 0 0 S"
		],
		"Mongol": [
			"1983 1984 3 1 7 0 0 1 S",
			"1983 1983 9 1 7 0 0 0",
			"1985 1998 2 0 8 0 0 1 S",
			"1984 1998 8 0 8 0 0 0",
			"2001 2001 3 6 8 2 0 1 S",
			"2001 2006 8 6 8 2 0 0",
			"2002 2006 2 6 8 2 0 1 S"
		],
		"Mont": [
			"1917 1917 2 25 7 2 0 1 D",
			"1917 1917 3 24 7 0 0 0 S",
			"1919 1919 2 31 7 2:30 0 1 D",
			"1919 1919 9 25 7 2:30 0 0 S",
			"1920 1920 4 2 7 2:30 0 1 D",
			"1920 1922 9 1 0 2:30 0 0 S",
			"1921 1921 4 1 7 2 0 1 D",
			"1922 1922 3 30 7 2 0 1 D",
			"1924 1924 4 17 7 2 0 1 D",
			"1924 1926 8 0 8 2:30 0 0 S",
			"1925 1926 4 1 0 2 0 1 D",
			"1927 1927 4 1 7 0 0 1 D",
			"1927 1932 8 0 8 0 0 0 S",
			"1928 1931 3 0 8 0 0 1 D",
			"1932 1932 4 1 7 0 0 1 D",
			"1933 1940 3 0 8 0 0 1 D",
			"1933 1933 9 1 7 0 0 0 S",
			"1934 1939 8 0 8 0 0 0 S",
			"1946 1973 3 0 8 2 0 1 D",
			"1945 1948 8 0 8 2 0 0 S",
			"1949 1950 9 0 8 2 0 0 S",
			"1951 1956 8 0 8 2 0 0 S",
			"1957 1973 9 0 8 2 0 0 S"
		],
		"Morocco": [
			"1939 1939 8 12 7 0 0 1 S",
			"1939 1939 10 19 7 0 0 0",
			"1940 1940 1 25 7 0 0 1 S",
			"1945 1945 10 18 7 0 0 0",
			"1950 1950 5 11 7 0 0 1 S",
			"1950 1950 9 29 7 0 0 0",
			"1967 1967 5 3 7 12 0 1 S",
			"1967 1967 9 1 7 0 0 0",
			"1974 1974 5 24 7 0 0 1 S",
			"1974 1974 8 1 7 0 0 0",
			"1976 1977 4 1 7 0 0 1 S",
			"1976 1976 7 1 7 0 0 0",
			"1977 1977 8 28 7 0 0 0",
			"1978 1978 5 1 7 0 0 1 S",
			"1978 1978 7 4 7 0 0 0",
			"2008 2008 5 1 7 0 0 1 S",
			"2008 2008 8 1 7 0 0 0",
			"2009 2009 5 1 7 0 0 1 S",
			"2009 2009 7 21 7 0 0 0",
			"2010 2010 4 2 7 0 0 1 S",
			"2010 2010 7 8 7 0 0 0",
			"2011 2011 3 3 7 0 0 1 S",
			"2011 2011 6 31 7 0 0 0",
			"2012 2019 3 0 8 2 0 1 S",
			"2012 9999 8 0 8 3 0 0",
			"2012 2012 6 20 7 3 0 0",
			"2012 2012 7 20 7 2 0 1 S",
			"2013 2013 6 9 7 3 0 0",
			"2013 2013 7 8 7 2 0 1 S",
			"2014 2014 5 29 7 3 0 0",
			"2014 2014 6 29 7 2 0 1 S",
			"2015 2015 5 18 7 3 0 0",
			"2015 2015 6 18 7 2 0 1 S",
			"2016 2016 5 7 7 3 0 0",
			"2016 2016 6 7 7 2 0 1 S",
			"2017 2017 4 27 7 3 0 0",
			"2017 2017 5 26 7 2 0 1 S",
			"2018 2018 4 16 7 3 0 0",
			"2018 2018 5 15 7 2 0 1 S",
			"2019 2019 4 6 7 3 0 0",
			"2019 2019 5 5 7 2 0 1 S",
			"2020 2020 4 24 7 2 0 1 S",
			"2021 2021 4 13 7 2 0 1 S",
			"2022 2022 4 3 7 2 0 1 S",
			"2023 9999 3 0 8 2 0 1 S"
		],
		"NBorneo": [
			"1935 1941 8 14 7 0 0 0:20 TS",
			"1935 1941 11 14 7 0 0 0"
		],
		"NC": [
			"1977 1978 11 1 0 0 0 1 S",
			"1978 1979 1 27 7 0 0 0",
			"1996 1996 11 1 7 2 2 1 S",
			"1997 1997 2 2 7 2 2 0"
		],
		"NT_YK": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1919 1919 4 25 7 2 0 1 D",
			"1919 1919 10 1 7 0 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1965 1965 3 0 8 0 0 2 DD",
			"1965 1965 9 0 8 2 0 0 S",
			"1980 1986 3 0 8 2 0 1 D",
			"1980 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D"
		],
		"NYC": [
			"1920 1920 2 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1966 3 0 8 2 0 1 D",
			"1921 1954 8 0 8 2 0 0 S",
			"1955 1966 9 0 8 2 0 0 S"
		],
		"NZ": [
			"1927 1927 10 6 7 2 0 1 S",
			"1928 1928 2 4 7 2 0 0 M",
			"1928 1933 9 8 0 2 0 0:30 S",
			"1929 1933 2 15 0 2 0 0 M",
			"1934 1940 3 0 8 2 0 0 M",
			"1934 1940 8 0 8 2 0 0:30 S",
			"1946 1946 0 1 7 0 0 0 S",
			"1974 1974 10 1 0 2 2 1 D",
			"1975 1975 1 0 8 2 2 0 S",
			"1975 1988 9 0 8 2 2 1 D",
			"1976 1989 2 1 0 2 2 0 S",
			"1989 1989 9 8 0 2 2 1 D",
			"1990 2006 9 1 0 2 2 1 D",
			"1990 2007 2 15 0 2 2 0 S",
			"2007 9999 8 0 8 2 2 1 D",
			"2008 9999 3 1 0 2 2 0 S"
		],
		"NZAQ": [
			"1974 1974 10 3 7 2 2 1 D",
			"1975 1988 9 0 8 2 2 1 D",
			"1989 1989 9 8 7 2 2 1 D",
			"1990 2006 9 1 0 2 2 1 D",
			"1975 1975 1 23 7 2 2 0 S",
			"1976 1989 2 1 0 2 2 0 S",
			"1990 2007 2 15 0 2 2 0 S",
			"2007 9999 8 0 8 2 2 1 D",
			"2008 9999 3 1 0 2 2 0 S"
		],
		"Namibia": [
			"1994 9999 8 1 0 2 0 1 S",
			"1995 9999 3 1 0 2 0 0"
		],
		"Neth": [
			"1916 1916 4 1 7 0 0 1 NST",
			"1916 1916 9 1 7 0 0 0 AMT",
			"1917 1917 3 16 7 2 2 1 NST",
			"1917 1917 8 17 7 2 2 0 AMT",
			"1918 1921 3 1 1 2 2 1 NST",
			"1918 1921 8 1 8 2 2 0 AMT",
			"1922 1922 2 0 8 2 2 1 NST",
			"1922 1936 9 2 0 2 2 0 AMT",
			"1923 1923 5 1 5 2 2 1 NST",
			"1924 1924 2 0 8 2 2 1 NST",
			"1925 1925 5 1 5 2 2 1 NST",
			"1926 1931 4 15 7 2 2 1 NST",
			"1932 1932 4 22 7 2 2 1 NST",
			"1933 1936 4 15 7 2 2 1 NST",
			"1937 1937 4 22 7 2 2 1 NST",
			"1937 1937 6 1 7 0 0 1 S",
			"1937 1939 9 2 0 2 2 0",
			"1938 1939 4 15 7 2 2 1 S",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 8 16 7 2 2 0"
		],
		"Nic": [
			"1979 1980 2 16 0 0 0 1 D",
			"1979 1980 5 23 1 0 0 0 S",
			"2005 2005 3 10 7 0 0 1 D",
			"2005 2005 9 1 0 0 0 0 S",
			"2006 2006 3 30 7 2 0 1 D",
			"2006 2006 9 1 0 1 0 0 S"
		],
		"Norway": [
			"1916 1916 4 22 7 1 0 1 S",
			"1916 1916 8 30 7 0 0 0",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 9 1 7 2 2 0",
			"1959 1964 2 15 0 2 2 1 S",
			"1959 1965 8 15 0 2 2 0",
			"1965 1965 3 25 7 2 2 1 S"
		],
		"PRC": [
			"1986 1986 4 4 7 0 0 1 D",
			"1986 1991 8 11 0 0 0 0 S",
			"1987 1991 3 10 0 0 0 1 D"
		],
		"Pakistan": [
			"2002 2002 3 2 0 0:1 0 1 S",
			"2002 2002 9 2 0 0:1 0 0",
			"2008 2008 5 1 7 0 0 1 S",
			"2008 2008 10 1 7 0 0 0",
			"2009 2009 3 15 7 0 0 1 S",
			"2009 2009 10 1 7 0 0 0"
		],
		"Palestine": [
			"1999 2005 3 15 5 0 0 1 S",
			"1999 2003 9 15 5 0 0 0",
			"2004 2004 9 1 7 1 0 0",
			"2005 2005 9 4 7 2 0 0",
			"2006 2007 3 1 7 0 0 1 S",
			"2006 2006 8 22 7 0 0 0",
			"2007 2007 8 8 4 2 0 0",
			"2008 2009 2 5 8 0 0 1 S",
			"2008 2008 8 1 7 0 0 0",
			"2009 2009 8 1 5 1 0 0",
			"2010 2010 2 26 7 0 0 1 S",
			"2010 2010 7 11 7 0 0 0",
			"2011 2011 3 1 7 0:1 0 1 S",
			"2011 2011 7 1 7 0 0 0",
			"2011 2011 7 30 7 0 0 1 S",
			"2011 2011 8 30 7 0 0 0",
			"2012 9999 2 4 8 24 0 1 S",
			"2012 9999 8 21 5 1 0 0"
		],
		"Para": [
			"1975 1988 9 1 7 0 0 1 S",
			"1975 1978 2 1 7 0 0 0",
			"1979 1991 3 1 7 0 0 0",
			"1989 1989 9 22 7 0 0 1 S",
			"1990 1990 9 1 7 0 0 1 S",
			"1991 1991 9 6 7 0 0 1 S",
			"1992 1992 2 1 7 0 0 0",
			"1992 1992 9 5 7 0 0 1 S",
			"1993 1993 2 31 7 0 0 0",
			"1993 1995 9 1 7 0 0 1 S",
			"1994 1995 1 0 8 0 0 0",
			"1996 1996 2 1 7 0 0 0",
			"1996 2001 9 1 0 0 0 1 S",
			"1997 1997 1 0 8 0 0 0",
			"1998 2001 2 1 0 0 0 0",
			"2002 2004 3 1 0 0 0 0",
			"2002 2003 8 1 0 0 0 1 S",
			"2004 2009 9 15 0 0 0 1 S",
			"2005 2009 2 8 0 0 0 0",
			"2010 9999 9 1 0 0 0 1 S",
			"2010 2012 3 8 0 0 0 0",
			"2013 9999 2 22 0 0 0 0"
		],
		"Perry": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1953 1954 3 0 8 2 0 1 D",
			"1953 1959 8 0 8 2 0 0 S",
			"1955 1955 4 1 7 0 0 1 D",
			"1956 1963 3 0 8 2 0 1 D",
			"1960 1960 9 0 8 2 0 0 S",
			"1961 1961 8 0 8 2 0 0 S",
			"1962 1963 9 0 8 2 0 0 S"
		],
		"Peru": [
			"1938 1938 0 1 7 0 0 1 S",
			"1938 1938 3 1 7 0 0 0",
			"1938 1939 8 0 8 0 0 1 S",
			"1939 1940 2 24 0 0 0 0",
			"1986 1987 0 1 7 0 0 1 S",
			"1986 1987 3 1 7 0 0 0",
			"1990 1990 0 1 7 0 0 1 S",
			"1990 1990 3 1 7 0 0 0",
			"1994 1994 0 1 7 0 0 1 S",
			"1994 1994 3 1 7 0 0 0"
		],
		"Phil": [
			"1936 1936 10 1 7 0 0 1 S",
			"1937 1937 1 1 7 0 0 0",
			"1954 1954 3 12 7 0 0 1 S",
			"1954 1954 6 1 7 0 0 0",
			"1978 1978 2 22 7 0 0 1 S",
			"1978 1978 8 21 7 0 0 0"
		],
		"Pike": [
			"1955 1955 4 1 7 0 0 1 D",
			"1955 1960 8 0 8 2 0 0 S",
			"1956 1964 3 0 8 2 0 1 D",
			"1961 1964 9 0 8 2 0 0 S"
		],
		"Poland": [
			"1918 1919 8 16 7 2 2 0",
			"1919 1919 3 15 7 2 2 1 S",
			"1944 1944 3 3 7 2 2 1 S",
			"1944 1944 9 4 7 2 0 0",
			"1945 1945 3 29 7 0 0 1 S",
			"1945 1945 10 1 7 0 0 0",
			"1946 1946 3 14 7 0 2 1 S",
			"1946 1946 9 7 7 2 2 0",
			"1947 1947 4 4 7 2 2 1 S",
			"1947 1949 9 1 0 2 2 0",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 10 7 2 2 1 S",
			"1957 1957 5 2 7 1 2 1 S",
			"1957 1958 8 0 8 1 2 0",
			"1958 1958 2 30 7 1 2 1 S",
			"1959 1959 4 31 7 1 2 1 S",
			"1959 1961 9 1 0 1 2 0",
			"1960 1960 3 3 7 1 2 1 S",
			"1961 1964 4 0 8 1 2 1 S",
			"1962 1964 8 0 8 1 2 0"
		],
		"Port": [
			"1916 1916 5 17 7 23 0 1 S",
			"1916 1916 10 1 7 1 0 0",
			"1917 1917 1 28 7 23 2 1 S",
			"1917 1921 9 14 7 23 2 0",
			"1918 1918 2 1 7 23 2 1 S",
			"1919 1919 1 28 7 23 2 1 S",
			"1920 1920 1 29 7 23 2 1 S",
			"1921 1921 1 28 7 23 2 1 S",
			"1924 1924 3 16 7 23 2 1 S",
			"1924 1924 9 14 7 23 2 0",
			"1926 1926 3 17 7 23 2 1 S",
			"1926 1929 9 1 6 23 2 0",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1931 1931 3 18 7 23 2 1 S",
			"1931 1932 9 1 6 23 2 0",
			"1932 1932 3 2 7 23 2 1 S",
			"1934 1934 3 7 7 23 2 1 S",
			"1934 1938 9 1 6 23 2 0",
			"1935 1935 2 30 7 23 2 1 S",
			"1936 1936 3 18 7 23 2 1 S",
			"1937 1937 3 3 7 23 2 1 S",
			"1938 1938 2 26 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 24 7 23 2 1 S",
			"1940 1941 9 5 7 23 2 0",
			"1941 1941 3 5 7 23 2 1 S",
			"1942 1945 2 8 6 23 2 1 S",
			"1942 1942 3 25 7 22 2 2 M",
			"1942 1942 7 15 7 22 2 1 S",
			"1942 1945 9 24 6 23 2 0",
			"1943 1943 3 17 7 22 2 2 M",
			"1943 1945 7 25 6 22 2 1 S",
			"1944 1945 3 21 6 22 2 2 M",
			"1946 1946 3 1 6 23 2 1 S",
			"1946 1946 9 1 6 23 2 0",
			"1947 1949 3 1 0 2 2 1 S",
			"1947 1949 9 1 0 2 2 0",
			"1951 1965 3 1 0 2 2 1 S",
			"1951 1965 9 1 0 2 2 0",
			"1977 1977 2 27 7 0 2 1 S",
			"1977 1977 8 25 7 0 2 0",
			"1978 1979 3 1 0 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1979 1982 8 0 8 1 2 0",
			"1980 1980 2 0 8 0 2 1 S",
			"1981 1982 2 0 8 1 2 1 S",
			"1983 1983 2 0 8 2 2 1 S"
		],
		"Pulaski": [
			"1946 1960 3 0 8 2 0 1 D",
			"1946 1954 8 0 8 2 0 0 S",
			"1955 1956 9 0 8 2 0 0 S",
			"1957 1960 8 0 8 2 0 0 S"
		],
		"ROK": [
			"1960 1960 4 15 7 0 0 1 D",
			"1960 1960 8 13 7 0 0 0 S",
			"1987 1988 4 8 0 0 0 1 D",
			"1987 1988 9 8 0 0 0 0 S"
		],
		"Regina": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1930 1934 4 1 0 0 0 1 D",
			"1930 1934 9 1 0 0 0 0 S",
			"1937 1941 3 8 0 0 0 1 D",
			"1937 1937 9 8 0 0 0 0 S",
			"1938 1938 9 1 0 0 0 0 S",
			"1939 1941 9 8 0 0 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1946 1946 3 8 0 2 0 1 D",
			"1946 1946 9 8 0 2 0 0 S",
			"1947 1957 3 0 8 2 0 1 D",
			"1947 1957 8 0 8 2 0 0 S",
			"1959 1959 3 0 8 2 0 1 D",
			"1959 1959 9 0 8 2 0 0 S"
		],
		"Romania": [
			"1932 1932 4 21 7 0 2 1 S",
			"1932 1939 9 1 0 0 2 0",
			"1933 1939 3 2 0 0 2 1 S",
			"1979 1979 4 27 7 0 0 1 S",
			"1979 1979 8 0 8 0 0 0",
			"1980 1980 3 5 7 23 0 1 S",
			"1980 1980 8 0 8 1 0 0",
			"1991 1993 2 0 8 0 2 1 S",
			"1991 1993 8 0 8 0 2 0"
		],
		"Russia": [
			"1917 1917 6 1 7 23 0 1 MST",
			"1917 1917 11 28 7 0 0 0 MMT",
			"1918 1918 4 31 7 22 0 2 MDST",
			"1918 1918 8 16 7 1 0 1 MST",
			"1919 1919 4 31 7 23 0 2 MDST",
			"1919 1919 6 1 7 2 0 1 S",
			"1919 1919 7 16 7 0 0 0",
			"1921 1921 1 14 7 23 0 1 S",
			"1921 1921 2 20 7 23 0 2 M",
			"1921 1921 8 1 7 0 0 1 S",
			"1921 1921 9 1 7 0 0 0",
			"1981 1984 3 1 7 0 0 1 S",
			"1981 1983 9 1 7 0 0 0",
			"1984 1991 8 0 8 2 2 0",
			"1985 1991 2 0 8 2 2 1 S",
			"1992 1992 2 6 8 23 0 1 S",
			"1992 1992 8 6 8 23 0 0",
			"1993 2010 2 0 8 2 2 1 S",
			"1993 1995 8 0 8 2 2 0",
			"1996 2010 9 0 8 2 2 0"
		],
		"RussiaAsia": [
			"1981 1984 3 1 7 0 0 1 S",
			"1981 1983 9 1 7 0 0 0",
			"1984 1991 8 0 8 2 2 0",
			"1985 1991 2 0 8 2 2 1 S",
			"1992 1992 2 6 8 23 0 1 S",
			"1992 1992 8 6 8 23 0 0",
			"1993 9999 2 0 8 2 2 1 S",
			"1993 1995 8 0 8 2 2 0",
			"1996 9999 9 0 8 2 2 0"
		],
		"SA": [
			"1942 1943 8 15 0 2 0 1",
			"1943 1944 2 15 0 2 0 0"
		],
		"SL": [
			"1935 1942 5 1 7 0 0 0:40 SLST",
			"1935 1942 9 1 7 0 0 0 WAT",
			"1957 1962 5 1 7 0 0 1 SLST",
			"1957 1962 8 1 7 0 0 0 GMT"
		],
		"Salv": [
			"1987 1988 4 1 0 0 0 1 D",
			"1987 1988 8 0 8 0 0 0 S"
		],
		"SanLuis": [
			"2008 2009 2 8 0 0 0 0",
			"2007 2009 9 8 0 0 0 1 S"
		],
		"Shang": [
			"1940 1940 5 3 7 0 0 1 D",
			"1940 1941 9 1 7 0 0 0 S",
			"1941 1941 2 16 7 0 0 1 D"
		],
		"SovietZone": [
			"1945 1945 4 24 7 2 0 2 M",
			"1945 1945 8 24 7 3 0 1 S",
			"1945 1945 10 18 7 2 2 0"
		],
		"Spain": [
			"1917 1917 4 5 7 23 2 1 S",
			"1917 1919 9 6 7 23 2 0",
			"1918 1918 3 15 7 23 2 1 S",
			"1919 1919 3 5 7 23 2 1 S",
			"1924 1924 3 16 7 23 2 1 S",
			"1924 1924 9 4 7 23 2 0",
			"1926 1926 3 17 7 23 2 1 S",
			"1926 1929 9 1 6 23 2 0",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1937 1937 4 22 7 23 2 1 S",
			"1937 1939 9 1 6 23 2 0",
			"1938 1938 2 22 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1940 1940 2 16 7 23 2 1 S",
			"1942 1942 4 2 7 22 2 2 M",
			"1942 1942 8 1 7 22 2 1 S",
			"1943 1946 3 13 6 22 2 2 M",
			"1943 1943 9 3 7 22 2 1 S",
			"1944 1944 9 10 7 22 2 1 S",
			"1945 1945 8 30 7 1 0 1 S",
			"1946 1946 8 30 7 0 0 0",
			"1949 1949 3 30 7 23 0 1 S",
			"1949 1949 8 30 7 1 0 0",
			"1974 1975 3 13 6 23 0 1 S",
			"1974 1975 9 1 0 1 0 0",
			"1976 1976 2 27 7 23 0 1 S",
			"1976 1977 8 0 8 1 0 0",
			"1977 1978 3 2 7 23 0 1 S",
			"1978 1978 9 1 7 1 0 0"
		],
		"SpainAfrica": [
			"1967 1967 5 3 7 12 0 1 S",
			"1967 1967 9 1 7 0 0 0",
			"1974 1974 5 24 7 0 0 1 S",
			"1974 1974 8 1 7 0 0 0",
			"1976 1977 4 1 7 0 0 1 S",
			"1976 1976 7 1 7 0 0 0",
			"1977 1977 8 28 7 0 0 0",
			"1978 1978 5 1 7 0 0 1 S",
			"1978 1978 7 4 7 0 0 0"
		],
		"StJohns": [
			"1917 1917 3 8 7 2 0 1 D",
			"1917 1917 8 17 7 2 0 0 S",
			"1919 1919 4 5 7 23 0 1 D",
			"1919 1919 7 12 7 23 0 0 S",
			"1920 1935 4 1 0 23 0 1 D",
			"1920 1935 9 0 8 23 0 0 S",
			"1936 1941 4 9 1 0 0 1 D",
			"1936 1941 9 2 1 0 0 0 S",
			"1946 1950 4 8 0 2 0 1 D",
			"1946 1950 9 2 0 2 0 0 S",
			"1951 1986 3 0 8 2 0 1 D",
			"1951 1959 8 0 8 2 0 0 S",
			"1960 1986 9 0 8 2 0 0 S",
			"1987 1987 3 1 0 0:1 0 1 D",
			"1987 2006 9 0 8 0:1 0 0 S",
			"1988 1988 3 1 0 0:1 0 2 DD",
			"1989 2006 3 1 0 0:1 0 1 D",
			"2007 2011 2 8 0 0:1 0 1 D",
			"2007 2010 10 1 0 0:1 0 0 S"
		],
		"Starke": [
			"1947 1961 3 0 8 2 0 1 D",
			"1947 1954 8 0 8 2 0 0 S",
			"1955 1956 9 0 8 2 0 0 S",
			"1957 1958 8 0 8 2 0 0 S",
			"1959 1961 9 0 8 2 0 0 S"
		],
		"Sudan": [
			"1970 1970 4 1 7 0 0 1 S",
			"1970 1985 9 15 7 0 0 0",
			"1971 1971 3 30 7 0 0 1 S",
			"1972 1985 3 0 8 0 0 1 S"
		],
		"Swift": [
			"1957 1957 3 0 8 2 0 1 D",
			"1957 1957 9 0 8 2 0 0 S",
			"1959 1961 3 0 8 2 0 1 D",
			"1959 1959 9 0 8 2 0 0 S",
			"1960 1961 8 0 8 2 0 0 S"
		],
		"Swiss": [
			"1941 1942 4 1 1 1 0 1 S",
			"1941 1942 9 1 1 2 0 0"
		],
		"Syria": [
			"1920 1923 3 15 0 2 0 1 S",
			"1920 1923 9 1 0 2 0 0",
			"1962 1962 3 29 7 2 0 1 S",
			"1962 1962 9 1 7 2 0 0",
			"1963 1965 4 1 7 2 0 1 S",
			"1963 1963 8 30 7 2 0 0",
			"1964 1964 9 1 7 2 0 0",
			"1965 1965 8 30 7 2 0 0",
			"1966 1966 3 24 7 2 0 1 S",
			"1966 1976 9 1 7 2 0 0",
			"1967 1978 4 1 7 2 0 1 S",
			"1977 1978 8 1 7 2 0 0",
			"1983 1984 3 9 7 2 0 1 S",
			"1983 1984 9 1 7 2 0 0",
			"1986 1986 1 16 7 2 0 1 S",
			"1986 1986 9 9 7 2 0 0",
			"1987 1987 2 1 7 2 0 1 S",
			"1987 1988 9 31 7 2 0 0",
			"1988 1988 2 15 7 2 0 1 S",
			"1989 1989 2 31 7 2 0 1 S",
			"1989 1989 9 1 7 2 0 0",
			"1990 1990 3 1 7 2 0 1 S",
			"1990 1990 8 30 7 2 0 0",
			"1991 1991 3 1 7 0 0 1 S",
			"1991 1992 9 1 7 0 0 0",
			"1992 1992 3 8 7 0 0 1 S",
			"1993 1993 2 26 7 0 0 1 S",
			"1993 1993 8 25 7 0 0 0",
			"1994 1996 3 1 7 0 0 1 S",
			"1994 2005 9 1 7 0 0 0",
			"1997 1998 2 1 8 0 0 1 S",
			"1999 2006 3 1 7 0 0 1 S",
			"2006 2006 8 22 7 0 0 0",
			"2007 2007 2 5 8 0 0 1 S",
			"2007 2007 10 1 5 0 0 0",
			"2008 2008 3 1 5 0 0 1 S",
			"2008 2008 10 1 7 0 0 0",
			"2009 2009 2 5 8 0 0 1 S",
			"2010 2011 3 1 5 0 0 1 S",
			"2012 9999 2 5 8 0 0 1 S",
			"2009 9999 9 5 8 0 0 0"
		],
		"TC": [
			"1979 1986 3 0 8 2 0 1 D",
			"1979 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Taiwan": [
			"1945 1951 4 1 7 0 0 1 D",
			"1945 1951 9 1 7 0 0 0 S",
			"1952 1952 2 1 7 0 0 1 D",
			"1952 1954 10 1 7 0 0 0 S",
			"1953 1959 3 1 7 0 0 1 D",
			"1955 1961 9 1 7 0 0 0 S",
			"1960 1961 5 1 7 0 0 1 D",
			"1974 1975 3 1 7 0 0 1 D",
			"1974 1975 9 1 7 0 0 0 S",
			"1979 1979 5 30 7 0 0 1 D",
			"1979 1979 8 30 7 0 0 0 S"
		],
		"Thule": [
			"1991 1992 2 0 8 2 0 1 D",
			"1991 1992 8 0 8 2 0 0 S",
			"1993 2006 3 1 0 2 0 1 D",
			"1993 2006 9 0 8 2 0 0 S",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Tonga": [
			"1999 1999 9 7 7 2 2 1 S",
			"2000 2000 2 19 7 2 2 0",
			"2000 2001 10 1 0 2 0 1 S",
			"2001 2002 0 0 8 2 0 0"
		],
		"Toronto": [
			"1919 1919 2 30 7 23:30 0 1 D",
			"1919 1919 9 26 7 0 0 0 S",
			"1920 1920 4 2 7 2 0 1 D",
			"1920 1920 8 26 7 0 0 0 S",
			"1921 1921 4 15 7 2 0 1 D",
			"1921 1921 8 15 7 2 0 0 S",
			"1922 1923 4 8 0 2 0 1 D",
			"1922 1926 8 15 0 2 0 0 S",
			"1924 1927 4 1 0 2 0 1 D",
			"1927 1932 8 0 8 2 0 0 S",
			"1928 1931 3 0 8 2 0 1 D",
			"1932 1932 4 1 7 2 0 1 D",
			"1933 1940 3 0 8 2 0 1 D",
			"1933 1933 9 1 7 2 0 0 S",
			"1934 1939 8 0 8 2 0 0 S",
			"1945 1946 8 0 8 2 0 0 S",
			"1946 1946 3 0 8 2 0 1 D",
			"1947 1949 3 0 8 0 0 1 D",
			"1947 1948 8 0 8 0 0 0 S",
			"1949 1949 10 0 8 0 0 0 S",
			"1950 1973 3 0 8 2 0 1 D",
			"1950 1950 10 0 8 2 0 0 S",
			"1951 1956 8 0 8 2 0 0 S",
			"1957 1973 9 0 8 2 0 0 S"
		],
		"Tunisia": [
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 25 7 23 2 1 S",
			"1941 1941 9 6 7 0 0 0",
			"1942 1942 2 9 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 29 7 2 0 1 S",
			"1943 1943 3 17 7 2 0 0",
			"1943 1943 3 25 7 2 0 1 S",
			"1943 1943 9 4 7 2 0 0",
			"1944 1945 3 1 1 2 0 1 S",
			"1944 1944 9 8 7 0 0 0",
			"1945 1945 8 16 7 0 0 0",
			"1977 1977 3 30 7 0 2 1 S",
			"1977 1977 8 24 7 0 2 0",
			"1978 1978 4 1 7 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1988 1988 5 1 7 0 2 1 S",
			"1988 1990 8 0 8 0 2 0",
			"1989 1989 2 26 7 0 2 1 S",
			"1990 1990 4 1 7 0 2 1 S",
			"2005 2005 4 1 7 0 2 1 S",
			"2005 2005 8 30 7 1 2 0",
			"2006 2008 2 0 8 2 2 1 S",
			"2006 2008 9 0 8 2 2 0"
		],
		"Turkey": [
			"1916 1916 4 1 7 0 0 1 S",
			"1916 1916 9 1 7 0 0 0",
			"1920 1920 2 28 7 0 0 1 S",
			"1920 1920 9 25 7 0 0 0",
			"1921 1921 3 3 7 0 0 1 S",
			"1921 1921 9 3 7 0 0 0",
			"1922 1922 2 26 7 0 0 1 S",
			"1922 1922 9 8 7 0 0 0",
			"1924 1924 4 13 7 0 0 1 S",
			"1924 1925 9 1 7 0 0 0",
			"1925 1925 4 1 7 0 0 1 S",
			"1940 1940 5 30 7 0 0 1 S",
			"1940 1940 9 5 7 0 0 0",
			"1940 1940 11 1 7 0 0 1 S",
			"1941 1941 8 21 7 0 0 0",
			"1942 1942 3 1 7 0 0 1 S",
			"1942 1942 10 1 7 0 0 0",
			"1945 1945 3 2 7 0 0 1 S",
			"1945 1945 9 8 7 0 0 0",
			"1946 1946 5 1 7 0 0 1 S",
			"1946 1946 9 1 7 0 0 0",
			"1947 1948 3 16 0 0 0 1 S",
			"1947 1950 9 2 0 0 0 0",
			"1949 1949 3 10 7 0 0 1 S",
			"1950 1950 3 19 7 0 0 1 S",
			"1951 1951 3 22 7 0 0 1 S",
			"1951 1951 9 8 7 0 0 0",
			"1962 1962 6 15 7 0 0 1 S",
			"1962 1962 9 8 7 0 0 0",
			"1964 1964 4 15 7 0 0 1 S",
			"1964 1964 9 1 7 0 0 0",
			"1970 1972 4 2 0 0 0 1 S",
			"1970 1972 9 2 0 0 0 0",
			"1973 1973 5 3 7 1 0 1 S",
			"1973 1973 10 4 7 3 0 0",
			"1974 1974 2 31 7 2 0 1 S",
			"1974 1974 10 3 7 5 0 0",
			"1975 1975 2 30 7 0 0 1 S",
			"1975 1976 9 0 8 0 0 0",
			"1976 1976 5 1 7 0 0 1 S",
			"1977 1978 3 1 0 0 0 1 S",
			"1977 1977 9 16 7 0 0 0",
			"1979 1980 3 1 0 3 0 1 S",
			"1979 1982 9 11 1 0 0 0",
			"1981 1982 2 0 8 3 0 1 S",
			"1983 1983 6 31 7 0 0 1 S",
			"1983 1983 9 2 7 0 0 0",
			"1985 1985 3 20 7 0 0 1 S",
			"1985 1985 8 28 7 0 0 0",
			"1986 1990 2 0 8 2 2 1 S",
			"1986 1990 8 0 8 2 2 0",
			"1991 2006 2 0 8 1 2 1 S",
			"1991 1995 8 0 8 1 2 0",
			"1996 2006 9 0 8 1 2 0"
		],
		"US": [
			"1918 1919 2 0 8 2 0 1 D",
			"1918 1919 9 0 8 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1967 2006 9 0 8 2 0 0 S",
			"1967 1973 3 0 8 2 0 1 D",
			"1974 1974 0 6 7 2 0 1 D",
			"1975 1975 1 23 7 2 0 1 D",
			"1976 1986 3 0 8 2 0 1 D",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Uruguay": [
			"1923 1923 9 2 7 0 0 0:30 HS",
			"1924 1926 3 1 7 0 0 0",
			"1924 1925 9 1 7 0 0 0:30 HS",
			"1933 1935 9 0 8 0 0 0:30 HS",
			"1934 1936 2 25 6 23:30 2 0",
			"1936 1936 10 1 7 0 0 0:30 HS",
			"1937 1941 2 0 8 0 0 0",
			"1937 1940 9 0 8 0 0 0:30 HS",
			"1941 1941 7 1 7 0 0 0:30 HS",
			"1942 1942 0 1 7 0 0 0",
			"1942 1942 11 14 7 0 0 1 S",
			"1943 1943 2 14 7 0 0 0",
			"1959 1959 4 24 7 0 0 1 S",
			"1959 1959 10 15 7 0 0 0",
			"1960 1960 0 17 7 0 0 1 S",
			"1960 1960 2 6 7 0 0 0",
			"1965 1967 3 1 0 0 0 1 S",
			"1965 1965 8 26 7 0 0 0",
			"1966 1967 9 31 7 0 0 0",
			"1968 1970 4 27 7 0 0 0:30 HS",
			"1968 1970 11 2 7 0 0 0",
			"1972 1972 3 24 7 0 0 1 S",
			"1972 1972 7 15 7 0 0 0",
			"1974 1974 2 10 7 0 0 0:30 HS",
			"1974 1974 11 22 7 0 0 1 S",
			"1976 1976 9 1 7 0 0 0",
			"1977 1977 11 4 7 0 0 1 S",
			"1978 1978 3 1 7 0 0 0",
			"1979 1979 9 1 7 0 0 1 S",
			"1980 1980 4 1 7 0 0 0",
			"1987 1987 11 14 7 0 0 1 S",
			"1988 1988 2 14 7 0 0 0",
			"1988 1988 11 11 7 0 0 1 S",
			"1989 1989 2 12 7 0 0 0",
			"1989 1989 9 29 7 0 0 1 S",
			"1990 1992 2 1 0 0 0 0",
			"1990 1991 9 21 0 0 0 1 S",
			"1992 1992 9 18 7 0 0 1 S",
			"1993 1993 1 28 7 0 0 0",
			"2004 2004 8 19 7 0 0 1 S",
			"2005 2005 2 27 7 2 0 0",
			"2005 2005 9 9 7 2 0 1 S",
			"2006 2006 2 12 7 2 0 0",
			"2006 9999 9 1 0 2 0 1 S",
			"2007 9999 2 8 0 2 0 0"
		],
		"Vanc": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1946 1986 3 0 8 2 0 1 D",
			"1946 1946 9 13 7 2 0 0 S",
			"1947 1961 8 0 8 2 0 0 S",
			"1962 2006 9 0 8 2 0 0 S"
		],
		"Vanuatu": [
			"1983 1983 8 25 7 0 0 1 S",
			"1984 1991 2 23 0 0 0 0",
			"1984 1984 9 23 7 0 0 1 S",
			"1985 1991 8 23 0 0 0 1 S",
			"1992 1993 0 23 0 0 0 0",
			"1992 1992 9 23 0 0 0 1 S"
		],
		"Vincennes": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1953 1954 3 0 8 2 0 1 D",
			"1953 1959 8 0 8 2 0 0 S",
			"1955 1955 4 1 7 0 0 1 D",
			"1956 1963 3 0 8 2 0 1 D",
			"1960 1960 9 0 8 2 0 0 S",
			"1961 1961 8 0 8 2 0 0 S",
			"1962 1963 9 0 8 2 0 0 S"
		],
		"W-Eur": [
			"1977 1980 3 1 0 1 2 1 S",
			"1977 1977 8 0 8 1 2 0",
			"1978 1978 9 1 7 1 2 0",
			"1979 1995 8 0 8 1 2 0",
			"1981 9999 2 0 8 1 2 1 S",
			"1996 9999 9 0 8 1 2 0"
		],
		"WS": [
			"2012 9999 8 0 8 3 0 1 D",
			"2012 9999 3 1 0 4 0 0"
		],
		"Winn": [
			"1916 1916 3 23 7 0 0 1 D",
			"1916 1916 8 17 7 0 0 0 S",
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1937 1937 4 16 7 2 0 1 D",
			"1937 1937 8 26 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1946 1946 4 12 7 2 0 1 D",
			"1946 1946 9 13 7 2 0 0 S",
			"1947 1949 3 0 8 2 0 1 D",
			"1947 1949 8 0 8 2 0 0 S",
			"1950 1950 4 1 7 2 0 1 D",
			"1950 1950 8 30 7 2 0 0 S",
			"1951 1960 3 0 8 2 0 1 D",
			"1951 1958 8 0 8 2 0 0 S",
			"1959 1959 9 0 8 2 0 0 S",
			"1960 1960 8 0 8 2 0 0 S",
			"1963 1963 3 0 8 2 0 1 D",
			"1963 1963 8 22 7 2 0 0 S",
			"1966 1986 3 0 8 2 2 1 D",
			"1966 2005 9 0 8 2 2 0 S",
			"1987 2005 3 1 0 2 2 1 D"
		],
		"Zion": [
			"1940 1940 5 1 7 0 0 1 D",
			"1942 1944 10 1 7 0 0 0 S",
			"1943 1943 3 1 7 2 0 1 D",
			"1944 1944 3 1 7 0 0 1 D",
			"1945 1945 3 16 7 0 0 1 D",
			"1945 1945 10 1 7 2 0 0 S",
			"1946 1946 3 16 7 2 0 1 D",
			"1946 1946 10 1 7 0 0 0 S",
			"1948 1948 4 23 7 0 0 2 DD",
			"1948 1948 8 1 7 0 0 1 D",
			"1948 1949 10 1 7 2 0 0 S",
			"1949 1949 4 1 7 0 0 1 D",
			"1950 1950 3 16 7 0 0 1 D",
			"1950 1950 8 15 7 3 0 0 S",
			"1951 1951 3 1 7 0 0 1 D",
			"1951 1951 10 11 7 3 0 0 S",
			"1952 1952 3 20 7 2 0 1 D",
			"1952 1952 9 19 7 3 0 0 S",
			"1953 1953 3 12 7 2 0 1 D",
			"1953 1953 8 13 7 3 0 0 S",
			"1954 1954 5 13 7 0 0 1 D",
			"1954 1954 8 12 7 0 0 0 S",
			"1955 1955 5 11 7 2 0 1 D",
			"1955 1955 8 11 7 0 0 0 S",
			"1956 1956 5 3 7 0 0 1 D",
			"1956 1956 8 30 7 3 0 0 S",
			"1957 1957 3 29 7 2 0 1 D",
			"1957 1957 8 22 7 0 0 0 S",
			"1974 1974 6 7 7 0 0 1 D",
			"1974 1974 9 13 7 0 0 0 S",
			"1975 1975 3 20 7 0 0 1 D",
			"1975 1975 7 31 7 0 0 0 S",
			"1985 1985 3 14 7 0 0 1 D",
			"1985 1985 8 15 7 0 0 0 S",
			"1986 1986 4 18 7 0 0 1 D",
			"1986 1986 8 7 7 0 0 0 S",
			"1987 1987 3 15 7 0 0 1 D",
			"1987 1987 8 13 7 0 0 0 S",
			"1988 1988 3 9 7 0 0 1 D",
			"1988 1988 8 3 7 0 0 0 S",
			"1989 1989 3 30 7 0 0 1 D",
			"1989 1989 8 3 7 0 0 0 S",
			"1990 1990 2 25 7 0 0 1 D",
			"1990 1990 7 26 7 0 0 0 S",
			"1991 1991 2 24 7 0 0 1 D",
			"1991 1991 8 1 7 0 0 0 S",
			"1992 1992 2 29 7 0 0 1 D",
			"1992 1992 8 6 7 0 0 0 S",
			"1993 1993 3 2 7 0 0 1 D",
			"1993 1993 8 5 7 0 0 0 S",
			"1994 1994 3 1 7 0 0 1 D",
			"1994 1994 7 28 7 0 0 0 S",
			"1995 1995 2 31 7 0 0 1 D",
			"1995 1995 8 3 7 0 0 0 S",
			"1996 1996 2 15 7 0 0 1 D",
			"1996 1996 8 16 7 0 0 0 S",
			"1997 1997 2 21 7 0 0 1 D",
			"1997 1997 8 14 7 0 0 0 S",
			"1998 1998 2 20 7 0 0 1 D",
			"1998 1998 8 6 7 0 0 0 S",
			"1999 1999 3 2 7 2 0 1 D",
			"1999 1999 8 3 7 2 0 0 S",
			"2000 2000 3 14 7 2 0 1 D",
			"2000 2000 9 6 7 1 0 0 S",
			"2001 2001 3 9 7 1 0 1 D",
			"2001 2001 8 24 7 1 0 0 S",
			"2002 2002 2 29 7 1 0 1 D",
			"2002 2002 9 7 7 1 0 0 S",
			"2003 2003 2 28 7 1 0 1 D",
			"2003 2003 9 3 7 1 0 0 S",
			"2004 2004 3 7 7 1 0 1 D",
			"2004 2004 8 22 7 1 0 0 S",
			"2005 2005 3 1 7 2 0 1 D",
			"2005 2005 9 9 7 2 0 0 S",
			"2006 2010 2 26 5 2 0 1 D",
			"2006 2006 9 1 7 2 0 0 S",
			"2007 2007 8 16 7 2 0 0 S",
			"2008 2008 9 5 7 2 0 0 S",
			"2009 2009 8 27 7 2 0 0 S",
			"2010 2010 8 12 7 2 0 0 S",
			"2011 2011 3 1 7 2 0 1 D",
			"2011 2011 9 2 7 2 0 0 S",
			"2012 2012 2 26 5 2 0 1 D",
			"2012 2012 8 23 7 2 0 0 S",
			"2013 9999 2 23 5 2 0 1 D",
			"2013 2026 9 2 0 2 0 0 S",
			"2027 2027 9 3 1 2 0 0 S",
			"2028 9999 9 2 0 2 0 0 S"
		]
	},
	"zones": {
		"Africa/Abidjan": [
			"-0:16:8 - LMT 1912 -0:16:8",
			"0 - GMT"
		],
		"Africa/Accra": [
			"-0:0:52 - LMT 1918 -0:0:52",
			"0 Ghana %s"
		],
		"Africa/Addis_Ababa": [
			"2:34:48 - LMT 1870 2:34:48",
			"2:35:20 - ADMT 1936_4_5 2:35:20",
			"3 - EAT"
		],
		"Africa/Algiers": [
			"0:12:12 - LMT 1891_2_15_0_1 0:12:12",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"0 Algeria WE%sT 1940_1_25_2",
			"1 Algeria CE%sT 1946_9_7 1",
			"0 - WET 1956_0_29",
			"1 - CET 1963_3_14 1",
			"0 Algeria WE%sT 1977_9_21 1",
			"1 Algeria CE%sT 1979_9_26 1",
			"0 Algeria WE%sT 1981_4",
			"1 - CET"
		],
		"Africa/Asmara": [
			"2:35:32 - LMT 1870 2:35:32",
			"2:35:32 - AMT 1890 2:35:32",
			"2:35:20 - ADMT 1936_4_5 2:35:20",
			"3 - EAT"
		],
		"Africa/Bamako": [
			"-0:32 - LMT 1912 -0:32",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960_5_20 -1",
			"0 - GMT"
		],
		"Africa/Bangui": [
			"1:14:20 - LMT 1912 1:14:20",
			"1 - WAT"
		],
		"Africa/Banjul": [
			"-1:6:36 - LMT 1912 -1:6:36",
			"-1:6:36 - BMT 1935 -1:6:36",
			"-1 - WAT 1964 -1",
			"0 - GMT"
		],
		"Africa/Bissau": [
			"-1:2:20 - LMT 1911_4_26 -1:2:20",
			"-1 - WAT 1975 -1",
			"0 - GMT"
		],
		"Africa/Blantyre": [
			"2:20 - LMT 1903_2 2:20",
			"2 - CAT"
		],
		"Africa/Brazzaville": [
			"1:1:8 - LMT 1912 1:1:8",
			"1 - WAT"
		],
		"Africa/Bujumbura": [
			"1:57:28 - LMT 1890 1:57:28",
			"2 - CAT"
		],
		"Africa/Cairo": [
			"2:5:9 - LMT 1900_9 2:5:9",
			"2 Egypt EE%sT"
		],
		"Africa/Casablanca": [
			"-0:30:20 - LMT 1913_9_26 -0:30:20",
			"0 Morocco WE%sT 1984_2_16",
			"1 - CET 1986 1",
			"0 Morocco WE%sT"
		],
		"Africa/Ceuta": [
			"-0:21:16 - LMT 1901 -0:21:16",
			"0 - WET 1918_4_6_23",
			"1 - WEST 1918_9_7_23 1",
			"0 - WET 1924",
			"0 Spain WE%sT 1929",
			"0 SpainAfrica WE%sT 1984_2_16",
			"1 - CET 1986 1",
			"1 EU CE%sT"
		],
		"Africa/Conakry": [
			"-0:54:52 - LMT 1912 -0:54:52",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960 -1",
			"0 - GMT"
		],
		"Africa/Dakar": [
			"-1:9:44 - LMT 1912 -1:9:44",
			"-1 - WAT 1941_5 -1",
			"0 - GMT"
		],
		"Africa/Dar_es_Salaam": [
			"2:37:8 - LMT 1931 2:37:8",
			"3 - EAT 1948 3",
			"2:45 - BEAUT 1961 2:45",
			"3 - EAT"
		],
		"Africa/Djibouti": [
			"2:52:36 - LMT 1911_6 2:52:36",
			"3 - EAT"
		],
		"Africa/Douala": [
			"0:38:48 - LMT 1912 0:38:48",
			"1 - WAT"
		],
		"Africa/El_Aaiun": [
			"-0:52:48 - LMT 1934_0 -0:52:48",
			"-1 - WAT 1976_3_14 -1",
			"0 - WET"
		],
		"Africa/Freetown": [
			"-0:53 - LMT 1882 -0:53",
			"-0:53 - FMT 1913_5 -0:53",
			"-1 SL %s 1957 -1",
			"0 SL %s"
		],
		"Africa/Gaborone": [
			"1:43:40 - LMT 1885 1:43:40",
			"1:30 - SAST 1903_2 1:30",
			"2 - CAT 1943_8_19_2 2",
			"3 - CAST 1944_2_19_2 3",
			"2 - CAT"
		],
		"Africa/Harare": [
			"2:4:12 - LMT 1903_2 2:4:12",
			"2 - CAT"
		],
		"Africa/Johannesburg": [
			"1:52 - LMT 1892_1_8 1:52",
			"1:30 - SAST 1903_2 1:30",
			"2 SA SAST"
		],
		"Africa/Juba": [
			"2:6:24 - LMT 1931 2:6:24",
			"2 Sudan CA%sT 2000_0_15_12 2",
			"3 - EAT"
		],
		"Africa/Kampala": [
			"2:9:40 - LMT 1928_6 2:9:40",
			"3 - EAT 1930 3",
			"2:30 - BEAT 1948 2:30",
			"2:45 - BEAUT 1957 2:45",
			"3 - EAT"
		],
		"Africa/Khartoum": [
			"2:10:8 - LMT 1931 2:10:8",
			"2 Sudan CA%sT 2000_0_15_12 2",
			"3 - EAT"
		],
		"Africa/Kigali": [
			"2:0:16 - LMT 1935_5 2:0:16",
			"2 - CAT"
		],
		"Africa/Kinshasa": [
			"1:1:12 - LMT 1897_10_9 1:1:12",
			"1 - WAT"
		],
		"Africa/Lagos": [
			"0:13:36 - LMT 1919_8 0:13:36",
			"1 - WAT"
		],
		"Africa/Libreville": [
			"0:37:48 - LMT 1912 0:37:48",
			"1 - WAT"
		],
		"Africa/Lome": [
			"0:4:52 - LMT 1893 0:4:52",
			"0 - GMT"
		],
		"Africa/Luanda": [
			"0:52:56 - LMT 1892 0:52:56",
			"0:52:4 - AOT 1911_4_26 0:52:4",
			"1 - WAT"
		],
		"Africa/Lubumbashi": [
			"1:49:52 - LMT 1897_10_9 1:49:52",
			"2 - CAT"
		],
		"Africa/Lusaka": [
			"1:53:8 - LMT 1903_2 1:53:8",
			"2 - CAT"
		],
		"Africa/Malabo": [
			"0:35:8 - LMT 1912 0:35:8",
			"0 - GMT 1963_11_15",
			"1 - WAT"
		],
		"Africa/Maputo": [
			"2:10:20 - LMT 1903_2 2:10:20",
			"2 - CAT"
		],
		"Africa/Maseru": [
			"1:50 - LMT 1903_2 1:50",
			"2 - SAST 1943_8_19_2 2",
			"3 - SAST 1944_2_19_2 3",
			"2 - SAST"
		],
		"Africa/Mbabane": [
			"2:4:24 - LMT 1903_2 2:4:24",
			"2 - SAST"
		],
		"Africa/Mogadishu": [
			"3:1:28 - LMT 1893_10 3:1:28",
			"3 - EAT 1931 3",
			"2:30 - BEAT 1957 2:30",
			"3 - EAT"
		],
		"Africa/Monrovia": [
			"-0:43:8 - LMT 1882 -0:43:8",
			"-0:43:8 - MMT 1919_2 -0:43:8",
			"-0:44:30 - LRT 1972_4 -0:44:30",
			"0 - GMT"
		],
		"Africa/Nairobi": [
			"2:27:16 - LMT 1928_6 2:27:16",
			"3 - EAT 1930 3",
			"2:30 - BEAT 1940 2:30",
			"2:45 - BEAUT 1960 2:45",
			"3 - EAT"
		],
		"Africa/Ndjamena": [
			"1:0:12 - LMT 1912 1:0:12",
			"1 - WAT 1979_9_14 1",
			"2 - WAST 1980_2_8 2",
			"1 - WAT"
		],
		"Africa/Niamey": [
			"0:8:28 - LMT 1912 0:8:28",
			"-1 - WAT 1934_1_26 -1",
			"0 - GMT 1960",
			"1 - WAT"
		],
		"Africa/Nouakchott": [
			"-1:3:48 - LMT 1912 -1:3:48",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960_10_28 -1",
			"0 - GMT"
		],
		"Africa/Ouagadougou": [
			"-0:6:4 - LMT 1912 -0:6:4",
			"0 - GMT"
		],
		"Africa/Porto-Novo": [
			"0:10:28 - LMT 1912 0:10:28",
			"0 - GMT 1934_1_26",
			"1 - WAT"
		],
		"Africa/Sao_Tome": [
			"0:26:56 - LMT 1884 0:26:56",
			"-0:36:32 - LMT 1912 -0:36:32",
			"0 - GMT"
		],
		"Africa/Tripoli": [
			"0:52:44 - LMT 1920 0:52:44",
			"1 Libya CE%sT 1959 1",
			"2 - EET 1982 2",
			"1 Libya CE%sT 1990_4_4 1",
			"2 - EET 1996_8_30 2",
			"1 Libya CE%sT 1997_9_4 2",
			"2 - EET 2012_10_10_2 2",
			"1 Libya CE%sT"
		],
		"Africa/Tunis": [
			"0:40:44 - LMT 1881_4_12 0:40:44",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"1 Tunisia CE%sT"
		],
		"Africa/Windhoek": [
			"1:8:24 - LMT 1892_1_8 1:8:24",
			"1:30 - SWAT 1903_2 1:30",
			"2 - SAST 1942_8_20_2 2",
			"3 - SAST 1943_2_21_2 3",
			"2 - SAST 1990_2_21 2",
			"2 - CAT 1994_3_3 2",
			"1 Namibia WA%sT"
		],
		"America/Adak": [
			"12:13:21 - LMT 1867_9_18 12:13:21",
			"-11:46:38 - LMT 1900_7_20_12 -11:46:38",
			"-11 - NST 1942 -11",
			"-11 US N%sT 1946 -11",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1969 -11",
			"-11 US B%sT 1983_9_30_2 -10",
			"-10 US AH%sT 1983_10_30 -10",
			"-10 US HA%sT"
		],
		"America/Anchorage": [
			"14:0:24 - LMT 1867_9_18 14:0:24",
			"-9:59:36 - LMT 1900_7_20_12 -9:59:36",
			"-10 - CAT 1942 -10",
			"-10 US CAT/CAWT 1945_7_14_23",
			"-10 US CAT/CAPT 1946 -10",
			"-10 - CAT 1967_3 -10",
			"-10 - AHST 1969 -10",
			"-10 US AH%sT 1983_9_30_2 -9",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Anguilla": [
			"-4:12:16 - LMT 1912_2_2 -4:12:16",
			"-4 - AST"
		],
		"America/Antigua": [
			"-4:7:12 - LMT 1912_2_2 -4:7:12",
			"-5 - EST 1951 -5",
			"-4 - AST"
		],
		"America/Araguaina": [
			"-3:12:48 - LMT 1914 -3:12:48",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1995_8_14 -3",
			"-3 Brazil BR%sT 2003_8_24 -3",
			"-3 - BRT 2012_9_21 -3",
			"-3 Brazil BR%sT"
		],
		"America/Argentina/Buenos_Aires": [
			"-3:53:48 - LMT 1894_9_31 -3:53:48",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Catamarca": [
			"-4:23:8 - LMT 1894_9_31 -4:23:8",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Cordoba": [
			"-4:16:48 - LMT 1894_9_31 -4:16:48",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Jujuy": [
			"-4:21:12 - LMT 1894_9_31 -4:21:12",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990_2_4 -2",
			"-4 - WART 1990_9_28 -4",
			"-3 - WARST 1991_2_17 -3",
			"-4 - WART 1991_9_6 -4",
			"-2 - ARST 1992 -2",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/La_Rioja": [
			"-4:27:24 - LMT 1894_9_31 -4:27:24",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_1 -2",
			"-4 - WART 1991_4_7 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Mendoza": [
			"-4:35:16 - LMT 1894_9_31 -4:35:16",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990_2_4 -2",
			"-4 - WART 1990_9_15 -4",
			"-3 - WARST 1991_2_1 -3",
			"-4 - WART 1991_9_15 -4",
			"-3 - WARST 1992_2_1 -3",
			"-4 - WART 1992_9_18 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_23 -3",
			"-4 - WART 2004_8_26 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Rio_Gallegos": [
			"-4:36:52 - LMT 1894_9_31 -4:36:52",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Salta": [
			"-4:21:40 - LMT 1894_9_31 -4:21:40",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/San_Juan": [
			"-4:34:4 - LMT 1894_9_31 -4:34:4",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_1 -2",
			"-4 - WART 1991_4_7 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_31 -3",
			"-4 - WART 2004_6_25 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/San_Luis": [
			"-4:25:24 - LMT 1894_9_31 -4:25:24",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990 -2",
			"-2 - ARST 1990_2_14 -2",
			"-4 - WART 1990_9_15 -4",
			"-3 - WARST 1991_2_1 -3",
			"-4 - WART 1991_5_1 -4",
			"-3 - ART 1999_9_3 -3",
			"-3 - WARST 2000_2_3 -3",
			"-3 - ART 2004_4_31 -3",
			"-4 - WART 2004_6_25 -4",
			"-3 Arg AR%sT 2008_0_21 -2",
			"-4 SanLuis WAR%sT"
		],
		"America/Argentina/Tucuman": [
			"-4:20:52 - LMT 1894_9_31 -4:20:52",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_13 -4",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Ushuaia": [
			"-4:33:12 - LMT 1894_9_31 -4:33:12",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_30 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Aruba": [
			"-4:40:24 - LMT 1912_1_12 -4:40:24",
			"-4:30 - ANT 1965 -4:30",
			"-4 - AST"
		],
		"America/Asuncion": [
			"-3:50:40 - LMT 1890 -3:50:40",
			"-3:50:40 - AMT 1931_9_10 -3:50:40",
			"-4 - PYT 1972_9 -4",
			"-3 - PYT 1974_3 -3",
			"-4 Para PY%sT"
		],
		"America/Atikokan": [
			"-6:6:28 - LMT 1895 -6:6:28",
			"-6 Canada C%sT 1940_8_29 -6",
			"-5 - CDT 1942_1_9_2 -6",
			"-6 Canada C%sT 1945_8_30_2 -5",
			"-5 - EST"
		],
		"America/Bahia": [
			"-2:34:4 - LMT 1914 -2:34:4",
			"-3 Brazil BR%sT 2003_8_24 -3",
			"-3 - BRT 2011_9_16 -3",
			"-3 Brazil BR%sT 2012_9_21 -3",
			"-3 - BRT"
		],
		"America/Bahia_Banderas": [
			"-7:1 - LMT 1921_11_31_23_59 -7:1",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT 2010_3_4_2 -7",
			"-6 Mexico C%sT"
		],
		"America/Barbados": [
			"-3:58:29 - LMT 1924 -3:58:29",
			"-3:58:29 - BMT 1932 -3:58:29",
			"-4 Barb A%sT"
		],
		"America/Belem": [
			"-3:13:56 - LMT 1914 -3:13:56",
			"-3 Brazil BR%sT 1988_8_12 -3",
			"-3 - BRT"
		],
		"America/Belize": [
			"-5:52:48 - LMT 1912_3 -5:52:48",
			"-6 Belize C%sT"
		],
		"America/Blanc-Sablon": [
			"-3:48:28 - LMT 1884 -3:48:28",
			"-4 Canada A%sT 1970 -4",
			"-4 - AST"
		],
		"America/Boa_Vista": [
			"-4:2:40 - LMT 1914 -4:2:40",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 1999_8_30 -4",
			"-4 Brazil AM%sT 2000_9_15 -3",
			"-4 - AMT"
		],
		"America/Bogota": [
			"-4:56:16 - LMT 1884_2_13 -4:56:16",
			"-4:56:16 - BMT 1914_10_23 -4:56:16",
			"-5 CO CO%sT"
		],
		"America/Boise": [
			"-7:44:49 - LMT 1883_10_18_12_15_11 -7:44:49",
			"-8 US P%sT 1923_4_13_2 -8",
			"-7 US M%sT 1974 -7",
			"-7 - MST 1974_1_3_2 -7",
			"-7 US M%sT"
		],
		"America/Cambridge_Bay": [
			"0 - zzz 1920",
			"-7 NT_YK M%sT 1999_9_31_2 -6",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 - EST 2000_10_5_0 -5",
			"-6 - CST 2001_3_1_3 -6",
			"-7 Canada M%sT"
		],
		"America/Campo_Grande": [
			"-3:38:28 - LMT 1914 -3:38:28",
			"-4 Brazil AM%sT"
		],
		"America/Cancun": [
			"-5:47:4 - LMT 1922_0_1_0_12_56 -5:47:4",
			"-6 - CST 1981_11_23 -6",
			"-5 Mexico E%sT 1998_7_2_2 -4",
			"-6 Mexico C%sT"
		],
		"America/Caracas": [
			"-4:27:44 - LMT 1890 -4:27:44",
			"-4:27:40 - CMT 1912_1_12 -4:27:40",
			"-4:30 - VET 1965 -4:30",
			"-4 - VET 2007_11_9_03 -4",
			"-4:30 - VET"
		],
		"America/Cayenne": [
			"-3:29:20 - LMT 1911_6 -3:29:20",
			"-4 - GFT 1967_9 -4",
			"-3 - GFT"
		],
		"America/Cayman": [
			"-5:25:32 - LMT 1890 -5:25:32",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 - EST"
		],
		"America/Chicago": [
			"-5:50:36 - LMT 1883_10_18_12_9_24 -5:50:36",
			"-6 US C%sT 1920 -6",
			"-6 Chicago C%sT 1936_2_1_2 -6",
			"-5 - EST 1936_10_15_2 -5",
			"-6 Chicago C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Chicago C%sT 1967 -6",
			"-6 US C%sT"
		],
		"America/Chihuahua": [
			"-7:4:20 - LMT 1921_11_31_23_55_40 -7:4:20",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1996 -6",
			"-6 Mexico C%sT 1998 -6",
			"-6 - CST 1998_3_5_3 -6",
			"-7 Mexico M%sT"
		],
		"America/Costa_Rica": [
			"-5:36:13 - LMT 1890 -5:36:13",
			"-5:36:13 - SJMT 1921_0_15 -5:36:13",
			"-6 CR C%sT"
		],
		"America/Creston": [
			"-7:46:4 - LMT 1884 -7:46:4",
			"-7 - MST 1916_9_1 -7",
			"-8 - PST 1918_5_2 -8",
			"-7 - MST"
		],
		"America/Cuiaba": [
			"-3:44:20 - LMT 1914 -3:44:20",
			"-4 Brazil AM%sT 2003_8_24 -4",
			"-4 - AMT 2004_9_1 -4",
			"-4 Brazil AM%sT"
		],
		"America/Curacao": [
			"-4:35:47 - LMT 1912_1_12 -4:35:47",
			"-4:30 - ANT 1965 -4:30",
			"-4 - AST"
		],
		"America/Danmarkshavn": [
			"-1:14:40 - LMT 1916_6_28 -1:14:40",
			"-3 - WGT 1980_3_6_2 -3",
			"-3 EU WG%sT 1996 -3",
			"0 - GMT"
		],
		"America/Dawson": [
			"-9:17:40 - LMT 1900_7_20 -9:17:40",
			"-9 NT_YK Y%sT 1973_9_28_0 -9",
			"-8 NT_YK P%sT 1980 -8",
			"-8 Canada P%sT"
		],
		"America/Dawson_Creek": [
			"-8:0:56 - LMT 1884 -8:0:56",
			"-8 Canada P%sT 1947 -8",
			"-8 Vanc P%sT 1972_7_30_2 -7",
			"-7 - MST"
		],
		"America/Denver": [
			"-6:59:56 - LMT 1883_10_18_12_0_4 -6:59:56",
			"-7 US M%sT 1920 -7",
			"-7 Denver M%sT 1942 -7",
			"-7 US M%sT 1946 -7",
			"-7 Denver M%sT 1967 -7",
			"-7 US M%sT"
		],
		"America/Detroit": [
			"-5:32:11 - LMT 1905 -5:32:11",
			"-6 - CST 1915_4_15_2 -6",
			"-5 - EST 1942 -5",
			"-5 US E%sT 1946 -5",
			"-5 Detroit E%sT 1973 -5",
			"-5 US E%sT 1975 -5",
			"-5 - EST 1975_3_27_2 -5",
			"-5 US E%sT"
		],
		"America/Dominica": [
			"-4:5:36 - LMT 1911_6_1_0_1 -4:5:36",
			"-4 - AST"
		],
		"America/Edmonton": [
			"-7:33:52 - LMT 1906_8 -7:33:52",
			"-7 Edm M%sT 1987 -7",
			"-7 Canada M%sT"
		],
		"America/Eirunepe": [
			"-4:39:28 - LMT 1914 -4:39:28",
			"-5 Brazil AC%sT 1988_8_12 -5",
			"-5 - ACT 1993_8_28 -5",
			"-5 Brazil AC%sT 1994_8_22 -5",
			"-5 - ACT 2008_5_24_00 -5",
			"-4 - AMT"
		],
		"America/El_Salvador": [
			"-5:56:48 - LMT 1921 -5:56:48",
			"-6 Salv C%sT"
		],
		"America/Fortaleza": [
			"-2:34 - LMT 1914 -2:34",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_22 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Glace_Bay": [
			"-3:59:48 - LMT 1902_5_15 -3:59:48",
			"-4 Canada A%sT 1953 -4",
			"-4 Halifax A%sT 1954 -4",
			"-4 - AST 1972 -4",
			"-4 Halifax A%sT 1974 -4",
			"-4 Canada A%sT"
		],
		"America/Godthab": [
			"-3:26:56 - LMT 1916_6_28 -3:26:56",
			"-3 - WGT 1980_3_6_2 -3",
			"-3 EU WG%sT"
		],
		"America/Goose_Bay": [
			"-4:1:40 - LMT 1884 -4:1:40",
			"-3:30:52 - NST 1918 -3:30:52",
			"-3:30:52 Canada N%sT 1919 -3:30:52",
			"-3:30:52 - NST 1935_2_30 -3:30:52",
			"-3:30 - NST 1936 -3:30",
			"-3:30 StJohns N%sT 1942_4_11 -3:30",
			"-3:30 Canada N%sT 1946 -3:30",
			"-3:30 StJohns N%sT 1966_2_15_2 -3:30",
			"-4 StJohns A%sT 2011_10 -3",
			"-4 Canada A%sT"
		],
		"America/Grand_Turk": [
			"-4:44:32 - LMT 1890 -4:44:32",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 TC E%sT"
		],
		"America/Grenada": [
			"-4:7 - LMT 1911_6 -4:7",
			"-4 - AST"
		],
		"America/Guadeloupe": [
			"-4:6:8 - LMT 1911_5_8 -4:6:8",
			"-4 - AST"
		],
		"America/Guatemala": [
			"-6:2:4 - LMT 1918_9_5 -6:2:4",
			"-6 Guat C%sT"
		],
		"America/Guayaquil": [
			"-5:19:20 - LMT 1890 -5:19:20",
			"-5:14 - QMT 1931 -5:14",
			"-5 - ECT"
		],
		"America/Guyana": [
			"-3:52:40 - LMT 1915_2 -3:52:40",
			"-3:45 - GBGT 1966_4_26 -3:45",
			"-3:45 - GYT 1975_6_31 -3:45",
			"-3 - GYT 1991 -3",
			"-4 - GYT"
		],
		"America/Halifax": [
			"-4:14:24 - LMT 1902_5_15 -4:14:24",
			"-4 Halifax A%sT 1918 -4",
			"-4 Canada A%sT 1919 -4",
			"-4 Halifax A%sT 1942_1_9_2 -4",
			"-4 Canada A%sT 1946 -4",
			"-4 Halifax A%sT 1974 -4",
			"-4 Canada A%sT"
		],
		"America/Havana": [
			"-5:29:28 - LMT 1890 -5:29:28",
			"-5:29:36 - HMT 1925_6_19_12 -5:29:36",
			"-5 Cuba C%sT"
		],
		"America/Hermosillo": [
			"-7:23:52 - LMT 1921_11_31_23_36_8 -7:23:52",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT 1999 -7",
			"-7 - MST"
		],
		"America/Indiana/Indianapolis": [
			"-5:44:38 - LMT 1883_10_18_12_15_22 -5:44:38",
			"-6 US C%sT 1920 -6",
			"-6 Indianapolis C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Indianapolis C%sT 1955_3_24_2 -6",
			"-5 - EST 1957_8_29_2 -5",
			"-6 - CST 1958_3_27_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Knox": [
			"-5:46:30 - LMT 1883_10_18_12_13_30 -5:46:30",
			"-6 US C%sT 1947 -6",
			"-6 Starke C%sT 1962_3_29_2 -6",
			"-5 - EST 1963_9_27_2 -5",
			"-6 US C%sT 1991_9_27_2 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT"
		],
		"America/Indiana/Marengo": [
			"-5:45:23 - LMT 1883_10_18_12_14_37 -5:45:23",
			"-6 US C%sT 1951 -6",
			"-6 Marengo C%sT 1961_3_30_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1974_0_6_2 -5",
			"-5 - CDT 1974_9_27_2 -5",
			"-5 US E%sT 1976 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Petersburg": [
			"-5:49:7 - LMT 1883_10_18_12_10_53 -5:49:7",
			"-6 US C%sT 1955 -6",
			"-6 Pike C%sT 1965_3_25_2 -6",
			"-5 - EST 1966_9_30_2 -5",
			"-6 US C%sT 1977_9_30_2 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_10_4_2 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Tell_City": [
			"-5:47:3 - LMT 1883_10_18_12_12_57 -5:47:3",
			"-6 US C%sT 1946 -6",
			"-6 Perry C%sT 1964_3_26_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT"
		],
		"America/Indiana/Vevay": [
			"-5:40:16 - LMT 1883_10_18_12_19_44 -5:40:16",
			"-6 US C%sT 1954_3_25_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1973 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Vincennes": [
			"-5:50:7 - LMT 1883_10_18_12_9_53 -5:50:7",
			"-6 US C%sT 1946 -6",
			"-6 Vincennes C%sT 1964_3_26_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_10_4_2 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Winamac": [
			"-5:46:25 - LMT 1883_10_18_12_13_35 -5:46:25",
			"-6 US C%sT 1946 -6",
			"-6 Pulaski C%sT 1961_3_30_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_2_11_2 -6",
			"-5 US E%sT"
		],
		"America/Inuvik": [
			"0 - zzz 1953",
			"-8 NT_YK P%sT 1979_3_29_2 -8",
			"-7 NT_YK M%sT 1980 -7",
			"-7 Canada M%sT"
		],
		"America/Iqaluit": [
			"0 - zzz 1942_7",
			"-5 NT_YK E%sT 1999_9_31_2 -4",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 Canada E%sT"
		],
		"America/Jamaica": [
			"-5:7:12 - LMT 1890 -5:7:12",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 - EST 1974_3_28_2 -5",
			"-5 US E%sT 1984 -5",
			"-5 - EST"
		],
		"America/Juneau": [
			"15:2:19 - LMT 1867_9_18 15:2:19",
			"-8:57:41 - LMT 1900_7_20_12 -8:57:41",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1980_3_27_2 -8",
			"-9 US Y%sT 1980_9_26_2 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Kentucky/Louisville": [
			"-5:43:2 - LMT 1883_10_18_12_16_58 -5:43:2",
			"-6 US C%sT 1921 -6",
			"-6 Louisville C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Louisville C%sT 1961_6_23_2 -5",
			"-5 - EST 1968 -5",
			"-5 US E%sT 1974_0_6_2 -5",
			"-5 - CDT 1974_9_27_2 -5",
			"-5 US E%sT"
		],
		"America/Kentucky/Monticello": [
			"-5:39:24 - LMT 1883_10_18_12_20_36 -5:39:24",
			"-6 US C%sT 1946 -6",
			"-6 - CST 1968 -6",
			"-6 US C%sT 2000_9_29_2 -5",
			"-5 US E%sT"
		],
		"America/La_Paz": [
			"-4:32:36 - LMT 1890 -4:32:36",
			"-4:32:36 - CMT 1931_9_15 -4:32:36",
			"-3:32:36 - BOST 1932_2_21 -3:32:36",
			"-4 - BOT"
		],
		"America/Lima": [
			"-5:8:12 - LMT 1890 -5:8:12",
			"-5:8:36 - LMT 1908_6_28 -5:8:36",
			"-5 Peru PE%sT"
		],
		"America/Los_Angeles": [
			"-7:52:58 - LMT 1883_10_18_12_7_2 -7:52:58",
			"-8 US P%sT 1946 -8",
			"-8 CA P%sT 1967 -8",
			"-8 US P%sT"
		],
		"America/Maceio": [
			"-2:22:52 - LMT 1914 -2:22:52",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1995_9_13 -3",
			"-3 Brazil BR%sT 1996_8_4 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_22 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Managua": [
			"-5:45:8 - LMT 1890 -5:45:8",
			"-5:45:12 - MMT 1934_5_23 -5:45:12",
			"-6 - CST 1973_4 -6",
			"-5 - EST 1975_1_16 -5",
			"-6 Nic C%sT 1992_0_1_4 -6",
			"-5 - EST 1992_8_24 -5",
			"-6 - CST 1993 -6",
			"-5 - EST 1997 -5",
			"-6 Nic C%sT"
		],
		"America/Manaus": [
			"-4:0:4 - LMT 1914 -4:0:4",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 1993_8_28 -4",
			"-4 Brazil AM%sT 1994_8_22 -4",
			"-4 - AMT"
		],
		"America/Martinique": [
			"-4:4:20 - LMT 1890 -4:4:20",
			"-4:4:20 - FFMT 1911_4 -4:4:20",
			"-4 - AST 1980_3_6 -4",
			"-3 - ADT 1980_8_28 -3",
			"-4 - AST"
		],
		"America/Matamoros": [
			"-6:40 - LMT 1921_11_31_23_20 -6:40",
			"-6 - CST 1988 -6",
			"-6 US C%sT 1989 -6",
			"-6 Mexico C%sT 2010 -6",
			"-6 US C%sT"
		],
		"America/Mazatlan": [
			"-7:5:40 - LMT 1921_11_31_23_54_20 -7:5:40",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT"
		],
		"America/Menominee": [
			"-5:50:27 - LMT 1885_8_18_12 -5:50:27",
			"-6 US C%sT 1946 -6",
			"-6 Menominee C%sT 1969_3_27_2 -6",
			"-5 - EST 1973_3_29_2 -5",
			"-6 US C%sT"
		],
		"America/Merida": [
			"-5:58:28 - LMT 1922_0_1_0_1_32 -5:58:28",
			"-6 - CST 1981_11_23 -6",
			"-5 - EST 1982_11_2 -5",
			"-6 Mexico C%sT"
		],
		"America/Metlakatla": [
			"15:13:42 - LMT 1867_9_18 15:13:42",
			"-8:46:18 - LMT 1900_7_20_12 -8:46:18",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-8 - MeST"
		],
		"America/Mexico_City": [
			"-6:36:36 - LMT 1922_0_1_0_23_24 -6:36:36",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 Mexico C%sT 2001_8_30_02 -5",
			"-6 - CST 2002_1_20 -6",
			"-6 Mexico C%sT"
		],
		"America/Miquelon": [
			"-3:44:40 - LMT 1911_4_15 -3:44:40",
			"-4 - AST 1980_4 -4",
			"-3 - PMST 1987 -3",
			"-3 Canada PM%sT"
		],
		"America/Moncton": [
			"-4:19:8 - LMT 1883_11_9 -4:19:8",
			"-5 - EST 1902_5_15 -5",
			"-4 Canada A%sT 1933 -4",
			"-4 Moncton A%sT 1942 -4",
			"-4 Canada A%sT 1946 -4",
			"-4 Moncton A%sT 1973 -4",
			"-4 Canada A%sT 1993 -4",
			"-4 Moncton A%sT 2007 -4",
			"-4 Canada A%sT"
		],
		"America/Monterrey": [
			"-6:41:16 - LMT 1921_11_31_23_18_44 -6:41:16",
			"-6 - CST 1988 -6",
			"-6 US C%sT 1989 -6",
			"-6 Mexico C%sT"
		],
		"America/Montevideo": [
			"-3:44:44 - LMT 1898_5_28 -3:44:44",
			"-3:44:44 - MMT 1920_4_1 -3:44:44",
			"-3:30 Uruguay UY%sT 1942_11_14 -3:30",
			"-3 Uruguay UY%sT"
		],
		"America/Montreal": [
			"-4:54:16 - LMT 1884 -4:54:16",
			"-5 Mont E%sT 1918 -5",
			"-5 Canada E%sT 1919 -5",
			"-5 Mont E%sT 1942_1_9_2 -5",
			"-5 Canada E%sT 1946 -5",
			"-5 Mont E%sT 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Montserrat": [
			"-4:8:52 - LMT 1911_6_1_0_1 -4:8:52",
			"-4 - AST"
		],
		"America/Nassau": [
			"-5:9:30 - LMT 1912_2_2 -5:9:30",
			"-5 Bahamas E%sT 1976 -5",
			"-5 US E%sT"
		],
		"America/New_York": [
			"-4:56:2 - LMT 1883_10_18_12_3_58 -4:56:2",
			"-5 US E%sT 1920 -5",
			"-5 NYC E%sT 1942 -5",
			"-5 US E%sT 1946 -5",
			"-5 NYC E%sT 1967 -5",
			"-5 US E%sT"
		],
		"America/Nipigon": [
			"-5:53:4 - LMT 1895 -5:53:4",
			"-5 Canada E%sT 1940_8_29 -5",
			"-4 - EDT 1942_1_9_2 -5",
			"-5 Canada E%sT"
		],
		"America/Nome": [
			"12:58:21 - LMT 1867_9_18 12:58:21",
			"-11:1:38 - LMT 1900_7_20_12 -11:1:38",
			"-11 - NST 1942 -11",
			"-11 US N%sT 1946 -11",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1969 -11",
			"-11 US B%sT 1983_9_30_2 -10",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Noronha": [
			"-2:9:40 - LMT 1914 -2:9:40",
			"-2 Brazil FN%sT 1990_8_17 -2",
			"-2 - FNT 1999_8_30 -2",
			"-2 Brazil FN%sT 2000_9_15 -1",
			"-2 - FNT 2001_8_13 -2",
			"-2 Brazil FN%sT 2002_9_1 -2",
			"-2 - FNT"
		],
		"America/North_Dakota/Beulah": [
			"-6:47:7 - LMT 1883_10_18_12_12_53 -6:47:7",
			"-7 US M%sT 2010_10_7_2 -6",
			"-6 US C%sT"
		],
		"America/North_Dakota/Center": [
			"-6:45:12 - LMT 1883_10_18_12_14_48 -6:45:12",
			"-7 US M%sT 1992_9_25_02 -6",
			"-6 US C%sT"
		],
		"America/North_Dakota/New_Salem": [
			"-6:45:39 - LMT 1883_10_18_12_14_21 -6:45:39",
			"-7 US M%sT 2003_9_26_02 -6",
			"-6 US C%sT"
		],
		"America/Ojinaga": [
			"-6:57:40 - LMT 1922_0_1_0_2_20 -6:57:40",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1996 -6",
			"-6 Mexico C%sT 1998 -6",
			"-6 - CST 1998_3_5_3 -6",
			"-7 Mexico M%sT 2010 -7",
			"-7 US M%sT"
		],
		"America/Panama": [
			"-5:18:8 - LMT 1890 -5:18:8",
			"-5:19:36 - CMT 1908_3_22 -5:19:36",
			"-5 - EST"
		],
		"America/Pangnirtung": [
			"0 - zzz 1921",
			"-4 NT_YK A%sT 1995_3_2_2 -4",
			"-5 Canada E%sT 1999_9_31_2 -4",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 Canada E%sT"
		],
		"America/Paramaribo": [
			"-3:40:40 - LMT 1911 -3:40:40",
			"-3:40:52 - PMT 1935 -3:40:52",
			"-3:40:36 - PMT 1945_9 -3:40:36",
			"-3:30 - NEGT 1975_10_20 -3:30",
			"-3:30 - SRT 1984_9 -3:30",
			"-3 - SRT"
		],
		"America/Phoenix": [
			"-7:28:18 - LMT 1883_10_18_11_31_42 -7:28:18",
			"-7 US M%sT 1944_0_1_00_1 -6",
			"-7 - MST 1944_3_1_00_1 -7",
			"-7 US M%sT 1944_9_1_00_1 -6",
			"-7 - MST 1967 -7",
			"-7 US M%sT 1968_2_21 -7",
			"-7 - MST"
		],
		"America/Port-au-Prince": [
			"-4:49:20 - LMT 1890 -4:49:20",
			"-4:49 - PPMT 1917_0_24_12 -4:49",
			"-5 Haiti E%sT"
		],
		"America/Port_of_Spain": [
			"-4:6:4 - LMT 1912_2_2 -4:6:4",
			"-4 - AST"
		],
		"America/Porto_Velho": [
			"-4:15:36 - LMT 1914 -4:15:36",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT"
		],
		"America/Puerto_Rico": [
			"-4:24:25 - LMT 1899_2_28_12 -4:24:25",
			"-4 - AST 1942_4_3 -4",
			"-4 US A%sT 1946 -4",
			"-4 - AST"
		],
		"America/Rainy_River": [
			"-6:18:16 - LMT 1895 -6:18:16",
			"-6 Canada C%sT 1940_8_29 -6",
			"-5 - CDT 1942_1_9_2 -6",
			"-6 Canada C%sT"
		],
		"America/Rankin_Inlet": [
			"0 - zzz 1957",
			"-6 NT_YK C%sT 2000_9_29_2 -5",
			"-5 - EST 2001_3_1_3 -5",
			"-6 Canada C%sT"
		],
		"America/Recife": [
			"-2:19:36 - LMT 1914 -2:19:36",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_15 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Regina": [
			"-6:58:36 - LMT 1905_8 -6:58:36",
			"-7 Regina M%sT 1960_3_24_2 -7",
			"-6 - CST"
		],
		"America/Resolute": [
			"0 - zzz 1947_7_31",
			"-6 NT_YK C%sT 2000_9_29_2 -5",
			"-5 - EST 2001_3_1_3 -5",
			"-6 Canada C%sT 2006_9_29_2 -5",
			"-5 - EST 2007_2_11_3 -5",
			"-6 Canada C%sT"
		],
		"America/Rio_Branco": [
			"-4:31:12 - LMT 1914 -4:31:12",
			"-5 Brazil AC%sT 1988_8_12 -5",
			"-5 - ACT 2008_5_24_00 -5",
			"-4 - AMT"
		],
		"America/Santa_Isabel": [
			"-7:39:28 - LMT 1922_0_1_0_20_32 -7:39:28",
			"-7 - MST 1924 -7",
			"-8 - PST 1927_5_10_23 -8",
			"-7 - MST 1930_10_15 -7",
			"-8 - PST 1931_3_1 -8",
			"-7 - PDT 1931_8_30 -7",
			"-8 - PST 1942_3_24 -8",
			"-7 - PWT 1945_7_14_23",
			"-7 - PPT 1945_10_12 -7",
			"-8 - PST 1948_3_5 -8",
			"-7 - PDT 1949_0_14 -7",
			"-8 - PST 1954 -8",
			"-8 CA P%sT 1961 -8",
			"-8 - PST 1976 -8",
			"-8 US P%sT 1996 -8",
			"-8 Mexico P%sT 2001 -8",
			"-8 US P%sT 2002_1_20 -8",
			"-8 Mexico P%sT"
		],
		"America/Santarem": [
			"-3:38:48 - LMT 1914 -3:38:48",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 2008_5_24_00 -4",
			"-3 - BRT"
		],
		"America/Santiago": [
			"-4:42:46 - LMT 1890 -4:42:46",
			"-4:42:46 - SMT 1910 -4:42:46",
			"-5 - CLT 1916_6_1 -5",
			"-4:42:46 - SMT 1918_8_1 -4:42:46",
			"-4 - CLT 1919_6_1 -4",
			"-4:42:46 - SMT 1927_8_1 -4:42:46",
			"-5 Chile CL%sT 1947_4_22 -5",
			"-4 Chile CL%sT"
		],
		"America/Santo_Domingo": [
			"-4:39:36 - LMT 1890 -4:39:36",
			"-4:40 - SDMT 1933_3_1_12 -4:40",
			"-5 DR E%sT 1974_9_27 -5",
			"-4 - AST 2000_9_29_02 -4",
			"-5 US E%sT 2000_11_3_01 -5",
			"-4 - AST"
		],
		"America/Sao_Paulo": [
			"-3:6:28 - LMT 1914 -3:6:28",
			"-3 Brazil BR%sT 1963_9_23_00 -3",
			"-2 - BRST 1964 -2",
			"-3 Brazil BR%sT"
		],
		"America/Scoresbysund": [
			"-1:27:52 - LMT 1916_6_28 -1:27:52",
			"-2 - CGT 1980_3_6_2 -2",
			"-2 C-Eur CG%sT 1981_2_29 -2",
			"-1 EU EG%sT"
		],
		"America/Sitka": [
			"14:58:47 - LMT 1867_9_18 14:58:47",
			"-9:1:13 - LMT 1900_7_20_12 -9:1:13",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/St_Johns": [
			"-3:30:52 - LMT 1884 -3:30:52",
			"-3:30:52 StJohns N%sT 1918 -3:30:52",
			"-3:30:52 Canada N%sT 1919 -3:30:52",
			"-3:30:52 StJohns N%sT 1935_2_30 -3:30:52",
			"-3:30 StJohns N%sT 1942_4_11 -3:30",
			"-3:30 Canada N%sT 1946 -3:30",
			"-3:30 StJohns N%sT 2011_10 -2:30",
			"-3:30 Canada N%sT"
		],
		"America/St_Kitts": [
			"-4:10:52 - LMT 1912_2_2 -4:10:52",
			"-4 - AST"
		],
		"America/St_Lucia": [
			"-4:4 - LMT 1890 -4:4",
			"-4:4 - CMT 1912 -4:4",
			"-4 - AST"
		],
		"America/St_Thomas": [
			"-4:19:44 - LMT 1911_6 -4:19:44",
			"-4 - AST"
		],
		"America/St_Vincent": [
			"-4:4:56 - LMT 1890 -4:4:56",
			"-4:4:56 - KMT 1912 -4:4:56",
			"-4 - AST"
		],
		"America/Swift_Current": [
			"-7:11:20 - LMT 1905_8 -7:11:20",
			"-7 Canada M%sT 1946_3_28_2 -7",
			"-7 Regina M%sT 1950 -7",
			"-7 Swift M%sT 1972_3_30_2 -7",
			"-6 - CST"
		],
		"America/Tegucigalpa": [
			"-5:48:52 - LMT 1921_3 -5:48:52",
			"-6 Hond C%sT"
		],
		"America/Thule": [
			"-4:35:8 - LMT 1916_6_28 -4:35:8",
			"-4 Thule A%sT"
		],
		"America/Thunder_Bay": [
			"-5:57 - LMT 1895 -5:57",
			"-6 - CST 1910 -6",
			"-5 - EST 1942 -5",
			"-5 Canada E%sT 1970 -5",
			"-5 Mont E%sT 1973 -5",
			"-5 - EST 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Tijuana": [
			"-7:48:4 - LMT 1922_0_1_0_11_56 -7:48:4",
			"-7 - MST 1924 -7",
			"-8 - PST 1927_5_10_23 -8",
			"-7 - MST 1930_10_15 -7",
			"-8 - PST 1931_3_1 -8",
			"-7 - PDT 1931_8_30 -7",
			"-8 - PST 1942_3_24 -8",
			"-7 - PWT 1945_7_14_23",
			"-7 - PPT 1945_10_12 -7",
			"-8 - PST 1948_3_5 -8",
			"-7 - PDT 1949_0_14 -7",
			"-8 - PST 1954 -8",
			"-8 CA P%sT 1961 -8",
			"-8 - PST 1976 -8",
			"-8 US P%sT 1996 -8",
			"-8 Mexico P%sT 2001 -8",
			"-8 US P%sT 2002_1_20 -8",
			"-8 Mexico P%sT 2010 -8",
			"-8 US P%sT"
		],
		"America/Toronto": [
			"-5:17:32 - LMT 1895 -5:17:32",
			"-5 Canada E%sT 1919 -5",
			"-5 Toronto E%sT 1942_1_9_2 -5",
			"-5 Canada E%sT 1946 -5",
			"-5 Toronto E%sT 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Tortola": [
			"-4:18:28 - LMT 1911_6 -4:18:28",
			"-4 - AST"
		],
		"America/Vancouver": [
			"-8:12:28 - LMT 1884 -8:12:28",
			"-8 Vanc P%sT 1987 -8",
			"-8 Canada P%sT"
		],
		"America/Whitehorse": [
			"-9:0:12 - LMT 1900_7_20 -9:0:12",
			"-9 NT_YK Y%sT 1966_6_1_2 -9",
			"-8 NT_YK P%sT 1980 -8",
			"-8 Canada P%sT"
		],
		"America/Winnipeg": [
			"-6:28:36 - LMT 1887_6_16 -6:28:36",
			"-6 Winn C%sT 2006 -6",
			"-6 Canada C%sT"
		],
		"America/Yakutat": [
			"14:41:5 - LMT 1867_9_18 14:41:5",
			"-9:18:55 - LMT 1900_7_20_12 -9:18:55",
			"-9 - YST 1942 -9",
			"-9 US Y%sT 1946 -9",
			"-9 - YST 1969 -9",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Yellowknife": [
			"0 - zzz 1935",
			"-7 NT_YK M%sT 1980 -7",
			"-7 Canada M%sT"
		],
		"Antarctica/Casey": [
			"0 - zzz 1969",
			"8 - WST 2009_9_18_2 8",
			"11 - CAST 2010_2_5_2 11",
			"8 - WST 2011_9_28_2 8",
			"11 - CAST 2012_1_21_17",
			"8 - WST"
		],
		"Antarctica/Davis": [
			"0 - zzz 1957_0_13",
			"7 - DAVT 1964_10 7",
			"0 - zzz 1969_1",
			"7 - DAVT 2009_9_18_2 7",
			"5 - DAVT 2010_2_10_20",
			"7 - DAVT 2011_9_28_2 7",
			"5 - DAVT 2012_1_21_20",
			"7 - DAVT"
		],
		"Antarctica/DumontDUrville": [
			"0 - zzz 1947",
			"10 - PMT 1952_0_14 10",
			"0 - zzz 1956_10",
			"10 - DDUT"
		],
		"Antarctica/Macquarie": [
			"0 - zzz 1899_10",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1919_3 10",
			"0 - zzz 1948_2_25",
			"10 Aus EST 1967 10",
			"10 AT EST 2010_3_4_3 11",
			"11 - MIST"
		],
		"Antarctica/Mawson": [
			"0 - zzz 1954_1_13",
			"6 - MAWT 2009_9_18_2 6",
			"5 - MAWT"
		],
		"Antarctica/McMurdo": [
			"0 - zzz 1956",
			"12 NZAQ NZ%sT"
		],
		"Antarctica/Palmer": [
			"0 - zzz 1965",
			"-4 ArgAQ AR%sT 1969_9_5 -4",
			"-3 ArgAQ AR%sT 1982_4 -3",
			"-4 ChileAQ CL%sT"
		],
		"Antarctica/Rothera": [
			"0 - zzz 1976_11_1",
			"-3 - ROTT"
		],
		"Antarctica/Syowa": [
			"0 - zzz 1957_0_29",
			"3 - SYOT"
		],
		"Antarctica/Vostok": [
			"0 - zzz 1957_11_16",
			"6 - VOST"
		],
		"Asia/Aden": [
			"2:59:54 - LMT 1950 2:59:54",
			"3 - AST"
		],
		"Asia/Almaty": [
			"5:7:48 - LMT 1924_4_2 5:7:48",
			"5 - ALMT 1930_5_21 5",
			"6 RussiaAsia ALM%sT 1991 6",
			"6 - ALMT 1992 6",
			"6 RussiaAsia ALM%sT 2005_2_15 6",
			"6 - ALMT"
		],
		"Asia/Amman": [
			"2:23:44 - LMT 1931 2:23:44",
			"2 Jordan EE%sT"
		],
		"Asia/Anadyr": [
			"11:49:56 - LMT 1924_4_2 11:49:56",
			"12 - ANAT 1930_5_21 12",
			"13 Russia ANA%sT 1982_3_1_0 13",
			"12 Russia ANA%sT 1991_2_31_2 12",
			"11 Russia ANA%sT 1992_0_19_2 11",
			"12 Russia ANA%sT 2010_2_28_2 12",
			"11 Russia ANA%sT 2011_2_27_2 11",
			"12 - ANAT"
		],
		"Asia/Aqtau": [
			"3:21:4 - LMT 1924_4_2 3:21:4",
			"4 - FORT 1930_5_21 4",
			"5 - FORT 1963 5",
			"5 - SHET 1981_9_1 5",
			"6 - SHET 1982_3_1 6",
			"5 RussiaAsia SHE%sT 1991 5",
			"5 - SHET 1991_11_16 5",
			"5 RussiaAsia AQT%sT 1995_2_26_2 5",
			"4 RussiaAsia AQT%sT 2005_2_15 4",
			"5 - AQTT"
		],
		"Asia/Aqtobe": [
			"3:48:40 - LMT 1924_4_2 3:48:40",
			"4 - AKTT 1930_5_21 4",
			"5 - AKTT 1981_3_1 5",
			"6 - AKTST 1981_9_1 6",
			"6 - AKTT 1982_3_1 6",
			"5 RussiaAsia AKT%sT 1991 5",
			"5 - AKTT 1991_11_16 5",
			"5 RussiaAsia AQT%sT 2005_2_15 5",
			"5 - AQTT"
		],
		"Asia/Ashgabat": [
			"3:53:32 - LMT 1924_4_2 3:53:32",
			"4 - ASHT 1930_5_21 4",
			"5 RussiaAsia ASH%sT 1991_2_31_2 5",
			"4 RussiaAsia ASH%sT 1991_9_27 4",
			"4 RussiaAsia TM%sT 1992_0_19_2 4",
			"5 - TMT"
		],
		"Asia/Baghdad": [
			"2:57:40 - LMT 1890 2:57:40",
			"2:57:36 - BMT 1918 2:57:36",
			"3 - AST 1982_4 3",
			"3 Iraq A%sT"
		],
		"Asia/Bahrain": [
			"3:22:20 - LMT 1920 3:22:20",
			"4 - GST 1972_5 4",
			"3 - AST"
		],
		"Asia/Baku": [
			"3:19:24 - LMT 1924_4_2 3:19:24",
			"3 - BAKT 1957_2 3",
			"4 RussiaAsia BAK%sT 1991_2_31_2 4",
			"4 - BAKST 1991_7_30 4",
			"3 RussiaAsia AZ%sT 1992_8_26_23 4",
			"4 - AZT 1996 4",
			"4 EUAsia AZ%sT 1997 4",
			"4 Azer AZ%sT"
		],
		"Asia/Bangkok": [
			"6:42:4 - LMT 1880 6:42:4",
			"6:42:4 - BMT 1920_3 6:42:4",
			"7 - ICT"
		],
		"Asia/Beirut": [
			"2:22 - LMT 1880 2:22",
			"2 Lebanon EE%sT"
		],
		"Asia/Bishkek": [
			"4:58:24 - LMT 1924_4_2 4:58:24",
			"5 - FRUT 1930_5_21 5",
			"6 RussiaAsia FRU%sT 1991_2_31_2 6",
			"6 - FRUST 1991_7_31_2 6",
			"5 Kyrgyz KG%sT 2005_7_12 6",
			"6 - KGT"
		],
		"Asia/Brunei": [
			"7:39:40 - LMT 1926_2 7:39:40",
			"7:30 - BNT 1933 7:30",
			"8 - BNT"
		],
		"Asia/Choibalsan": [
			"7:38 - LMT 1905_7 7:38",
			"7 - ULAT 1978 7",
			"8 - ULAT 1983_3 8",
			"9 Mongol CHO%sT 2008_2_31 9",
			"8 Mongol CHO%sT"
		],
		"Asia/Chongqing": [
			"7:6:20 - LMT 1928 7:6:20",
			"7 - LONT 1980_4 7",
			"8 PRC C%sT"
		],
		"Asia/Colombo": [
			"5:19:24 - LMT 1880 5:19:24",
			"5:19:32 - MMT 1906 5:19:32",
			"5:30 - IST 1942_0_5 5:30",
			"6 - IHST 1942_8 6",
			"6:30 - IST 1945_9_16_2 6:30",
			"5:30 - IST 1996_4_25_0 5:30",
			"6:30 - LKT 1996_9_26_0_30 6:30",
			"6 - LKT 2006_3_15_0_30 6",
			"5:30 - IST"
		],
		"Asia/Damascus": [
			"2:25:12 - LMT 1920 2:25:12",
			"2 Syria EE%sT"
		],
		"Asia/Dhaka": [
			"6:1:40 - LMT 1890 6:1:40",
			"5:53:20 - HMT 1941_9 5:53:20",
			"6:30 - BURT 1942_4_15 6:30",
			"5:30 - IST 1942_8 5:30",
			"6:30 - BURT 1951_8_30 6:30",
			"6 - DACT 1971_2_26 6",
			"6 - BDT 2009 6",
			"6 Dhaka BD%sT"
		],
		"Asia/Dili": [
			"8:22:20 - LMT 1912 8:22:20",
			"8 - TLT 1942_1_21_23 8",
			"9 - JST 1945_8_23 9",
			"9 - TLT 1976_4_3 9",
			"8 - CIT 2000_8_17_00 8",
			"9 - TLT"
		],
		"Asia/Dubai": [
			"3:41:12 - LMT 1920 3:41:12",
			"4 - GST"
		],
		"Asia/Dushanbe": [
			"4:35:12 - LMT 1924_4_2 4:35:12",
			"5 - DUST 1930_5_21 5",
			"6 RussiaAsia DUS%sT 1991_2_31_2 6",
			"6 - DUSST 1991_8_9_2 5",
			"5 - TJT"
		],
		"Asia/Gaza": [
			"2:17:52 - LMT 1900_9 2:17:52",
			"2 Zion EET 1948_4_15 2",
			"2 EgyptAsia EE%sT 1967_5_5 3",
			"2 Zion I%sT 1996 2",
			"2 Jordan EE%sT 1999 2",
			"2 Palestine EE%sT 2008_7_29_0 3",
			"2 - EET 2008_8 2",
			"2 Palestine EE%sT 2010 2",
			"2 - EET 2010_2_27_0_1 2",
			"2 Palestine EE%sT 2011_7_1 3",
			"2 - EET 2012 2",
			"2 Palestine EE%sT"
		],
		"Asia/Harbin": [
			"8:26:44 - LMT 1928 8:26:44",
			"8:30 - CHAT 1932_2 8:30",
			"8 - CST 1940 8",
			"9 - CHAT 1966_4 9",
			"8:30 - CHAT 1980_4 8:30",
			"8 PRC C%sT"
		],
		"Asia/Hebron": [
			"2:20:23 - LMT 1900_9 2:20:23",
			"2 Zion EET 1948_4_15 2",
			"2 EgyptAsia EE%sT 1967_5_5 3",
			"2 Zion I%sT 1996 2",
			"2 Jordan EE%sT 1999 2",
			"2 Palestine EE%sT"
		],
		"Asia/Ho_Chi_Minh": [
			"7:6:40 - LMT 1906_5_9 7:6:40",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Hong_Kong": [
			"7:36:42 - LMT 1904_9_30 7:36:42",
			"8 HK HK%sT 1941_11_25 8",
			"9 - JST 1945_8_15 9",
			"8 HK HK%sT"
		],
		"Asia/Hovd": [
			"6:6:36 - LMT 1905_7 6:6:36",
			"6 - HOVT 1978 6",
			"7 Mongol HOV%sT"
		],
		"Asia/Irkutsk": [
			"6:57:20 - LMT 1880 6:57:20",
			"6:57:20 - IMT 1920_0_25 6:57:20",
			"7 - IRKT 1930_5_21 7",
			"8 Russia IRK%sT 1991_2_31_2 8",
			"7 Russia IRK%sT 1992_0_19_2 7",
			"8 Russia IRK%sT 2011_2_27_2 8",
			"9 - IRKT"
		],
		"Asia/Jakarta": [
			"7:7:12 - LMT 1867_7_10 7:7:12",
			"7:7:12 - JMT 1923_11_31_23_47_12 7:7:12",
			"7:20 - JAVT 1932_10 7:20",
			"7:30 - WIT 1942_2_23 7:30",
			"9 - JST 1945_8_23 9",
			"7:30 - WIT 1948_4 7:30",
			"8 - WIT 1950_4 8",
			"7:30 - WIT 1964 7:30",
			"7 - WIT"
		],
		"Asia/Jayapura": [
			"9:22:48 - LMT 1932_10 9:22:48",
			"9 - EIT 1944_8_1 9",
			"9:30 - CST 1964 9:30",
			"9 - EIT"
		],
		"Asia/Jerusalem": [
			"2:20:56 - LMT 1880 2:20:56",
			"2:20:40 - JMT 1918 2:20:40",
			"2 Zion I%sT"
		],
		"Asia/Kabul": [
			"4:36:48 - LMT 1890 4:36:48",
			"4 - AFT 1945 4",
			"4:30 - AFT"
		],
		"Asia/Kamchatka": [
			"10:34:36 - LMT 1922_10_10 10:34:36",
			"11 - PETT 1930_5_21 11",
			"12 Russia PET%sT 1991_2_31_2 12",
			"11 Russia PET%sT 1992_0_19_2 11",
			"12 Russia PET%sT 2010_2_28_2 12",
			"11 Russia PET%sT 2011_2_27_2 11",
			"12 - PETT"
		],
		"Asia/Karachi": [
			"4:28:12 - LMT 1907 4:28:12",
			"5:30 - IST 1942_8 5:30",
			"6:30 - IST 1945_9_15 6:30",
			"5:30 - IST 1951_8_30 5:30",
			"5 - KART 1971_2_26 5",
			"5 Pakistan PK%sT"
		],
		"Asia/Kashgar": [
			"5:3:56 - LMT 1928 5:3:56",
			"5:30 - KAST 1940 5:30",
			"5 - KAST 1980_4 5",
			"8 PRC C%sT"
		],
		"Asia/Kathmandu": [
			"5:41:16 - LMT 1920 5:41:16",
			"5:30 - IST 1986 5:30",
			"5:45 - NPT"
		],
		"Asia/Khandyga": [
			"9:2:13 - LMT 1919_11_15 9:2:13",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAK%sT 1991_2_31_2 9",
			"8 Russia YAK%sT 1992_0_19_2 8",
			"9 Russia YAK%sT 2004 9",
			"10 Russia VLA%sT 2011_2_27_2 10",
			"11 - VLAT 2011_8_13_0 11",
			"10 - YAKT"
		],
		"Asia/Kolkata": [
			"5:53:28 - LMT 1880 5:53:28",
			"5:53:20 - HMT 1941_9 5:53:20",
			"6:30 - BURT 1942_4_15 6:30",
			"5:30 - IST 1942_8 5:30",
			"6:30 - IST 1945_9_15 6:30",
			"5:30 - IST"
		],
		"Asia/Krasnoyarsk": [
			"6:11:20 - LMT 1920_0_6 6:11:20",
			"6 - KRAT 1930_5_21 6",
			"7 Russia KRA%sT 1991_2_31_2 7",
			"6 Russia KRA%sT 1992_0_19_2 6",
			"7 Russia KRA%sT 2011_2_27_2 7",
			"8 - KRAT"
		],
		"Asia/Kuala_Lumpur": [
			"6:46:46 - LMT 1901_0_1 6:46:46",
			"6:55:25 - SMT 1905_5_1 6:55:25",
			"7 - MALT 1933_0_1 7",
			"7:20 - MALST 1936_0_1 7:20",
			"7:20 - MALT 1941_8_1 7:20",
			"7:30 - MALT 1942_1_16 7:30",
			"9 - JST 1945_8_12 9",
			"7:30 - MALT 1982_0_1 7:30",
			"8 - MYT"
		],
		"Asia/Kuching": [
			"7:21:20 - LMT 1926_2 7:21:20",
			"7:30 - BORT 1933 7:30",
			"8 NBorneo BOR%sT 1942_1_16 8",
			"9 - JST 1945_8_12 9",
			"8 - BORT 1982_0_1 8",
			"8 - MYT"
		],
		"Asia/Kuwait": [
			"3:11:56 - LMT 1950 3:11:56",
			"3 - AST"
		],
		"Asia/Macau": [
			"7:34:20 - LMT 1912 7:34:20",
			"8 Macau MO%sT 1999_11_20 8",
			"8 PRC C%sT"
		],
		"Asia/Magadan": [
			"10:3:12 - LMT 1924_4_2 10:3:12",
			"10 - MAGT 1930_5_21 10",
			"11 Russia MAG%sT 1991_2_31_2 11",
			"10 Russia MAG%sT 1992_0_19_2 10",
			"11 Russia MAG%sT 2011_2_27_2 11",
			"12 - MAGT"
		],
		"Asia/Makassar": [
			"7:57:36 - LMT 1920 7:57:36",
			"7:57:36 - MMT 1932_10 7:57:36",
			"8 - CIT 1942_1_9 8",
			"9 - JST 1945_8_23 9",
			"8 - CIT"
		],
		"Asia/Manila": [
			"-15:56 - LMT 1844_11_31 -15:56",
			"8:4 - LMT 1899_4_11 8:4",
			"8 Phil PH%sT 1942_4 8",
			"9 - JST 1944_10 9",
			"8 Phil PH%sT"
		],
		"Asia/Muscat": [
			"3:54:24 - LMT 1920 3:54:24",
			"4 - GST"
		],
		"Asia/Nicosia": [
			"2:13:28 - LMT 1921_10_14 2:13:28",
			"2 Cyprus EE%sT 1998_8 3",
			"2 EUAsia EE%sT"
		],
		"Asia/Novokuznetsk": [
			"5:48:48 - NMT 1920_0_6 5:48:48",
			"6 - KRAT 1930_5_21 6",
			"7 Russia KRA%sT 1991_2_31_2 7",
			"6 Russia KRA%sT 1992_0_19_2 6",
			"7 Russia KRA%sT 2010_2_28_2 7",
			"6 Russia NOV%sT 2011_2_27_2 6",
			"7 - NOVT"
		],
		"Asia/Novosibirsk": [
			"5:31:40 - LMT 1919_11_14_6 5:31:40",
			"6 - NOVT 1930_5_21 6",
			"7 Russia NOV%sT 1991_2_31_2 7",
			"6 Russia NOV%sT 1992_0_19_2 6",
			"7 Russia NOV%sT 1993_4_23 8",
			"6 Russia NOV%sT 2011_2_27_2 6",
			"7 - NOVT"
		],
		"Asia/Omsk": [
			"4:53:36 - LMT 1919_10_14 4:53:36",
			"5 - OMST 1930_5_21 5",
			"6 Russia OMS%sT 1991_2_31_2 6",
			"5 Russia OMS%sT 1992_0_19_2 5",
			"6 Russia OMS%sT 2011_2_27_2 6",
			"7 - OMST"
		],
		"Asia/Oral": [
			"3:25:24 - LMT 1924_4_2 3:25:24",
			"4 - URAT 1930_5_21 4",
			"5 - URAT 1981_3_1 5",
			"6 - URAST 1981_9_1 6",
			"6 - URAT 1982_3_1 6",
			"5 RussiaAsia URA%sT 1989_2_26_2 5",
			"4 RussiaAsia URA%sT 1991 4",
			"4 - URAT 1991_11_16 4",
			"4 RussiaAsia ORA%sT 2005_2_15 4",
			"5 - ORAT"
		],
		"Asia/Phnom_Penh": [
			"6:59:40 - LMT 1906_5_9 6:59:40",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Pontianak": [
			"7:17:20 - LMT 1908_4 7:17:20",
			"7:17:20 - PMT 1932_10 7:17:20",
			"7:30 - WIT 1942_0_29 7:30",
			"9 - JST 1945_8_23 9",
			"7:30 - WIT 1948_4 7:30",
			"8 - WIT 1950_4 8",
			"7:30 - WIT 1964 7:30",
			"8 - CIT 1988_0_1 8",
			"7 - WIT"
		],
		"Asia/Pyongyang": [
			"8:23 - LMT 1890 8:23",
			"8:30 - KST 1904_11 8:30",
			"9 - KST 1928 9",
			"8:30 - KST 1932 8:30",
			"9 - KST 1954_2_21 9",
			"8 - KST 1961_7_10 8",
			"9 - KST"
		],
		"Asia/Qatar": [
			"3:26:8 - LMT 1920 3:26:8",
			"4 - GST 1972_5 4",
			"3 - AST"
		],
		"Asia/Qyzylorda": [
			"4:21:52 - LMT 1924_4_2 4:21:52",
			"4 - KIZT 1930_5_21 4",
			"5 - KIZT 1981_3_1 5",
			"6 - KIZST 1981_9_1 6",
			"6 - KIZT 1982_3_1 6",
			"5 RussiaAsia KIZ%sT 1991 5",
			"5 - KIZT 1991_11_16 5",
			"5 - QYZT 1992_0_19_2 5",
			"6 RussiaAsia QYZ%sT 2005_2_15 6",
			"6 - QYZT"
		],
		"Asia/Rangoon": [
			"6:24:40 - LMT 1880 6:24:40",
			"6:24:40 - RMT 1920 6:24:40",
			"6:30 - BURT 1942_4 6:30",
			"9 - JST 1945_4_3 9",
			"6:30 - MMT"
		],
		"Asia/Riyadh": [
			"3:6:52 - LMT 1950 3:6:52",
			"3 - AST"
		],
		"Asia/Sakhalin": [
			"9:30:48 - LMT 1905_7_23 9:30:48",
			"9 - CJT 1938 9",
			"9 - JST 1945_7_25 9",
			"11 Russia SAK%sT 1991_2_31_2 11",
			"10 Russia SAK%sT 1992_0_19_2 10",
			"11 Russia SAK%sT 1997_2_30_2 11",
			"10 Russia SAK%sT 2011_2_27_2 10",
			"11 - SAKT"
		],
		"Asia/Samarkand": [
			"4:27:12 - LMT 1924_4_2 4:27:12",
			"4 - SAMT 1930_5_21 4",
			"5 - SAMT 1981_3_1 5",
			"6 - SAMST 1981_9_1 6",
			"6 - TAST 1982_3_1 6",
			"5 RussiaAsia SAM%sT 1991_8_1 6",
			"5 RussiaAsia UZ%sT 1992 5",
			"5 - UZT"
		],
		"Asia/Seoul": [
			"8:27:52 - LMT 1890 8:27:52",
			"8:30 - KST 1904_11 8:30",
			"9 - KST 1928 9",
			"8:30 - KST 1932 8:30",
			"9 - KST 1954_2_21 9",
			"8 ROK K%sT 1961_7_10 8",
			"8:30 - KST 1968_9 8:30",
			"9 ROK K%sT"
		],
		"Asia/Shanghai": [
			"8:5:57 - LMT 1928 8:5:57",
			"8 Shang C%sT 1949 8",
			"8 PRC C%sT"
		],
		"Asia/Singapore": [
			"6:55:25 - LMT 1901_0_1 6:55:25",
			"6:55:25 - SMT 1905_5_1 6:55:25",
			"7 - MALT 1933_0_1 7",
			"7:20 - MALST 1936_0_1 7:20",
			"7:20 - MALT 1941_8_1 7:20",
			"7:30 - MALT 1942_1_16 7:30",
			"9 - JST 1945_8_12 9",
			"7:30 - MALT 1965_7_9 7:30",
			"7:30 - SGT 1982_0_1 7:30",
			"8 - SGT"
		],
		"Asia/Taipei": [
			"8:6 - LMT 1896 8:6",
			"8 Taiwan C%sT"
		],
		"Asia/Tashkent": [
			"4:37:12 - LMT 1924_4_2 4:37:12",
			"5 - TAST 1930_5_21 5",
			"6 RussiaAsia TAS%sT 1991_2_31_2 6",
			"5 RussiaAsia TAS%sT 1991_8_1 6",
			"5 RussiaAsia UZ%sT 1992 5",
			"5 - UZT"
		],
		"Asia/Tbilisi": [
			"2:59:16 - LMT 1880 2:59:16",
			"2:59:16 - TBMT 1924_4_2 2:59:16",
			"3 - TBIT 1957_2 3",
			"4 RussiaAsia TBI%sT 1991_2_31_2 4",
			"4 - TBIST 1991_3_9 4",
			"3 RussiaAsia GE%sT 1992 3",
			"3 E-EurAsia GE%sT 1994_8_25 4",
			"4 E-EurAsia GE%sT 1996_9_27 5",
			"5 - GEST 1997_2_30 5",
			"4 E-EurAsia GE%sT 2004_5_27 5",
			"3 RussiaAsia GE%sT 2005_2_27_2 3",
			"4 - GET"
		],
		"Asia/Tehran": [
			"3:25:44 - LMT 1916 3:25:44",
			"3:25:44 - TMT 1946 3:25:44",
			"3:30 - IRST 1977_10 3:30",
			"4 Iran IR%sT 1979 4",
			"3:30 Iran IR%sT"
		],
		"Asia/Thimphu": [
			"5:58:36 - LMT 1947_7_15 5:58:36",
			"5:30 - IST 1987_9 5:30",
			"6 - BTT"
		],
		"Asia/Tokyo": [
			"9:18:59 - LMT 1887_11_31_15",
			"9 - JST 1896 9",
			"9 - CJT 1938 9",
			"9 Japan J%sT"
		],
		"Asia/Ulaanbaatar": [
			"7:7:32 - LMT 1905_7 7:7:32",
			"7 - ULAT 1978 7",
			"8 Mongol ULA%sT"
		],
		"Asia/Urumqi": [
			"5:50:20 - LMT 1928 5:50:20",
			"6 - URUT 1980_4 6",
			"8 PRC C%sT"
		],
		"Asia/Ust-Nera": [
			"9:32:54 - LMT 1919_11_15 9:32:54",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAKT 1981_3_1 9",
			"11 Russia MAG%sT 1991_2_31_2 11",
			"10 Russia MAG%sT 1992_0_19_2 10",
			"11 Russia MAG%sT 2011_2_27_2 11",
			"12 - MAGT 2011_8_13_0 12",
			"11 - VLAT"
		],
		"Asia/Vientiane": [
			"6:50:24 - LMT 1906_5_9 6:50:24",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Vladivostok": [
			"8:47:44 - LMT 1922_10_15 8:47:44",
			"9 - VLAT 1930_5_21 9",
			"10 Russia VLA%sT 1991_2_31_2 10",
			"9 Russia VLA%sST 1992_0_19_2 9",
			"10 Russia VLA%sT 2011_2_27_2 10",
			"11 - VLAT"
		],
		"Asia/Yakutsk": [
			"8:38:40 - LMT 1919_11_15 8:38:40",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAK%sT 1991_2_31_2 9",
			"8 Russia YAK%sT 1992_0_19_2 8",
			"9 Russia YAK%sT 2011_2_27_2 9",
			"10 - YAKT"
		],
		"Asia/Yekaterinburg": [
			"4:2:24 - LMT 1919_6_15_4 4:2:24",
			"4 - SVET 1930_5_21 4",
			"5 Russia SVE%sT 1991_2_31_2 5",
			"4 Russia SVE%sT 1992_0_19_2 4",
			"5 Russia YEK%sT 2011_2_27_2 5",
			"6 - YEKT"
		],
		"Asia/Yerevan": [
			"2:58 - LMT 1924_4_2 2:58",
			"3 - YERT 1957_2 3",
			"4 RussiaAsia YER%sT 1991_2_31_2 4",
			"4 - YERST 1991_8_23 4",
			"3 RussiaAsia AM%sT 1995_8_24_2 3",
			"4 - AMT 1997 4",
			"4 RussiaAsia AM%sT 2012_2_25_2 4",
			"4 - AMT"
		],
		"Atlantic/Azores": [
			"-1:42:40 - LMT 1884 -1:42:40",
			"-1:54:32 - HMT 1911_4_24 -1:54:32",
			"-2 Port AZO%sT 1966_3_3_2 -2",
			"-1 Port AZO%sT 1983_8_25_1 -1",
			"-1 W-Eur AZO%sT 1992_8_27_1 -1",
			"0 EU WE%sT 1993_2_28_1",
			"-1 EU AZO%sT"
		],
		"Atlantic/Bermuda": [
			"-4:19:18 - LMT 1930_0_1_2 -4:19:18",
			"-4 - AST 1974_3_28_2 -4",
			"-4 Bahamas A%sT 1976 -4",
			"-4 US A%sT"
		],
		"Atlantic/Canary": [
			"-1:1:36 - LMT 1922_2 -1:1:36",
			"-1 - CANT 1946_8_30_1 -1",
			"0 - WET 1980_3_6_0",
			"1 - WEST 1980_8_28_0",
			"0 EU WE%sT"
		],
		"Atlantic/Cape_Verde": [
			"-1:34:4 - LMT 1907 -1:34:4",
			"-2 - CVT 1942_8 -2",
			"-1 - CVST 1945_9_15 -1",
			"-2 - CVT 1975_10_25_2 -2",
			"-1 - CVT"
		],
		"Atlantic/Faroe": [
			"-0:27:4 - LMT 1908_0_11 -0:27:4",
			"0 - WET 1981",
			"0 EU WE%sT"
		],
		"Atlantic/Madeira": [
			"-1:7:36 - LMT 1884 -1:7:36",
			"-1:7:36 - FMT 1911_4_24 -1:7:36",
			"-1 Port MAD%sT 1966_3_3_2 -1",
			"0 Port WE%sT 1983_8_25_1",
			"0 EU WE%sT"
		],
		"Atlantic/Reykjavik": [
			"-1:27:24 - LMT 1837 -1:27:24",
			"-1:27:48 - RMT 1908 -1:27:48",
			"-1 Iceland IS%sT 1968_3_7_1 -1",
			"0 - GMT"
		],
		"Atlantic/South_Georgia": [
			"-2:26:8 - LMT 1890 -2:26:8",
			"-2 - GST"
		],
		"Atlantic/St_Helena": [
			"-0:22:48 - LMT 1890 -0:22:48",
			"-0:22:48 - JMT 1951 -0:22:48",
			"0 - GMT"
		],
		"Atlantic/Stanley": [
			"-3:51:24 - LMT 1890 -3:51:24",
			"-3:51:24 - SMT 1912_2_12 -3:51:24",
			"-4 Falk FK%sT 1983_4 -4",
			"-3 Falk FK%sT 1985_8_15 -3",
			"-4 Falk FK%sT 2010_8_5_02 -4",
			"-3 - FKST"
		],
		"Australia/Adelaide": [
			"9:14:20 - LMT 1895_1 9:14:20",
			"9 - CST 1899_4 9",
			"9:30 Aus CST 1971 9:30",
			"9:30 AS CST"
		],
		"Australia/Brisbane": [
			"10:12:8 - LMT 1895 10:12:8",
			"10 Aus EST 1971 10",
			"10 AQ EST"
		],
		"Australia/Broken_Hill": [
			"9:25:48 - LMT 1895_1 9:25:48",
			"10 - EST 1896_7_23 10",
			"9 - CST 1899_4 9",
			"9:30 Aus CST 1971 9:30",
			"9:30 AN CST 2000 10:30",
			"9:30 AS CST"
		],
		"Australia/Currie": [
			"9:35:28 - LMT 1895_8 9:35:28",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1971_6 10",
			"10 AT EST"
		],
		"Australia/Darwin": [
			"8:43:20 - LMT 1895_1 8:43:20",
			"9 - CST 1899_4 9",
			"9:30 Aus CST"
		],
		"Australia/Eucla": [
			"8:35:28 - LMT 1895_11 8:35:28",
			"8:45 Aus CWST 1943_6 8:45",
			"8:45 AW CWST"
		],
		"Australia/Hobart": [
			"9:49:16 - LMT 1895_8 9:49:16",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1967 10",
			"10 AT EST"
		],
		"Australia/Lindeman": [
			"9:55:56 - LMT 1895 9:55:56",
			"10 Aus EST 1971 10",
			"10 AQ EST 1992_6 10",
			"10 Holiday EST"
		],
		"Australia/Lord_Howe": [
			"10:36:20 - LMT 1895_1 10:36:20",
			"10 - EST 1981_2 10",
			"10:30 LH LHST"
		],
		"Australia/Melbourne": [
			"9:39:52 - LMT 1895_1 9:39:52",
			"10 Aus EST 1971 10",
			"10 AV EST"
		],
		"Australia/Perth": [
			"7:43:24 - LMT 1895_11 7:43:24",
			"8 Aus WST 1943_6 8",
			"8 AW WST"
		],
		"Australia/Sydney": [
			"10:4:52 - LMT 1895_1 10:4:52",
			"10 Aus EST 1971 10",
			"10 AN EST"
		],
		"CET": [
			"1 C-Eur CE%sT"
		],
		"CST6CDT": [
			"-6 US C%sT"
		],
		"EET": [
			"2 EU EE%sT"
		],
		"EST": [
			"-5 - EST"
		],
		"EST5EDT": [
			"-5 US E%sT"
		],
		"Europe/Amsterdam": [
			"0:19:32 - LMT 1835 0:19:32",
			"0:19:32 Neth %s 1937_6_1 1:19:32",
			"0:20 Neth NE%sT 1940_4_16_0 0:20",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Neth CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Andorra": [
			"0:6:4 - LMT 1901 0:6:4",
			"0 - WET 1946_8_30",
			"1 - CET 1985_2_31_2 1",
			"1 EU CE%sT"
		],
		"Europe/Athens": [
			"1:34:52 - LMT 1895_8_14 1:34:52",
			"1:34:52 - AMT 1916_6_28_0_1 1:34:52",
			"2 Greece EE%sT 1941_3_30 3",
			"1 Greece CE%sT 1944_3_4 1",
			"2 Greece EE%sT 1981 2",
			"2 EU EE%sT"
		],
		"Europe/Belgrade": [
			"1:22 - LMT 1884 1:22",
			"1 - CET 1941_3_18_23 1",
			"1 C-Eur CE%sT 1945 1",
			"1 - CET 1945_4_8_2 1",
			"2 - CEST 1945_8_16_2 1",
			"1 - CET 1982_10_27 1",
			"1 EU CE%sT"
		],
		"Europe/Berlin": [
			"0:53:28 - LMT 1893_3 0:53:28",
			"1 C-Eur CE%sT 1945_4_24_2 2",
			"1 SovietZone CE%sT 1946 1",
			"1 Germany CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Brussels": [
			"0:17:30 - LMT 1880 0:17:30",
			"0:17:30 - BMT 1892_4_1_12 0:17:30",
			"0 - WET 1914_10_8",
			"1 - CET 1916_4_1_0 1",
			"1 C-Eur CE%sT 1918_10_11_11",
			"0 Belgium WE%sT 1940_4_20_2",
			"1 C-Eur CE%sT 1944_8_3 2",
			"1 Belgium CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Bucharest": [
			"1:44:24 - LMT 1891_9 1:44:24",
			"1:44:24 - BMT 1931_6_24 1:44:24",
			"2 Romania EE%sT 1981_2_29_2 2",
			"2 C-Eur EE%sT 1991 2",
			"2 Romania EE%sT 1994 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Budapest": [
			"1:16:20 - LMT 1890_9 1:16:20",
			"1 C-Eur CE%sT 1918 1",
			"1 Hungary CE%sT 1941_3_6_2 1",
			"1 C-Eur CE%sT 1945 1",
			"1 Hungary CE%sT 1980_8_28_2 1",
			"1 EU CE%sT"
		],
		"Europe/Chisinau": [
			"1:55:20 - LMT 1880 1:55:20",
			"1:55 - CMT 1918_1_15 1:55",
			"1:44:24 - BMT 1931_6_24 1:44:24",
			"2 Romania EE%sT 1940_7_15 2",
			"3 - EEST 1941_6_17 3",
			"1 C-Eur CE%sT 1944_7_24 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_4_6 3",
			"2 - EET 1991 2",
			"2 Russia EE%sT 1992 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Copenhagen": [
			"0:50:20 - LMT 1890 0:50:20",
			"0:50:20 - CMT 1894_0_1 0:50:20",
			"1 Denmark CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Denmark CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Dublin": [
			"-0:25 - LMT 1880_7_2 -0:25",
			"-0:25:21 - DMT 1916_4_21_2 -0:25:21",
			"0:34:39 - IST 1916_9_1_2 -0:25:21",
			"0 GB-Eire %s 1921_11_6",
			"0 GB-Eire GMT/IST 1940_1_25_2",
			"1 - IST 1946_9_6_2 1",
			"0 - GMT 1947_2_16_2",
			"1 - IST 1947_10_2_2 1",
			"0 - GMT 1948_3_18_2",
			"0 GB-Eire GMT/IST 1968_9_27 1",
			"1 - IST 1971_9_31_2",
			"0 GB-Eire GMT/IST 1996",
			"0 EU GMT/IST"
		],
		"Europe/Gibraltar": [
			"-0:21:24 - LMT 1880_7_2_0 -0:21:24",
			"0 GB-Eire %s 1957_3_14_2",
			"1 - CET 1982 1",
			"1 EU CE%sT"
		],
		"Europe/Helsinki": [
			"1:39:52 - LMT 1878_4_31 1:39:52",
			"1:39:52 - HMT 1921_4 1:39:52",
			"2 Finland EE%sT 1983 2",
			"2 EU EE%sT"
		],
		"Europe/Istanbul": [
			"1:55:52 - LMT 1880 1:55:52",
			"1:56:56 - IMT 1910_9 1:56:56",
			"2 Turkey EE%sT 1978_9_15 3",
			"3 Turkey TR%sT 1985_3_20 3",
			"2 Turkey EE%sT 2007 2",
			"2 EU EE%sT 2011_2_27_1",
			"2 - EET 2011_2_28_1",
			"2 EU EE%sT"
		],
		"Europe/Kaliningrad": [
			"1:22 - LMT 1893_3 1:22",
			"1 C-Eur CE%sT 1945 1",
			"2 Poland CE%sT 1946 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 Russia EE%sT 2011_2_27_2 2",
			"3 - FET"
		],
		"Europe/Kiev": [
			"2:2:4 - LMT 1880 2:2:4",
			"2:2:4 - KMT 1924_4_2 2:2:4",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_8_20 3",
			"1 C-Eur CE%sT 1943_10_6 1",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Europe/Lisbon": [
			"-0:36:32 - LMT 1884 -0:36:32",
			"-0:36:32 - LMT 1912_0_1 -0:36:32",
			"0 Port WE%sT 1966_3_3_2",
			"1 - CET 1976_8_26_1 1",
			"0 Port WE%sT 1983_8_25_1",
			"0 W-Eur WE%sT 1992_8_27_1",
			"1 EU CE%sT 1996_2_31_1",
			"0 EU WE%sT"
		],
		"Europe/London": [
			"-0:1:15 - LMT 1847_11_1_0 -0:1:15",
			"0 GB-Eire %s 1968_9_27 1",
			"1 - BST 1971_9_31_2",
			"0 GB-Eire %s 1996",
			"0 EU GMT/BST"
		],
		"Europe/Luxembourg": [
			"0:24:36 - LMT 1904_5 0:24:36",
			"1 Lux CE%sT 1918_10_25 1",
			"0 Lux WE%sT 1929_9_6_2",
			"0 Belgium WE%sT 1940_4_14_3 1",
			"1 C-Eur WE%sT 1944_8_18_3 2",
			"1 Belgium CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Madrid": [
			"-0:14:44 - LMT 1901_0_1_0 -0:14:44",
			"0 Spain WE%sT 1946_8_30 2",
			"1 Spain CE%sT 1979 1",
			"1 EU CE%sT"
		],
		"Europe/Malta": [
			"0:58:4 - LMT 1893_10_2_0 0:58:4",
			"1 Italy CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Italy CE%sT 1973_2_31 1",
			"1 Malta CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Minsk": [
			"1:50:16 - LMT 1880 1:50:16",
			"1:50 - MMT 1924_4_2 1:50",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_5_28 3",
			"1 C-Eur CE%sT 1944_6_3 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1991_2_31_2 3",
			"3 - EEST 1991_8_29_2 2",
			"2 - EET 1992_2_29_0 2",
			"3 - EEST 1992_8_27_0 2",
			"2 Russia EE%sT 2011_2_27_2 2",
			"3 - FET"
		],
		"Europe/Monaco": [
			"0:29:32 - LMT 1891_2_15 0:29:32",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"0 France WE%sT 1945_8_16_3 2",
			"1 France CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Moscow": [
			"2:30:20 - LMT 1880 2:30:20",
			"2:30 - MMT 1916_6_3 2:30",
			"2:30:48 Russia %s 1919_6_1_2 4:30:48",
			"3 Russia MSK/MSD 1922_9 3",
			"2 - EET 1930_5_21 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 Russia EE%sT 1992_0_19_2 2",
			"3 Russia MSK/MSD 2011_2_27_2 3",
			"4 - MSK"
		],
		"Europe/Oslo": [
			"0:43 - LMT 1895_0_1 0:43",
			"1 Norway CE%sT 1940_7_10_23 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Norway CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Paris": [
			"0:9:21 - LMT 1891_2_15_0_1 0:9:21",
			"0:9:21 - PMT 1911_2_11_0_1 0:9:21",
			"0 France WE%sT 1940_5_14_23 1",
			"1 C-Eur CE%sT 1944_7_25 2",
			"0 France WE%sT 1945_8_16_3 2",
			"1 France CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Prague": [
			"0:57:44 - LMT 1850 0:57:44",
			"0:57:44 - PMT 1891_9 0:57:44",
			"1 C-Eur CE%sT 1944_8_17_2 1",
			"1 Czech CE%sT 1979 1",
			"1 EU CE%sT"
		],
		"Europe/Riga": [
			"1:36:24 - LMT 1880 1:36:24",
			"1:36:24 - RMT 1918_3_15_2 1:36:24",
			"2:36:24 - LST 1918_8_16_3 2:36:24",
			"1:36:24 - RMT 1919_3_1_2 1:36:24",
			"2:36:24 - LST 1919_4_22_3 2:36:24",
			"1:36:24 - RMT 1926_4_11 1:36:24",
			"2 - EET 1940_7_5 2",
			"3 - MSK 1941_6 3",
			"1 C-Eur CE%sT 1944_9_13 1",
			"3 Russia MSK/MSD 1989_2_26_2 3",
			"3 - EEST 1989_8_24_2 2",
			"2 Latvia EE%sT 1997_0_21 2",
			"2 EU EE%sT 2000_1_29 2",
			"2 - EET 2001_0_2 2",
			"2 EU EE%sT"
		],
		"Europe/Rome": [
			"0:49:56 - LMT 1866_8_22 0:49:56",
			"0:49:56 - RMT 1893_10_1_0 0:49:56",
			"1 Italy CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1944_6 2",
			"1 Italy CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Samara": [
			"3:20:36 - LMT 1919_6_1_2 3:20:36",
			"3 - SAMT 1930_5_21 3",
			"4 - SAMT 1935_0_27 4",
			"4 Russia KUY%sT 1989_2_26_2 4",
			"3 Russia KUY%sT 1991_2_31_2 3",
			"2 Russia KUY%sT 1991_8_29_2 2",
			"3 - KUYT 1991_9_20_3 3",
			"4 Russia SAM%sT 2010_2_28_2 4",
			"3 Russia SAM%sT 2011_2_27_2 3",
			"4 - SAMT"
		],
		"Europe/Simferopol": [
			"2:16:24 - LMT 1880 2:16:24",
			"2:16 - SMT 1924_4_2 2:16",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_10 3",
			"1 C-Eur CE%sT 1944_3_13 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1994_4 3",
			"3 E-Eur MSK/MSD 1996_2_31_3 3",
			"4 - MSD 1996_9_27_3 3",
			"3 Russia MSK/MSD 1997 3",
			"3 - MSK 1997_2_30_1",
			"2 EU EE%sT"
		],
		"Europe/Sofia": [
			"1:33:16 - LMT 1880 1:33:16",
			"1:56:56 - IMT 1894_10_30 1:56:56",
			"2 - EET 1942_10_2_3 2",
			"1 C-Eur CE%sT 1945 1",
			"1 - CET 1945_3_2_3 1",
			"2 - EET 1979_2_31_23 2",
			"2 Bulg EE%sT 1982_8_26_2 3",
			"2 C-Eur EE%sT 1991 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Stockholm": [
			"1:12:12 - LMT 1879_0_1 1:12:12",
			"1:0:14 - SET 1900_0_1 1:0:14",
			"1 - CET 1916_4_14_23 1",
			"2 - CEST 1916_9_1_01 2",
			"1 - CET 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Tallinn": [
			"1:39 - LMT 1880 1:39",
			"1:39 - TMT 1918_1 1:39",
			"1 C-Eur CE%sT 1919_6 1",
			"1:39 - TMT 1921_4 1:39",
			"2 - EET 1940_7_6 2",
			"3 - MSK 1941_8_15 3",
			"1 C-Eur CE%sT 1944_8_22 2",
			"3 Russia MSK/MSD 1989_2_26_2 3",
			"3 - EEST 1989_8_24_2 2",
			"2 C-Eur EE%sT 1998_8_22 3",
			"2 EU EE%sT 1999_10_1 3",
			"2 - EET 2002_1_21 2",
			"2 EU EE%sT"
		],
		"Europe/Tirane": [
			"1:19:20 - LMT 1914 1:19:20",
			"1 - CET 1940_5_16 1",
			"1 Albania CE%sT 1984_6 2",
			"1 EU CE%sT"
		],
		"Europe/Uzhgorod": [
			"1:29:12 - LMT 1890_9 1:29:12",
			"1 - CET 1940 1",
			"1 C-Eur CE%sT 1944_9 2",
			"2 - CEST 1944_9_26 2",
			"1 - CET 1945_5_29 1",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"1 - CET 1991_2_31_3 1",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Europe/Vaduz": [
			"0:38:4 - LMT 1894_5 0:38:4",
			"1 - CET 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Vienna": [
			"1:5:21 - LMT 1893_3 1:5:21",
			"1 C-Eur CE%sT 1920 1",
			"1 Austria CE%sT 1940_3_1_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"2 - CEST 1945_3_12_2 1",
			"1 - CET 1946 1",
			"1 Austria CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Vilnius": [
			"1:41:16 - LMT 1880 1:41:16",
			"1:24 - WMT 1917 1:24",
			"1:35:36 - KMT 1919_9_10 1:35:36",
			"1 - CET 1920_6_12 1",
			"2 - EET 1920_9_9 2",
			"1 - CET 1940_7_3 1",
			"3 - MSK 1941_5_24 3",
			"1 C-Eur CE%sT 1944_7 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"3 - EEST 1991_8_29_2 2",
			"2 C-Eur EE%sT 1998 2",
			"2 - EET 1998_2_29_1",
			"1 EU CE%sT 1999_9_31_1",
			"2 - EET 2003_0_1 2",
			"2 EU EE%sT"
		],
		"Europe/Volgograd": [
			"2:57:40 - LMT 1920_0_3 2:57:40",
			"3 - TSAT 1925_3_6 3",
			"3 - STAT 1930_5_21 3",
			"4 - STAT 1961_10_11 4",
			"4 Russia VOL%sT 1989_2_26_2 4",
			"3 Russia VOL%sT 1991_2_31_2 3",
			"4 - VOLT 1992_2_29_2 4",
			"3 Russia VOL%sT 2011_2_27_2 3",
			"4 - VOLT"
		],
		"Europe/Warsaw": [
			"1:24 - LMT 1880 1:24",
			"1:24 - WMT 1915_7_5 1:24",
			"1 C-Eur CE%sT 1918_8_16_3 2",
			"2 Poland EE%sT 1922_5 2",
			"1 Poland CE%sT 1940_5_23_2 1",
			"1 C-Eur CE%sT 1944_9 2",
			"1 Poland CE%sT 1977 1",
			"1 W-Eur CE%sT 1988 1",
			"1 EU CE%sT"
		],
		"Europe/Zaporozhye": [
			"2:20:40 - LMT 1880 2:20:40",
			"2:20 - CUT 1924_4_2 2:20",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_7_25 3",
			"1 C-Eur CE%sT 1943_9_25 1",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Europe/Zurich": [
			"0:34:8 - LMT 1848_8_12 0:34:8",
			"0:29:44 - BMT 1894_5 0:29:44",
			"1 Swiss CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"HST": [
			"-10 - HST"
		],
		"Indian/Antananarivo": [
			"3:10:4 - LMT 1911_6 3:10:4",
			"3 - EAT 1954_1_27_23 3",
			"4 - EAST 1954_4_29_23 3",
			"3 - EAT"
		],
		"Indian/Chagos": [
			"4:49:40 - LMT 1907 4:49:40",
			"5 - IOT 1996 5",
			"6 - IOT"
		],
		"Indian/Christmas": [
			"7:2:52 - LMT 1895_1 7:2:52",
			"7 - CXT"
		],
		"Indian/Cocos": [
			"6:27:40 - LMT 1900 6:27:40",
			"6:30 - CCT"
		],
		"Indian/Comoro": [
			"2:53:4 - LMT 1911_6 2:53:4",
			"3 - EAT"
		],
		"Indian/Kerguelen": [
			"0 - zzz 1950",
			"5 - TFT"
		],
		"Indian/Mahe": [
			"3:41:48 - LMT 1906_5 3:41:48",
			"4 - SCT"
		],
		"Indian/Maldives": [
			"4:54 - LMT 1880 4:54",
			"4:54 - MMT 1960 4:54",
			"5 - MVT"
		],
		"Indian/Mauritius": [
			"3:50 - LMT 1907 3:50",
			"4 Mauritius MU%sT"
		],
		"Indian/Mayotte": [
			"3:0:56 - LMT 1911_6 3:0:56",
			"3 - EAT"
		],
		"Indian/Reunion": [
			"3:41:52 - LMT 1911_5 3:41:52",
			"4 - RET"
		],
		"MET": [
			"1 C-Eur ME%sT"
		],
		"MST": [
			"-7 - MST"
		],
		"MST7MDT": [
			"-7 US M%sT"
		],
		"PST8PDT": [
			"-8 US P%sT"
		],
		"Pacific/Apia": [
			"12:33:4 - LMT 1879_6_5 12:33:4",
			"-11:26:56 - LMT 1911 -11:26:56",
			"-11:30 - SAMT 1950 -11:30",
			"-11 - WST 2010_8_26 -11",
			"-10 - WSDT 2011_3_2_4 -10",
			"-11 - WST 2011_8_24_3 -11",
			"-10 - WSDT 2011_11_30 -10",
			"14 - WSDT 2012_3_1_4 14",
			"13 WS WS%sT"
		],
		"Pacific/Auckland": [
			"11:39:4 - LMT 1868_10_2 11:39:4",
			"11:30 NZ NZ%sT 1946_0_1 12",
			"12 NZ NZ%sT"
		],
		"Pacific/Chatham": [
			"12:13:48 - LMT 1957_0_1 12:13:48",
			"12:45 Chatham CHA%sT"
		],
		"Pacific/Chuuk": [
			"10:7:8 - LMT 1901 10:7:8",
			"10 - CHUT"
		],
		"Pacific/Easter": [
			"-7:17:44 - LMT 1890 -7:17:44",
			"-7:17:28 - EMT 1932_8 -7:17:28",
			"-7 Chile EAS%sT 1982_2_13_21 -6",
			"-6 Chile EAS%sT"
		],
		"Pacific/Efate": [
			"11:13:16 - LMT 1912_0_13 11:13:16",
			"11 Vanuatu VU%sT"
		],
		"Pacific/Enderbury": [
			"-11:24:20 - LMT 1901 -11:24:20",
			"-12 - PHOT 1979_9 -12",
			"-11 - PHOT 1995 -11",
			"13 - PHOT"
		],
		"Pacific/Fakaofo": [
			"-11:24:56 - LMT 1901 -11:24:56",
			"-11 - TKT 2011_11_30 -11",
			"13 - TKT"
		],
		"Pacific/Fiji": [
			"11:55:44 - LMT 1915_9_26 11:55:44",
			"12 Fiji FJ%sT"
		],
		"Pacific/Funafuti": [
			"11:56:52 - LMT 1901 11:56:52",
			"12 - TVT"
		],
		"Pacific/Galapagos": [
			"-5:58:24 - LMT 1931 -5:58:24",
			"-5 - ECT 1986 -5",
			"-6 - GALT"
		],
		"Pacific/Gambier": [
			"-8:59:48 - LMT 1912_9 -8:59:48",
			"-9 - GAMT"
		],
		"Pacific/Guadalcanal": [
			"10:39:48 - LMT 1912_9 10:39:48",
			"11 - SBT"
		],
		"Pacific/Guam": [
			"-14:21 - LMT 1844_11_31 -14:21",
			"9:39 - LMT 1901 9:39",
			"10 - GST 2000_11_23 10",
			"10 - ChST"
		],
		"Pacific/Honolulu": [
			"-10:31:26 - LMT 1896_0_13_12 -10:31:26",
			"-10:30 - HST 1933_3_30_2 -10:30",
			"-9:30 - HDT 1933_4_21_12 -9:30",
			"-10:30 - HST 1942_1_09_2 -10:30",
			"-9:30 - HDT 1945_8_30_2 -9:30",
			"-10:30 - HST 1947_5_8_2 -10:30",
			"-10 - HST"
		],
		"Pacific/Johnston": [
			"-10 - HST"
		],
		"Pacific/Kiritimati": [
			"-10:29:20 - LMT 1901 -10:29:20",
			"-10:40 - LINT 1979_9 -10:40",
			"-10 - LINT 1995 -10",
			"14 - LINT"
		],
		"Pacific/Kosrae": [
			"10:51:56 - LMT 1901 10:51:56",
			"11 - KOST 1969_9 11",
			"12 - KOST 1999 12",
			"11 - KOST"
		],
		"Pacific/Kwajalein": [
			"11:9:20 - LMT 1901 11:9:20",
			"11 - MHT 1969_9 11",
			"-12 - KWAT 1993_7_20 -12",
			"12 - MHT"
		],
		"Pacific/Majuro": [
			"11:24:48 - LMT 1901 11:24:48",
			"11 - MHT 1969_9 11",
			"12 - MHT"
		],
		"Pacific/Marquesas": [
			"-9:18 - LMT 1912_9 -9:18",
			"-9:30 - MART"
		],
		"Pacific/Midway": [
			"-11:49:28 - LMT 1901 -11:49:28",
			"-11 - NST 1956_5_3 -11",
			"-10 - NDT 1956_8_2 -10",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1983_10_30 -11",
			"-11 - SST"
		],
		"Pacific/Nauru": [
			"11:7:40 - LMT 1921_0_15 11:7:40",
			"11:30 - NRT 1942_2_15 11:30",
			"9 - JST 1944_7_15 9",
			"11:30 - NRT 1979_4 11:30",
			"12 - NRT"
		],
		"Pacific/Niue": [
			"-11:19:40 - LMT 1901 -11:19:40",
			"-11:20 - NUT 1951 -11:20",
			"-11:30 - NUT 1978_9_1 -11:30",
			"-11 - NUT"
		],
		"Pacific/Norfolk": [
			"11:11:52 - LMT 1901 11:11:52",
			"11:12 - NMT 1951 11:12",
			"11:30 - NFT"
		],
		"Pacific/Noumea": [
			"11:5:48 - LMT 1912_0_13 11:5:48",
			"11 NC NC%sT"
		],
		"Pacific/Pago_Pago": [
			"12:37:12 - LMT 1879_6_5 12:37:12",
			"-11:22:48 - LMT 1911 -11:22:48",
			"-11:30 - SAMT 1950 -11:30",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1983_10_30 -11",
			"-11 - SST"
		],
		"Pacific/Palau": [
			"8:57:56 - LMT 1901 8:57:56",
			"9 - PWT"
		],
		"Pacific/Pitcairn": [
			"-8:40:20 - LMT 1901 -8:40:20",
			"-8:30 - PNT 1998_3_27_00 -8:30",
			"-8 - PST"
		],
		"Pacific/Pohnpei": [
			"10:32:52 - LMT 1901 10:32:52",
			"11 - PONT"
		],
		"Pacific/Port_Moresby": [
			"9:48:40 - LMT 1880 9:48:40",
			"9:48:32 - PMMT 1895 9:48:32",
			"10 - PGT"
		],
		"Pacific/Rarotonga": [
			"-10:39:4 - LMT 1901 -10:39:4",
			"-10:30 - CKT 1978_10_12 -10:30",
			"-10 Cook CK%sT"
		],
		"Pacific/Saipan": [
			"-14:17 - LMT 1844_11_31 -14:17",
			"9:43 - LMT 1901 9:43",
			"9 - MPT 1969_9 9",
			"10 - MPT 2000_11_23 10",
			"10 - ChST"
		],
		"Pacific/Tahiti": [
			"-9:58:16 - LMT 1912_9 -9:58:16",
			"-10 - TAHT"
		],
		"Pacific/Tarawa": [
			"11:32:4 - LMT 1901 11:32:4",
			"12 - GILT"
		],
		"Pacific/Tongatapu": [
			"12:19:20 - LMT 1901 12:19:20",
			"12:20 - TOT 1941 12:20",
			"13 - TOT 1999 13",
			"13 Tonga TO%sT"
		],
		"Pacific/Wake": [
			"11:6:28 - LMT 1901 11:6:28",
			"12 - WAKT"
		],
		"Pacific/Wallis": [
			"12:15:20 - LMT 1901 12:15:20",
			"12 - WFT"
		],
		"WET": [
			"0 EU WE%sT"
		]
	}
}
    moment.tz.addZones(window.momentTZData.zones);
    moment.tz.addRules(window.momentTZData.rules);
}());
