document.querySelectorAll(".input-text").forEach(inputContainer => {
  const input = inputContainer.querySelector("input");
  const textarea = inputContainer.querySelector("textarea");

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

  if (textarea) {
    if (textarea.value) {
      inputContainer.classList.add("focused");
      inputContainer.classList.add("has-value");
    }
    textarea.addEventListener("focus", function () {
      inputContainer.classList.add("focused");
      inputContainer.classList.add("has-value");
    });
    textarea.addEventListener("blur", function () {
      inputContainer.classList.remove("focused");
      if (!textarea.value) {
        inputContainer.classList.remove("has-value");
      } 
    });
  }
});