Array.from(document.querySelectorAll(".input-radio")).forEach(inputContainer => {
  const input = inputContainer.querySelector("input");
  if (input.defaultChecked) {
    inputContainer.classList.add("selected");
  }
  input.addEventListener("click", function () {
    inputContainer.closest("fieldset").querySelectorAll(".input-radio").forEach(radioInput => {
      radioInput.classList.remove("selected");
    });
    if (input.checked) {
      inputContainer.classList.add("selected");
    }
  });
  input.addEventListener("focus", function () {
    inputContainer.classList.add("focused");
  });
  input.addEventListener("blur", function () {
    inputContainer.classList.remove("focused");
  });
});