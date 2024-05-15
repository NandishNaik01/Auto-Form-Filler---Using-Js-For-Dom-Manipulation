var fillValues;

// Fetch the JSON file and initialize fillValues
fetch("https://raw.githubusercontent.com/NandishNaik01/newrepo/main/info.json")
  .then((response) => response.json())
  .then((data) => {
    // Process the JSON data
    fillValues = data; // Assign the fetched data to fillValues
    // console.log("fillValues initialized:", fillValues); // Log the initialized fillValues

    // Call the fill functions after fillValues is initialized
    executeEvery5Seconds();
  })
  .catch((error) => console.error("Error fetching JSON:", error));

// Function to fill Google Forms
function FillGoogleForms() {
  chrome.storage.sync.get("formData", function (result) {
    formData = result["formData"];
    var FormElement = document.getElementsByTagName("form")[0];

    // Fill text fields
    var selectorStr =
      "input[type='text'], input[type='email'], input[type='number'], input[type='tel'], input[type='url']";
    var fields = FormElement.querySelectorAll(selectorStr);
    fields.forEach(function (item) {
      var formTitle = item
        .closest("div[role='listitem']")
        .querySelector("div[role='heading']").firstChild.textContent;
      var answer = formData[formTitle.trim()];
      if (answer) {
        item.value = answer;
        item.setAttribute("data-initial-value", answer);
        item.setAttribute("badinput", "false");
        item.nextElementSibling.style.display = "none";
      }
    });

    // Fill textareas
    var fields = FormElement.querySelectorAll("textarea");
    fields.forEach(function (item) {
      var formTitle = item
        .closest("div[role='listitem']")
        .querySelector("div[role='heading']").firstChild.textContent;
      var answer = formData[formTitle.trim()];
      if (answer) {
        item.value = answer;
        item.setAttribute("data-initial-value", answer);
        item.setAttribute("badinput", "false");
        item.parentElement.previousElementSibling.style.display = "none";
      }
    });
  });
}

function fillForm() {
  // Select all input text fields
  var textFields = document.querySelectorAll(
    "input[type='text'], input[type='email'], input[type='number'], input[type='tel'], input[type='url']"
  );

  // Loop through each input field
  textFields.forEach(function (field) {
    // Check if the field id, placeholder, or name attribute exists in the fillValues object
    var matchedAttribute = field.id || field.placeholder || field.name;
    if (fillValues.hasOwnProperty(matchedAttribute)) {
      //   console.log(fillValues[matchedAttribute]);
      // Fill the field with the corresponding value
      field.value = fillValues[matchedAttribute];
    } else {
      // Find the associated label element
      var label = document.querySelector("label[for='" + field.id + "']");
      if (label) {
        // Get the text content of the label
        var labelText = label.textContent.trim();
        // console.log(labelText);
        // Check if the label text exists in the fillValues object
        if (fillValues.hasOwnProperty(labelText)) {
          //   console.log(fillValues[labelText]);
          // Fill the input field with the corresponding value
          field.value = fillValues[labelText];
        }
      }
    }
  });
}

// Function to execute after 5 seconds
function executeEvery5Seconds() {
  // Execute the fill functions
  fillForm();
  FillGoogleForms();
  fillFormIrctc();
}

// Call the executeEvery5Seconds function every 5 seconds
setTimeout(executeEvery5Seconds, 5000);
