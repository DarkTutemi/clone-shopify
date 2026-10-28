  (() => {
    const section = document.getElementById(
      "senzio-plantar-heel-explorer-v6"
    );

    if (
      !section ||
      section.dataset.senzioPhe6Ready === "true"
    ) {
      return;
    }

    section.dataset.senzioPhe6Ready = "true";

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =======================================================
       INGREDIENT DATA

       thumbScale:
       Controls how far the image is zoomed inside the circle.

       thumbY:
       Moves the visible crop upward so embedded image names
       remain outside the visible circle.
    ======================================================== */

    const ingredients = [
      {
        id: "comfrey",
        name: "Comfrey",
        jobs:
          "Heel and tissue comfort",
        description:
          "Helps soothe overworked heel, arch, and sole tissues affected by daily strain.",
        tags: [
          "Heel Tissue",
          "Arch Comfort",
          "Daily Strain"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/f5139c20-4a4c-4a98-8fd7-9aeca35634e5.png?v=1784490592",
        thumbScale: 1.46,
        thumbY: "36%",
        effectColor:
          "rgba(74, 163, 105, 0.22)"
      },
      {
        id: "fenghuang",
        name: "Fenghuang",
        jobs:
          "Deep foot tension comfort",
        description:
          "Helps ease deep foot tension and supports more comfortable standing and walking.",
        tags: [
          "Deep Tension",
          "Standing Comfort",
          "Walking Support"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/d6c396cb-5ca6-417d-addc-a63648bc5bf6.png?v=1784490592",
        thumbScale: 1.46,
        thumbY: "36%",
        effectColor:
          "rgba(68, 157, 110, 0.22)"
      },
      {
        id: "angelica-sinensis",
        name: "Angelica Sinensis",
        jobs:
          "Foot circulation support",
        description:
          "Supports healthy circulation through the heels, arches, soles, and feet.",
        tags: [
          "Foot Circulation",
          "Heels & Arches",
          "Sole Comfort"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/558a288b-8699-4942-b5ff-82b99c914927.png?v=1784490592",
        thumbScale: 1.53,
        thumbY: "33%",
        effectColor:
          "rgba(170, 118, 76, 0.2)"
      },
      {
        id: "radix-angelicae-dahuricae",
        name: "Radix Angelicae Dahuricae",
        jobs:
          "Heel-pressure comfort",
        description:
          "Helps calm pressure and discomfort concentrated around the heel and plantar area.",
        tags: [
          "Heel Pressure",
          "Plantar Area",
          "Tenderness"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/8961d45c-6f37-462b-a481-b6f29b6920e9.png?v=1784490595",
        thumbScale: 1.55,
        thumbY: "31%",
        effectColor:
          "rgba(184, 146, 102, 0.2)"
      },
      {
        id: "frankincense",
        name: "Frankincense",
        jobs:
          "Flexible walking support",
        description:
          "Helps calm persistent heel and plantar discomfort while supporting easier movement.",
        tags: [
          "Persistent Comfort",
          "Flexible Walking",
          "Easier Movement"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/cab9a649-2aee-4d5a-aef3-4cbee4ee940b.png?v=1784490592",
        thumbScale: 1.47,
        thumbY: "35%",
        effectColor:
          "rgba(209, 174, 84, 0.24)"
      },
      {
        id: "myrrh",
        name: "Myrrh",
        jobs:
          "Tender-foot comfort",
        description:
          "Supports circulation and comfort in tender, tight, and overworked feet.",
        tags: [
          "Tender Feet",
          "Tight Areas",
          "Circulation"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/5d3064d0-8f18-4f88-b7be-52e608ba1020.png?v=1784490592",
        thumbScale: 1.47,
        thumbY: "35%",
        effectColor:
          "rgba(166, 106, 72, 0.22)"
      },
      {
        id: "peppermint-oil",
        name: "Peppermint Oil",
        jobs:
          "Fast cooling comfort",
        description:
          "Provides fast cooling comfort for hot, sore, and aching heels and soles.",
        tags: [
          "Fast Cooling",
          "Sore Heels",
          "Aching Soles"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/a9631d13-b154-4d18-bc79-d915ae377c0d.png?v=1784490592",
        thumbScale: 1.46,
        thumbY: "34%",
        effectColor:
          "rgba(87, 181, 199, 0.23)"
      },
      {
        id: "sesame-oil",
        name: "Sesame Oil",
        jobs:
          "Smooth foot application",
        description:
          "Helps the herbal ingredients spread smoothly across the heels, arches, and soles.",
        tags: [
          "Smooth Coverage",
          "Heels & Arches",
          "Soles"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/dfbfa7aa-4c83-46aa-b5ee-bb1f65f7a423.png?v=1784490591",
        thumbScale: 1.47,
        thumbY: "34%",
        effectColor:
          "rgba(218, 183, 88, 0.23)"
      },
      {
        id: "beeswax",
        name: "Beeswax",
        jobs:
          "Longer-lasting comfort",
        description:
          "Keeps the balm on the skin longer for extended heel, arch, and foot comfort.",
        tags: [
          "Longer Contact",
          "Lasting Comfort",
          "Foot Care"
        ],
        image:
          "https://cdn.shopify.com/s/files/1/0885/4444/4723/files/490043ce-fe26-4873-8b00-7d957c1538d4.png?v=1784490591",
        thumbScale: 1.48,
        thumbY: "34%",
        effectColor:
          "rgba(229, 188, 71, 0.24)"
      }
    ];

    if (window.MB_ING_ASSETS) {
      ingredients.forEach(function (item) {
        if (window.MB_ING_ASSETS[item.id]) item.image = window.MB_ING_ASSETS[item.id];
      });
    }

    if (window.MB_ING_DATA) {
      window.MB_ING_DATA.forEach(function (row, index) {
        var item = ingredients[index];
        if (!item || !row) return;
        ["name", "jobs", "description", "image"].forEach(function (key) {
          if (row[key]) item[key] = row[key];
        });
        if (row.tags && row.tags.length) {
          item.tags = row.tags.map(function (tag) { return String(tag).trim(); }).filter(Boolean);
        }
      });
    }

    /* =======================================================
       ELEMENT REFERENCES
    ======================================================== */

    const orbitStage = section.querySelector(
      "#senzioPhe6OrbitStage"
    );

    const orbitNodes = section.querySelector(
      "#senzioPhe6OrbitNodes"
    );

    const mobileSelector = section.querySelector(
      "#senzioPhe6MobileSelector"
    );

    const desktopElements = {
      count: section.querySelector(
        "#senzioPhe6DesktopCount"
      ),
      media: section.querySelector(
        "#senzioPhe6DesktopMedia"
      ),
      image: section.querySelector(
        "#senzioPhe6DesktopImage"
      ),
      name: section.querySelector(
        "#senzioPhe6DesktopName"
      ),
      jobs: section.querySelector(
        "#senzioPhe6DesktopJobs"
      ),
      description: section.querySelector(
        "#senzioPhe6DesktopDescription"
      ),
      tags: section.querySelector(
        "#senzioPhe6DesktopTags"
      )
    };

    const mobileElements = {
      count: section.querySelector(
        "#senzioPhe6MobileCount"
      ),
      media: section.querySelector(
        "#senzioPhe6MobileMedia"
      ),
      image: section.querySelector(
        "#senzioPhe6MobileImage"
      ),
      name: section.querySelector(
        "#senzioPhe6MobileName"
      ),
      jobs: section.querySelector(
        "#senzioPhe6MobileJobs"
      ),
      description: section.querySelector(
        "#senzioPhe6MobileDescription"
      ),
      tags: section.querySelector(
        "#senzioPhe6MobileTags"
      )
    };

    let selectedId = ingredients[0].id;
    let previewId = selectedId;
    let detailId = "";
    let layoutFrame = 0;

    const decodedImageCache = new Map();

    const preloadImage = (source) => {
      if (!source) {
        return Promise.resolve();
      }

      if (decodedImageCache.has(source)) {
        return decodedImageCache.get(source);
      }

      const image = new Image();
      image.decoding = "async";
      image.src = source;

      const ready =
        typeof image.decode === "function"
          ? image.decode().catch(() => undefined)
          : new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            });

      decodedImageCache.set(source, ready);

      return ready;
    };

    /* =======================================================
       HELPERS
    ======================================================== */

    const padNumber = (number) => {
      return String(number).padStart(2, "0");
    };

    const findIngredient = (id) => {
      return (
        ingredients.find(
          (ingredient) => ingredient.id === id
        ) || ingredients[0]
      );
    };

    const createTags = (tags) => {
      const fragment =
        document.createDocumentFragment();

      tags.forEach((tag) => {
        const element =
          document.createElement("span");

        element.setAttribute(
          "role",
          "listitem"
        );

        element.textContent = tag;

        fragment.appendChild(element);
      });

      return fragment;
    };

    const replaceTags = (target, tags) => {
      target.replaceChildren(
        createTags(tags)
      );
    };

    /* =======================================================
       SHARED THUMBNAIL CONTENT
    ======================================================== */

    const createThumbnailContent = (
      ingredient,
      imageSize
    ) => {
      const circle =
        document.createElement("span");

      circle.className =
        "senzio-phe6__thumb-circle";

      const effect =
        document.createElement("span");

      effect.className =
        "senzio-phe6__thumb-effect";

      effect.setAttribute(
        "aria-hidden",
        "true"
      );

      const image =
        document.createElement("img");

      image.className =
        "senzio-phe6__thumb-image";

      image.src = ingredient.image;
      image.alt = "";
      image.width = imageSize;
      image.height = imageSize;
      image.loading = "eager";
      image.fetchPriority = "low";
      image.decoding = "async";

      const label =
        document.createElement("span");

      label.className =
        "senzio-phe6__thumb-label";

      label.textContent =
        ingredient.name;

      circle.append(
        effect,
        image
      );

      return {
        circle,
        label
      };
    };

    /* =======================================================
       CREATE DESKTOP ORBIT ITEM
    ======================================================== */

    const createOrbitItem = (
      ingredient,
      index
    ) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "senzio-phe6__orbit-item";

      button.dataset.ingredientId =
        ingredient.id;

      button.dataset.ingredientIndex =
        String(index);

      button.setAttribute(
        "aria-label",
        `View ${ingredient.name} details`
      );

      button.setAttribute(
        "aria-pressed",
        "false"
      );

      button.style.setProperty(
        "--sphe6-effect-color",
        ingredient.effectColor
      );

      button.style.setProperty(
        "--sphe6-thumb-scale",
        String(ingredient.thumbScale)
      );

      button.style.setProperty(
        "--sphe6-thumb-y",
        ingredient.thumbY
      );

      const thumbnail =
        createThumbnailContent(
          ingredient,
          320
        );

      button.append(
        thumbnail.circle,
        thumbnail.label
      );

      return button;
    };

    /* =======================================================
       CREATE MOBILE OPTION
    ======================================================== */

    const createMobileOption = (
      ingredient,
      index
    ) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "senzio-phe6__mobile-option";

      button.dataset.ingredientId =
        ingredient.id;

      button.dataset.ingredientIndex =
        String(index);

      button.setAttribute(
        "role",
        "tab"
      );

      button.setAttribute(
        "aria-label",
        `Open ${ingredient.name}`
      );

      button.setAttribute(
        "aria-selected",
        "false"
      );

      button.style.setProperty(
        "--sphe6-effect-color",
        ingredient.effectColor
      );

      button.style.setProperty(
        "--sphe6-thumb-scale",
        String(ingredient.thumbScale)
      );

      button.style.setProperty(
        "--sphe6-thumb-y",
        ingredient.thumbY
      );

      const thumbnail =
        createThumbnailContent(
          ingredient,
          220
        );

      button.append(
        thumbnail.circle,
        thumbnail.label
      );

      return button;
    };

    /* =======================================================
       RENDER CONTROLS ONCE
    ======================================================== */

    const orbitFragment =
      document.createDocumentFragment();

    const mobileFragment =
      document.createDocumentFragment();

    ingredients.forEach(
      (ingredient, index) => {
        orbitFragment.appendChild(
          createOrbitItem(
            ingredient,
            index
          )
        );

        mobileFragment.appendChild(
          createMobileOption(
            ingredient,
            index
          )
        );
      }
    );

    orbitNodes.replaceChildren(
      orbitFragment
    );

    mobileSelector.replaceChildren(
      mobileFragment
    );

    const desktopButtons = Array.from(
      orbitNodes.querySelectorAll(
        ".senzio-phe6__orbit-item"
      )
    );

    const mobileButtons = Array.from(
      mobileSelector.querySelectorAll(
        ".senzio-phe6__mobile-option"
      )
    );

    /* =======================================================
       BALANCED RESPONSIVE ORBIT
    ======================================================== */

    const updateOrbitPositions = () => {
      if (!orbitStage) {
        return;
      }

      const width =
        orbitStage.clientWidth;

      const height =
        orbitStage.clientHeight;

      if (!width || !height) {
        return;
      }

      /*
        Nine evenly spaced positions:
        360 degrees / 9 ingredients = 40 degrees.
      */

      const horizontalRadius =
        width * 0.395;

      const verticalRadius =
        height * 0.382;

      const angleStep =
        360 / ingredients.length;

      const startAngle = -90;

      desktopButtons.forEach(
        (button, index) => {
          const angleDegrees =
            startAngle +
            angleStep * index;

          const angleRadians =
            angleDegrees *
            (Math.PI / 180);

          const x =
            Math.cos(angleRadians) *
            horizontalRadius;

          const y =
            Math.sin(angleRadians) *
            verticalRadius;

          button.style.setProperty(
            "--sphe6-node-x",
            `${x.toFixed(2)}px`
          );

          button.style.setProperty(
            "--sphe6-node-y",
            `${y.toFixed(2)}px`
          );
        }
      );
    };

    const requestOrbitLayout = () => {
      if (layoutFrame) {
        cancelAnimationFrame(
          layoutFrame
        );
      }

      layoutFrame =
        requestAnimationFrame(() => {
          updateOrbitPositions();

          layoutFrame = 0;
        });
    };

    if ("ResizeObserver" in window) {
      const orbitObserver =
        new ResizeObserver(
          requestOrbitLayout
        );

      orbitObserver.observe(
        orbitStage
      );
    } else {
      window.addEventListener(
        "resize",
        requestOrbitLayout,
        {
          passive: true
        }
      );
    }

    requestOrbitLayout();

    /* =======================================================
       UPDATE DETAIL CARDS
    ======================================================== */

    const updateDetailElements = (
      elements,
      ingredient,
      index
    ) => {
      const count =
        `${padNumber(index + 1)} / ` +
        `${padNumber(ingredients.length)}`;

      elements.count.textContent =
        count;

      elements.media.style.setProperty(
        "--sphe6-effect-color",
        ingredient.effectColor
      );

      if (
        elements.image.dataset.currentSource !==
        ingredient.image
      ) {
        elements.image.src =
          ingredient.image;

        elements.image.dataset.currentSource =
          ingredient.image;
      }

      elements.image.alt =
        ingredient.name;

      elements.name.textContent =
        ingredient.name;

      elements.jobs.textContent =
        ingredient.jobs;

      elements.description.textContent =
        ingredient.description;

      replaceTags(
        elements.tags,
        ingredient.tags
      );
    };

    const renderIngredient = (id) => {
      const ingredient =
        findIngredient(id);

      const index =
        ingredients.findIndex(
          (item) =>
            item.id === ingredient.id
        );

      if (detailId !== ingredient.id) {
        detailId = ingredient.id;

        preloadImage(
          ingredient.image
        );

        updateDetailElements(
          desktopElements,
          ingredient,
          index
        );

        updateDetailElements(
          mobileElements,
          ingredient,
          index
        );
      }

      desktopButtons.forEach(
        (button) => {
          const isSelected =
            button.dataset.ingredientId ===
            selectedId;

          const isPreview =
            button.dataset.ingredientId ===
              previewId &&
            !isSelected;

          button.classList.toggle(
            "is-active",
            isSelected
          );

          button.classList.toggle(
            "is-preview",
            isPreview
          );

          button.setAttribute(
            "aria-pressed",
            isSelected
              ? "true"
              : "false"
          );
        }
      );

      mobileButtons.forEach(
        (button) => {
          const isSelected =
            button.dataset.ingredientId ===
            selectedId;

          button.classList.toggle(
            "is-active",
            isSelected
          );

          button.setAttribute(
            "aria-selected",
            isSelected
              ? "true"
              : "false"
          );

          button.tabIndex =
            isSelected ? 0 : -1;
        }
      );
    };

    const previewIngredient = (id) => {
      if (!id || previewId === id) {
        return;
      }

      previewId = id;

      renderIngredient(id);
    };

    const selectIngredient = (id) => {
      selectedId = id;
      previewId = id;

      renderIngredient(id);
    };

    /* =======================================================
       DESKTOP INTERACTIONS
    ======================================================== */

    orbitNodes.addEventListener(
      "pointerover",
      (event) => {
        if (event.pointerType === "touch") {
          return;
        }

        const button =
          event.target.closest(
            ".senzio-phe6__orbit-item"
          );

        if (
          !button ||
          !orbitNodes.contains(button)
        ) {
          return;
        }

        previewIngredient(
          button.dataset.ingredientId
        );
      }
    );

    orbitNodes.addEventListener(
      "pointerleave",
      () => {
        previewIngredient(
          selectedId
        );
      }
    );

    orbitNodes.addEventListener(
      "focusin",
      (event) => {
        const button =
          event.target.closest(
            ".senzio-phe6__orbit-item"
          );

        if (!button) {
          return;
        }

        previewIngredient(
          button.dataset.ingredientId
        );
      }
    );

    orbitNodes.addEventListener(
      "focusout",
      (event) => {
        const nextElement =
          event.relatedTarget;

        if (
          nextElement &&
          orbitNodes.contains(
            nextElement
          )
        ) {
          return;
        }

        previewIngredient(
          selectedId
        );
      }
    );

    orbitNodes.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(
            ".senzio-phe6__orbit-item"
          );

        if (
          !button ||
          !orbitNodes.contains(button)
        ) {
          return;
        }

        selectIngredient(
          button.dataset.ingredientId
        );
      }
    );

    /* =======================================================
       MOBILE INTERACTIONS
    ======================================================== */

    mobileSelector.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(
            ".senzio-phe6__mobile-option"
          );

        if (
          !button ||
          !mobileSelector.contains(
            button
          )
        ) {
          return;
        }

        selectIngredient(
          button.dataset.ingredientId
        );

        button.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    );

    mobileSelector.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key !== "ArrowLeft" &&
          event.key !== "ArrowRight"
        ) {
          return;
        }

        event.preventDefault();

        const currentIndex =
          ingredients.findIndex(
            (ingredient) =>
              ingredient.id ===
              selectedId
          );

        const direction =
          event.key === "ArrowRight"
            ? 1
            : -1;

        const nextIndex =
          (
            currentIndex +
            direction +
            ingredients.length
          ) %
          ingredients.length;

        const nextIngredient =
          ingredients[nextIndex];

        const nextButton =
          mobileButtons[nextIndex];

        selectIngredient(
          nextIngredient.id
        );

        nextButton.focus();

        nextButton.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    );

    /* =======================================================
       FAST IMAGE WARMUP
    ======================================================== */

    preloadImage(
      ingredients[0].image
    );

    const warmRemainingImages = () => {
      ingredients.slice(1).forEach(
        (ingredient) => {
          preloadImage(
            ingredient.image
          );
        }
      );
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        warmRemainingImages,
        { timeout: 1200 }
      );
    } else {
      window.setTimeout(
        warmRemainingImages,
        250
      );
    }

    /* =======================================================
       INITIAL STATE
    ======================================================== */

    selectIngredient(
      selectedId
    );
  })();
