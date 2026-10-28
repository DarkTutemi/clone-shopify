  (function () {
    "use strict";

    function initializeSenzioHeelTimeline(root) {
      if (!root || root.dataset.shtReady === "true") {
        return;
      }

      root.dataset.shtReady = "true";

      var carousel = root.querySelector("[data-sht-carousel]");
      var viewport = root.querySelector("[data-sht-viewport]");
      var track = root.querySelector("[data-sht-track]");
      var slides = Array.prototype.slice.call(
        root.querySelectorAll("[data-sht-slide]")
      );
      var navItems = Array.prototype.slice.call(
        root.querySelectorAll("[data-sht-go]")
      );
      var previousButton = root.querySelector("[data-sht-previous]");
      var nextButton = root.querySelector("[data-sht-next]");
      var progress = root.querySelector("[data-sht-progress]");

      if (
        !carousel ||
        !viewport ||
        !track ||
        !slides.length ||
        !previousButton ||
        !nextButton ||
        !progress
      ) {
        return;
      }

      var currentIndex = 0;
      var autoplayDelay = 5600;
      var autoplayTimer = null;
      var scrollTimer = null;
      var resizeTimer = null;
      var isHovered = false;
      var isFocused = false;
      var isDragging = false;
      var pointerStartX = 0;
      var scrollStartX = 0;

      function prefersReducedMotion() {
        return (
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      }

      function getSlideStep() {
        return slides[0]
          ? slides[0].getBoundingClientRect().width
          : viewport.clientWidth || 1;
      }

      function clampIndex(index) {
        if (index < 0) {
          return slides.length - 1;
        }

        if (index >= slides.length) {
          return 0;
        }

        return index;
      }

      function restartProgress() {
        progress.classList.remove("is-running");
        void progress.offsetWidth;

        if (!prefersReducedMotion()) {
          progress.classList.add("is-running");
        }
      }

      function updateActiveState(index) {
        currentIndex = clampIndex(index);

        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === currentIndex;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-current", active ? "true" : "false");
        });

        navItems.forEach(function (item, itemIndex) {
          var active = itemIndex === currentIndex;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", active ? "true" : "false");
        });
      }

      function scrollToStage(index, behavior) {
        var safeIndex = clampIndex(index);

        updateActiveState(safeIndex);

        viewport.scrollTo({
          left: safeIndex * getSlideStep(),
          behavior: behavior || (prefersReducedMotion() ? "auto" : "smooth")
        });

        restartProgress();
      }

      function moveNext() {
        scrollToStage(currentIndex + 1);
      }

      function movePrevious() {
        scrollToStage(currentIndex - 1);
      }

      function stopAutoplay() {
        if (!autoplayTimer) {
          return;
        }

        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }

      function startAutoplay() {
        stopAutoplay();

        if (
          prefersReducedMotion() ||
          isHovered ||
          isFocused ||
          isDragging ||
          document.hidden
        ) {
          return;
        }

        restartProgress();

        autoplayTimer = window.setInterval(function () {
          moveNext();
        }, autoplayDelay);
      }

      function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      previousButton.addEventListener("click", function () {
        movePrevious();
        restartAutoplay();
      });

      nextButton.addEventListener("click", function () {
        moveNext();
        restartAutoplay();
      });

      navItems.forEach(function (item, index) {
        item.addEventListener("click", function () {
          scrollToStage(index);
          restartAutoplay();
        });
      });

      carousel.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          movePrevious();
          restartAutoplay();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveNext();
          restartAutoplay();
        }

        if (event.key === "Home") {
          event.preventDefault();
          scrollToStage(0);
          restartAutoplay();
        }

        if (event.key === "End") {
          event.preventDefault();
          scrollToStage(slides.length - 1);
          restartAutoplay();
        }
      });

      viewport.addEventListener(
        "scroll",
        function () {
          window.clearTimeout(scrollTimer);

          scrollTimer = window.setTimeout(function () {
            var step = getSlideStep();

            if (!step) {
              return;
            }

            var index = Math.round(viewport.scrollLeft / step);
            updateActiveState(index);
            restartProgress();
          }, 80);
        },
        { passive: true }
      );

      viewport.addEventListener("pointerdown", function (event) {
        isDragging = true;
        pointerStartX = event.clientX;
        scrollStartX = viewport.scrollLeft;

        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(event.pointerId);

        stopAutoplay();
      });

      viewport.addEventListener("pointermove", function (event) {
        if (!isDragging) {
          return;
        }

        var distance = event.clientX - pointerStartX;
        viewport.scrollLeft = scrollStartX - distance;
      });

      function endDrag(event) {
        if (!isDragging) {
          return;
        }

        isDragging = false;
        viewport.classList.remove("is-dragging");

        if (
          event &&
          event.pointerId !== undefined &&
          viewport.hasPointerCapture(event.pointerId)
        ) {
          viewport.releasePointerCapture(event.pointerId);
        }

        var step = getSlideStep();
        var index = Math.round(viewport.scrollLeft / step);

        scrollToStage(index);
        startAutoplay();
      }

      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("pointerleave", function (event) {
        if (isDragging) {
          endDrag(event);
        }
      });

      carousel.addEventListener("mouseenter", function () {
        isHovered = true;
        stopAutoplay();
      });

      carousel.addEventListener("mouseleave", function () {
        isHovered = false;
        startAutoplay();
      });

      carousel.addEventListener("focusin", function () {
        isFocused = true;
        stopAutoplay();
      });

      carousel.addEventListener("focusout", function () {
        isFocused = false;
        startAutoplay();
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(function () {
          scrollToStage(currentIndex, "auto");
          restartAutoplay();
        }, 140);
      });

      updateActiveState(0);
      scrollToStage(0, "auto");
      startAutoplay();
    }

    function initializeAllSenzioHeelTimelines() {
      document.querySelectorAll("[data-sht-root]").forEach(function (root) {
        initializeSenzioHeelTimeline(root);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeAllSenzioHeelTimelines);
    } else {
      initializeAllSenzioHeelTimelines();
    }

    document.addEventListener("shopify:section:load", initializeAllSenzioHeelTimelines);
    document.addEventListener("gemPageBuilder:loaded", initializeAllSenzioHeelTimelines);
    document.addEventListener("gempages:loaded", initializeAllSenzioHeelTimelines);
    document.addEventListener("gp:page:loaded", initializeAllSenzioHeelTimelines);

    window.setTimeout(initializeAllSenzioHeelTimelines, 500);
    window.setTimeout(initializeAllSenzioHeelTimelines, 1200);
  })();
