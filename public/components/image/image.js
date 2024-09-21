document.addEventListener("click", function (ev) {
  const imagePreview = document.querySelector(".dor-image-preview");
  if (imagePreview && !ev.target.closest(".dor-image-preview button")) {
    imagePreview.remove();
  }
});