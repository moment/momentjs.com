(function(){
    var banner = $('#nodeunit-banner');
    var tests = $('#nodeunit-tests');

    $('#nodeunit-userAgent').html(navigator.userAgent);

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
            banner.removeClass('alert-info');
            banner.addClass('alert-error');
        }
        banner.html('<h3>' + _passed + ' passed.</h3><h3>' + _failed + ' failed.</h3><h3>' + duration + ' milliseconds.</h3>');
    }

    nodeunit.runModules(exports, {
        moduleStart : function (name) {
            tests.append('<h3>' + name + '</h3>');
        },
        testDone : function (name, assertions) {
            var testEl = $('<li class="alert alert-success">'),
                testHtml = '',
                assertUl = $('<ul>'),
                assertLi,
                assertHtml = '';
                assert;

            total++;
            
            // each test
            testHtml += '<div><strong>' + name + '</strong> ';
            if (assertions.failures()) {
                testEl.addClass('alert-error open');
                testEl.removeClass('alert-success');
                testHtml += assertions.passes() + ' passed,';
                testHtml += assertions.failures() + ' failed.</div>';
            } else {
                testHtml += 'All ' + assertions.passes() + ' passed.</div>';
            }
            testEl.addClass('test');
            testEl.html(testHtml);

            // each assert
            for (var i = 0; i < assertions.length; i++) {
                assert = assertions[i];
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
            var duration = moment().diff(start);
            var failures = assertions.failures();

            if (failures) {
                banner.after("<p class='alert alert-error'>Hmm, looks like some of the unit tests are failing.<br/><br/>" +
                    "It's hard to catch all the bugs across all timezones, so if you have a minute, " + 
                    "please submit an issue with your user agent, timezone, and the failing test here.<br/><br/>" + 
                    "<a class='btn' href='https://github.com/timrwood/moment/issues'>github.com/timrwood/moment/issues</a>" + 
                    "<br/><br/>Thanks!</p>");
            } else {
                banner.after("<p class='alert alert-success'>Awesome, all the unit tests passed!</p>");
            }

            updateTotals(assertions.passes(), failures);
        }
    });

    tests.on('click', 'li.test', {}, function(){
        $(this).toggleClass('open');
    });
})();