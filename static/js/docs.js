$(function(){
	'use strict';

	function ScrollSpy(element, options) {
		var process  = $.proxy(this.process, this);

		this.$body          = $('body');
		this.$scrollElement = $(window);
		this.options        = $.extend({}, ScrollSpy.DEFAULTS, options);
		this.target         = '.docs-nav';
		this.$target        = $(this.target);
		this.offsets        = [];
		this.targets        = [];
		this.activeTarget   = null;
		this.scrollHeight   = 0;

		this.$scrollElement.on('scroll.bs.scrollspy', process);
		this.refresh();
		this.process();
	}

	ScrollSpy.DEFAULTS = {
		offset: 10
	};

	ScrollSpy.prototype.getScrollHeight = function () {
		return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
	};

	ScrollSpy.prototype.refresh = function () {
		this.offsets = [];
		this.targets = [];
		this.scrollHeight = this.getScrollHeight();

		var self     = this;

		this.$body
			.find(this.target + ' a')
			.map(function () {
				var $el   = $(this);
				var href  = $el.data('target') || $el.attr('href');
				var $href = /^#./.test(href) && $('[id="' + href.replace('#', '') + '"]');

				return ($href && $href.length && [[$href.offset().top, href]]) || null;
			})
			.sort(function (a, b) { return a[0] - b[0]; })
			.each(function () {
				self.offsets.push(this[0]);
				self.targets.push(this[1]);
			});
	};

	ScrollSpy.prototype.process = function () {
		var elScrollTop  = this.$scrollElement.scrollTop();
		var scrollTop    = elScrollTop + this.options.offset;
		var scrollHeight = this.getScrollHeight();
		var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height();
		var offsets      = this.offsets;
		var targets      = this.targets;
		var activeTarget = this.activeTarget;
		var i;

		if (this.scrollHeight != scrollHeight) {
			this.refresh();
		}

		this.$target.css('top', Math.min(130, Math.max(0, 130 - elScrollTop)));

		if (scrollTop >= maxScroll) {
			return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
		}

		if (activeTarget && scrollTop <= offsets[0]) {
			return activeTarget != (i = targets[0]) && this.activate(i);
		}

		for (i = offsets.length; i--;) {
			if (activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
				this.activate(targets[i]);
			}
		}
	};

	ScrollSpy.prototype.activate = function (target) {
		this.activeTarget = target;

		$(this.target).find('a, .docs-nav-section').removeClass('active');

		var selector = this.target + ' a[data-target="' + target + '"],' + this.target + ' a[href="' + target + '"]';

		$(selector).addClass('active').closest('.docs-nav-section').addClass('active');
	};

	$.fn.scrollspy = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.scrollspy');
			var options = typeof option == 'object' && option;

			if (!data) {
				$this.data('bs.scrollspy', (data = new ScrollSpy(this, options)));
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	};

	$(window).scrollspy();
});
