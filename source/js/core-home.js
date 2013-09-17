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
        arr.push(moment().format('l'));
        arr.push(moment().format('LL'));
        arr.push(moment().format('ll'));
        arr.push(moment().format('LLL'));
        arr.push(moment().format('lll'));
        arr.push(moment().format('LLLL'));
        arr.push(moment().format('llll'));
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

        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;


        $('#hour').css("transform", "rotate(" + hour + "deg)");
        $('#minute').css("transform", "rotate(" + minute + "deg)");
        $('#second').css("transform", "rotate(" + second + "deg)");
    }

    function timedUpdate () {
        update();
        setTimeout(timedUpdate, 1000);
    }

    timedUpdate();

    $(document).on('click', '[data-lang]', function(){
        var dom = $(this);
        currentLang = dom.data('lang');
        $('[data-lang]').removeClass('active');
        dom.addClass('active');
        update();
    });

	// Modified version of
	// http://stackoverflow.com/questions/11128130/select-text-in-javascript
	function selectText(element) {
		if (document.body.createTextRange) { // ms
			var range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) { // moz, opera, webkit
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	$('.selectable').on('click', function(event) {
		// console.log("got click");
		// console.log(event);
		selectText(event.currentTarget);
	});
})();
