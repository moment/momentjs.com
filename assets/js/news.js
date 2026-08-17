$(function () {
  "use strict";

  var $posts = $(".news-post");
  var $links = $(".news-nav a");

  function showPost(hash) {
    var id = hash.replace(/^#/, "");
    var $post = $posts.filter(function () {
      return this.id === id;
    });

    if (!$post.length) {
      return;
    }

    $posts.find(".news-post-details").prop("open", false);
    $post.find(".news-post-details").prop("open", true);
    $links
      .removeClass("active")
      .filter(function () {
        return this.hash === hash;
      })
      .addClass("active");
  }

  $links.on("click", function () {
    showPost(this.hash);
  });

  $(window).on("hashchange", function () {
    showPost(window.location.hash);
  });

  if (window.location.hash) {
    showPost(window.location.hash);
  }
});
