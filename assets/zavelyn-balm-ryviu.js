(function () {
  document.querySelectorAll("[data-mb-ry-more]").forEach(function (button) {
    button.addEventListener("click", function () {
      var copy = button.parentElement;
      var shortText = copy.querySelector(".mb-ry-short");
      var fullText = copy.querySelector(".mb-ry-full");
      if (shortText) shortText.hidden = true;
      if (fullText) fullText.hidden = false;
      button.hidden = true;
    });
  });
})();
