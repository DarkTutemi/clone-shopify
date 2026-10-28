  (function () {
    "use strict";

    function initializeSenzioProof() {
      var sections = document.querySelectorAll(
        "[data-senzio-proof]:not([data-sp-ready])"
      );

      sections.forEach(function (section) {
        section.setAttribute(
          "data-sp-ready",
          "true"
        );

        var reducedMotion =
          window.matchMedia &&
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

        if (
          reducedMotion ||
          !("IntersectionObserver" in window)
        ) {
          section.classList.add(
            "sp-visible"
          );

          return;
        }

        var observer =
          new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                  return;
                }

                entry.target.classList.add(
                  "sp-visible"
                );

                observer.unobserve(
                  entry.target
                );
              });
            },
            {
              threshold: 0.12,
              rootMargin: "0px 0px -4% 0px"
            }
          );

        observer.observe(section);
      });
    }

    function initializeSenzioProofGallery() {
      var galleries = document.querySelectorAll(
        "[data-sp-gallery]:not([data-sp-gallery-ready])"
      );

      galleries.forEach(function (gallery) {
        gallery.setAttribute(
          "data-sp-gallery-ready",
          "true"
        );

        var scroll = gallery.querySelector(
          "[data-sp-scroll]"
        );

        var prev = gallery.querySelector(
          "[data-sp-prev]"
        );

        var next = gallery.querySelector(
          "[data-sp-next]"
        );

        var slides = gallery.querySelectorAll(
          ".sp-slide"
        );

        if (
          !scroll ||
          !slides.length
        ) {
          return;
        }

        var autoTimer = null;
        var autoDelay = 4200;
        var isHovering = false;
        var isTouching = false;

        function getCurrentIndex() {
          var width =
            scroll.clientWidth || 1;

          var index =
            Math.round(
              scroll.scrollLeft / width
            );

          return Math.max(
            0,
            Math.min(
              slides.length - 1,
              index
            )
          );
        }

        function goToSlide(
          index,
          behavior
        ) {
          var safeIndex = index;

          if (safeIndex < 0) {
            safeIndex = slides.length - 1;
          }

          if (safeIndex > slides.length - 1) {
            safeIndex = 0;
          }

          scroll.scrollTo({
            left: safeIndex * scroll.clientWidth,
            behavior: behavior || "smooth"
          });
        }

        function goNext() {
          goToSlide(
            getCurrentIndex() + 1,
            "smooth"
          );
        }

        function goPrev() {
          goToSlide(
            getCurrentIndex() - 1,
            "smooth"
          );
        }

        function stopAutoLoop() {
          if (autoTimer) {
            window.clearInterval(autoTimer);
            autoTimer = null;
          }
        }

        function startAutoLoop() {
          var reducedMotion =
            window.matchMedia &&
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;

          if (
            reducedMotion ||
            slides.length <= 1
          ) {
            return;
          }

          stopAutoLoop();

          autoTimer =
            window.setInterval(
              function () {
                if (
                  isHovering ||
                  isTouching
                ) {
                  return;
                }

                goNext();
              },
              autoDelay
            );
        }

        if (prev) {
          prev.addEventListener(
            "click",
            function () {
              stopAutoLoop();
              goPrev();
              startAutoLoop();
            }
          );
        }

        if (next) {
          next.addEventListener(
            "click",
            function () {
              stopAutoLoop();
              goNext();
              startAutoLoop();
            }
          );
        }

        gallery.addEventListener(
          "mouseenter",
          function () {
            isHovering = true;
          }
        );

        gallery.addEventListener(
          "mouseleave",
          function () {
            isHovering = false;
          }
        );

        scroll.addEventListener(
          "touchstart",
          function () {
            isTouching = true;
            stopAutoLoop();
          },
          {
            passive: true
          }
        );

        scroll.addEventListener(
          "touchend",
          function () {
            isTouching = false;
            startAutoLoop();
          },
          {
            passive: true
          }
        );

        scroll.addEventListener(
          "pointerdown",
          function () {
            isTouching = true;
            stopAutoLoop();
          },
          {
            passive: true
          }
        );

        scroll.addEventListener(
          "pointerup",
          function () {
            isTouching = false;
            startAutoLoop();
          },
          {
            passive: true
          }
        );

        window.addEventListener(
          "resize",
          function () {
            goToSlide(
              getCurrentIndex(),
              "auto"
            );
          }
        );

        startAutoLoop();
      });
    }

    function runAllSenzioProofScripts() {
      initializeSenzioProof();
      initializeSenzioProofGallery();
    }

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        runAllSenzioProofScripts
      );
    } else {
      runAllSenzioProofScripts();
    }

    window.addEventListener(
      "load",
      runAllSenzioProofScripts
    );

    document.addEventListener(
      "shopify:section:load",
      runAllSenzioProofScripts
    );

    document.addEventListener(
      "gemPageBuilder:loaded",
      runAllSenzioProofScripts
    );

    document.addEventListener(
      "gempages:loaded",
      runAllSenzioProofScripts
    );

    document.addEventListener(
      "gp:page:loaded",
      runAllSenzioProofScripts
    );

    window.setTimeout(
      runAllSenzioProofScripts,
      500
    );

    window.setTimeout(
      runAllSenzioProofScripts,
      1200
    );
  })();
