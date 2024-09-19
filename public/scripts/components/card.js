document.addEventListener("DOMContentLoaded", () => {
  const cardGroupContainer = document.getElementById("card-demo");
  const cards = Array.from({length: 10}, (_, i) => {
    return {
      title: "Dor card Nº " + i + ".", 
      body: "This is a sample card with a small body of text.", 
      ammount: 10000 * i, 
      date: Date.now() - 10000000000 * i, 
      image: {
        src: `https://picsum.photos/3840/${2160 + i}`, 
        alt: "lorem picsum image Nº " + i,
      }, 
    }
  });
  for (let card of cards) {
    const cardContainer = document.createElement("div");
    cardGroupContainer.append(cardContainer);
    const cardObject = new DorCard(cardContainer, card);
  }
});

class DorCard {
  #domElement;
  #data;

  constructor(domElement, data) {
    this.#domElement = domElement;
    this.#data = data;
    this.#assemble();
  }

  #assemble() {
    this.log();
    this.#domElement.classList.add("dor-card");
    const cardData = this.#data;
    let htmlAsString = 
    `<img src="${cardData.image.src}" alt="${cardData.image.alt}"></img>` + 
    '<div class="dor-card-body">' + 
    `<h3>${cardData.title}</h3>` + 
    `<p>${cardData.body}</p>`;

    if (cardData.ammount !== null && cardData.ammount !== undefined) {
      htmlAsString += 
      `<p class="dor-card-ammount"><b>Ammount: </b>${formatNumber(cardData.ammount)}.</p>`;
    }

    htmlAsString += 
    '<div class="dor-card-buttons">' + 
      '<button class="dor-like-button">' +  
      '<svg class="void" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>' + 
      '<svg class="filled" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>' + 
      '</button>' + 
      '<button class="dor-comment-button">' + 
      '<svg class="void" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>' + 
      '<svg class="filled" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z"/></svg>' + 
      '</button>' + 
      '<button class="dor-share-button">' + 
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z"/></svg>' + 
      '</button>';

    if (cardData.date !== null && cardData.date !== undefined) {
      htmlAsString += 
      `<span class="dor-card-date">${shortenDate(cardData.date)}</span>`;
    }

    htmlAsString += 
    '</div>';

    htmlAsString += 
    '<div class="dor-comment-section hidden" style="margin-top: 1rem;">' + 
      '<div class="input-text">' + 
        '<span>0 / 200</span>' + 
        '<label for="comment">Add a comment.</label>' + 
        '<textarea rows="1" maxlength="200" name="comment" id="comment"></textarea>' + 
      '</div>' + 
      '<button>' + 
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>' + 
      '</button>'
    '</div>'

    htmlAsString +=
    '</div>';

    this.#domElement.innerHTML = htmlAsString;

    this.#addEvents();
  }

  #addEvents() {
    const image = this.#domElement.querySelector("img");
    image.addEventListener("click", function (ev) {
      const imagePreviewContainer = document.createElement("div");
      imagePreviewContainer.classList.add("dor-image-preview");
      const imagePreview = document.createElement("img");
      imagePreview.src = image.src;
      imagePreview.alt = image.alt;
      imagePreviewContainer.appendChild(imagePreview);
      document.body.prepend(imagePreviewContainer);
      ev.stopPropagation();
    });

    const likeButton = this.#domElement.querySelector(".dor-like-button");
    likeButton.addEventListener("click", function () {
      likeButton.classList.toggle("toggled-svg");
    });
    
    const commentButton = this.#domElement.querySelector(".dor-comment-button");
    const commentSection = this.#domElement.querySelector(".dor-comment-section");
    commentButton.addEventListener("click", function () {
      commentButton.classList.toggle("toggled-svg");
      commentSection.classList.toggle("hidden");
    });

    const textareaContainer = commentSection.querySelector(".input-text");
    const commentTextarea = textareaContainer.querySelector("textarea");
    const characterTrack = textareaContainer.querySelector("span");
    if (commentTextarea.value) {
      textareaContainer.classList.add("focused");
      textareaContainer.classList.add("has-value");
    }
    commentTextarea.addEventListener("focus", function () {
      textareaContainer.classList.add("focused");
      textareaContainer.classList.add("has-value");
    });
    commentTextarea.addEventListener("blur", function () {
      textareaContainer.classList.remove("focused");
      if (!commentTextarea.value) {
        textareaContainer.classList.remove("has-value");
      } 
    });

    const textAreaLines = commentTextarea.value.split("\n").length;
    commentTextarea.setAttribute("rows", textAreaLines);
    commentTextarea.addEventListener("input", function (ev) {
      const maxLength = commentTextarea.getAttribute("maxlength");
      if (maxLength) {
        const characters = ev.target.value.length;
        characterTrack.textContent = characters + " / " + maxLength;
      }
      const lines = ev.target.value.split("\n");
      let lineBreaks = lines.length;
      for (let line of lines) {
        const lineLength = Math.floor(line.length / 30);
        lineBreaks += lineLength;
      }
      commentTextarea.setAttribute("rows", lineBreaks);
    });

    const sendComment = this.#domElement.querySelector(".dor-comment-section button");
    sendComment.addEventListener("click", function () {
      // TODO : Send comment...
    });

    const shareButton = this.#domElement.querySelector(".dor-share-button");
    commentButton.addEventListener("click", function () {
      // TODO : Share...
    });
  }

  log() {
    console.log(this.#domElement, this.#data);
  }
}