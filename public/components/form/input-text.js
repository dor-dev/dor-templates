document.querySelectorAll(".dor-input-text").forEach(inputContainer => {
  let input = inputContainer.querySelector("input");
  const characterTrack = inputContainer.querySelector("span");

  if (!input) {
    input = inputContainer.querySelector("textarea");
  }

  if (input) {
    if (input.value) {
      inputContainer.classList.add("focused");
      inputContainer.classList.add("has-value");
    }
    input.addEventListener("focus", function () {
      inputContainer.classList.add("focused");
      inputContainer.classList.add("has-value");
    });
    input.addEventListener("blur", function () {
      inputContainer.classList.remove("focused");
      if (!input.value) {
        inputContainer.classList.remove("has-value");
      } 
    });
  }

  const inputLines = input.value.split("\n").length;
  input.setAttribute("rows", inputLines);
  input.addEventListener("input", function (ev) {
    const maxLength = input.getAttribute("maxlength");
    if (maxLength && characterTrack) {
      const characters = ev.target.value.length;
      characterTrack.textContent = characters + " / " + maxLength;
    }
    const lines = ev.target.value.split("\n");
    let lineBreaks = lines.length;
    for (let line of lines) {
      const lineLength = Math.floor(line.length / 20);
      lineBreaks += lineLength;
    }
    input.setAttribute("rows", lineBreaks);
  });
});

class DorInputText {
  #domElement;
  #data;

  constructor(domElement, data) {
    this.#domElement = domElement;
    this.#data = data;
    this.#assemble();
  }

  #assemble() {
    let htmlAsString = "";

    if (this.#data.maxLength) {
      htmlAsString += 
      `<span>${this.#data.maxLength}</span>`;
    }

    htmlAsString += 
    `<label for="${this.#data.id}">${this.#data.label}</label>` + 
    (this.#data.isTextarea === true ? 
    '<textarea ' : '<input ') + 
    (this.#data.maxLength ? `maxlength="${this.#data.maxLength}"` : '') + 
    `type="${this.#data.type || "text"}" name="${this.#data.id}" id="${this.#data.id}"` + 
    (this.#data.value ? `value="${this.#data.value}"` : '') + 
    (this.#data.autocomplete ? `autocomplete="${this.#data.autocomplete}"` : '') + 
    (this.#data.isTextarea === true ? 
    '></textarea>' : ' />');

    this.#domElement.classList.add("dor-input-text");

    this.#domElement.innerHTML = htmlAsString;

    this.#addEvents();
  }

  #addEvents() {
    let input = this.#domElement.querySelector("input");
    
    if (this.#data.isTextarea === true) {
      input = this.#domElement.querySelector("textarea");
    }

    if (input) {
      if (input.value) {
        this.#domElement.classList.add("has-value");
      }
      input.addEventListener("focus", () => {
        this.#domElement.classList.add("focused");
        this.#domElement.classList.add("has-value");
      });
      input.addEventListener("blur", () => {
        this.#domElement.classList.remove("focused");
        if (!input.value) {
          this.#domElement.classList.remove("has-value");
        } 
      });
    }

    const characterTrack = this.#domElement.querySelector("span");
    const inputLines = input.value.split("\n").length;
    input.setAttribute("rows", inputLines);
    input.addEventListener("input", function (ev) {
      const maxLength = input.getAttribute("maxlength");
      if (maxLength && characterTrack) {
        const characters = ev.target.value.length;
        characterTrack.textContent = characters + " / " + maxLength;
      }
      const lines = ev.target.value.split("\n");
      let lineBreaks = lines.length;
      for (let line of lines) {
        const lineLength = Math.floor(line.length / 20);
        lineBreaks += lineLength;
      }
      input.setAttribute("rows", lineBreaks);
    });
  }
}