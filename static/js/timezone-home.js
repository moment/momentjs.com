(function(){

	var currentZone,
		$map = $('.map-inset'),
		$labelName = $('.map-label-name'),
		$labelTime = $('.map-label-time'),
		width = $map.outerWidth(),
		height = $map.outerHeight(),
		i,
		lastCenter,
		centers = [];

	function Center (data, name) {
		this.x = (180 + data.lon) / 360;
		this.y = (90 - data.lat) / 180;
		this.dom = $('<span>').appendTo($map).css({
			left: this.x * 100 + '%',
			top: this.y * 100 + '%'
		});
		this.name = name;
	}

	Center.prototype = {
		distSqr : function (x, y) {
			var dx = this.x - x,
				dy = this.y - y;
			return dx * dx + dy * dy;
		}
	};

	for (i in window.momentTZData.meta) {
		centers.push(new Center(window.momentTZData.meta[i], i));
	}

	function changeZone (zone) {
		if (zone === currentZone) {
			return;
		}
		currentZone = zone;
		var m = moment.tz(zone);
		$labelName.text(zone);
		$labelTime.text(m.format("hh:mm a ") + m.zoneAbbr());
	}

	changeZone('America/Los_Angeles');

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
			if (lastCenter && lastCenter !== closestCenter) {
				lastCenter.dom.removeClass('active');
			}
			lastCenter = closestCenter;
			changeZone(closestCenter.name);
			closestCenter.dom.addClass('active');
		}
	});

})();
