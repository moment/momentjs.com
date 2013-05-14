(function(){

    var currentZone = 'America/Los_Angeles';

    function update(){
        $('#js-zone').html(moment().tz(currentZone).format());
        $('.zone-name').html(currentZone);
    }

    function timedUpdate () {
        update();
        setTimeout(timedUpdate, 1000);
    }

    timedUpdate();

    $(document).on('click', '[data-zone]', function(){
        var dom = $(this);
        currentZone = dom.data('zone');
        $('[data-zone]').removeClass('active');
        dom.addClass('active');
        update();
    });

})();
