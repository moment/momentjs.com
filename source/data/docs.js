var fs        = require('fs'),
	highlight = require("highlight.js").highlight,
	marked    = require('marked');

marked.setOptions({
	highlight : function (code, lang) {
		if (lang === "javascript") {
			return highlight("javascript", code).value;
		}
		return code;
	}
});

function filename(fn) {
	fn.unshift(process.cwd());
	var output = fn.join('/');
	return output;
}

var exp = [
	{
		key : "use-it",
		title : "Where to use it",
		methods : [
			{
				key : "Node.js"
			},
			{
				key : "Browser"
			},
			{
				key : "Require.js"
			}
		]
	},
	{
		key : "parsing",
		title : "Parse",
		methods : [
			{
				key : "Now",
				signature : "moment();",
				version : "1.0.0"
			},
			{
				key : "String",
				signature : "moment(String);",
				version : "1.0.0"
			},
			{
				key : "String + Format",
				signature : [
					"moment(String, String);",
					"moment(String, String, String);"
				],
				version : "1.0.0"
			},
			{
				key : "String + Formats",
				signature : "moment(String, String[]);",
				version : "1.0.0"
			},
			{
				key : "Unix Offset",
				title : "Unix Offset (milliseconds)",
				signature : "moment(Number);",
				version : "1.0.0"
			},
			{
				key : "Unix Timestamp",
				title : "Unix Timestamp (seconds)",
				signature : "moment.unix(Number)",
				version : "1.6.0"
			},
			{
				key : "Date",
				signature : "moment(Date);",
				version : "1.0.0"
			},
			{
				key : "Array",
				signature : "moment(Number[]);",
				version : "1.0.0"
			},
			{
				key : "ASP.NET JSON Date",
				signature : "moment(String);",
				version : "1.3.0"
			},
			{
				key : "Moment Clone",
				signature : "moment(Moment);",
				version : "1.2.0"
			},
			{
				key : "UTC",
				signature : [
					"moment.utc();",
					"moment.utc(Number);",
					"moment.utc(Number[]);",
					"moment.utc(String);",
					"moment.utc(String, String);",
					"moment.utc(String, String[]);",
					"moment.utc(String, String, String);",
					"moment.utc(Moment);",
					"moment.utc(Date);"
				],
				version : "1.5.0"
			},
			{
				key : "is-valid",
				title : "Validation",
				signature : "moment().isValid();",
				version : "1.7.0"
			}
		]
	},
	{
		key : "get-set",
		title : "Get + Set",
		methods : [
			{
				key : "Millisecond",
				signature : [
					"moment().millisecond(Number);",
					"moment().millisecond(); // Number",
					"moment().milliseconds(Number);",
					"moment().milliseconds(); // Number"
				],
				version : "1.3.0"
			},
			{
				key : "Second",
				signature : [
					"moment().second(Number);",
					"moment().second(); // Number",
					"moment().seconds(Number);",
					"moment().seconds(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Minute",
				signature : [
					"moment().minute(Number);",
					"moment().minute(); // Number",
					"moment().minutes(Number);",
					"moment().minutes(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Hour",
				signature : [
					"moment().hour(Number);",
					"moment().hour(); // Number",
					"moment().hours(Number);",
					"moment().hours(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Date",
				title : "Date of Month",
				signature : [
					"moment().date(Number);",
					"moment().date(); // Number",
					"moment().dates(Number);",
					"moment().dates(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Day",
				title : "Day of Week",
				signature : [
					"moment().day(Number|String);",
					"moment().day(); // Number",
					"moment().days(Number|String);",
					"moment().days(); // Number"
				],
				version : "1.3.0"
			},
			{
				key : "Weekday",
				title : "Day of Week (Locale Aware)",
				signature : [
					"moment().weekday(Number);",
					"moment().weekday(); // Number"
				],
				version : "2.1.0"
			},
			{
				key : "ISO Weekday",
				title : "ISO Day of Week",
				signature : [
					"moment().isoWeekday(Number);",
					"moment().isoWeekday(); // Number"
				],
				version : "2.1.0"
			},
			{
				key : "Day of Year",
				signature : [
					"moment().dayOfYear(Number);",
					"moment().dayOfYear(); // Number"
				],
				version : "2.0.0"
			},
			{
				key : "Week",
				title : "Week of Year",
				signature : [
					"moment().week(Number);",
					"moment().week(); // Number",
					"moment().weeks(Number);",
					"moment().weeks(); // Number"
				],
				version : "2.0.0"
			},
			{
				key : "ISO Week",
				title : "Week of Year (ISO)",
				signature : [
					"moment().isoWeek(Number);",
					"moment().isoWeek(); // Number",
					"moment().isoWeeks(Number);",
					"moment().isoWeeks(); // Number"
				],
				version : "2.0.0"
			},
			{
				key : "Month",
				signature : [
					"moment().month(Number|String);",
					"moment().month(); // Number",
					"moment().months(Number|String);",
					"moment().months(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Year",
				signature : [
					"moment().year(Number);",
					"moment().year(); // Number",
					"moment().years(Number);",
					"moment().years(); // Number"
				],
				version : "1.0.0"
			},
			{
				key : "Week Year",
				signature : [
					"moment().weekYear(Number);",
					"moment().weekYear(); // Number"
				],
				version : "2.1.0"
			},
			{
				key : "ISO Week Year",
				title : "Week Year (ISO)",
				signature : [
					"moment().isoWeekYear(Number);",
					"moment().isoWeekYear(); // Number"
				],
				version : "2.1.0"
			}
		]
	},
	{
		key : "Manipulating",
		title : "Manipulate",
		methods : [
			{
				key : "Add",
				signature : [
					"moment().add(String, Number);",
					"moment().add(Number, String); // 2.0.0",
					"moment().add(Duration); // 1.6.0",
					"moment().add(Object);"
				],
				version : "1.0.0"
			},
			{
				key : "Subtract",
				signature : [
					"moment().subtract(String, Number);",
					"moment().subtract(Number, String); // 2.0.0",
					"moment().subtract(Duration); // 1.6.0",
					"moment().subtract(Object);"
				],
				version : "1.0.0"
			},
			{
				key : "start-of",
				title : "Start of Time",
				signature : "moment().startOf(String);",
				version : "1.7.0"
			},
			{
				key : "end-of",
				title : "End of Time",
				signature : "moment().endOf(String);",
				version : "1.7.0"
			},
			{
				key : "max",
				title : "Maximum",
				signature : "moment().max(Moment|String|Number|Date|Array);",
				version : "2.1.0"
			},
			{
				key : "min",
				title : "Minimum",
				signature : "moment().min(Moment|String|Number|Date|Array);",
				version : "2.1.0"
			},
			{
				key : "Local",
				signature : "moment().local();",
				version : "1.5.0"
			},
			{
				key : "UTC",
				signature : "moment().utc();",
				version : "1.5.0"
			},
			{
				key : "Timezone Offset",
				signature : [
					"moment().zone();",
					"moment().zone(Number|String);"
				],
				version : "1.2.0"
			}
		]
	},
	{
		key : "Displaying",
		title : "Display",
		methods : [
			{
				key : "Format",
				signature : [
					"moment().format();",
					"moment().format(String);"
				],
				version : "1.0.0"
			},
			{
				key : "fromNow",
				title : "Time from now",
				signature : [
					"moment().fromNow();",
					"moment().fromNow(Boolean);"
				],
				version : "1.0.0"
			},
			{
				key : "from",
				title : "Time from X",
				signature : [
					"moment().from(Moment|String|Number|Date|Array);",
					"moment().from(Moment|String|Number|Date|Array, Boolean);"
				],
				version : "1.0.0"
			},
			{
				key : "Calendar Time",
				signature : "moment().calendar();",
				version : "1.3.0"
			},
			{
				key : "Difference",
				signature : [
					"moment().diff(Moment|String|Number|Date|Array);",
					"moment().diff(Moment|String|Number|Date|Array, String);",
					"moment().diff(Moment|String|Number|Date|Array, String, Boolean);"
				],
				version : "1.0.0"
			},
			{
				key : "Unix Offset",
				title : "Unix Offset (milliseconds)",
				signature : [
					"moment().valueOf();",
					"+moment();"
				],
				version : "1.0.0"
			},
			{
				key : "Unix Timestamp",
				title : "Unix Timestamp (seconds)",
				signature : "moment().unix();",
				version : "1.6.0"
			},
			{
				key : "Days in Month",
				signature : "moment().daysInMonth();",
				version : "1.5.0"
			},
			{
				key : "As Javascript Date",
				signature : "moment().toDate();",
				version : "1.0.0"
			},
			{
				key : "As Array",
				signature : "moment().toArray();",
				version : "1.7.0"
			},
			{
				key : "As JSON",
				signature : "moment().toJSON();",
				version : "2.0.0"
			},
			{
				key : "as-iso-string",
				title : "As ISO 8601 String",
				signature : "moment().toISOString();",
				version : "2.1.0"
			}
		]
	},
	{
		key : "Query",
		title : "Query",
		methods : [
			{
				key : "Is Before",
				signature : [
					"moment().isBefore(Moment|String|Number|Date|Array);",
					"moment().isBefore(Moment|String|Number|Date|Array, String);"
				],
				version : "2.0.0"
			},
			{
				key : "Is Same",
				signature : [
					"moment().isSame(Moment|String|Number|Date|Array);",
					"moment().isSame(Moment|String|Number|Date|Array, String);"
				],
				version : "2.0.0"
			},
			{
				key : "Is After",
				signature : [
					"moment().isAfter(Moment|String|Number|Date|Array);",
					"moment().isAfter(Moment|String|Number|Date|Array, String);"
				],
				version : "2.0.0"
			},
			{
				key : "Is Leap Year",
				signature : "moment().isLeapYear();",
				version : "1.0.0"
			},
			{
				key : "Is Daylight Saving Time",
				signature : "moment().isDST();",
				version : "1.2.0"
			},
			{
				key : "Is a Moment",
				signature : "moment.isMoment(obj);",
				version : "1.5.0"
			}
		]
	},
	{
		key : "i18n",
		title : "i18n",
		methods : [
			{
				key : "changing-language",
				title : "Changing language globally",
				signature : [
					"moment.lang(String);",
					"moment.lang(String, Object);"
				],
				version : "1.0.0"
			},
			{
				key : "instance-language",
				title : "Changing language locally",
				signature : "moment().lang(String);",
				version : "1.7.0"
			},
			{
				key : "loading-into-nodejs",
				title : "Loading languages in NodeJS",
				signature : [
					"moment.lang(String);"
				],
				version : "1.0.0"
			},
			{
				key : "loading-into-browser",
				title : "Loading languages in the browser",
				signature : "moment.lang(String, Object);",
				version : "1.0.0"
			},
			{
				key : "adding-language",
				title : "Adding your language to Moment.js"
			},
			{
				key : "getting-language",
				title : "Checking the current Moment.js language",
				signature : "moment.lang();",
				version : "1.6.0"
			}
		]
	},
	{
		key : "Customization",
		title : "Customize",
		methods : [
			{
				key : "Month Names",
				signature : [
					"moment.lang('en', {",
					"    months : String[]",
					"});",
					"moment.lang('en', {",
					"    months : Function",
					"});"
				],
				version : "1.0.0"
			},
			{
				key : "Month Abbreviations",
				signature : [
					"moment.lang('en', {",
					"    monthsShort : String[]",
					"});",
					"moment.lang('en', {",
					"    monthsShort : Function",
					"});"
				],
				version : "1.0.0"
			},
			{
				key : "Weekday Names",
				signature : [
					"moment.lang('en', {",
					"    weekdays : String[]",
					"});",
					"moment.lang('en', {",
					"    weekdays : Function",
					"});"
				],
				version : "1.0.0"
			},
			{
				key : "Weekday Abbreviations",
				signature : [
					"moment.lang('en', {",
					"    weekdaysShort : String[]",
					"});",
					"moment.lang('en', {",
					"    weekdaysShort : Function",
					"});"
				],
				version : "1.0.0"
			},
			{
				key : "weekday-min",
				title : "Minimal Weekday Abbreviations",
				signature : [
					"moment.lang('en', {",
					"    weekdaysMin : String[]",
					"});",
					"moment.lang('en', {",
					"    weekdaysMin : Function",
					"});"
				],
				version : "1.7.0"
			},
			{
				key : "Long Date Formats",
				signature : [
					"moment.lang('en', {",
					"    longDateFormat : Object",
					"});"
				],
				version : "1.1.0"
			},
			{
				key : "Relative Time",
				signature : [
					"moment.lang('en', {",
					"    relativeTime : Object",
					"});"
				],
				version : "1.0.0"
			},
			{
				key : "AM/PM",
				signature : [
					"moment.lang('en', {",
					"    meridiem : Function",
					"});"
				],
				version : "1.6.0"
			},
			{
				key : "AM/PM Parsing",
				signature : [
					"moment.lang('en', {",
					"    meridiemParse : RegExp",
					"    isPM : Function",
					"});"
				],
				version : "2.1.0"
			},
			{
				key : "Calendar",
				signature : [
					"moment.lang('en', {",
					"    calendar : Object",
					"});"
				],
				version : "1.3.0"
			},
			{
				key : "Ordinal",
				signature : [
					"moment.lang('en', {",
					"    ordinal : Function",
					"});"
				],
				version : "1.0.0"
			}
		]
	},
	{
		key : "Durations",
		title : "Durations",
		methods : [
			{
				key : "Creating",
				signature : [
					"moment.duration(Number, String);",
					"moment.duration(Number);",
					"moment.duration(Object);",
					"moment.duration(String);"
				],
				version : "1.6.0"
			},
			{
				key : "Humanize",
				signature : "moment.duration().humanize();",
				version : "1.6.0"
			},
			{
				key : "Milliseconds",
				signature : "moment.duration().milliseconds();\nmoment.duration().asMilliseconds();",
				version : "1.6.0"
			},
			{
				key : "Seconds",
				signature : "moment.duration().seconds();\nmoment.duration().asSeconds();",
				version : "1.6.0"
			},
			{
				key : "Minutes",
				signature : "moment.duration().minutes();\nmoment.duration().asMinutes();",
				version : "1.6.0"
			},
			{
				key : "Hours",
				signature : "moment.duration().hours();\nmoment.duration().asHours();",
				version : "1.6.0"
			},
			{
				key : "Days",
				signature : "moment.duration().days();\nmoment.duration().asDays();",
				version : "1.6.0"
			},
			{
				key : "Months",
				signature : "moment.duration().months();\nmoment.duration().asMonths();",
				version : "1.6.0"
			},
			{
				key : "Years",
				signature : "moment.duration().years();\nmoment.duration().asYears();",
				version : "1.6.0"
			},
			{
				key : "add",
				title : "Add Time",
				signature : [
					"moment.duration().add(Number, String);",
					"moment.duration().add(Number);",
					"moment.duration().add(Duration);",
					"moment.duration().add(Object);"
				],
				version : "2.1.0"
			},
			{
				key : "subtract",
				title : "Subtract Time",
				signature : [
					"moment.duration().subtract(Number, String);",
					"moment.duration().subtract(Number);",
					"moment.duration().subtract(Duration);",
					"moment.duration().subtract(Object);"
				],
				version : "2.1.0"
			},
			{
				key : "as",
				title : "As Unit of Time",
				signature : "moment.duration().as(String);",
				version : "2.1.0"
			},
			{
				key : "get",
				title : "Get Unit of Time",
				signature : "moment.duration().get(String);",
				version : "2.1.0"
			}
		]
	},
	{
		key : "Plugins",
		methods : [
			{
				key : "strftime",
				signature : [
					"npm install moment-strftime"
				]
			},
			{
				key : "isocalendar",
				title : "ISO Calendar",
				signature : [
					"npm install moment-isocalendar"
				]
			},
			{
				key : "range",
				title : "Date Ranges",
				signature : [
					"npm install moment-range"
				]
			},
			{
				key : "twix",
				title : "Twix",
				signature : [
					"npm install twix"
				]
			},
			{
				key : "twitter",
				title : "Twitter"
			}
		]
	}
];

/*********************************************
	Docs
*********************************************/


function machineFriendly(str) {
	return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function normalizeDocs(docs) {
	var method, section, i, j;
	for (i = 0; i < docs.length; i++) {
		section = docs[i];
		section.title = section.title || section.key;
		section.key = machineFriendly(section.key);
		section.body = docsAtPath(filename(['source', 'docs', section.key + '.md']));
		for (j = 0; j < section.methods.length; j++) {
			method = section.methods[j];
			method.title = method.title || method.key;
			method.key = machineFriendly(method.key);
			if (method.signature && method.signature.join) {
				method.signature = method.signature.join('\n');
			}
			method.body = docsAtPath(filename(['source', 'docs', section.key, method.key + '.md']));
		}
	}
	return docs;
}

function docsAtPath(p) {
	if (fs.existsSync(p)) {
		return marked(fs.readFileSync(p, 'utf8'));
	}
	return '';
}

module.exports = normalizeDocs(exp);
