  (function () {
    "use strict";

    function initializeSenzioScience() {
      var sections = document.querySelectorAll(
        "[data-senzio-science]:not([data-ss-ready])"
      );

      sections.forEach(function (section) {
        section.setAttribute(
          "data-ss-ready",
          "true"
        );

        var metrics = Array.prototype.slice.call(
          section.querySelectorAll(".ss-metric")
        );

        function configureCircle(
          circle,
          percentage,
          reset
        ) {
          if (!circle) {
            return;
          }

          var radius =
            Number(circle.getAttribute("r")) || 44;

          var circumference =
            2 * Math.PI * radius;

          var safePercentage =
            Math.max(
              0,
              Math.min(
                100,
                Number(percentage) || 0
              )
            );

          var offset =
            circumference -
            circumference *
            (safePercentage / 100);

          circle.style.strokeDasharray =
            circumference + " " + circumference;

          circle.style.strokeDashoffset =
            reset
              ? circumference
              : offset;
        }

        function prepareMetrics() {
          metrics.forEach(function (metric) {
            var primaryCircle =
              metric.querySelector(
                ".ss-ring-progress"
              );

            var secondaryCircle =
              metric.querySelector(
                ".ss-outer-progress"
              );

            configureCircle(
              primaryCircle,
              0,
              true
            );

            configureCircle(
              secondaryCircle,
              0,
              true
            );

            if (primaryCircle) {
              primaryCircle.style.transition =
                "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)";
            }

            if (secondaryCircle) {
              secondaryCircle.style.transition =
                "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.14s";
            }
          });
        }

        function animateOnce() {
          if (
            section.hasAttribute(
              "data-ss-animated"
            )
          ) {
            return;
          }

          section.setAttribute(
            "data-ss-animated",
            "true"
          );

          section.classList.add(
            "ss-visible"
          );

          metrics.forEach(function (
            metric,
            index
          ) {
            var primaryPercentage =
              Number(
                metric.getAttribute(
                  "data-primary-percent"
                )
              ) || 0;

            var secondaryPercentage =
              Number(
                metric.getAttribute(
                  "data-secondary-percent"
                )
              ) || 0;

            var primaryCircle =
              metric.querySelector(
                ".ss-ring-progress"
              );

            var secondaryCircle =
              metric.querySelector(
                ".ss-outer-progress"
              );

            window.setTimeout(
              function () {
                configureCircle(
                  primaryCircle,
                  primaryPercentage,
                  false
                );

                configureCircle(
                  secondaryCircle,
                  secondaryPercentage,
                  false
                );
              },
              index * 120
            );
          });
        }

        prepareMetrics();

        var reducedMotion =
          window.matchMedia &&
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

        if (
          reducedMotion ||
          !("IntersectionObserver" in window)
        ) {
          animateOnce();
          return;
        }

        var observer =
          new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                  return;
                }

                animateOnce();

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

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        initializeSenzioScience
      );
    } else {
      initializeSenzioScience();
    }

    window.addEventListener(
      "load",
      initializeSenzioScience
    );

    document.addEventListener(
      "shopify:section:load",
      initializeSenzioScience
    );

    document.addEventListener(
      "gemPageBuilder:loaded",
      initializeSenzioScience
    );

    document.addEventListener(
      "gempages:loaded",
      initializeSenzioScience
    );

    document.addEventListener(
      "gp:page:loaded",
      initializeSenzioScience
    );

    window.setTimeout(
      initializeSenzioScience,
      500
    );

    window.setTimeout(
      initializeSenzioScience,
      1200
    );
  })();
