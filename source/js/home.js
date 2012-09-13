(function(){

    var currentLang = 'en';

    /********************************************
        Formatting
    ********************************************/

    function formatArray(array) {
        return array.join('<br/>');
    }

    function calendarHtml() {
        var arr = [];
        arr.push(moment().subtract('days', 10).calendar());
        arr.push(moment().subtract('days', 6).calendar());
        arr.push(moment().subtract('days', 3).calendar());
        arr.push(moment().subtract('days', 1).calendar());
        arr.push(moment().calendar());
        arr.push(moment().add('days', 1).calendar());
        arr.push(moment().add('days', 3).calendar());
        arr.push(moment().add('days', 10).calendar());
        return formatArray(arr);
    }

    function formatHtml() {
        var arr = [];
        arr.push(moment().format('MMMM Do YYYY, h:mm:ss a'));
        arr.push(moment().format('dddd'));
        arr.push(moment().format("MMM Do YY"));
        arr.push(moment().format('YYYY [escaped] YYYY'));
        arr.push(moment().format());
        return formatArray(arr);
    }

    function fromHtml() {
        var arr = [];
        arr.push(moment("20111031", "YYYYMMDD").fromNow());
        arr.push(moment("20120620", "YYYYMMDD").fromNow());
        arr.push(moment().startOf('day').fromNow());
        arr.push(moment().endOf('day').fromNow());
        arr.push(moment().startOf('hour').fromNow());
        return formatArray(arr);
    }

    function langHtml() {
        var arr = [];
        arr.push(moment().format('L'));
        arr.push(moment().format('LL'));
        arr.push(moment().format('LLL'));
        arr.push(moment().format('LLLL'));
        return formatArray(arr);
    }

    /********************************************
        Update
    ********************************************/

    function update(){
        moment.lang(currentLang);

        $('#js-format').html(formatHtml());
        $('#js-from-now').html(fromHtml());
        $('#js-calendar').html(calendarHtml());
        $('#js-lang').html(langHtml());
    }

    function timedUpdate () {
        update();
        setTimeout(timedUpdate, 1000);
    }

    if (window.location.pathname.match('docs')) {
        initDocs();
    } else {
        timedUpdate();
    }

    $(document).on('click', '[data-lang]', function(){
        var dom = $(this);
        currentLang = dom.data('lang');
        $('[data-lang]').removeClass('active');
        dom.addClass('active');
        update();
    });

    function initDocs(){
        var dropdowns = $('.dropdown');
        $(document).on('click', function (e) {
            var el = $(e.target);
            if (!el.is('.dropdown-toggle')) {
                el = el.closest('.dropdown-toggle');
            }
            dropdowns.removeClass('open');
            if (el.length) {
                el.closest('.dropdown').addClass('open');
            }
        });
    }

})();
