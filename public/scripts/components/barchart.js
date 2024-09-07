document.addEventListener("DOMContentLoaded", () => {
  const barChartContainer = document.getElementById("barchart-demo");
  const barChartItems = Array.from({length: 30}, (_, i) => {
    return {
      id: i, 
      name: "Long item Number " + i, 
      ammount: i * 600, 
    };
  });
  const barChart = new DorBarChart(barChartContainer, barChartItems);
});

class DorBarChart {
  #domElement;
  #items;

  constructor(domElement, items) {
    this.#domElement = domElement;
    this.#items = items;
    this.#assemble();
  }

  #assemble() {
    this.#log();
    const maxAmmount = Math.ceil(this.#items.sort((a, b) => b.ammount - a.ammount)[0].ammount);
    shuffleArray(this.#items);
    this.#domElement.classList.add("dor-barchart");
    const htmlAsString = 
    `<div class="dor-barchart-grid" style="--grid-fractions: ${this.#items.length}">` +
    '<div class="dor-barchart-y dor-barchart-info">' + 
    `<span>${shortenNumber(maxAmmount)}</span>` + 
    `<span>${shortenNumber(maxAmmount / 2)}</span>` + 
    `<span>${shortenNumber(0)}</span>` + 
    '</div>' + 
    `${this.#items.map(item => (
      `<div class="dor-barchart-item" data-id="${item.id}">` + 
        `<div class="dor-barchart-column"` + 
        `style="height: ${getCurrentItemammount(item.ammount, maxAmmount)}%"></div>` + 
      '</div>'
    )).join("")}` + 
    '<div class="dor-barchart-empty"></div>' + 
    `${this.#items.map(item => (
      '<div class="dor-barchart-x dor-barchart-info">' + 
        `<span title="${item.name}">${item.name}</span>` + 
      '</div>'
    )).join("")}` + 
    '</div>';

    this.#domElement.innerHTML = htmlAsString;

    this.#addEvents();
    
    function getCurrentItemammount(ammount, maxAmmount) {
      // x = 100 * ammount / maxAmmount
      return Math.round(100 * ammount / maxAmmount);
    }
  }

  #addEvents() {
    const barChartItems = this.#domElement.querySelectorAll(".dor-barchart-item");
    
    document.addEventListener("click", function (ev) {
      if (ev.target.closest(".dor-barchart-item")) {
        return;
      }
      barChartItems.forEach(item => {
        item.classList.remove("selected");
      });
      const popup = document.querySelector(".dor-popup");
      if (popup) {
        popup.remove();
      }
    });
    
    barChartItems.forEach(item => {
      const itemId = item.getAttribute("data-id");
      const itemData = this.#items.find(sourceItem => String(sourceItem.id) === itemId);

      if (itemData) {
        item.addEventListener("mouseenter", function () {
          const popup = document.querySelector(".dor-popup");
          if (popup) {
            if (document.querySelector(".dor-barchart-item.selected")) {
              return;
            }
            popup.remove();
          }
          createNewPopup(itemData, item);
        });

        item.addEventListener("mouseleave", function () {
          const popup = document.querySelector(".dor-popup");
          if (popup) {
            if (document.querySelector(".dor-barchart-item.selected")) {
              return;
            }
            popup.remove();
          }
        });

        item.addEventListener("click", function () {
          barChartItems.forEach(otherItem => {
            if (otherItem.getAttribute("data-id") !== itemId) {
              otherItem.classList.remove("selected");
            }
          });
          item.classList.toggle("selected");
          const popup = document.querySelector(".dor-popup");
          if (popup) {
            popup.remove();
          }
          createNewPopup(itemData, item);
        });
      }

      function createNewPopup(data, parent) {
        const popupHtml = 
        `<p><b>Name: </b>${data.name}.</p>` + 
        `<p style="margin-top: .5rem;"><b>Ammount: </b>${formatNumber(data.ammount)}.</p>`;

        const popupElement = document.createElement("div");
        popupElement.classList.add("dor-popup");
        popupElement.innerHTML = popupHtml;
        
        parent.prepend(popupElement);
      }
    });
  }

  #log() {
    console.log(this.#domElement);
    console.log(this.#items);
  }
}