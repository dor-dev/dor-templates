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
  #domElement;
  #data;
  #fields;

  constructor(domElement, data, fields) {
    this.#domElement = domElement;
    this.#data = data;
    this.#fields = fields;
    
    this.#assemble();
  }

  #assemble() {
    this.log();
    this.#domElement.classList.add("dor-table");

    const htmlAsString = 
    '<div class="dor-table-columns">' + 
    this.#fields.map(field => (
      `<div class="dor-table-column dor-table-cell" data-column="${field.id}">` + 
        `<p class="cell-${getFieldAlignment(field.type)}">${field.label}</p>` + 
      '</div>'
    )).join("") + 
    '</div>' + 
    '<div class="dor-table-rows">' + 
    this.#data.map(item => (
      '<div class="dor-table-row">' + 
      this.#fields.map(field => (
        `<div class="dor-table-cell" data-column="${field.id}">` + 
          displayItemField(item, field) + 
        '</div>'
      )).join("") + 
      '</div>'
    )).join("") + 
    '</div>';

    this.#domElement.innerHTML = htmlAsString;

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

  log() {
    console.log(this.#domElement, this.#data, this.#fields);
  }
}