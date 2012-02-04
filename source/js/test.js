(function(){
    var banner = $('#nodeunit-banner');
    var tests = $('#nodeunit-tests');

    $('#nodeunit-userAgent').html(navigator.userAgent);

    var start = moment();
    var passed = 0;
    var failed = 0;

    function updateTest(_passed, _failed) {
        var duration = moment().diff(start);
        passed += _passed;
        failed += _failed;
        if (failed) {
            banner.addClass('fail');
        }
        banner.text(passed + ' passed, ' + failed + ' failed. ' + duration + ' milliseconds.');
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
            
            // each test
            testHtml += '<div><strong>' + name + '</strong> ';
            testHtml += assertions.passes() + ' passed,';
            testHtml += assertions.failures() + ' failed.</div>';
            if (assertions.failures()) {
                testEl.addClass('fail open');
            }
            testEl.addClass('test');
            testEl.html(testHtml);

            // each assert
            for (var i = 0; i < assertions.length; i++) {
                assertLi = $('<li>');
                assertHtml = '';
                assert = assertions[i];
                if (assert.failed()) {
                    assertHtml += (assert.message || assert.method || 'no message');
                    assertHtml += '<pre>' + (assert.error.stack || assert.error) + '</pre>';
                    assertLi.html(assertHtml);
                    assertLi.addClass('fail');
                } else {
                    assertLi.html(assert.message || assert.method || 'no message');
                    assertLi.addClass('pass');
                }
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
                banner.after("<p class='submit-issue'>Hmm, looks like some of the unit tests are failing.<br/><br/>" +
                    "It's hard to catch all the bugs across all timezones, so if you have a minute, " + 
                    "please submit an issue with your user agent, timezone, and the failing test here: " + 
                    "<a href='https://github.com/timrwood/moment/issues'>github.com/timrwood/moment/issues</a>." + 
                    "<br/><br/>Thanks!</p>");
            }

            banner.addClass(failures ? 'fail': 'pass');
            banner.text(assertions.passes() + ' passed, ' + assertions.failures() + ' failed. ' + duration + ' milliseconds.');
        }
    });

    tests.on('click', 'li.test', {}, function(){
        $(this).toggleClass('open');
    });
})();