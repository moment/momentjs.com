/*global moment:false*/

(function(){
	var banner = $('#nodeunit-banner');
	var tests = $('#nodeunit-tests');
	var headerRow = $('#header-row');

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

        QUnit.moduleStart(function (module) {
            var name = module.name;
            currentTestModule = name;
            currentModuleEl = $('<div>').addClass('tests-module');
            currentModuleEl.append('<h3 class="tests-module-title">' + name + '</h3>');
            tests.append(currentModuleEl);
        });

        var assertions;
        var failedAssertions = []
        QUnit.testStart(function (test) {
            assertions = [];
        });

        QUnit.log(function (assertion) {
            assertions.push(assertion);
        });

        QUnit.testDone(function (test) {
            var name = test.name;
            var testEl = $('<div>').addClass('tests-test'),
                    testHtml = '',
                    assertUl = $('<div>').addClass('tests-asserts'),
                    assertLi,
                    assertHtml = '',
                    assert;

            total++;

            // each test
            testHtml += '<div class="tests-test-title"><strong>' + name + '</strong> ';
            if (test.failed > 0) {
                    testEl.addClass('has-failed is-open');
                    testHtml += test.passed + ' passed : ';
                    testHtml += test.failed + ' failed</div>';
            } else {
                    testHtml += 'all ' + test.passed + ' passed</div>';
            }
            testEl.html(testHtml);

            // each assert
            for (var i = 0; i < assertions.length; i++) {
                    assert = assertions[i];
                    assert.uid = total + '.' + (i + 1);
                    assertLi = $('<div>').addClass('tests-assert');
                    assertHtml = '<strong>' + assert.uid + '</strong> ';
                    assertHtml += (assert.message || 'no message');
                    if (assert.result === false) {
                            assertHtml += ' (' + assert.expected + ' ' + '===' + ' ' + assert.actual + ')';
                            assertHtml += '<pre>' + (assert.source || assert.message) + '</pre>';
                            assertLi.addClass('has-failed');
                            failedAssertions.push(assert);
                    }
                    assertLi.html(assertHtml);
                    assertUl.append(assertLi);
            }

            testEl.append(assertUl);
            currentModuleEl.append(testEl);
            updateTest(test.passed, test.failed);
        });

        QUnit.done(function () {
            var duration = moment().diff(start),
                    failures = failedAssertions.length,
                    assert, i,
                    reportHTML = '',
                    header,
                    failingModules = '',
                    expression,
                    submitUrl = 'https://github.com/moment/moment/issues/new',
                    searchUrl = 'https://github.com/moment/moment/search',
                    titleText = '' + failures + ' test' + (failures !== 1 ? 's' : '') + ' failed. ',
                    shortenedTitle = '' + failures + ' test' + (failures !== 1 ? 's' : '') + ' failed in modules: ',
                    shortenedBody = [],
                    bodyText = [
                        '### Client info',
                        '```',
                        'Date String   : ' + (new Date()).toString(),
                        'Locale String : ' + (new Date()).toLocaleString(),
                        'Offset        : ' + (new Date()).getTimezoneOffset(),
                        'User Agent    : ' + navigator.userAgent,
                        'Moment Version: ' + moment.version,
                        '```'
                    ];
            shortenedBody.concat(bodyText)
            shortenedBody.push('Failing tests: ')

            for (i = 0; i < failedAssertions.length; ++i) {
                    assert = failedAssertions[i];

                    header = assert.module + ':' + assert.name + ' (' + assert.uid + ') ';
                    let failingModule = assert.module + ':' + assert.name
                    titleText += header;
                    shortenedBody.push('### ' + assert.uid );

                    if(failingModules.indexOf(failingModule) < 0) {
                        failingModules += failingModules.length > 0 ? ' || ' : ''
                        failingModules += failingModule
                        shortenedTitle += failingModule + ', '
                    }
                    bodyText.push('');
                    bodyText.push('====');
                    bodyText.push('');
                    bodyText.push('### ' + header);
                    bodyText.push('');
                    bodyText.push(assert.message);
                    bodyText.push('');
                    bodyText.push('```javascript');
                    bodyText.push('// Expected ' + assert.expected);
                    bodyText.push('// Actual   ' + assert.actual);

                    expression = typeof assert.actual === 'string' ?
                        '"' + assert.actual.replace('"', '\\"') + '"' : assert.actual;
                    expression += ' ' + '===' + ' ';
                    expression += typeof assert.expected === 'string' ?
                        '"' + assert.expected.replace('"', '\\"') + '"' : assert.expected;

                    bodyText.push(expression);
                    bodyText.push('```');
            }

            shortenedTitle = shortenedTitle.substr(0, titleText.length -2)
            if (titleText.length > 256) {
                titleText = shortenedTitle
                bodyText = shortenedBody
            }
            bodyText = bodyText.join('\n');

            submitUrl += '?title=' + encodeURIComponent(titleText);
            submitUrl += '&body=' + encodeURIComponent(bodyText);

            searchUrl += '?type=Issues&q=' + encodeURIComponent(titleText);

            if (failures) {
                    reportHTML += '<h2>Uh oh, looks like some tests failed.</h2>';
                    reportHTML += '<p>It\'s hard to catch bugs across all browsers and timezones. If you have a minute, please report the failing test.</p>';
                    reportHTML += '<a class="button" href="' + searchUrl + '" target="_blank"><b>STEP 1:</b> Search for an existing failure report</a>';
                    reportHTML += '<p>If it doesn\'t look like this failure has already been reported, proceed to step 2.</p>';
                    reportHTML += '<a class="button" href="' + submitUrl + '" target="_blank"><b>STEP 2:</b> Submit a failure report</a>';
                    reportHTML += '<h3>Issue title</h3>';
                    reportHTML += '<pre>' + titleText + '</pre>';
                    reportHTML += '<h3>Issue description</h3>';
                    reportHTML += '<pre>' + bodyText.replace(/\n/g,"<br/>") + '</pre>';
            } else {
                    reportHTML += '<p class="success">Awesome, all the unit tests passed!</p>';
            }

            $('#report-wrapper').html('<div class="tests-reporting">' + reportHTML + '<div>');

            // updateTotals(assertions.passes(), failures);
	});

        // fire tests after callbacks are registered
        QUnit.start();

	tests.on('click', '.tests-test', function(){
		$(this).toggleClass('is-open');
	});
})();
