document.addEventListener("DOMContentLoaded", function () {
  const addFieldButton = document.getElementById("addField");

  if (addFieldButton) {
    addFieldButton.addEventListener("click", function () {
      // show prompt to add field
      const field = prompt("Enter field name");
      if (field) {
        const cardBody = document.querySelector(".card-body");
        const div = document.createElement("div");
        div.classList.add("mb-3");

        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        inputGroup.classList.add("input-group-flat");

        const label = document.createElement("label");
        label.classList.add("form-label");
        label.textContent = field;

        const input = document.createElement("input");
        input.classList.add("form-control");
        input.setAttribute("type", "text");
        input.setAttribute("name", `extra_${field}`);
        input.setAttribute("placeholder", `Enter ${field} information`);

        const removeButton = document.createElement("span");
        removeButton.classList.add("input-group-text");

        const removeLink = document.createElement("a");
        removeLink.setAttribute("href", "#");
        removeLink.setAttribute("data-bs-toggle", "tooltip");
        removeLink.setAttribute("aria-label", "Delete field");
        removeLink.setAttribute("data-bs-original-title", "Delete field");
        removeLink.classList.add("link-secondary");
        removeLink.innerHTML = `<i class="icon ti ti-trash"></i>`;
        removeLink.addEventListener("click", function (e) {
          e.preventDefault();
          e.target.closest(".mb-3").remove();
        });

        removeButton.appendChild(removeLink);

        inputGroup.appendChild(input);
        inputGroup.appendChild(removeButton);

        div.appendChild(label);
        div.appendChild(inputGroup);

        cardBody.appendChild(div);

        input.focus();
      }
    });
  }

  const removeButtons = document.querySelectorAll(".input-group-text a");
  if (removeButtons) {
    removeButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.target.closest(".mb-3").remove();
      });
    });
  }
});
