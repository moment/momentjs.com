$("pre.js").snippet("javascript", {style:"typical",showNum:false});
function update(){
    moment.lang('en');
    $('#js-format-now').html('"' + moment().format('dddd, MMMM Do YYYY, h:mm:ss a') + '"');
    setTimeout(update, 1000);
}
update();
$('#js-from-now').html('"' + moment([2011, 9, 31]).fromNow() + '"');
$('#js-add').html('"' + moment().subtract('days', 3).calendar() + '"');
moment.lang('fr');
$('#js-lang').html('"' + moment().format('LLLL') + '"');
moment.lang('en');