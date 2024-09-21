document.querySelectorAll(".input-checkbox").forEach(inputContainer => {
  const input = inputContainer.querySelector("input");
  if (input.defaultChecked) {
    inputContainer.classList.add("selected");
  }
  input.addEventListener("click", function () {
    inputContainer.classList.toggle("selected");
  });
  input.addEventListener("focus", function () {
    inputContainer.classList.add("focused");
  });
  input.addEventListener("blur", function () {
    inputContainer.classList.remove("focused");
  });
});