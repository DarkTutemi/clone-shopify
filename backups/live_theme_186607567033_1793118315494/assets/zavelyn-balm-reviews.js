  (function () {
    "use strict";

    /* =====================================================
       SCIATICA CUSTOMER REVIEW DATA

       First 8:
       - Male images
       - Male names

       Last 8:
       - Female images
       - Female names
    ===================================================== */

    var senzioPlantarReviews = [

      {
        name: "Michael T******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_9.jpg?v=1783881888",
        date: "1 day ago",
        stars: 5,
        title: "My First Steps Hurt Much Less",
        text:
          "The worst pain used to hit the moment I stepped out of bed. After using the balm every day on my heel and arch, those first morning steps feel far less sharp and much easier."
      },

      {
        name: "Robert H******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_4.jpg?v=1783881888",
        date: "3 days ago",
        stars: 5,
        title: "Takes the Edge Off Heel Pain",
        text:
          "Standing for long hours made the bottom of my heel feel bruised and tight. Massaging this balm in morning and night helps calm that sore pressure and makes walking more manageable."
      },

      {
        name: "David P******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_10.jpg?v=1783881888",
        date: "5 days ago",
        stars: 5,
        title: "My Arch Feels Less Tight",
        text:
          "I had a constant pulling feeling through my arch that made each step uncomfortable. Daily use has helped loosen the area and made my foot feel more relaxed."
      },

      {
        name: "James W******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_8.jpg?v=1783881888",
        date: "1 week ago",
        stars: 4,
        title: "Helps After Being on My Feet",
        text:
          "By afternoon my heel used to feel hot, sore, and overworked. Applying the balm after work helps settle that pain and gives my foot a more comfortable evening."
      },

      {
        name: "Richard M******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_1.jpg?v=1783881888",
        date: "2 weeks ago",
        stars: 5,
        title: "Walking Feels More Natural Again",
        text:
          "Plantar pain made me change how I walked just to protect my heel. With regular use, the heel and arch feel less tender and I can walk with a more normal stride."
      },

      {
        name: "Thomas B******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_7.jpg?v=1783881888",
        date: "3 weeks ago",
        stars: 5,
        title: "Great for That Deep Heel Ache",
        text:
          "The ache at the bottom of my heel used to linger all day. This balm gives soothing comfort and helps the soreness settle faster, especially after walking."
      },

      {
        name: "Daniel K******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_2.jpg?v=1783881888",
        date: "1 month ago",
        stars: 5,
        title: "A Better Morning Routine",
        text:
          "I used to brace myself before taking my first steps in the morning. Massaging this into my heel and arch every day has made the foot feel looser and easier to move."
      },

      {
        name: "George A******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_6.jpg?v=1783881888",
        date: "2 months ago",
        stars: 4,
        title: "The Pain Is Easier to Manage",
        text:
          "My heel pain used to flare up after errands or long walks. Several weeks of consistent use have helped reduce the tightness and made those flare-ups easier to manage."
      },

      {
        name: "Sarah J******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_14.jpg?v=1783882136",
        date: "2 days ago",
        stars: 5,
        title: "Less Stabbing Pain in My Heel",
        text:
          "I had a sharp stabbing feeling under my heel whenever I stood after resting. The balm helps calm that spot and makes each step feel much less intimidating."
      },

      {
        name: "Linda C******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_17.jpg?v=1783882136",
        date: "4 days ago",
        stars: 5,
        title: "My Foot Feels More Relaxed",
        text:
          "The bottom of my foot often felt tight from the heel into the arch. Since using the balm consistently, that tension settles faster and walking feels smoother."
      },

      {
        name: "Carolyn B******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_11.jpg?v=1783882136",
        date: "6 days ago",
        stars: 5,
        title: "A Big Help for Flare-Ups",
        text:
          "My plantar flare-ups made it painful to stand in the kitchen or walk through the store. Gentle massage with this balm helps calm the area and makes daily movement easier."
      },

      {
        name: "Patricia M******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_16.jpg?v=1783882136",
        date: "1 week ago",
        stars: 4,
        title: "Comfort After Long Days",
        text:
          "Standing too long left my heel and arch feeling sore and tired. Applying the balm afterward helps release the tension and gives me a more comfortable evening."
      },

      {
        name: "Barbara Y******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_13.jpg?v=1783882136",
        date: "2 weeks ago",
        stars: 5,
        title: "Less Pulling Through My Arch",
        text:
          "I felt a pulling sensation through the arch whenever I walked barefoot. Consistent use has helped that area feel more flexible and less irritated."
      },

      {
        name: "Susan H******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_12.jpg?v=1783882136",
        date: "1 month ago",
        stars: 5,
        title: "Long Walks Feel Possible Again",
        text:
          "I avoided longer walks because my heel would start throbbing halfway through. Regular use has helped calm the soreness and made it easier to stay active."
      },

      {
        name: "Margaret W******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_15.jpg?v=1783882136",
        date: "2 months ago",
        stars: 5,
        title: "My Heel Feels Looser",
        text:
          "By evening, my heel and arch often felt stiff and overworked. The balm eases that tight feeling and helps my foot feel more relaxed before bed."
      },

      {
        name: "Dorothy G******",
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/images_3.jpg?v=1783882136",
        date: "3 months ago",
        stars: 4,
        title: "Helps Keep Heel Pain Under Control",
        text:
          "My heel pain caused soreness, tightness, and discomfort with nearly every step. The soothing sensation and regular massage help keep the pain under control throughout the day."
      }
    ];

    if (window.MB_REVIEW_DATA) {
      window.MB_REVIEW_DATA.forEach(function (row, index) {
        var base = senzioPlantarReviews[index];
        if (!base || !row) return;
        ["name", "date", "stars", "title", "text", "image"].forEach(function (key) {
          if (row[key]) base[key] = row[key];
        });
      });
    }

    if (window.MB_REVIEW_ASSETS) {
      senzioPlantarReviews.forEach(function (review) {
        var file = String(review.image || "").split("/").pop().split("?")[0];
        if (window.MB_REVIEW_ASSETS[file]) review.image = window.MB_REVIEW_ASSETS[file];
      });
    }

    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeSERHTML(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    /* =====================================================
       STARS
    ===================================================== */

    function createSERStars(stars) {
      var output =
        "";

      for (
        var index = 1;
        index <= 5;
        index += 1
      ) {
        if (
          index <= stars
        ) {
          output +=
            "<i>★</i>";
        } else {
          output +=
            '<i class="ser-star-empty">★</i>';
        }
      }

      return output;
    }

    /* =====================================================
       CARD TEMPLATE
    ===================================================== */

    function createSERCard(review) {
      var name =
        escapeSERHTML(
          review.name
        );

      var image =
        escapeSERHTML(
          review.image
        );

      var date =
        escapeSERHTML(
          review.date
        );

      var title =
        escapeSERHTML(
          review.title
        );

      var text =
        escapeSERHTML(
          review.text
        );

      var starLabel =
        review.stars === 5
          ? "Five out of five stars"
          : "Four out of five stars";

      return (
        '<article class="ser-card">' +

          '<div class="ser-card-top">' +

            '<span class="ser-card-stars" aria-label="' +
              starLabel +
            '">' +

              createSERStars(
                review.stars
              ) +

            "</span>" +

            '<span class="ser-date">' +
              date +
            "</span>" +

          "</div>" +

          '<div class="ser-review-content">' +

            "<h3>" +
              title +
            "</h3>" +

            "<p>“" +
              text +
            "”</p>" +

          "</div>" +

          '<footer class="ser-author">' +

            '<span class="ser-avatar">' +

              '<img' +
                ' src="' + image + '"' +
                ' alt="' + name + ' customer profile photo"' +
                ' width="96" height="96"' +
                ' loading="lazy"' +
                ' decoding="async"' +
              ">" +

            "</span>" +

            '<span class="ser-author-copy">' +

              "<strong>" +
                name +
              "</strong>" +

              "<small>" +

                '<svg viewBox="0 0 20 20" aria-hidden="true">' +

                  '<circle cx="10" cy="10" r="9"></circle>' +

                  '<path d="m6 10 2.5 2.5L14 7"></path>' +

                "</svg>" +

                "Verified customer" +

              "</small>" +

            "</span>" +

          "</footer>" +

        "</article>"
      );
    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeSenzioPlantarReviews() {
      var sections =
        document.querySelectorAll(
          "[data-ser-reviews]:not([data-ser-ready])"
        );

      sections.forEach(
        function (section) {
          section.setAttribute(
            "data-ser-ready",
            "true"
          );

          var track =
            section.querySelector(
              "[data-ser-track]"
            );

          var previousButton =
            section.querySelector(
              "[data-ser-previous]"
            );

          var nextButton =
            section.querySelector(
              "[data-ser-next]"
            );

          var pagination =
            section.querySelector(
              "[data-ser-pagination]"
            );

          if (
            !track ||
            !previousButton ||
            !nextButton ||
            !pagination
          ) {
            return;
          }

          /* ---------------------------------------------
             CREATE ALL CARDS
          --------------------------------------------- */

          var cardsHTML =
            "";

          senzioPlantarReviews.forEach(
            function (review) {
              cardsHTML +=
                createSERCard(
                  review
                );
            }
          );

          track.innerHTML =
            cardsHTML;

          var cards =
            Array.prototype.slice.call(
              track.querySelectorAll(
                ".ser-card"
              )
            );

          var visibleDotCount =
            7;

          var updateTimer =
            null;

          var resizeTimer =
            null;

          var autoplayTimer =
            null;

          var autoplayDelay =
            5000;

          var isHovered =
            false;

          var isInteracting =
            false;

          /* ---------------------------------------------
             REDUCED MOTION
          --------------------------------------------- */

          function prefersReducedMotion() {
            return (
              window.matchMedia &&
              window
                .matchMedia(
                  "(prefers-reduced-motion: reduce)"
                )
                .matches
            );
          }

          /* ---------------------------------------------
             GAP
          --------------------------------------------- */

          function getTrackGap() {
            var styles =
              window.getComputedStyle(
                track
              );

            return (
              parseFloat(
                styles.columnGap
              ) ||
              parseFloat(
                styles.gap
              ) ||
              0
            );
          }

          /* ---------------------------------------------
             CARD STEP
          --------------------------------------------- */

          function getCardStep() {
            if (
              !cards.length
            ) {
              return (
                track.clientWidth ||
                1
              );
            }

            return (
              cards[0]
                .getBoundingClientRect()
                .width +
              getTrackGap()
            );
          }

          /* ---------------------------------------------
             CURRENT POSITION
          --------------------------------------------- */

          function getCurrentIndex() {
            var step =
              getCardStep();

            if (!step) {
              return 0;
            }

            var index =
              Math.round(
                track.scrollLeft /
                step
              );

            return Math.max(
              0,
              Math.min(
                getMaximumIndex(),
                index
              )
            );
          }

          /* ---------------------------------------------
             VISIBLE CARDS
          --------------------------------------------- */

          function getVisibleCardCount() {
            var step =
              getCardStep();

            if (!step) {
              return 1;
            }

            return Math.max(
              1,
              Math.floor(
                track.clientWidth /
                step
              )
            );
          }

          /* ---------------------------------------------
             MAXIMUM POSITION
          --------------------------------------------- */

          function getMaximumIndex() {
            return Math.max(
              0,
              cards.length -
              getVisibleCardCount()
            );
          }

          /* ---------------------------------------------
             SCROLL TO POSITION
          --------------------------------------------- */

          function scrollToIndex(
            targetIndex,
            behavior
          ) {
            var maximumIndex =
              getMaximumIndex();

            var safeIndex =
              Math.max(
                0,
                Math.min(
                  maximumIndex,
                  targetIndex
                )
              );

            track.scrollTo({
              left:
                safeIndex *
                getCardStep(),

              behavior:
                behavior ||
                (
                  prefersReducedMotion()
                    ? "auto"
                    : "smooth"
                )
            });
          }

          /* ---------------------------------------------
             NEXT
          --------------------------------------------- */

          function moveNext() {
            var currentIndex =
              getCurrentIndex();

            var maximumIndex =
              getMaximumIndex();

            if (
              currentIndex >=
              maximumIndex
            ) {
              scrollToIndex(
                0
              );

              return;
            }

            scrollToIndex(
              currentIndex + 1
            );
          }

          /* ---------------------------------------------
             PREVIOUS
          --------------------------------------------- */

          function movePrevious() {
            var currentIndex =
              getCurrentIndex();

            if (
              currentIndex <= 0
            ) {
              scrollToIndex(
                getMaximumIndex()
              );

              return;
            }

            scrollToIndex(
              currentIndex - 1
            );
          }

          /* ---------------------------------------------
             PAGINATION
          --------------------------------------------- */

          function renderPagination(
            currentIndex
          ) {
            pagination.innerHTML =
              "";

            var maximumIndex =
              getMaximumIndex();

            var totalPositions =
              maximumIndex + 1;

            var half =
              Math.floor(
                visibleDotCount / 2
              );

            var start =
              Math.max(
                0,
                currentIndex -
                half
              );

            var end =
              Math.min(
                totalPositions,
                start +
                visibleDotCount
              );

            if (
              end - start <
              visibleDotCount
            ) {
              start =
                Math.max(
                  0,
                  end -
                  visibleDotCount
                );
            }

            for (
              var index = start;
              index < end;
              index += 1
            ) {
              var dot =
                document.createElement(
                  "button"
                );

              dot.type =
                "button";

              dot.className =
                "ser-dot";

              dot.setAttribute(
                "aria-label",
                "Show review group " +
                (index + 1)
              );

              if (
                index === currentIndex
              ) {
                dot.classList.add(
                  "is-active"
                );

                dot.setAttribute(
                  "aria-current",
                  "true"
                );
              }

              (function (
                selectedIndex
              ) {
                dot.addEventListener(
                  "click",
                  function () {
                    scrollToIndex(
                      selectedIndex
                    );

                    restartAutoplay();
                  }
                );
              })(index);

              pagination.appendChild(
                dot
              );
            }
          }

          /* ---------------------------------------------
             UPDATE UI
          --------------------------------------------- */

          function updateControls() {
            var currentIndex =
              getCurrentIndex();

            renderPagination(
              currentIndex
            );

            previousButton.style.opacity =
              currentIndex <= 0
                ? "0.6"
                : "1";

            nextButton.style.opacity =
              currentIndex >=
              getMaximumIndex()
                ? "0.6"
                : "1";
          }

          /* ---------------------------------------------
             AUTOPLAY
          --------------------------------------------- */

          function stopAutoplay() {
            if (
              !autoplayTimer
            ) {
              return;
            }

            window.clearInterval(
              autoplayTimer
            );

            autoplayTimer =
              null;
          }

          function startAutoplay() {
            if (
              prefersReducedMotion() ||
              isHovered ||
              isInteracting ||
              cards.length <= 1
            ) {
              return;
            }

            stopAutoplay();

            autoplayTimer =
              window.setInterval(
                function () {
                  if (
                    document.hidden ||
                    isHovered ||
                    isInteracting
                  ) {
                    return;
                  }

                  moveNext();
                },
                autoplayDelay
              );
          }

          function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
          }

          /* ---------------------------------------------
             ARROWS
          --------------------------------------------- */

          previousButton.addEventListener(
            "click",
            function () {
              movePrevious();
              restartAutoplay();
            }
          );

          nextButton.addEventListener(
            "click",
            function () {
              moveNext();
              restartAutoplay();
            }
          );

          /* ---------------------------------------------
             MANUAL SCROLL
          --------------------------------------------- */

          track.addEventListener(
            "scroll",
            function () {
              window.clearTimeout(
                updateTimer
              );

              updateTimer =
                window.setTimeout(
                  updateControls,
                  70
                );
            },
            {
              passive: true
            }
          );

          /* ---------------------------------------------
             HOVER
          --------------------------------------------- */

          section.addEventListener(
            "mouseenter",
            function () {
              isHovered =
                true;

              stopAutoplay();
            }
          );

          section.addEventListener(
            "mouseleave",
            function () {
              isHovered =
                false;

              startAutoplay();
            }
          );

          /* ---------------------------------------------
             TOUCH AND POINTER
          --------------------------------------------- */

          track.addEventListener(
            "pointerdown",
            function () {
              isInteracting =
                true;

              stopAutoplay();
            },
            {
              passive: true
            }
          );

          window.addEventListener(
            "pointerup",
            function () {
              if (
                !isInteracting
              ) {
                return;
              }

              isInteracting =
                false;

              window.setTimeout(
                function () {
                  updateControls();
                  startAutoplay();
                },
                180
              );
            },
            {
              passive: true
            }
          );

          track.addEventListener(
            "touchstart",
            function () {
              isInteracting =
                true;

              stopAutoplay();
            },
            {
              passive: true
            }
          );

          track.addEventListener(
            "touchend",
            function () {
              isInteracting =
                false;

              window.setTimeout(
                function () {
                  updateControls();
                  startAutoplay();
                },
                180
              );
            },
            {
              passive: true
            }
          );

          /* ---------------------------------------------
             KEYBOARD
          --------------------------------------------- */

          track.addEventListener(
            "keydown",
            function (event) {
              if (
                event.key ===
                "ArrowLeft"
              ) {
                event.preventDefault();

                movePrevious();
                restartAutoplay();
              }

              if (
                event.key ===
                "ArrowRight"
              ) {
                event.preventDefault();

                moveNext();
                restartAutoplay();
              }
            }
          );

          /* ---------------------------------------------
             RESIZE
          --------------------------------------------- */

          window.addEventListener(
            "resize",
            function () {
              window.clearTimeout(
                resizeTimer
              );

              resizeTimer =
                window.setTimeout(
                  function () {
                    var currentIndex =
                      getCurrentIndex();

                    scrollToIndex(
                      currentIndex,
                      "auto"
                    );

                    updateControls();
                    restartAutoplay();
                  },
                  130
                );
            }
          );

          /* ---------------------------------------------
             PAGE VISIBILITY
          --------------------------------------------- */

          document.addEventListener(
            "visibilitychange",
            function () {
              if (
                document.hidden
              ) {
                stopAutoplay();
              } else {
                startAutoplay();
              }
            }
          );

          /* ---------------------------------------------
             INITIAL STATE
          --------------------------------------------- */

          updateControls();
          startAutoplay();

          window.setTimeout(
            updateControls,
            350
          );

          window.setTimeout(
            updateControls,
            900
          );
        }
      );
    }

    /* =====================================================
       START
    ===================================================== */

    if (
      document.readyState ===
      "loading"
    ) {
      document.addEventListener(
        "DOMContentLoaded",
        initializeSenzioPlantarReviews
      );
    } else {
      initializeSenzioPlantarReviews();
    }

    window.addEventListener(
      "load",
      initializeSenzioPlantarReviews
    );

    document.addEventListener(
      "shopify:section:load",
      initializeSenzioPlantarReviews
    );

    document.addEventListener(
      "gemPageBuilder:loaded",
      initializeSenzioPlantarReviews
    );

    document.addEventListener(
      "gempages:loaded",
      initializeSenzioPlantarReviews
    );

    document.addEventListener(
      "gp:page:loaded",
      initializeSenzioPlantarReviews
    );

    window.setTimeout(
      initializeSenzioPlantarReviews,
      400
    );

    window.setTimeout(
      initializeSenzioPlantarReviews,
      1000
    );

    window.setTimeout(
      initializeSenzioPlantarReviews,
      2000
    );
  })();
