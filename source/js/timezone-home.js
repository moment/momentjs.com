(function(){

    var currentZone = 'America/Los_Angeles',
        width = $('.map-inset').outerWidth(),
        height = $('.map-inset').outerHeight();

    console.log(width, height);

    $('.map-inset').mousemove(function(e){
        var x = e.pageX - this.offsetLeft,
            y = e.pageY - this.offsetTop;

        console.log(x / width, y / height);
    });

})();
