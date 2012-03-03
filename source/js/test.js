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
            banner.removeClass('alert-info');
            banner.addClass('alert-error');
        }
        banner.html('<h3>' + passed + ' passed.</h3><h3>' + failed + ' failed.</h3><h3>' + duration + ' milliseconds.</h3>');
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
            if (assertions.failures()) {
                testEl.addClass('fail open');
                testHtml += assertions.passes() + ' passed,';
                testHtml += assertions.failures() + ' failed.</div>';
            } else {
                testHtml += 'All ' + assertions.passes() + ' passed.</div>';
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

            if (failures || true) {
                banner.after("<p class='alert alert-error'>Hmm, looks like some of the unit tests are failing.<br/><br/>" +
                    "It's hard to catch all the bugs across all timezones, so if you have a minute, " + 
                    "please submit an issue with your user agent, timezone, and the failing test here.<br/><br/>" + 
                    "<a class='btn' href='https://github.com/timrwood/moment/issues'>github.com/timrwood/moment/issues</a>" + 
                    "<br/><br/>Thanks!</p>");
            }

            banner.addClass(failures ? 'fail': 'pass');
            updateTest(assertions.passes(), assertions.failures() + 1);
        }
    });

    tests.on('click', 'li.test', {}, function(){
        $(this).toggleClass('open');
    });
})();