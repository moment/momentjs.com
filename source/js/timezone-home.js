(function(){
        moment.lang("en");

	var $map = $('.map-inset'),
		$labelName = $('.map-label-name'),
		$labelTime = $('.map-label-time'),
		$axisX = $('.map-axis-x'),
		$axisY = $('.map-axis-y'),
		width = $map.outerWidth(),
		height = $map.outerHeight(),
		i,
		lastCenter,
		centers = [];

	$(window).resize(function () {
		width = $map.outerWidth();
		height = $map.outerHeight();
	}).resize();

	function changeCenter (center) {
		if (center === lastCenter) {
			return;
		}
		if (lastCenter) {
			lastCenter.deactivate();
		}
		center.activate();
		lastCenter = center;
	}

	function Center (data, name) {
		this.x = (180 + data.lon) / 360;
		this.y = (90 - data.lat) / 180;
		this.dom = $('<span>').appendTo($map).css({
			left: this.x * 100 + '%',
			top: this.y * 100 + '%'
		});
		this.name = name;
		if (name === 'America/Los_Angeles') {
			changeCenter(this);
		}
	}

	Center.prototype = {
		distSqr : function (x, y) {
			var dx = this.x - x,
				dy = this.y - y;
			return dx * dx + dy * dy;
		},
		activate : function () {
			var m = moment.tz(this.name);
			$labelName.text(this.name);
			$labelTime.text(m.format("hh:mm a ") + m.zoneAbbr());
			$axisX.css('left', this.x * 100 + '%');
			$axisY.css('top', this.y * 100 + '%');
		},
		deactivate : function ()  {
			this.dom.removeClass('active');
		}
	};

	for (i in window.momentTZData.meta) {
		centers.push(new Center(window.momentTZData.meta[i], i));
	}

	$('.map-inset').mousemove(function (e) {
		var offset = $(this).offset(),
			x = e.pageX - offset.left,
			y = e.pageY - offset.top,
			px = x / width,
			py = y / height,
			dist,
			closestDist = 100,
			closestCenter,
			i;

		for (i = 0; i < centers.length; i++) {
			dist = centers[i].distSqr(px, py);
			if (dist < closestDist) {
				closestCenter = centers[i];
				closestDist = dist;
			}
		}

		if (closestCenter) {
			changeCenter(closestCenter);
		}
	});

})();
