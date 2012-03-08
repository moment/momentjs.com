(function(){
    var langs = {
        'en' : 'English',
        'ca' : 'Catalan',
        'da' : 'Danish',
        'de' : 'German',
        'es' : 'Spanish',
        'eu' : 'Basque',
        'fr' : 'French',
        'gl' : 'Galician',
        'it' : 'Italian',
        'kr' : 'Korean',
        'nb' : 'Norwegian',
        'nl' : 'Dutch',
        'pl' : 'Polish',
        'pt' : 'Portuguese',
        'ru' : 'Russian',
        'sv' : 'Swedish',
        'tr' : 'Turkish',
        'zh-cn' : 'Chinese',
        'zh-tw' : 'Traditional Chinese'
    };

    // lang and format
    function update(){
        var formatHtml = '',
            fromHtml = '',
            calendarHtml = '',
            i,
            threeDaysAgo = moment().subtract('days', 3);
        for (i in langs) {
            moment.lang(i);
            formatHtml += "<p><b>" + langs[i] + " :</b> ";
            formatHtml += moment().format('LLLL');
            formatHtml += "</p>";

            calendarHtml += "<p><b>" + langs[i] + " :</b> ";
            calendarHtml += threeDaysAgo.calendar();
            calendarHtml += "</p>";

            fromHtml += "<p><b>" + langs[i] + " :</b> ";
            fromHtml += moment([2011, 9, 31]).fromNow();
            fromHtml += "</p>";
        }
        $('#js-lang').html(formatHtml);
        $('#js-from-now').html(fromHtml);
        $('#js-add').html(calendarHtml);

        // formats
        moment.lang('en');
        var formatHtmlEn = ''
        formatHtmlEn += "<p>";
        formatHtmlEn += moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
        formatHtmlEn += "</p><p>";
        formatHtmlEn += moment().format('dddd [on the] wo [week of the year]');
        formatHtmlEn += "</p><p>";
        formatHtmlEn += moment().format("MMM Do 'YY");
        formatHtmlEn += "</p><p>";
        formatHtmlEn += moment().format();
        formatHtmlEn += "</p>";
        $('#js-format-now').html(formatHtmlEn);
        
        setTimeout(update, 1000);
    }
    update();
})();