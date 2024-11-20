const createSelectFieldOptions = () => {
  const fieldOptions = document.getElementById("fieldOptions");
  const field = document.createElement("div");
  field.classList.add("mb-3");

  const label = document.createElement("label");
  label.classList.add("form-label");
  label.textContent = "Options";
  label.setAttribute("for", "options");

  const input = document.createElement("textarea");
  input.classList.add("form-control");
  input.setAttribute("name", "options");
  input.setAttribute("rows", "6");
  input.setAttribute("placeholder", "Enter comma separated list of values");
  input.setAttribute("required", "");

  field.appendChild(label);
  field.appendChild(input);

  fieldOptions.appendChild(field);
};

const clearFieldOptions = () => {
  const fieldOptions = document.getElementById("fieldOptions");
  fieldOptions.innerHTML = "";
};

document.addEventListener("DOMContentLoaded", function () {
  var selectType = document.getElementById("type");
  // Add option selected listener
  selectType.addEventListener("change", function () {
    var selectedOption = selectType.options[selectType.selectedIndex];
    var selectedValue = selectedOption.value;
    var selectedText = selectedOption.text;

    if (selectedValue === "Enum") {
      createSelectFieldOptions();
    } else {
      clearFieldOptions();
    }

    // Log the selected option value and text
    console.log(selectedValue, selectedText);
  });
});
