document.querySelectorAll(".input-text").forEach(inputContainer => {
  const input = inputContainer.querySelector("input");
  if (input.value) {
    inputContainer.classList.add("focused");
  }
  input.addEventListener("focus", function () {
    inputContainer.classList.add("focused");
  });
  input.addEventListener("blur", function () {
    if (!input.value) {
      inputContainer.classList.remove("focused");
    } 
  });
});