
(function () {

  "use strict";


  /* =========================================================
     INITIALIZE FAQ
  ========================================================= */

  function initializeSenzioFaqLive() {

    var sections =
      document.querySelectorAll(
        "[data-senzio-faq-live]:not([data-sfl-ready])"
      );


    sections.forEach(function (section) {


      /* Prevent duplicate initialization */

      section.setAttribute(
        "data-sfl-ready",
        "true"
      );


      /* =====================================================
         GET FAQ ITEMS
      ====================================================== */

      var items =
        Array.prototype.slice.call(
          section.querySelectorAll(
            ".sfl-item"
          )
        );


      /* =====================================================
         ACCORDION
      ====================================================== */

      items.forEach(function (item) {

        var button =
          item.querySelector(
            ".sfl-question"
          );


        if (!button) {
          return;
        }


        button.addEventListener(
          "click",
          function () {


            var shouldOpen =
              !item.classList.contains(
                "is-open"
              );


            /* ===============================================
               CLOSE ALL ITEMS
            ================================================ */

            items.forEach(
              function (otherItem) {

                var otherButton =
                  otherItem.querySelector(
                    ".sfl-question"
                  );


                otherItem.classList.remove(
                  "is-open"
                );


                if (otherButton) {

                  otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                  );

                }

              }
            );


            /* ===============================================
               OPEN CLICKED ITEM
            ================================================ */

            if (shouldOpen) {

              item.classList.add(
                "is-open"
              );


              button.setAttribute(
                "aria-expanded",
                "true"
              );

            }

          }
        );

      });


      /* =====================================================
         REDUCED MOTION DETECTION
      ====================================================== */

      var reducedMotion =
        window.matchMedia &&
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;


      /* =====================================================
         FALLBACK
      ====================================================== */

      if (
        reducedMotion ||
        !("IntersectionObserver" in window)
      ) {

        section.classList.add(
          "sfl-visible"
        );

        return;
      }


      /* =====================================================
         INTERSECTION OBSERVER
      ====================================================== */

      var observer =
        new IntersectionObserver(

          function (entries) {

            entries.forEach(
              function (entry) {


                if (!entry.isIntersecting) {
                  return;
                }


                entry.target.classList.add(
                  "sfl-visible"
                );


                observer.unobserve(
                  entry.target
                );

              }
            );

          },

          {

            threshold:
              0.12,

            rootMargin:
              "0px 0px -4% 0px"

          }

        );


      observer.observe(
        section
      );

    });

  }


  /* =========================================================
     DOM READY
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      initializeSenzioFaqLive

    );

  } else {

    initializeSenzioFaqLive();

  }


  /* =========================================================
     WINDOW LOAD
  ========================================================= */

  window.addEventListener(

    "load",

    initializeSenzioFaqLive

  );


  /* =========================================================
     SHOPIFY SECTION LOAD
  ========================================================= */

  document.addEventListener(

    "shopify:section:load",

    initializeSenzioFaqLive

  );


  /* =========================================================
     GEMPAGES EVENTS
  ========================================================= */

  document.addEventListener(

    "gemPageBuilder:loaded",

    initializeSenzioFaqLive

  );


  document.addEventListener(

    "gempages:loaded",

    initializeSenzioFaqLive

  );


  document.addEventListener(

    "gp:page:loaded",

    initializeSenzioFaqLive

  );


  /* =========================================================
     DELAYED FALLBACK INITIALIZATION
  ========================================================= */

  window.setTimeout(

    initializeSenzioFaqLive,

    500

  );


  window.setTimeout(

    initializeSenzioFaqLive,

    1200

  );


})();

