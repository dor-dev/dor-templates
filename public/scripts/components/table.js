document.addEventListener("DOMContentLoaded", function () {
  const items = 100;
  const tableData = Array.from({length: items}, (_, i) => {
    const index = i + 1;
    return {
      name: "Item " + index, 
      surname: "Collection " + (items - i), 
      city: "Some city", 
      country: "Some country", 
      description: "This is the item number " + index + ", stored in some city in some country.",
      collected: i % 5 === 0, 
      age: index, 
      dob: new Date() - (1000000 * index), 
    };
  });

  const tableFields = [
    { id: "name", label: "Name", type: "string" }, 
    { id: "surname", label: "Surname", type: "string" }, 
    { id: "city", label: "City", type: "string" }, 
    { id: "country", label: "Country", type: "string" }, 
    { id: "description", label: "Description", type: "string" }, 
    { id: "collected", label: "Collected", type: "boolean" },
    { id: "age", label: "Age", type: "number" },  
    { id: "dob", label: "Date of Birth", type: "date" }, 
  ];

  const domElement = document.getElementById("table-demo");

  const table = new DorTable(domElement, tableData, tableFields);
});

class DorTable {
  #sorting = {
    type: "DESC", 
    field: null, 
  };
  #filtering = {};
  #pagination = {
    pageSize: 5, 
    currentPageNumber: 1, 
  };
  #domElement;
  #data;
  #fields;

  get currentSorting() {
    return this.#sorting;
  }

  get pagination() {
    return this.#pagination;
  }

  get maxPageNumber() {
    return Math.ceil(this.#data.length / this.#pagination.pageSize);
  }

  constructor(domElement, data, fields) {
    this.#domElement = domElement;
    this.#data = data;
    this.#fields = fields;
    
    this.#assemble();
  }

  #assemble() {
    this.log();
    this.#domElement.classList.add("dor-table");

    this.loadHtml();
  }

  loadHtml(newData) {
    console.log(this.#sorting, this.#filtering, this.#pagination);
    const currentSortingField = this.#sorting.field;
    const currentSortingType = this.#sorting.type;
    if (currentSortingField) {
      if (currentSortingType === "DESC") {
        this.#data.sort((a, b) => b[currentSortingField] > a[currentSortingField]);
      }
      if (currentSortingType === "ASC") {
        this.#data.sort((a, b) => a[currentSortingField] > b[currentSortingField]);
      }
    }

    const startIndex = (this.#pagination.currentPageNumber - 1) * this.pagination.pageSize;
    const endIndex = this.#pagination.currentPageNumber * this.#pagination.pageSize;
    const pageData = this.#data.slice(startIndex, endIndex);

    const isLastPage = this.#pagination.currentPageNumber >= this.maxPageNumber;
    const isFirstPage = this.#pagination.currentPageNumber <= 1;

    const htmlAsString = 
    '<div class="dor-table-body">' + 
    '<div class="dor-table-columns">' + 
    this.#fields.map(field => (
      `<div class="dor-table-column dor-table-cell" data-column="${field.id}">` + 
        `<p title="${field.label}" class="cell-${getFieldAlignment(field.type)}">${field.label}</p>` + 
        createCurrentSortIcon(this.#sorting, field.id) + 
        '<button class="column-filter">' + 
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/></svg>' + 
        '</button>' + 
      '</div>'
    )).join("") + 
    '</div>' + 
    '<div class="dor-table-rows">' + 
    (newData || pageData).map(item => (
      '<div class="dor-table-row">' + 
      this.#fields.map(field => (
        `<div class="dor-table-cell" data-column="${field.id}">` + 
          displayItemField(item, field) + 
        '</div>'
      )).join("") + 
      '</div>'
    )).join("") + 
    '</div>' + 
    '</div>' + 
    '<div class="dor-table-menu">' + 
      '<div class="dor-table-navigation">' + 
        `<button ${isFirstPage ? "disabled" : ""}>` + 
          '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="32px"><path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>' + 
        '</button>' + 
        `<button ${isFirstPage ? "disabled" : ""}>` + 
          '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="32px"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>' + 
        '</button>' + 
        '<div class="dor-table-navigation-pages">' + 
          createButtonPages(this.#pagination, this.maxPageNumber) + 
        '</div>' + 
        `<button ${isLastPage ? "disabled" : ""}>` + 
          '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="32px"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>' + 
        '</button>' + 
        `<button ${isLastPage ? "disabled" : ""}>` + 
          '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="32px"><path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"/></svg>' + 
        '</button>' + 
        `<p>${startIndex + 1} - ${endIndex} / ${this.#data.length}</p>` + 
        '<select>' + 
          [5, 10, 20, 30, 50, 100].map(option => {
            return `<option value="${option}" ${option === this.#pagination.pageSize ? `selected="selected"` : ""}>${option}</option>`
          }).join("") + 
        '</select>' + 
      '</div>' + 
    '</div>';

    this.#domElement.innerHTML = htmlAsString;

    this.#addEvents();

    function createCurrentSortIcon(sortData, columnId) {
      if (sortData.field && sortData.field === columnId) {
        if (sortData.type === "DESC") {
          return '<svg class="column-sort" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>';
        }
        if (sortData.type === "ASC") {
          return '<svg class="column-sort" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>';
        }
        return "";
      }
      return "";
    }

    function createButtonPages(paginationData, maxPageNumber) {
      let pagesHtml = "";
      const pages = [];
      const maxPageTracking = 3;
      const currentPage = paginationData.currentPageNumber;

      for (let i = currentPage - 1; i >= currentPage - maxPageTracking; i--) {
        if (i <= 0) break;
        pages.unshift(i);
      }
      
      pages.push(currentPage);

      for (let i = currentPage + 1; i <= currentPage + maxPageTracking; i++) {
        if (i > maxPageNumber) break;
        pages.push(i);
      }

      for (let page of pages) {
        pagesHtml += 
        `<button ${page === currentPage ? `class="selected"` : ""}>${page}</button>`;
      }

      return pagesHtml;
    }

    function getFieldAlignment(type) {
      if (["date", "number"].includes(type)) {
        return "right";
      }
      if (["boolean"].includes(type)) {
        return "center";
      }
      return "left";
    }

    function displayItemField(item, field) {
      const itemField = item[field.id];
      let alignment = "left";
      let textContent = null;
      if (field.type === "date") {
        textContent = new Date(itemField).toLocaleString();
        alignment = "right";
      }
      if (field.type === "number") {
        textContent = Number(itemField).toLocaleString();
        alignment = "right";
      }
      if (field.type === "string") {
        textContent = itemField;
      }
      if (field.type === "boolean") {
        textContent = itemField === true 
          ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>' 
          : '';
        alignment = "center";
      }
      if (textContent !== null) {
        return (
          `<p class="cell-${alignment}">${textContent}</p>`
        );
      } else {
        return (
          '<p class="dor-table-cell-empty">' + 
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M140-440q-25 0-42.5-17.5T80-500q0-25 17.5-42.5T140-560h240q25 0 42.5 17.5T440-500q0 25-17.5 42.5T380-440H140Zm440 0q-25 0-42.5-17.5T520-500q0-25 17.5-42.5T580-560h240q25 0 42.5 17.5T880-500q0 25-17.5 42.5T820-440H580Z"/></svg>' + 
          '</p>'
        )
      }
    }
  }

  #addEvents() {
    const domElement = this.#domElement;
    const tableColumns = domElement.querySelectorAll(".dor-table-column");
    tableColumns.forEach(column => {
      const currentColumnId = column.getAttribute("data-column");

      column.querySelector(".column-filter").addEventListener("click", (ev) => {
        ev.stopPropagation();

        const columnHasPopup = column.querySelector(".dor-popup");

        document.querySelectorAll(".dor-popup").forEach(popup => {
          popup.remove();
        });

        if (columnHasPopup) {
          return;
        }

        const newPopup = document.createElement("div");
        newPopup.classList.add("dor-popup");

        const columnData = this.#fields.find(field => field.id === currentColumnId);
        const fieldType = columnData.type;
        
        const popupHtml = 
        '<form>' + 
        `<h3>${columnData.label}</h3>` + 
        (fieldType === "string" ? '<div class="filter-contains"></div>' : '') + 
        '<div class="filter-equals"></div>' + 
        (fieldType !== "string" && fieldType !== "boolean" ? '<div class="filter-from"></div>' : '') + 
        (fieldType !== "string" && fieldType !== "boolean" ? '<div class="filter-to"></div>' : '') + 
        '<button type="reset">Reset</button>' + 
        '<button type="submit">Filter</button>' + 
        '</form>';

        newPopup.innerHTML = popupHtml;

        if (fieldType === "string") {
          new DorInputText(newPopup.querySelector("div.filter-contains"), {
            id: "filter-contains", 
            label: "Contains", 
            value: this.#filtering[currentColumnId]?.contains, 
          });
        }

        new DorInputText(newPopup.querySelector("div.filter-equals"), {
          id: "filter-equals", 
          label: "Equals", 
          type: fieldType === "string" ? "text" : fieldType, 
          value: this.#filtering[currentColumnId]?.equals, 
        });

        if (fieldType !== "string" && fieldType !== "boolean") {
          new DorInputText(newPopup.querySelector("div.filter-from"), {
            id: "filter-from", 
            label: "From", 
            type: fieldType, 
            value: this.#filtering[currentColumnId]?.from, 
          });
          new DorInputText(newPopup.querySelector("div.filter-to"), {
            id: "filter-to", 
            label: "To", 
            type: fieldType, 
            value: this.#filtering[currentColumnId]?.to, 
          });
        }

        newPopup.querySelector('button[type="reset"]').addEventListener("click", (ev) => {
          delete this.#filtering[currentColumnId];

          this.loadHtml();
        });

        newPopup.querySelector("form").addEventListener("submit", (ev) => {
          ev.preventDefault();

          const formData = new FormData(ev.target);

          this.#filtering[currentColumnId] = {
            from: formData.get("filter-from"), 
            to: formData.get("filter-to"), 
            contains: formData.get("filter-contains"), 
            equals: formData.get("filter-equals"), 
          };

          this.loadHtml();
        });

        newPopup.addEventListener("click", function (ev) {
          ev.stopPropagation();
        });

        column.append(newPopup);
      });

      column.addEventListener("click", () => {
        if (this.#sorting.field === currentColumnId) {
          const currentSorting = this.#sorting.type;
          if (currentSorting === "DESC") {
            this.#sorting.type = "ASC";
          } else if (currentSorting === "ASC") {
            this.#sorting.type = "DESC";
          }
        } else {
          this.#sorting = {
            field: currentColumnId, 
            type: "DESC", 
          };
        }

        this.loadHtml();
      });
    });

    const pageSelect = this.#domElement.querySelector(".dor-table-menu select");
    pageSelect.addEventListener("change", (ev) => {
      this.#pagination.pageSize = Number(ev.target.value);
      if (this.#pagination.currentPageNumber > this.maxPageNumber) {
        this.#pagination.currentPageNumber = this.maxPageNumber;
      }

      this.loadHtml();
    });

    const navigation = this.#domElement.querySelector(".dor-table-navigation");

    const pages = navigation.querySelectorAll(".dor-table-navigation-pages button");

    pages.forEach(page => {
      page.addEventListener("click", () => {
        const newPage = Number(page.textContent);
        if (this.#pagination.currentPageNumber === newPage) {
          return;
        }
        this.#pagination.currentPageNumber = newPage;
        this.loadHtml();
      });
    });

    const firstPageButton = navigation.querySelector(":scope > button:nth-of-type(1)");
    firstPageButton.addEventListener("click", () => {
      if (this.#pagination.currentPageNumber === 1) {
        return;
      }
      this.#pagination.currentPageNumber = 1;
      this.loadHtml();
    });
    const previousPageButton = navigation.querySelector(":scope > button:nth-of-type(2)");
    previousPageButton.addEventListener("click", () => {
      if (this.#pagination.currentPageNumber === 1) {
        return;
      }
      this.#pagination.currentPageNumber--;
      this.loadHtml();
    });
    const nextPageButton = navigation.querySelector(":scope> button:nth-of-type(3)");
    nextPageButton.addEventListener("click", () => {
      if (this.#pagination.currentPageNumber === this.maxPageNumber) {
        return;
      }
      this.#pagination.currentPageNumber++;
      this.loadHtml();
    });
    const lastPageButton = navigation.querySelector(":scope > button:nth-of-type(4)");
    lastPageButton.addEventListener("click", () => {
      if (this.#pagination.currentPageNumber === this.maxPageNumber) {
        return;
      }
      this.#pagination.currentPageNumber = this.maxPageNumber;
      this.loadHtml();
    });
  }

  log() {
    console.log(this.#domElement, this.#data, this.#fields);
  }
}