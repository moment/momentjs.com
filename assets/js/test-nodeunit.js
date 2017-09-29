/*global moment:false*/

(function(){
	var banner = $('#nodeunit-banner');
	var tests = $('#nodeunit-tests');
	var headerRow = $("#header-row");

	var start = moment();
	var passed = 0;
	var failed = 0;
	var total = 0;
	var currentTestModule;
	var currentModuleEl;

	function updateTest(_passed, _failed) {
		passed += _passed;
		failed += _failed;
		updateTotals(passed, failed);
	}

	function updateTotals(_passed, _failed) {
		if (_failed) {
			banner.addClass('has-failed');
		}
		banner.html('<span class="test-num">' + _passed + '</span> tests passed<br/>' +
                        '<span class="fail-label"><span class="test-num">' + _failed + '</span> failed</span>');
	}

	(function() {
		var queryArgs = {}, query = window.location.search, pieces, i, key_val,
			filtered, suite, test;
		if (!query) { return; }
		if (query[query.length - 1] === '/') {
			query = query.slice(0, query.length - 1);
		}
		pieces = query.slice(1).split('&');
		for (i = 0; i < pieces.length; ++i) {
			key_val = pieces[i].split('=');
			queryArgs[decodeURIComponent(key_val[0])] = decodeURIComponent(key_val[1]);
		}
		if (queryArgs.suite !== undefined) {
			filtered = {};
			for (suite in exports) {
				if (suite.match(queryArgs.suite)) {
					filtered[suite] = exports[suite];
				}
			}
			exports = filtered;
		}
		if (queryArgs.test !== undefined) {
			for (suite in exports) {
				filtered = {};
				for (test in exports[suite]) {
					if (test === 'setUp' || test === 'tearDown' || test.match(queryArgs.test)) {
						filtered[test] = exports[suite][test];
					}
				}
				exports[suite] = filtered;
			}
		}
	}());

	nodeunit.runModules(exports, {
		moduleStart : function (name) {
			currentTestModule = name;
			currentModuleEl = $('<div>').addClass('tests-module');
			currentModuleEl.append('<h3 class="tests-module-title">' + name + '</h3>');
			tests.append(currentModuleEl);
		},
		testDone : function (name, assertions) {
			var testEl = $('<div>').addClass('tests-test'),
				testHtml = '',
				assertUl = $('<div>').addClass('tests-asserts'),
				assertLi,
				assertHtml = '',
				assert;

			total++;

			// each test
			testHtml += '<div class="tests-test-title"><strong>' + name + '</strong> ';
			if (assertions.failures()) {
				testEl.addClass('has-failed is-open');
				testHtml += assertions.passes() + ' passed : ';
				testHtml += assertions.failures() + ' failed</div>';
			} else {
				testHtml += 'all ' + assertions.passes() + ' passed</div>';
			}
			testEl.html(testHtml);

			// each assert
			for (var i = 0; i < assertions.length; i++) {
				assert = assertions[i];
				assert.uid = total + '.' + (i + 1);
				assert.test_name = name;
				assert.module_name = currentTestModule;
				assertLi = $('<div>').addClass('tests-assert');
				assertHtml = '<strong>' + assert.uid + '</strong> ';
				assertHtml += (assert.message || assert.method || 'no message');
				if (assert.failed()) {
					assertHtml += ' (' + assert.error.expected + ' ' + assert.error.operator + ' ' + assert.error.actual + ')';
					assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
					assertLi.addClass('has-failed');
				}
				assertLi.html(assertHtml);
				assertUl.append(assertLi);
			}

			testEl.append(assertUl);
			currentModuleEl.append(testEl);
			updateTest(assertions.passes(), assertions.failures());
		},
		done : function (assertions) {
			var duration = moment().diff(start),
				failures = assertions.failures(),
				assert, error, i,
				reportHTML = '',
				header,
				expression,
				submitUrl = "https://github.com/moment/moment/issues/new",
				searchUrl = "https://github.com/moment/moment/search",
				titleText = "" + failures + " test" + (failures !== 1 ? "s" : "") + " failed. ",
				bodyText = [
					"### Client info",
					'```',
					"Date String   : " + (new Date()).toString(),
					"Locale String : " + (new Date()).toLocaleString(),
					"Offset        : " + (new Date(1000)).getTimezoneOffset(),
					"User Agent    : " + navigator.userAgent,
					'```'
				];

			for (i = 0; i < assertions.length; ++i) {
				assert = assertions[i];
				error = assert.error;

				if (!assert.failed()) {
					continue;
				}

				header = assert.module_name + ':' + assert.test_name + ' (' + assert.uid + ') ';
				titleText += header;

				bodyText.push('');
				bodyText.push('====');
				bodyText.push('');
				bodyText.push('### ' + header);
				bodyText.push('');
				bodyText.push(assert.message);
				bodyText.push('');
				bodyText.push('```javascript');
				bodyText.push('// Expected ' + error.expected);
				bodyText.push('// Actual   ' + error.actual);

				expression = typeof error.actual === 'string' ? '"' + error.actual.replace('"', '\\"') + '"' : error.actual;
				expression += ' ' + error.operator + ' ';
				expression += typeof error.expected === 'string' ? '"' + error.expected.replace('"', '\\"') + '"' : error.expected;

				bodyText.push(expression);
				bodyText.push('```');
				console && console.log && console.log(assert, error);
			}

			bodyText = bodyText.join('\n');

			submitUrl += '?title=' + encodeURIComponent(titleText);
			submitUrl += '&body=' + encodeURIComponent(bodyText);

			searchUrl += '?type=Issues&q=' + encodeURIComponent(titleText);

			if (failures) {
				reportHTML += '<h2>Uh oh, looks like some tests failed.</h2>';
				reportHTML += "<p>It's hard to catch bugs across all browsers and timezones. If you have a minute, please report the failing test.</p>";
				reportHTML += "<a class='button' href='" + searchUrl + "' target='_blank'><b>STEP 1:</b> Search for an existing failure report</a>";
				reportHTML += "<p>If it doesn't look like this failure has already been reported, proceed to step 2.</p>";
				reportHTML += "<a class='button' href='" + submitUrl + "' target='_blank'><b>STEP 2:</b> Submit a failure report</a>";
				reportHTML += '<h3>Issue title</h3>';
				reportHTML += '<pre>' + titleText + '</pre>';
				reportHTML += '<h3>Issue description</h3>';
				reportHTML += '<pre>' + bodyText.replace(/\n/g, '<br/>') + '</pre>';
			} else {
				reportHTML += "<p class='success'>Awesome, all the unit tests passed!</p>";
			}

			$('#report-wrapper').html('<div class="tests-reporting">' + reportHTML + '<div>');

			updateTotals(assertions.passes(), failures);
		}
	});

	tests.on('click', '.tests-test', function(){
		$(this).toggleClass('is-open');
	});
})();
