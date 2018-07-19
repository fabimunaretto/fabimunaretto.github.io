(function ($) {
  $(function () {
    $('.hero-image').addClass('hero_animate');

    $('.pos').animate({
      opacity: 1
    }, 900);

    // hide #back-top / back to top link
    $("#back-top").hide();

    // fade in #back-top / back to top link
    $(function () {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('#back-top').fadeIn();
        } else {
          $('#back-top').fadeOut();
        }
      });

      // scroll body to 0px on click
      $('#back-top a').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    });

    $('.main_nav li a, a.more').on('click', function (e) {
      e.preventDefault();
      var anchor = $(this);

      $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
      }, 1000);
    });

    $('.content-wrapper').waypoint({
      offset: '75%'
    });

    $('body').delegate('.content-wrapper', 'waypoint.reached', function (event, direction) {
      var $active = $(this);

      if (direction === "up") {
        $active = $active.prev();
      }

      if (!$active.length) $active = $active.end();

      $('.section-active').removeClass('section-active');
      $active.addClass('section-active');

      $('.link-active').removeClass('link-active');
      $(".main_nav li a[href='#" + $active.attr('id') + "']").addClass('link-active');
    });

    $("a.iframe").colorbox({
      iframe: true,
      innerWidth: 425,
      innerHeight: 344,
      maxWidth: "98%",
      maxHeight: "98%",
      rel: 'video'
    });

    check_webp_feature('lossless', function (feature, supported) {
      webpsupported = supported;

      $.getJSON("projetos.json", function (data) {
        var items = [];
        var galleries = [];
        var container = $("#portfolio_items");

        $.each(data.projetos, function (key, val) {
          var galleryName = "gallery" + key;

          galleries.push(galleryName);

          var line =
            "<li class='item " + val.tipo + "'>" +
            "<div class='awsm-item' style='background-image: url(" + getImageSrc(val, 0) + "); background-position: center; background-size: 200% 200%;'>" +
            "<div class='awsm-info'>" +
            "<h3>" + val.titulo + "</h3>" +
            "<p>" + val.descricao + "</p>" +
            "<p><a class='button small squared colorbox " + galleryName + "' href='" + getImageSrc(val, 0) +
            "' title='" + val.imagens[0].legenda + "'>Ver</a>";

          $.each(val.imagens, function (idx, data) {
            if (idx != 0) {
              line += "<a class='hdn-img " + galleryName + "' title='" + data.legenda + "'' href='" + getImageSrc(val, idx) + "'></a>";
            }
          });

          line +=
            "</p>" +
            "</div>" +
            "</div>" +
            "</li>"
          items.push(line);
        });

        $(items.join("")).appendTo(container);

        $('.awsm-item').each(function () { // the containers for all your galleries
          $(this).magnificPopup({
            delegate: 'a', // the selector for gallery item
            tClose: 'Fechar (Esc)',
            tLoading: 'Carregando...',
            type: 'image',
            gallery: {
              enabled: true,
              preload: [1, 2],
              tPrev: 'Anterior',
              tNext: 'Próxima',
              tCounter: '%curr% de %total%'
            }
          });
        });

        var $container = $('#portfolio_items').isotope({
          itemSelector: '.item',
          layoutMode: 'fitRows'
        });

        $('#portfolio_filter a').click(function (e) {
          e.preventDefault();
          
          var selector = $(this).attr('data-filter');

          $container.isotope({
            filter: selector
          });

          $("#portfolio_filter li").removeClass("current");
          $(this).closest("li").addClass("current");

          return false;
        });
      });
    });

  });
})(jQuery);

var webpsupported = false;

function getImageSrc(projeto, item) {
  var src = projeto.imagens[item].src;

  if (webpsupported) {
    src = src.substr(0, src.lastIndexOf(".")) + ".webp";
  }

  return encodeURI(projeto.pasta + src);
}

// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
function check_webp_feature(feature, callback) {
  var kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
  };
  var img = new Image();
  img.onload = function () {
    var result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
  };
  img.onerror = function () {
    callback(feature, false);
  };
  img.src = "data:image/webp;base64," + kTestImages[feature];
}