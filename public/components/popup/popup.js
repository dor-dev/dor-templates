document.addEventListener("DOMContentLoaded", function () {
  DorPopup.spawn("This is a <b>bold</b> message!", 3000);
});

document.addEventListener("click", function () {
  const popups = document.querySelectorAll(".dor-popup:not(.generated)");
  popups.forEach(popup => {
    popup.remove();
  });
});

class DorPopup {
  #domElement;
  #html;

  constructor(domElement, html) {
    this.#domElement = domElement;
    this.#html = html;

    this.#assemble();
  }

  #assemble() {
    this.#domElement.innerHTML = this.#html;
  }

  static spawn(html, timeout) {
    const newPopup = document.createElement("div");
    newPopup.classList.add("dor-popup");
    newPopup.classList.add("generated");
    newPopup.innerHTML = html;
    newPopup.style.cursor = "pointer";

    document.body.append(newPopup);

    if (timeout) {
      setTimeout(function () {
        newPopup.classList.add("fading");
        setTimeout(() => {
          newPopup.remove();
        }, 500);
      }, timeout);
    }

    newPopup.addEventListener("click", function () {
      newPopup.classList.add("fading");
        setTimeout(() => {
          newPopup.remove();
        }, 500);
    });
  }
}