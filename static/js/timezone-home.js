(function(){
	moment.locale("en");

	var $map = $('.map-inset'),
		$labelName = $('.map-label-name'),
		$labelTime = $('.map-label-time'),
		$axisX = $('.map-axis-x'),
		$axisY = $('.map-axis-y'),
		width = $map.outerWidth(),
		height = $map.outerHeight(),
		lastCenter,
		centers = [],
		guess = moment.tz.guess();

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

	function Center (data) {
		this.name = data.name;
		this.x = (180 + data.long) / 360;
		this.y = (90 - data.lat) / 180;
		this.dom = $('<span>').appendTo($map).css({
			left: this.x * 100 + '%',
			top: this.y * 100 + '%'
		});
		if (this.name === guess) {
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
			var m = moment().tz(this.name);
			$labelName.text(this.name);
			$labelTime.text(m.format("hh:mm a ") + m.zoneAbbr());
			$axisX.css('left', this.x * 100 + '%');
			$axisY.css('top', this.y * 100 + '%');
		},
		deactivate : function ()  {
			this.dom.removeClass('active');
		}
	};

	$.getJSON('/data/moment-timezone-meta.json').then(function (data) {
		for (var name in data.zones) {
			centers.push(new Center(data.zones[name]));
		}
	});

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
