document.querySelectorAll(".input-text").forEach(inputContainer => {
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