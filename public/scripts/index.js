document.addEventListener("DOMContentLoaded", function () {
  addElementToggling();
  addThemeToggling();
  addThemeStorage();
});

function addElementToggling() {
  Array.from(document.querySelectorAll("[data-toggle-ref]")).forEach(toggle => {
    const toggleRef = toggle.getAttribute("data-toggle-ref");
    let toggleTimeout = null;
    toggle.addEventListener("click", function () {
      if (toggleTimeout) {
        clearTimeout(toggleTimeout);
      }
      const toggledElement = document.getElementById(toggleRef);
      if (toggledElement) {
        toggledElement.classList.add("toggling");
        toggledElement.classList.toggle("toggled");
        toggleTimeout = setTimeout(() => {
          toggledElement.classList.remove("toggling");
        }, 150);
      }
    });
  });
}

function addThemeToggling() {
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme-mode", "dark");
      } else {
        localStorage.setItem("theme-mode", "light");
      }
    });
  }
}

function addThemeStorage() {
  const themeStorage = localStorage.getItem("theme-mode");

  if (themeStorage) {
    if (themeStorage === "light") {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  } else {
    document.body.classList.add("dark");
  }
}