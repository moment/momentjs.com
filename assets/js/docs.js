$(function () {
  "use strict";

  var projectStatusRedirects = {
    "#/-project-status/": "/news/",
    "#/-project-status/intro/": "/news/",
    "#/-project-status/recommendations/": "/news/#2020-09-14-project-status",
    "#/-project-status/future/": "/news/#2020-09-14-project-status",
  };
  var projectStatusRedirect = projectStatusRedirects[window.location.hash];

  if (projectStatusRedirect) {
    window.location.replace(projectStatusRedirect);
    return;
  }

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this);

    this.$body = $("body");
    this.$scrollElement = $(window);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.target = ".docs-nav";
    this.$target = $(this.target);
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on("scroll.bs.scrollspy", process);
    this.refresh();
    this.process();
  }

  ScrollSpy.DEFAULTS = {
    offset: 10,
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return (
      this.$scrollElement[0].scrollHeight ||
      Math.max(
        this.$body[0].scrollHeight,
        document.documentElement.scrollHeight
      )
    );
  };

  ScrollSpy.prototype.refresh = function () {
    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    var self = this;

    this.$body
      .find(this.target + " a")
      .map(function () {
        var $el = $(this);
        var href = $el.data("target") || $el.attr("href");
        var $href =
          /^#./.test(href) && $('[id="' + href.replace("#", "") + '"]');

        return ($href && $href.length && [[$href.offset().top, href]]) || null;
      })
      .sort(function (a, b) {
        return a[0] - b[0];
      })
      .each(function () {
        self.offsets.push(this[0]);
        self.targets.push(this[1]);
      });
  };

  ScrollSpy.prototype.process = function () {
    var elScrollTop = this.$scrollElement.scrollTop();
    var scrollTop = elScrollTop + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var targetTop = $(".docs").offset().top + 20;
    var maxScroll =
      this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    this.$target.css(
      "top",
      Math.min(targetTop, Math.max(0, targetTop - elScrollTop))
    );

    if (scrollTop >= maxScroll) {
      return (
        activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
      );
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i);
    }

    for (i = offsets.length; i--;) {
      if (
        activeTarget != targets[i] &&
        scrollTop >= offsets[i] &&
        (!offsets[i + 1] || scrollTop <= offsets[i + 1])
      ) {
        this.activate(targets[i]);
      }
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    $(this.target).find("a, .docs-nav-section").removeClass("active");

    var selector =
      this.target +
      ' a[data-target="' +
      target +
      '"],' +
      this.target +
      ' a[href="' +
      target +
      '"]';

    $(selector)
      .addClass("active")
      .closest(".docs-nav-section")
      .addClass("active");
  };

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.scrollspy");
      var options = typeof option == "object" && option;

      if (!data) {
        $this.data("bs.scrollspy", (data = new ScrollSpy(this, options)));
      }
      if (typeof option == "string") {
        data[option]();
      }
    });
  };

  $("[data-docs-tabs]").each(function () {
    var $tabGroup = $(this);
    var $tabs = $tabGroup.find('[role="tab"]');
    var $panels = $tabGroup.find('[role="tabpanel"]');

    function activate($tab, moveFocus) {
      var panelId = $tab.attr("aria-controls");

      $tabs.attr({
        "aria-selected": "false",
        tabindex: "-1",
      });
      $panels.attr("hidden", "hidden");

      $tab.attr("aria-selected", "true").removeAttr("tabindex");
      $tabGroup.find("#" + panelId).removeAttr("hidden");

      if (moveFocus) {
        $tab.focus();
      }
    }

    $tabs.on("click", function () {
      activate($(this), false);
    });

    $tabs.on("keydown", function (event) {
      var index = $tabs.index(this);
      var nextIndex;

      if (event.which === 36) {
        nextIndex = 0;
      } else if (event.which === 35) {
        nextIndex = $tabs.length - 1;
      } else if (event.which === 37 || event.which === 38) {
        nextIndex = (index - 1 + $tabs.length) % $tabs.length;
      } else if (event.which === 39 || event.which === 40) {
        nextIndex = (index + 1) % $tabs.length;
      } else {
        return;
      }

      event.preventDefault();
      activate($tabs.eq(nextIndex), true);
    });
  });

  $(window).scrollspy();
});
