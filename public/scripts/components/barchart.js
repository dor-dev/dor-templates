document.addEventListener("DOMContentLoaded", () => {
  const barChartContainer = document.getElementById("barchart-demo");
  const barChartItems = Array.from({length: 30}, (_, i) => {
    return {
      id: i, 
      name: "Item Number " + i, 
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
    '<div class="dor-barchart-empty display-small"></div>' + 
    '<div class="dor-barchart-y dor-barchart-info">' + 
    `<span>${shortenNumber(maxAmmount)}</span>` + 
    `<span>${shortenNumber(maxAmmount / 2)}</span>` + 
    `<span>${shortenNumber(0)}</span>` + 
    '</div>' + 
    `${this.#items.map(item => (
      '<div class="dor-barchart-x dor-barchart-info display-small">' + 
        `<span title="${item.name}">${item.name}</span>` + 
      '</div>' + 
      `<div class="dor-barchart-item display-small" data-id="${item.id}">` + 
        `<div class="dor-barchart-column"` + 
        `style="--column-size: ${getCurrentItemAmmount(item.ammount, maxAmmount)}%"></div>` + 
      '</div>'
    )).join("")}` + 
    `${this.#items.map(item => (
      `<div class="dor-barchart-item display-big" data-id="${item.id}">` + 
        `<div class="dor-barchart-column"` + 
        `style="--column-size: ${getCurrentItemAmmount(item.ammount, maxAmmount)}%"></div>` + 
      '</div>'
    )).join("")}` + 
    '<div class="dor-barchart-empty display-big"></div>' + 
    `${this.#items.map(item => (
      '<div class="dor-barchart-x dor-barchart-info display-big">' + 
        `<span title="${item.name}">${item.name}</span>` + 
      '</div>'
    )).join("")}` + 
    '</div>';

    this.#domElement.innerHTML = htmlAsString;

    this.#addEvents();
    
    function getCurrentItemAmmount(ammount, maxAmmount) {
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
      const popups = document.querySelectorAll(".dor-popup");
      if (popups.length !== 0) {
        popups.forEach(popup => {
          popup.remove();
        });
      }
    });
    
    barChartItems.forEach(item => {
      const itemId = item.getAttribute("data-id");
      const itemData = this.#items.find(sourceItem => String(sourceItem.id) === itemId);

      if (itemData) {
        item.addEventListener("mouseenter", function () {
          const popups = document.querySelectorAll(".dor-popup");
          if (popups.length !== 0) {
            if (document.querySelector(".dor-barchart-item.selected")) {
              return;
            }
            popups.forEach(popup => {
              popup.remove();
            });
          }
          createNewPopup(itemData, item);
        });

        item.addEventListener("mouseleave", function () {
          const popups = document.querySelectorAll(".dor-popup");
          if (popups.length !== 0) {
            if (document.querySelector(".dor-barchart-item.selected")) {
              return;
            }
            popups.forEach(popup => {
              popup.remove();
            });
          }
        });

        item.addEventListener("click", function () {
          barChartItems.forEach(otherItem => {
            if (otherItem.getAttribute("data-id") !== itemId) {
              otherItem.classList.remove("selected");
            } else {
              otherItem.classList.toggle("selected");
            }
          });
          const popups = document.querySelectorAll(".dor-popup");
          if (popups.length !== 0) {
            popups.forEach(popup => {
              popup.remove();
            });
          }
          createNewPopup(itemData, item);
        });
      }

      function createNewPopup(data, parent) {
        const childOffsets = [parent.offsetLeft, parent.offsetTop];
        const parentId = parent.getAttribute("data-id");

        const popupHtml = 
        `<p><b>Name: </b>${data.name}.</p>` + 
        `<p style="margin-top: .5rem;"><b>Ammount: </b>${formatNumber(data.ammount)}.</p>`;

        const popupElement = document.createElement("div");
        popupElement.classList.add("dor-popup");
        popupElement.innerHTML = popupHtml;
        
        const gridContainer = parent.closest(".dor-barchart-grid");
        const gridHeight = gridContainer.offsetHeight;
        const gridWidth = gridContainer.offsetWidth;

        const rightHalfOfScreen = childOffsets[0] >= gridWidth / 2;
        if (rightHalfOfScreen) {
          popupElement.style.right = "50%";
          popupElement.style.left = "initial";
        }

        const notAtTheTopOfParent = childOffsets[1] >= gridHeight / 2;
        if (notAtTheTopOfParent) {
          popupElement.style.bottom = "25%";
          popupElement.style.top = "initial";
        }
        
        const itemParents = document.querySelectorAll(`[data-id="${parentId}"]`);
        itemParents.forEach(itemParent => {
          itemParent.prepend(popupElement.cloneNode(true));
        });
      }
    });
  }

  #log() {
    console.log(this.#domElement);
    console.log(this.#items);
  }
}