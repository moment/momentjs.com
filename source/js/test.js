/*global moment:false*/

(function(){
	var banner = $('#nodeunit-banner');
	var tests = $('#nodeunit-tests');
	var headerRow = $("#header-row");

	var start = moment();
	var passed = 0;
	var failed = 0;
	var total = 0;

	function updateTest(_passed, _failed) {
		passed += _passed;
		failed += _failed;
		updateTotals(passed, failed);
	}

	function updateTotals(_passed, _failed) {
		var duration = moment().diff(start);
		if (_failed) {
			banner.removeClass('pass');
			banner.addClass('fail');
		}
		banner.html('<h3>' + _passed + ' tests passed. ' + _failed + ' failed.</h3>');
	}

	nodeunit.runModules(exports, {
		moduleStart : function (name) {
			tests.append('<h3>' + name + '</h3>');
		},
		testDone : function (name, assertions) {
			var testEl = $('<li>'),
				testHtml = '',
				assertUl = $('<ul>'),
				assertLi,
				assertHtml = '';
				assert;

			total++;

			// each test
			testHtml += '<div class="title"><strong>' + name + '</strong> ';
			if (assertions.failures()) {
				testEl.addClass('fail open');
				testHtml += assertions.passes() + ' passed,';
				testHtml += assertions.failures() + ' failed.</div>';
			} else {
				testEl.addClass('pass');
				testHtml += 'All ' + assertions.passes() + ' passed.</div>';
			}
			testEl.addClass('test');
			testEl.html(testHtml);

			// each assert
			for (var i = 0; i < assertions.length; i++) {
				assert = assertions[i];
				assert.test_name = name;
				assertLi = $('<li>');
				assertHtml = '<strong>' + total + '.' + (i + 1) + '</strong> ';
				assertHtml += (assert.message || assert.method || 'no message');
				if (assert.failed()) {
					assertHtml += ' (' + assert.error.expected + ' ' + assert.error.operator + ' ' + assert.error.actual + ')';
					assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
					assertLi.addClass('fail');
				} else {
					assertLi.addClass('pass');
				}
				assertLi.html(assertHtml);
				assertUl.append(assertLi);
			}

			testEl.append(assertUl);
			tests.append(testEl);
			updateTest(assertions.passes(), assertions.failures());
		},
		done : function (assertions) {
			var duration = moment().diff(start),
				failures = assertions.failures(),
				assert, error, i, preText, toStr;

				header = "Please <a href='https://github.com/moment/moment/issues/new'>submit an issue</a>" +
						"to moment&quot;s github repo with the following content:";
				preText = [
					"Date.prototype.toString = " + (new Date()).toString(),
					"Date.prototype.toLocaleString = " + (new Date()).toLocaleString(),
					"Date.prototype.getTimezoneOffset = " + (new Date(1000)).getTimezoneOffset(),
					"navigator.userAgent = " + navigator.userAgent,
				];

				for (i = 0; i < assertions.length; ++i) {
					assert = assertions[i];
					error = assert.error;
					if (assert.failed()) {
						preText.push('');
						preText.push('----');
						preText.push('[' + assert.test_name + '] ' +
								assert.message + ' (' + error.expected + ' ' +
									error.operator + ' ' + error.actual + ')');
						preText('```');
						preText.push(error.stack || error);
						preText('```');
					}
				}
				toStr = '<p>' + header + '</p>' +
						'<pre>' + preText.join('</br>') + '</pre>';

			if (failures) {
				banner.after('<p>' + [
					"Hmm, looks like some of the unit tests are failing.",
					"It's hard to catch all the bugs across all browsers and timezones, so if you have a minute, " +
						"please submit an issue with the failing test and the info below. Thanks!",
					toStr].join('</p><p>') + '</p>');
			} else {
				banner.after("<p class='success'>Awesome, all the unit tests passed!</p>");
			}

			updateTotals(assertions.passes(), failures);
		}
	});

	tests.on('click', 'li.test', function(){
		$(this).toggleClass('open');
	});
})();
