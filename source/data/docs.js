var fs        = require('fs'),
	ghm       = require('github-flavored-markdown');

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
				key : "In Node.js"
			},
			{
				key : "In the Browser"
			}
		]
	},
	{
		key : "parsing",
		title : "Parse",
		methods : [
			{
				key : "Javascript Date Object",
				signature : "moment(Date);",
				version : "1.0.0"
			},
			{
				key : "Milliseconds since the Unix Epoch",
				signature : "moment(Number);",
				version : "1.0.0"
			},
			{
				key : "Unix Timestamp",
				signature : "moment.unix(Number)",
				version : "1.6.0"
			},
			{
				key : "String",
				signature : "moment(String);",
				version : "1.0.0"
			},
			{
				key : "String + Format",
				signature : "moment(String, String);",
				version : "1.0.0"
			},
			{
				key : "String + Formats",
				signature : "moment(String, String[]);",
				version : "1.0.0"
			},
			{
				key : "Now",
				signature : "moment();",
				version : "1.0.0"
			},
			{
				key : "Javascript Array",
				signature : "moment(Number[]);",
				version : "1.0.0"
			},
			{
				key : "ASP.NET json dates",
				signature : "moment(String);",
				version : "1.3.0"
			},
			{
				key : "Unix Timestamp",
				signature : "moment.unix(Number)",
				version : "???"
			},
			{
				key : "Cloning",
				signature : "moment(Moment);",
				version : "1.2.0"
			},
			{
				key : "UTC",
				signature : "moment.utc();\nmoment.utc(Number);\nmoment.utc(Number[]);\nmoment.utc(String);\nmoment.utc(String, String);",
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
		key : "Manipulating",
		title : "Manipulate",
		methods : [
			{
				key : "Add",
				signature : "moment().add(String, Number);\nmoment().add(Object);",
				version : "1.0.0"
			},
			{
				key : "Subtract",
				signature : "moment().subtract(String, Number);\nmoment().subtract(Object);",
				version : "1.0.0"
			},
			{
				key : "Milliseconds",
				signature : "moment().milliseconds(Number);",
				version : "1.3.0"
			},
			{
				key : "Seconds",
				signature : "moment().seconds(Number);",
				version : "1.0.0"
			},
			{
				key : "Minutes",
				signature : "moment().minutes(Number);",
				version : "1.0.0"
			},
			{
				key : "Hours",
				signature : "moment().hours(Number);",
				version : "1.0.0"
			},
			{
				key : "Date",
				title : "Date of the Month",
				signature : "moment().date(Number);",
				version : "1.0.0"
			},
			{
				key : "Day",
				title : "Day of the Week",
				signature : "moment().day(Number);",
				version : "1.3.0"
			},
			{
				key : "Month",
				signature : "moment().month(Number);",
				version : "1.0.0"
			},
			{
				key : "Year",
				signature : "moment().year(Number);",
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
				key : "sod",
				title : "Start of Day",
				signature : "moment().sod();",
				version : "1.4.0"
			},
			{
				key : "eod",
				title : "End of Day",
				signature : "moment().eod();",
				version : "1.4.0"
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
			}
		]
	},
	{
		key : "Displaying",
		title : "Display",
		methods : [
			{
				key : "Format",
				signature : "moment().format();\nmoment().format(String);",
				version : "1.0.0"
			},
			{
				key : "from",
				title : "Humanize time from another moment",
				signature : "moment().from(Moment);\nmoment().from(Moment, Boolean);",
				version : "1.0.0"
			},
			{
				key : "fromNow",
				title : "Humanize time from now",
				signature : "moment().fromNow();\nmoment().fromNow(Boolean);",
				version : "1.0.0"
			},
			{
				key : "Humanize duration",
				signature : "moment.humanizeDuration(Number);\nmoment.humanizeDuration(Number, String);\nmoment.humanizeDuration(Number, String, Boolean);",
				version : "1.5.0"
			},
			{
				key : "Calendar Time",
				signature : "moment().calendar();",
				version : "1.3.0"
			},
			{
				key : "Difference",
				signature : "moment().diff(Moment);\nmoment().diff(Moment, String);\nmoment().diff(Moment, String, Boolean);",
				version : "1.0.0"
			},
			{
				key : "Native Javascript Date",
				signature : "moment().toDate();",
				version : "1.0.0"
			},
			{
				key : "Milliseconds since the Unix Epoch",
				signature : "moment().valueOf();",
				version : "1.0.0"
			},
			{
				key : "Unix Timestamp",
				signature : "moment().unix();",
				version : "1.6.0"
			},
			{
				key : "Milliseconds",
				signature : "moment().milliseconds();",
				version : "1.3.0"
			},
			{
				key : "Seconds",
				signature : "moment().seconds();",
				version : "1.0.0"
			},
			{
				key : "Minutes",
				signature : "moment().minutes();",
				version : "1.0.0"
			},
			{
				key : "Hours",
				signature : "moment().hours();",
				version : "1.0.0"
			},
			{
				key : "Date",
				title : "Date of the Month",
				signature : "moment().date();",
				version : "1.0.0"
			},
			{
				key : "Day",
				title : "Day of the Week",
				signature : "moment().day();",
				version : "1.0.0"
			},
			{
				key : "Month",
				signature : "moment().month();",
				version : "1.0.0"
			},
			{
				key : "Year",
				signature : "moment().year();",
				version : "1.0.0"
			},
			{
				key : "Leap Year",
				signature : "moment().isLeapYear();",
				version : "1.0.0"
			},
			{
				key : "Timezone Offset",
				signature : "moment().zone();",
				version : "1.2.0"
			},
			{
				key : "Days in Month",
				signature : "moment().daysInMonth();",
				version : "1.5.0"
			},
			{
				key : "Daylight Saving Time",
				signature : "moment().isDST();",
				version : "1.2.0"
			},
			{
				key : "isMoment",
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
				signature : "moment.lang(String);\nmoment.lang(String, Object);",
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
				signature : "moment.lang(String);",
				version : "1.0.0"
			},
			{
				key : "loading-into-browser",
				title : "Loading languages in the browser",
				signature : "moment.lang(String);",
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
				signature : "moment.months = String[];\nmoment.months = Function",
				version : "1.0.0"
			},
			{
				key : "Month Abbreviations",
				signature : "moment.monthsShort = String[];\nmoment.monthsShort = Function",
				version : "1.0.0"
			},
			{
				key : "Weekday Names",
				signature : "moment.weekdays = String[];\nmoment.weekdays = Function",
				version : "1.0.0"
			},
			{
				key : "Weekday Abbreviations",
				signature : "moment.weekdaysShort = String[];\nmoment.weekdaysShort = Function",
				version : "1.0.0"
			},
			{
				key : "weekday-min",
				title : "Minimal Weekday Abbreviations",
				signature : "moment.weekdaysMin = String[];\nmoment.weekdaysMin = Function",
				version : "1.7.0"
			},
			{
				key : "Long Date Formats",
				signature : "moment.longDateFormat = Object;",
				version : "1.1.0"
			},
			{
				key : "Relative Time",
				signature : "moment.relativeTime = Object;",
				version : "1.0.0"
			},
			{
				key : "AM/PM",
				signature : "moment.meridiem = Function;",
				version : "1.6.0"
			},
			{
				key : "Calendar",
				signature : "moment.calendar = Object;",
				version : "1.3.0"
			},
			{
				key : "Ordinal",
				signature : "moment.ordinal = Function;",
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
				signature : "moment.duration(Number, String);\nmoment.duration(Number);\nmoment.duration(Object);",
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
			}
		]
	},
	{
		key : "Plugins",
		methods : [
			{
				key : "strftime",
				signature : "moment().strftime(String);"
			},
			{
				key : "isocalendar",
				title : "ISO Calendar",
				signature : "moment().isocalendar();\nmoment.fromIsocalendar(Array);"
			},
			{
				key : "range",
				title : "Date Ranges",
				signature : "moment().range(Moment, Moment);\nmoment.within(DateRange);"
			},
			{
				key : "twix",
				title : "Twix",
				signature : "moment.twix(Moment, Moment);\nmoment.twix(Moment, Moment, Boolean);"
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
			method.body = docsAtPath(filename(['source', 'docs', section.key, method.key + '.md']));
		}
	}
	return docs;
}

function docsAtPath(p) {
	if (fs.existsSync(p)) {
		return ghm.parse(fs.readFileSync(p, 'utf8'), "timrwood/moment");
	}
	return '';
}

module.exports = normalizeDocs(exp);
