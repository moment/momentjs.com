(function(){

	var $output = $('#output'),
		env = 'browser',
		before = {
			json : '',
			browser : 'moment.tz.add(',
			amd : 'define(["moment-timezone"], function (moment) {\n    moment.tz.add('
		},
		after = {
			json : '',
			browser : ');',
			amd : ');\n});'
		};

	function addZone (name, op) {
		var rule, rules, i,
			zone = window.momentTZData.zones[name],
			meta = window.momentTZData.meta[name],
			link = window.momentTZData.links[name];

		if (zone) {
			op.zones[name] = zone;
		}

		if (link) {
			op.links[name] = link;
			addZone(link, op);
		}

		if (meta) {
			rules = meta.rules.split(' ');
			for (i = 0; i < rules.length; i++) {
				op.rules[rules[i]] = window.momentTZData.rules[rules[i]];
			}
		}
	}

	function rebuild () {
		var op = {
				zones : {},
				rules : {},
				links : {}
			};

		$('[data-zone].active').each(function(){
			var name = $(this).data('zone');
			addZone(name, op);
		});

		op = JSON.stringify(op, null, 4);

		if (env === 'amd') {
			op = op.replace(/\n/g, '\n    ');
		}

		$output.text(before[env] + op + after[env]);
	}

	$(document).on('click', '[data-zone]', function(){
		$(this).toggleClass('active');
		rebuild();
	});

	$(document).on('click', '[data-toggle-group]', function(){
		var dom = $(this),
			group = dom.data('toggle-group'),
			others = $('[data-group="' + group + '"]');

		if (dom.is('.active')) {
			dom.removeClass('active');
			others.removeClass('active');
		} else {
			dom.addClass('active');
			others.addClass('active');
		}

		rebuild();
	});

	$(document).on('click', '[data-env]', function(){
		$('[data-env]').removeClass('active');
		$(this).addClass('active');
		env = $(this).data('env');
		rebuild();
	});

	rebuild ();

})();
