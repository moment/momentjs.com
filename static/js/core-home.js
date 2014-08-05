(function(){

    var currentLang = 'en',
        snippets = [];

    function updateSnippets () {
        var i;

        moment.locale(currentLang);

        for (i = 0; i < snippets.length; i++) {
            snippets[i].render();
        }
    }

    function updateClock(){
        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

        $('#hour').css("transform", "rotate(" + hour + "deg)");
        $('#minute').css("transform", "rotate(" + minute + "deg)");
        $('#second').css("transform", "rotate(" + second + "deg)");
    }

    function spaces (length) {
        var out = "";
        while (out.length < length) {
            out += " ";
        }
        return out;
    }

    function Snippet (el) {
        var longest = 0,
            i,
            text  = this.text  = el.text().split('\n'),
            html  = this.html  = el.html().split('\n'),
            evals = this.evals = [];

        this.el = el;

        for (i = 0; i < text.length; i++) {
            longest = Math.max(text[i].length, longest);
            evals[i] = new Function('return ' + text[i]);
        }

        for (i = 0; i < text.length; i++) {
            html[i] += spaces(longest - text[i].length);
        }
    }

    Snippet.prototype.render = function () {
        var output = [],
            i;

        for (i = 0; i < this.html.length; i++) {
            output[i] = this.html[i];
            output[i] += '<span class="comment"> // ';
            output[i] += this.evals[i]();
            output[i] += '</span>';
        }

        this.el.html(output.join('\n'));
    };


    function timedUpdate () {
        updateClock();
        updateSnippets();
        setTimeout(timedUpdate, 1000);
    }

    $('.page-moment-index code').each(function () {
        snippets.push(new Snippet($(this)));
    });

    timedUpdate();

    $(document).on('click', '[data-locale]', function(){
        var dom = $(this);
        currentLang = dom.data('locale');
        $('[data-locale]').removeClass('active');
        dom.addClass('active');
        updateSnippets();
    });
})();
