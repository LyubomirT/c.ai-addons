// content.js for character.ai



function initMemoryManager() {
  if (localStorage.getItem("memoryManagerEnabled") === "true") {
    // create a fixed sidebar on the right
    var sidebar = document.createElement("div");
    var screenWidth = window.innerWidth;
    sidebar.id = "memory-manager";
    sidebar.style.position = "fixed";
    sidebar.style.overflow = "auto";
    sidebar.style.right = "0"; // Initially hide the sidebar
    sidebar.style.top = "0";
    console.log(screenWidth);
    sidebar.style.width = screenWidth <= 960 ? "100%" : "25%";
    sidebar.style.height = "100%";
    sidebar.style.zIndex = screenWidth <= 960 ? "15000" : "999";
    sidebar.style.backgroundColor = "#f0f0f0";
    sidebar.style.borderLeft = "1px solid #ccc";
    sidebar.style.transition = "right 0.5s ease-in-out";
    sidebar.style.padding = "10px";
    sidebar.style.boxShadow = "-5px 0 10px rgba(0,0,0,0.1)";
    document.body.appendChild(sidebar);

    // create a button to toggle sidebar visibility
    var toggleButton = document.createElement("button");
    toggleButton.id = "toggle-sidebar-button";
    toggleButton.textContent = ">";
    toggleButton.style.position = "fixed";
    toggleButton.style.right = "0";
    toggleButton.style.top = screenWidth <= 960 ? "50px" : "10px";
    toggleButton.style.zIndex = "16999";
    toggleButton.style.backgroundColor = "#e0e0e0";
    toggleButton.style.color = "#333";
    toggleButton.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";
    toggleButton.style.transition = "all 0.3s ease-in-out";

    toggleButton.addEventListener("mouseenter", function () {
      toggleButton.style.backgroundColor = "#ccc";
      toggleButton.style.color = "#000";
      toggleButton.style.transform = "scale(1.1)";
    });

    toggleButton.addEventListener("mouseleave", function () {
      toggleButton.style.backgroundColor = "#e0e0e0";
      toggleButton.style.color = "#333";
      toggleButton.style.transform = "none";
    });

    toggleButton.style.border = "none";
    toggleButton.style.padding = "5px";
    toggleButton.style.fontWeight = "bold";
    toggleButton.style.fontSize = "20px";
    toggleButton.style.cursor = "pointer";
    toggleButton.addEventListener("click", function () {
      if (sidebar.style.right === "-100%") {
        sidebar.style.right = "0";
        toggleButton.textContent = ">"; // change the direction of the arrow
      } else {
        sidebar.style.right = "-100%";
        toggleButton.textContent = "<"; // change the direction of the arrow
      }
    });
    document.body.appendChild(toggleButton);

    // after 1 second, withdraw the sidebar
    setTimeout(function () {
      sidebar.style.right = "-100%";
      toggleButton.textContent = "<";
    }, 1000);

    // create a title for the sidebar
    var title = document.createElement("h3");
    title.textContent = "Memory Manager";
    title.style.textAlign = "center";
    sidebar.appendChild(title);

    // create a form element for the memory manager
    var form = document.createElement("form");
    form.id = "memory-manager-form";

    // create a textarea to display the memory string
    var textarea = document.createElement("textarea");
    textarea.id = "memory-display";
    textarea.style.padding = "10px";
    textarea.style.width = "85%";
    textarea.name = "memory-display"; // add a name attribute for form submission
    textarea.placeholder = "Your memory string will appear here"; // add a placeholder attribute for user guidance
    textarea.rows = 10; // adjust the number of rows for better appearance
    textarea.cols = 40; // adjust the number of columns for better appearance
    textarea.readOnly = true; // prevent user from editing the textarea directly
    form.appendChild(textarea);

    // create two fields for character memory and user memory
    var fields = ["character", "user"];
    for (var i = 0; i < fields.length; i++) {
      var fieldset = document.createElement("fieldset"); // use a fieldset element to group related elements
      fieldset.id = fields[i] + "-memory-fieldset"; // change the id to match the fieldset element

      // create a legend element for the fieldset
      var legend = document.createElement("legend"); // use a legend element to provide a caption for the fieldset
      legend.textContent =
        fields[i].charAt(0).toUpperCase() + fields[i].slice(1) + " memory:";
      fieldset.appendChild(legend);

      // create a select element for the field
      var select = document.createElement("select");
      select.id = fields[i] + "-memory-select";
      select.style.padding = "10px";
      select.style.borderRadius = "5px";
      select.style.border = "1px solid #ccc";
      select.name = fields[i] + "-memory-select"; // add a name attribute for form submission

      // create an option element for the select element
      var option = document.createElement("option");
      option.value = "";
      option.textContent = "--Select a memory--";
      option.selected = true;
      option.disabled = true;
      select.appendChild(option);

      // append the select element to the fieldset
      fieldset.appendChild(select);

      // create two buttons for adding and removing memory
      var buttons = ["add", "remove"];
      for (var j = 0; j < buttons.length; j++) {
        var button = document.createElement("button");
        button.style.marginTop = "12px";
        button.style.border = "none";
        button.style.fontWeight = "bold";
        button.style.borderRadius = "5px";
        button.style.backgroundColor = "#2377d2";
        button.style.padding = "5px";
        button.style.paddingLeft = "10px";
        button.style.paddingRight = "10px";
        button.id = buttons[j] + "-" + fields[i] + "-memory-button";
        button.textContent =
          buttons[j].charAt(0).toUpperCase() + buttons[j].slice(1) + " memory";
        button.style.display = buttons[j] === "add" ? "inline-block" : "none"; // hide the remove button initially
        button.style.marginLeft = buttons[j] === "add" ? "10px" : "5px"; // adjust the margin
        button.type = "button"; // specify the button type to prevent form submission
        button.addEventListener("click", function (e) {
          e.preventDefault();
          handleMemoryButton(e.target.id); // call a function to handle the button click
        });
        fieldset.appendChild(button);
      }

      // append the fieldset to the form
      form.appendChild(fieldset);
    }

    // append the form to the sidebar
    sidebar.appendChild(form);

    // create a variable to store the memory string
    var memoryString;

    // create a function to handle the add and remove memory buttons
    function handleMemoryButton(buttonId) {
      // get the button type and the memory type from the button id
      var buttonType =
        buttonId.split("-")[0].charAt(0).toUpperCase() +
        buttonId.split("-")[0].slice(1);
      var memoryType =
        buttonId.split("-")[1].charAt(0).toUpperCase() +
        buttonId.split("-")[1].slice(1);

      // get the select element and the options for the memory type
      var selectElement = document.getElementById(
        memoryType.toLowerCase() + "-memory-select"
      );
      var options = selectElement.options;

      if (buttonType === "Add") {
        // prompt the user to enter a new memory
        var newMemory =
          prompt(`Enter a new ${memoryType.toLowerCase()} memory:`) || "";

        if (newMemory.trim() !== "") {
          // create a new option element with the new memory
          var newOption = document.createElement("option");
          newOption.value = newMemory;
          newOption.textContent = newMemory;

          // append the new option to the select element
          selectElement.appendChild(newOption);

          // select the new option
          selectElement.selectedIndex = options.length - 1;

          // show the remove button
          document.getElementById(
            "remove-" + memoryType.toLowerCase() + "-memory-button"
          ).style.display = "inline-block";
        }
      } else if (buttonType === "Remove") {
        // get the selected option index
        var selectedIndex = selectElement.selectedIndex;

        if (selectedIndex > 0) {
          // remove the selected option from the select element
          selectElement.removeChild(options[selectedIndex]);

          // select the first option
          selectElement.selectedIndex = 0;

          // hide the remove button if there are no more options
          if (options.length === 1) {
            document.getElementById(
              "remove-" + memoryType.toLowerCase() + "-memory-button"
            ).style.display = "none";
          }
        }
      }

      // update the memory string and display it in the textarea
      updateMemoryString();
    }

    function updateMemoryString() {
      var characterMemorySelect = document.getElementById(
        "character-memory-select"
      );
      var userMemorySelect = document.getElementById("user-memory-select");

      var characterMemories = Array.from(characterMemorySelect.options)
        .map((option) => option.value)
        .filter((memory) => memory.trim() !== "");

      var userMemories = Array.from(userMemorySelect.options)
        .map((option) => option.value)
        .filter((memory) => memory.trim() !== "");

      var characterMemoryString = characterMemories
        .map((memory) => '"' + memory + '"')
        .join("; ");

      var userMemoryString = userMemories
        .map((memory) => '"' + memory + '"')
        .join("; ");

      memoryString = "[ AI memories: " + characterMemoryString + " ]";

      if (userMemoryString.trim() !== "") {
        memoryString += "\n[ User Facts: " + userMemoryString + " ]";
      }

      document.getElementById("memory-display").value = memoryString;
    }

    // create a function to insert the memory string to the user input textarea
    function insertMemoryString() {
      // get the user input textarea element
      var userInputTextarea = document.getElementById("user-input");

      // insert the memory string to the user input textarea with a newline
      userInputTextarea.value = memoryString + "\n\n" + userInputTextarea.value;
    }

    function handleSubmit(event) {
      event.preventDefault();
      updateMemoryString();
      insertMemoryString();
    }

    // add an event listener to the form element for submission
    form.addEventListener("submit", handleSubmit);

    // create a style element for the sidebar
    var style = document.createElement("style");
    style.textContent = `
#memory-manager-form {
display: flex;
flex-direction: column;
align-items: center;
margin-bottom: 50px;
}

#memory-manager-form fieldset {
width: 80%;
margin: 10px;
}

#memory-manager-form legend {
font-weight: bold;
}

#memory-manager-form select {
width: 100%;
}

#memory-manager-form input[type="submit"] {
width: 50%;
margin-top: 20px;
padding: 10px;
border: none;
border-radius: 5px;
background-image: linear-gradient(to right, #00c6ff, #0072ff);
color: white;

`;
    document.head.appendChild(style);

    var DIVFORTHEINSERTBUTTON = document.createElement("div");
    DIVFORTHEINSERTBUTTON.style.display = "flex";
    DIVFORTHEINSERTBUTTON.style.justifyContent = "center";
    DIVFORTHEINSERTBUTTON.style.alignItems = "center";
    sidebar.appendChild(DIVFORTHEINSERTBUTTON);

    // create a button element for inserting memory string
    var insertButton = document.createElement("button");
    insertButton.innerText = "Insert Memory String";
    insertButton.style.backgroundImage =
      "linear-gradient(to right, #00c6ff, #0072ff)";
    insertButton.style.padding = "10px";
    insertButton.style.borderRadius = "5px";
    insertButton.style.border = "none";
    insertButton.marginTop = "30px !important";
    insertButton.width = "80%";
    insertButton.addEventListener("click", function () {
      insertMemoryString();
    });
    DIVFORTHEINSERTBUTTON.appendChild(insertButton);
  }
}

function updateSidebarWidth() {
  var screenWidth = window.innerWidth;
  var sidebar = document.getElementById("memory-manager");
  var toggleButton = document.getElementById("toggle-sidebar-button");
  var fixedField = document.getElementById("fixed-field");

  if (screenWidth <= 960) {
    if (sidebar) {
      sidebar.style.width = "100%";
      toggleButton.style.top = "50px";
      sidebar.style.zIndex = 15000;
    }
    fixedField.style.display = "block";
    fixedField.style.position = 'relative';
    fixedField.style.marginBottom = "200px";
    fixedField.style.width = "100%";
    fixedField.style.left = "0";
    // Move fixedField to below the #root div
    document.body.insertAdjacentElement("beforeend", fixedField);
  } else {
    if (sidebar)
    {
      sidebar.style.width = "25%";
      toggleButton.style.top = "10px";
      sidebar.style.zIndex = 999;
    }
    fixedField.style.position = 'absolute';
    fixedField.style.marginBottom = "0";
    fixedField.style.width = "115px";
    fixedField.style.left = "20px";

    // Move fixedField to above the #root div
    document.body.insertAdjacentElement("afterbegin", fixedField);

  }
}

// Add an event listener to the window's resize event
window.addEventListener("resize", updateSidebarWidth);


function toggleRoundedAvatars() {
  const roundedAvatarsEnabled = localStorage.getItem("roundedAvatars") === "true";
  const images = document.querySelectorAll("img");

  function applyRoundedStyle(image) {
    image.style.borderRadius = roundedAvatarsEnabled ? "0" : "45px";
  }

  images.forEach(image => {
    if (image.src.includes("https://characterai.io/i/80/static/avatars/")) {
      if (image.complete) {
        applyRoundedStyle(image);
      } else {
        image.onload = function() {
          applyRoundedStyle(image);
        };
      }
    }
  });
}

// Observe mutations in the document to handle dynamically loaded content
const observer = new MutationObserver(function(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      toggleRoundedAvatars(); // Call your function whenever the DOM changes
    }
  }
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to apply rounded avatars to existing images
toggleRoundedAvatars();


// create a fixed field in the bottom-left corner
var screenWidth = window.innerWidth;
var fixedField = document.createElement("div");
fixedField.id = "fixed-field";
fixedField.style.position = screenWidth <= 960 ? "relative" : "absolute";
fixedField.style.left = screenWidth <= 960 ? "0" : "20px";
fixedField.style.bottom = "20px";
fixedField.style.width = screenWidth <= 960 ? "100%" : "115px";
fixedField.style.height = "60px";
fixedField.style.marginBottom = screenWidth <= 960 ? "200px" : "0";
fixedField.style.backgroundColor = "#f0f0f0";
fixedField.style.zIndex = "9999";
fixedField.style.padding = "10px";
fixedField.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.1)";
document.body.appendChild(fixedField);

// create a cog button for opening addon settings
var cogButton = document.createElement("button");
cogButton.id = "addon-settings-button";
cogButton.textContent = "\u2699"; // Unicode for cog symbol
cogButton.style.backgroundColor = "#e0e0e0";
cogButton.style.color = "#333";
cogButton.style.border = "none";
cogButton.style.borderRadius = "50%";
cogButton.style.width = "40px";
cogButton.style.height = "40px";
cogButton.style.fontSize = "20px";
cogButton.style.cursor = "pointer";
cogButton.style.margin = "0";
cogButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
cogButton.style.transition = "all 0.3s ease-in-out";
cogButton.addEventListener("mouseenter", function () {
  cogButton.style.backgroundColor = "#ccc";
  cogButton.style.color = "#000";
});

cogButton.addEventListener("mouseleave", function () {
  cogButton.style.backgroundColor = "#e0e0e0";
  cogButton.style.color = "#333";
});
fixedField.appendChild(cogButton);

// create settings panel for C.ai addons
var settingsPanel = document.createElement("div");
settingsPanel.id = "addon-settings-panel";
settingsPanel.style.display = "none";
settingsPanel.style.position = "absolute";
settingsPanel.style.bottom = "50px";
settingsPanel.style.left = "10px";
settingsPanel.style.width = "300px";
settingsPanel.style.backgroundColor = "#fff";
settingsPanel.style.border = "1px solid #ccc";
settingsPanel.style.borderRadius = "5px";
settingsPanel.style.padding = "10px";
settingsPanel.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.1)";
fixedField.appendChild(settingsPanel);

// create a toggle button for enabling/disabling Memory Manager
var memoryToggle = document.createElement("input");
memoryToggle.type = "checkbox";
memoryToggle.id = "memory-toggle";
memoryToggle.style.marginRight = "5px";
memoryToggle.checked = true; // Enabled by default
settingsPanel.appendChild(memoryToggle);

var memoryToggleLabel = document.createElement("label");
memoryToggleLabel.htmlFor = "memory-toggle";
memoryToggleLabel.textContent = "Enable Memory Manager";
settingsPanel.appendChild(memoryToggleLabel);

var br = document.createElement("br");
settingsPanel.appendChild(br);

// create a toggle for enabling/disabling rounded avatars
var roundedAvatarsToggle = document.createElement("input");
roundedAvatarsToggle.type = "checkbox";
roundedAvatarsToggle.id = "rounded-avatars-toggle";
roundedAvatarsToggle.style.marginRight = "5px";
roundedAvatarsToggle.checked = true; // Enabled by default
settingsPanel.appendChild(roundedAvatarsToggle);

var roundedAvatarsToggleLabel = document.createElement("label");
roundedAvatarsToggleLabel.htmlFor = "rounded-avatars-toggle";
roundedAvatarsToggleLabel.textContent = "Disable Rounded Avatars";
settingsPanel.appendChild(roundedAvatarsToggleLabel);

roundedAvatarsToggle.addEventListener("change", function () {
  localStorage.setItem("roundedAvatars", this.checked);
  toggleRoundedAvatars();
});

br = document.createElement("br");
settingsPanel.appendChild(br);

// create a toggle for enabling/disabling creation of new legacy chats

var legacyChatsToggle = document.createElement("input");
legacyChatsToggle.type = "checkbox";
legacyChatsToggle.id = "legacy-chats-toggle";
legacyChatsToggle.style.marginRight = "5px";
legacyChatsToggle.checked = true; // Enabled by default
settingsPanel.appendChild(legacyChatsToggle);

var legacyChatsToggleLabel = document.createElement("label");
legacyChatsToggleLabel.htmlFor = "legacy-chats-toggle";
legacyChatsToggleLabel.textContent = "Enable Legacy Chats";
settingsPanel.appendChild(legacyChatsToggleLabel);

legacyChatsToggle.addEventListener("change", function () {
  localStorage.setItem("legacyChatsEnabled", this.checked);
  showMessage("Please reload the page for the changes to apply.");
});

if (localStorage.getItem("legacyChatsEnabled") === "true") {
  legacyChatsToggle.checked = true;
  initLegacy();
} else {
  legacyChatsToggle.checked = false;
}

// handle addon settings button click
cogButton.addEventListener("click", function () {
  settingsPanel.style.display =
    settingsPanel.style.display === "none" ? "block" : "none";
});

// Add event listener to toggle Memory Manager
memoryToggle.addEventListener("change", function () {
  var memoryManagerEnabled = this.checked;

  // Save the enabled/disabled state in localStorage
  localStorage.setItem("memoryManagerEnabled", memoryManagerEnabled);

  // Show a message indicating the changes were applied
  showMessage("Please reload the page for the changes to apply.");
});

// Check and set initial state from localStorage
var initialMemoryManagerState = localStorage.getItem("memoryManagerEnabled");
if (
  initialMemoryManagerState === "false" ||
  initialMemoryManagerState === null
) {
  memoryToggle.checked = false;
} else {
  memoryToggle.checked = true;
}

// Check and set initial state from localStorage
var initialRoundedAvatarsState = localStorage.getItem("roundedAvatars");
if (initialRoundedAvatarsState === "false" || initialRoundedAvatarsState === null) {
  
  roundedAvatarsToggle.checked = false;
} else {
  roundedAvatarsToggle.checked = true;
}


initMemoryManager();

// create a message box for displaying status messages
var messageBox = document.createElement("div");
messageBox.id = "message-box";
messageBox.style.backgroundColor = "red"; // Change the background color to red
messageBox.style.color = "white";
messageBox.style.padding = "10px";
messageBox.style.marginTop = "10px";
messageBox.style.display = "none"; // Initially hide the message box
settingsPanel.appendChild(messageBox);

// Function to display a message in the message box
function showMessage(message) {
  var messageBox = document.getElementById("message-box");
  messageBox.textContent = message;
  messageBox.style.display = "block"; // Show the message box
  setTimeout(function () {
    messageBox.style.display = "none"; // Hide the message box after a few seconds
  }, 5000); // Display the message for 5 seconds
}

setTimeout(function () {
  toggleRoundedAvatars();
});

function initLegacy() {
// Create a button for the New Legacy Chat
const newLegacyChatButton = document.createElement("button");
newLegacyChatButton.id = "new-legacy-chat-button";
newLegacyChatButton.textContent = "↻";
newLegacyChatButton.style.borderRadius = "50%";
newLegacyChatButton.style.fontSize = "20px";
newLegacyChatButton.style.margin = "0";
newLegacyChatButton.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.2)";
newLegacyChatButton.style.width = "40px";
newLegacyChatButton.style.height = "40px";
newLegacyChatButton.style.color = "#333";
newLegacyChatButton.style.padding = "5px 10px";
newLegacyChatButton.style.backgroundColor = "#e0e0e0";
newLegacyChatButton.style.color = "white";
newLegacyChatButton.style.border = "none";
newLegacyChatButton.style.cursor = "pointer";
newLegacyChatButton.style.zIndex = "9997";
newLegacyChatButton.style.marginLeft = "10px";
newLegacyChatButton.style.transition = "all 0.3s ease-in-out";

newLegacyChatButton.addEventListener("mouseenter", function () {
  newLegacyChatButton.style.backgroundColor = "#ccc";
  newLegacyChatButton.style.color = "#000";
});

newLegacyChatButton.addEventListener("mouseleave", function () {
  newLegacyChatButton.style.backgroundColor = "#e0e0e0";
  newLegacyChatButton.style.color = "#333";
});

newLegacyChatButton.addEventListener("click", async function () {
  const n = new URLSearchParams(window.location.search).get("char");
  if (!n) {
    alert("You are not on a character page!");
    return;
  }

  const o = localStorage.getItem("char_token");
  if (!o) {
    alert("You are not logged in!");
    return;
  }

  const a = JSON.parse(o).value;
  if (!a) {
    alert("You are not logged in!");
    return;
  }

  try {
    const e = await fetch("https://beta.character.ai/chat/history/create/", {
      method: "POST",
      body: JSON.stringify({ character_external_id: n }),
      credentials: "same-origin",
      headers: {
        Authorization: `Token ${a}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    const responseData = await e.json();
    const r = responseData.external_id;

    if (!r) {
      alert("Unexpected response from Character.AI. Check the console for more info.");
      console.warn("Unexpected response from Character.AI", responseData);
      return;
    }

    window.location.href = `https://beta.character.ai/chat?char=${n}&hist=${r}`;
  } catch (error) {
    alert("Failed to create a new chat using the legacy API. Check the console for more info.");
    console.error("Failed to create a new chat using the legacy API.", error);
  }
});



// Append the New Legacy Chat button to the document body
fixedField.appendChild(newLegacyChatButton);
}
