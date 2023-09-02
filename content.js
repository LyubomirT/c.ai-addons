// content.js for character.ai
var caughtOne = false;

function initMemoryManager() {
  if (localStorage.getItem("memoryManagerEnabled") === "true") {
    // create a fixed sidebar on the right
    var sidebar = document.createElement("div");
    var screenWidth = window.innerWidth;
    var userName;
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

    function importMemoryString(memoryString) {
      var characterMemorySelect = document.getElementById(
        "character-memory-select"
      );
      var userMemorySelect = document.getElementById("user-memory-select");

      // Clear existing memory options
      characterMemorySelect.innerHTML =
        '<option value="" disabled selected>--Select a memory--</option>';
      userMemorySelect.innerHTML =
        '<option value="" disabled selected>--Select a memory--</option>';

      // Split memoryString by newlines
      var memoryLines = memoryString.split("\n");

      memoryLines.forEach(function (memoryLine) {
        // Trim whitespace and check for AI memories or User Facts keywords
        var cleanedLine = memoryLine.trim();

        if (cleanedLine.startsWith("[ AI memories:")) {
          var memories = cleanedLine.match(/"([^"]*)"/g);
          if (memories) {
            memories.forEach(function (memory) {
              var cleanedMemory = memory.slice(1, -1); // Remove the surrounding double quotes
              var newOption = document.createElement("option");
              newOption.value = cleanedMemory;
              newOption.textContent = cleanedMemory;
              characterMemorySelect.appendChild(newOption);
            });
          }
        } else if (cleanedLine.startsWith("[ User Facts:")) {
          var memories = cleanedLine.match(/"([^"]*)"/g);
          if (memories) {
            memories.forEach(function (memory) {
              var cleanedMemory = memory.slice(1, -1); // Remove the surrounding double quotes
              var newOption = document.createElement("option");
              newOption.value = cleanedMemory;
              newOption.textContent = cleanedMemory;
              userMemorySelect.appendChild(newOption);
            });
          }
        }
      });

      updateMemoryString(); // Update the displayed memory string
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
width: 80%;
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
    DIVFORTHEINSERTBUTTON.style.flexDirection = "column"; // To vertically center
    DIVFORTHEINSERTBUTTON.style.alignItems = "center"; // To horizontally center
    sidebar.appendChild(DIVFORTHEINSERTBUTTON);

    // create a button element for inserting memory string
    var insertButton = document.createElement("button");
    insertButton.innerText = "Insert Memory String";
    insertButton.style.backgroundImage =
      "linear-gradient(to right, #00c6ff, #0072ff)";
    insertButton.style.padding = "10px";
    insertButton.style.borderRadius = "5px";
    insertButton.style.border = "none";
    insertButton.style.marginTop = "30px !important";
    insertButton.style.width = "80%";
    insertButton.addEventListener("click", function () {
      insertMemoryString();
    });
    DIVFORTHEINSERTBUTTON.appendChild(insertButton);
    // create a button element for importing memory string
    var importButton = document.createElement("button");
    importButton.innerText = "Import Memory String";
    importButton.style.backgroundImage =
      "linear-gradient(to right, #00c6ff, #0072ff)";
    importButton.style.padding = "10px";
    importButton.style.justifyContent = "center";
    importButton.style.alignItems = "center";
    importButton.style.borderRadius = "5px";
    importButton.style.border = "none";
    importButton.style.marginTop = "10px";
    importButton.style.width = "80%";
    importButton.addEventListener("click", function () {
      openImportDialog();
    });
    DIVFORTHEINSERTBUTTON.appendChild(importButton);

    // Add a "Scan" button to trigger the message scanning process
    var scanButton = document.createElement("button");
    scanButton.id = "scan-button";
    scanButton.textContent = "Generate Automatically";
    scanButton.style.backgroundImage =
      "linear-gradient(to right, #00c6ff, #0072ff)";
    scanButton.style.padding = "10px";
    scanButton.style.borderRadius = "5px";
    scanButton.style.border = "none";
    scanButton.style.marginTop = "10px";
    scanButton.style.width = "80%";
    scanButton.style.color = "white";
    scanButton.style.cursor = "pointer";
    scanButton.addEventListener("click", scanMessages);
    DIVFORTHEINSERTBUTTON.appendChild(scanButton);

    // Add a new select element for choosing which model to use for auto-scanning
    var modelSelect = document.createElement("select");
    modelSelect.id = "model-select";
    modelSelect.style.borderRadius = "5px";
    modelSelect.style.marginTop = "10px";
    modelSelect.style.padding = "10px";
    modelSelect.style.width = "80%";

    var currentlySelectedModel = "command";

    // Add options to the select element
    modelSelect.innerHTML = `<option value="command">Normal (Higher Quality, Slower)</option><option value="command-light">Fast (Lower Quality, Faster)</option>`;

    modelSelect.addEventListener("change", function () {
      currentlySelectedModel = modelSelect.value;
    })
    DIVFORTHEINSERTBUTTON.appendChild(modelSelect);
    
    function convertToMemoryString(obj) {
      // Extract the summary from the object
      var summary = obj.summary;
    
      // Split the summary into individual lines
      var lines = summary.split("\n");
    
      // Initialize an array to store the formatted lines
      var formattedLines = [];
    
      // Iterate through each line
      lines.forEach(function (line) {
        // Remove the leading dash and any whitespace characters
        line = line.replace(/^-/, "").trim();
    
        // Add the line to the formattedLines array, enclosed in double quotes
        formattedLines.push(`"${line}"`);
      });
    
      // Join the formatted lines with a semicolon separator
      var memoryString = `[ AI memories: ${formattedLines.join("; ")} ]`;
    
      // Return the resulting memory string
      return memoryString;
    }
    
    

    // Function to scan and summarize messages
    async function scanMessages() {

      scanButton.textContent = "Scanning... (Might take a while)";
      scanButton.disabled = true;
      // Check if the window.location.href contains "chat2"
      if (window.location.href.includes("chat2")) {
        scanChat2Messages();
        return
      }
      // Get all message divs
      var authorNameElement = document.querySelector(".msg-author-name");
      
      // Check if the element exists and contains text
      if (authorNameElement) {
        var userName = authorNameElement.textContent;
        console.log("User's name:", userName);
      } else {
        var userName = "Anonymous";
        console.log("Author name element not found.");
      }
    
      // Get the element with the class "chattitle p-0 pe-1 m-0"
      var chatTitleElement = document.querySelector(".chattitle.p-0.pe-1.m-0");
      var chatTitle;
    
      // Check if the element exists and contains text
      if (chatTitleElement) {
        var chatTitle = Array.from(chatTitleElement.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('')
        .trim();
        console.log("Chat title:", chatTitle);
      } else {
        var chatTitle = "Unknown";
        console.log("Chat title element not found.");
      }
    
      var messageDivs = document.querySelectorAll(
        ".msg.char-msg, .msg.user-msg"
      );
    
      // Initialize arrays to store character and user messages
      var characterMessages = [];
      var userMessages = [];
    
      // Iterate through each message div
      messageDivs.forEach(function (messageDiv) {
        var parentSlide = messageDiv.closest(".swiper-slide");
        if (parentSlide && !parentSlide.classList.contains("swiper-slide-active") || caughtOne) {
          return;
        }

        // Find the <p> elements inside the message div
        var messageParagraphs = messageDiv.querySelectorAll("div > div > div > p");
        var messageBlockquotes = messageDiv.querySelectorAll("div > div > div > blockquote > p");
        var messageInlineCodes = messageDiv.querySelectorAll("div > div > div > p > div > div > code > span > span");
        var messageUls = messageDiv.querySelectorAll("ul");

        // Extract and store the text content of each <p> element
        var messageText = Array.from(messageParagraphs).map(function (paragraph) {
          // Handle special elements inside the message
          var specialElements = messageDiv.querySelectorAll("ul, ol, pre, blockquote, code");
          if (specialElements.length > 0) {
            return Array.from(specialElements).map(function (element) {
              if (element.tagName == "CODE") {
                return element.textContent;
              }
              else if (element.tagName == "BLOCKQUOTE") {
                console.log(element.childNodes[0].innerText);
                return element.childNodes[0].innerText;
              }
            }).join("\n");
          } else {
            return paragraph.innerHTML;
          }
        }).join("\n");

        // Handle blockquotes
        if (messageBlockquotes.length > 0) {
          for (var i = 0; i < messageBlockquotes.length; i++) {
            messageText += "> " + messageBlockquotes[i].textContent + "\n";
          }
        }

        // Handle inline codes
        if (messageInlineCodes.length > 0) {
          for (var i = 0; i < messageInlineCodes.length; i++) {
            messageText += "`" + messageInlineCodes[i].textContent + "`";
          }
        }

        // Handle lists
        if (messageUls.length > 0) {
          for (var i = 0; i < messageUls.length; i++) {
            console.log('List:', messageUls[i]); // Debugging line
            for (var j = 0; j < messageUls[i].childNodes.length; j++) {
              console.log('List Item:', messageUls[i].childNodes[j]); // Debugging line
              if (messageUls[i].childNodes[j].nodeType === 1) {
                // Check if it's an element node
                messageText += "- " + messageUls[i].childNodes[j].textContent.trim() + "\n";
              }
            }
          }
        }

        messageText = messageText.replace("<strong>", "**").replace("</strong>", "**");
        messageText = messageText.replace("<em>", "*").replace("</em>", "*");
        messageText = messageText.replace("<h1>", "# ").replace("</h1>", "#" );
        messageText = messageText.replace("<h2>", "## ").replace("</h2>", "## ");
        messageText = messageText.replace("<h3>", "### ").replace("</h3>", "### ");
        messageText = messageText.replace("<h4>", "#### ").replace("</h4>", "#### ");
        messageText = messageText.replace("<h5>", "##### ").replace("</h5>", "##### ");
        messageText = messageText.replace("<h6>", "###### ").replace("</h6>", "###### ");

        // Check if the message is from the character or user
        if (messageDiv.classList.contains("char-msg")) {
          characterMessages.push(messageText);
        } else {
          userMessages.push(messageText);
        }
      });
    
      // Organize the messages as alternating character-user-character-user and so on
      var organizedMessages = [];
      var maxLength = Math.max(characterMessages.length, userMessages.length);
      for (var i = 0; i < maxLength; i++) {
        if (characterMessages[i]) {
          organizedMessages.push(`<<Character (Character Name = ${chatTitle}) Message Start>>\n\n${characterMessages[i]}\n\n<<Character Message End>>`);
        }
        if (userMessages[i]) {
          organizedMessages.push(`<<User (User Name = ${userName}) Message Start>>\n\n${userMessages[i]}\n\n<<User Message End>>`);
        }
      }
    
      // Display the summarized messages
      var summaryText = organizedMessages.join("\n\n");

      console.log(summaryText);

      // Check if the summaryText is less than 500 characters long
      if (summaryText.length < 500) {
        alert("The chat is too short to scan.");
        scanButton.textContent = "Generate Automatically";
        scanButton.disabled = false;
        return;
      }
      
      // Send a request to the API using fetch method
      const response = await fetch('https://api.cohere.ai/v1/summarize', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer npknXHWGCEpBMB87M5KEYZJFpeZB4uKoSN7pQXSj',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: summaryText,
            length: 'auto',
            format: 'bullets',
            model: currentlySelectedModel,
            additional_command: 'Extract facts and events from the conversation. Do not make up any information.',
            temperature: 0.6
          })
       });
       scanButton.textContent = "Generate Automatically";
       scanButton.disabled = false;
       if (!response.ok) {
        alert("Something went wrong. Please try again.");
        return
       }
       const data = await response.json();
       var summary = "";
       summary = convertToMemoryString(data);
       importMemoryString(summary);
       console.log(data);
    }

    async function scanChat2Messages() {

      if (screenWidth <= 960) {
        scanChat3Messages();
        return;
      }
      // Get the character name
      scanButton.textContent = "Scanning... (Might take a while)";
      scanButton.disabled = true;
      var characterNameElement = document.querySelector(".chat2 > div > div > button + div > div > div:first-child");
      var characterName = characterNameElement ? characterNameElement.textContent : "Unknown Character";
    
      // Get all message divs
      var messageDivs = document.querySelectorAll(".swiper-no-swiping");
    
      // Initialize arrays to store character and user messages
      var characterMessages = [];
      var userMessages = [];
      var userNames = [];
    
      // Iterate through each message div
      messageDivs.forEach(function (messageDiv, index) {
        // Ignore messages that are not in the active slide
        var parentSlide = messageDiv.closest(".swiper-slide");
        if (parentSlide && !parentSlide.classList.contains("swiper-slide-active") || caughtOne) {
          return;
        }

        if (parentSlide && parentSlide.classList.contains("swiper-slide-active")) {
          caughtOne = true;
        }
        
        // Find the <p> elements inside the message div
        var messageParagraphs = messageDiv.querySelectorAll("p");
        var messageBlockquotes = messageDiv.querySelectorAll("blockquote > p");
        var messageInlineCodes = messageDiv.querySelectorAll("code");
        var messageUls = messageDiv.querySelectorAll("ul, ol");
        
        // Extract and store the text content of each <p> element
        var messageText = Array.from(messageParagraphs).map(function (paragraph) {
          // Handle special elements inside the message
          var specialElements = messageDiv.querySelectorAll("ul, ol, pre, blockquote, code");
          if (specialElements.length > 0) {
            return Array.from(specialElements).map(function (element) {
              if (element.type == "code") {
                return element.textContent;
              }
              else if (element.type == "blockquote") {
                console.log(element.childNodes[0].innerText);
                return element.childNodes[0].innerText;
              }
              return element.textContent;
            }).join("\n");
          } else {
            return paragraph.innerHTML;
          }
        }).join("\n");

        // Handle blockquotes
        if (messageBlockquotes.length > 0) {
          for (var i = 0; i < messageBlockquotes.length; i++) {
            messageText += "> " + messageBlockquotes[i].textContent + "\n";
          }
        }

        // Handle inline codes
        if (messageInlineCodes.length > 0) {
          for (var i = 0; i < messageInlineCodes.length; i++) {
            messageText += "`" + messageInlineCodes[i].textContent + "`";
          }
        }

        // Handle lists
        if (messageUls.length > 0) {
          for (var i = 0; i < messageUls.length; i++) {
            console.log('List:', messageUls[i]); // Debugging line
            for (var j = 0; j < messageUls[i].childNodes.length; j++) {
              console.log('List Item:', messageUls[i].childNodes[j]); // Debugging line
              if (messageUls[i].childNodes[j].nodeType === 1) {
                // Check if it's an element node
                messageText += "- " + messageUls[i].childNodes[j].textContent.trim() + "\n";
              }
            }
          }
        }

        messageText = messageText.replace("<strong>", "**").replace("</strong>", "**");
        messageText = messageText.replace("<em>", "*").replace("</em>", "*");
        messageText = messageText.replace("<h1>", "# ").replace("</h1>", "#" );
        messageText = messageText.replace("<h2>", "## ").replace("</h2>", "## ");
        messageText = messageText.replace("<h3>", "### ").replace("</h3>", "### ");
        messageText = messageText.replace("<h4>", "#### ").replace("</h4>", "#### ");
        messageText = messageText.replace("<h5>", "##### ").replace("</h5>", "##### ");
        messageText = messageText.replace("<h6>", "###### ").replace("</h6>", "###### ");
        
        // Determine if the message is from the character or user
        if (index % 2 === 0) {
          characterMessages.push(messageText);
        } else {
          if (parentSlide && parentSlide.classList.contains("swiper-slide-active")) {
            characterMessages.push(messageText);
          } else {
            // Get the sibling div which contains the username
            var userNameDiv = messageDiv.previousElementSibling;
            if (userNameDiv) {
              userNames.push(userNameDiv.textContent.trim());
            } else {
              userNames.push("Unknown User");
            }
            userMessages.push(messageText);
          }
        }
      });

      caughtOne = false;

      console.log(characterName);
    
      // Combine character and user messages
      var organizedMessages = [];
      for (var i = 0; i < characterMessages.length || i < userMessages.length; i++) {
        if (characterMessages[i]) {
          organizedMessages.push(`<<Character (Character Name = ${characterName}) Message Start>>\n\n${characterMessages[i]}\n\n<<Character Message End>>`);
        }
        if (userMessages[i]) {
          organizedMessages.push(`<<User (User Name = ${userNames[i]}) Message Start>>\n\n${userMessages[i]}\n\n<<User Message End>>`);
        }
      }
    
      // Display the summarized messages
      var summaryText = organizedMessages.join("\n\n");
    
      console.log(summaryText);
    
      // Check if the summaryText is less than 500 characters long
      if (summaryText.length < 500) {
        alert("The chat is too short to scan.");
        scanButton.disabled = false;
        scanButton.textContent = "Generate Automatically";
        return;
      }
    
      // Send a request to the API using fetch method
      const response = await fetch('https://api.cohere.ai/v1/summarize', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer npknXHWGCEpBMB87M5KEYZJFpeZB4uKoSN7pQXSj',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: summaryText,
          length: 'auto',
          format: 'bullets',
          model: currentlySelectedModel,
          additional_command: 'Extract facts and events from the conversation. Do not make up any information.',
          temperature: 0.6
        })
      });
      scanButton.textContent = "Generate Automatically";
      scanButton.disabled = false;
      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        return
      }
    
      const data = await response.json();
      var summary = "";
      summary = convertToMemoryString(data);
      importMemoryString(summary);
      console.log(data);
    }

    async function scanChat3Messages() {
      // Get the character name
      scanButton.textContent = "Scanning... (Might take a while)";
      scanButton.disabled = true;
      var characterNameElement = document.querySelector(".chat2 > div > div > button + div > div > div:first-child");
      var characterName = characterNameElement ? characterNameElement.textContent : "Unknown Character";
    
      // Get all message divs
      var messageDivs = document.querySelectorAll('div[class=""]');
    
      // Initialize arrays to store character and user messages
      var characterMessages = [];
      var userMessages = [];
      var userNames = [];
    
      // Iterate through each message div
      messageDivs.forEach(function (messageDiv, index) {
        // Ignore messages that are not in the active slide
        var parentSlide = messageDiv.closest(".swiper-slide");
        if (parentSlide && !parentSlide.classList.contains("swiper-slide-active") || caughtOne) {
          return;
        }

        if (parentSlide && parentSlide.classList.contains("swiper-slide-active")) {
          caughtOne = true;
        }
        
        // Find the <p> elements inside the message div
        var messageParagraphs = messageDiv.querySelectorAll("p");
        var messageBlockquotes = messageDiv.querySelectorAll("blockquote > p");
        var messageInlineCodes = messageDiv.querySelectorAll("code");
        var messageUls = messageDiv.querySelectorAll("ul, ol");
        
        
        // Extract and store the text content of each <p> element
        var messageText = Array.from(messageParagraphs).map(function (paragraph) {
          // Handle special elements inside the message
          var specialElements = messageDiv.querySelectorAll("ul, ol, pre, blockquote, code");
          if (specialElements.length > 0) {
            return Array.from(specialElements).map(function (element) {
              return element.textContent;
            }).join("\n");
          } else {
            return paragraph.innerHTML;
          }
        }).join("\n");

        // Handle blockquotes
        if (messageBlockquotes.length > 0) {
          for (var i = 0; i < messageBlockquotes.length; i++) {
            messageText += "> " + messageBlockquotes[i].textContent + "\n";
          }
        }

        // Handle inline codes
        if (messageInlineCodes.length > 0) {
          for (var i = 0; i < messageInlineCodes.length; i++) {
            messageText += "`" + messageInlineCodes[i].textContent + "`";
          }
        }

        // Handle lists
        if (messageUls.length > 0) {
          for (var i = 0; i < messageUls.length; i++) {
            console.log('List:', messageUls[i]); // Debugging line
            for (var j = 0; j < messageUls[i].childNodes.length; j++) {
              console.log('List Item:', messageUls[i].childNodes[j]); // Debugging line
              if (messageUls[i].childNodes[j].nodeType === 1) {
                // Check if it's an element node
                messageText += "- " + messageUls[i].childNodes[j].textContent.trim() + "\n";
              }
            }
          }
        }

        messageText = messageText.replace("<strong>", "**").replace("</strong>", "**");
        messageText = messageText.replace("<em>", "*").replace("</em>", "*");
        messageText = messageText.replace("<h1>", "# ").replace("</h1>", "#" );
        messageText = messageText.replace("<h2>", "## ").replace("</h2>", "## ");
        messageText = messageText.replace("<h3>", "### ").replace("</h3>", "### ");
        messageText = messageText.replace("<h4>", "#### ").replace("</h4>", "#### ");
        messageText = messageText.replace("<h5>", "##### ").replace("</h5>", "##### ");
        messageText = messageText.replace("<h6>", "###### ").replace("</h6>", "###### ");
        
        // Determine if the message is from the character or user
        if (index % 2 === 0) {
          characterMessages.push(messageText);
        } else {
          if (parentSlide && parentSlide.classList.contains("swiper-slide-active")) {
            characterMessages.push(messageText);
          } else {
            // Get the sibling div which contains the username
            var userNameDiv = messageDiv.previousElementSibling;
            if (userNameDiv) {
              userNames.push(userNameDiv.textContent.trim());
            } else {
              userNames.push("Unknown User");
            }
            userMessages.push(messageText);
          }
        }
      });


      caughtOne = false;

      console.log(characterName);
    
      // Combine character and user messages
      var organizedMessages = [];
      for (var i = 0; i < characterMessages.length || i < userMessages.length; i++) {
        if (characterMessages[i]) {
          organizedMessages.push(`<<Character (Character Name = ${characterName}) Message Start>>\n\n${characterMessages[i]}\n\n<<Character Message End>>`);
        }
        if (userMessages[i]) {
          organizedMessages.push(`<<User (User Name = ${userNames[i]}) Message Start>>\n\n${userMessages[i]}\n\n<<User Message End>>`);
        }
      }
    
      // Display the summarized messages
      var summaryText = organizedMessages.join("\n\n");
    
      console.log(summaryText);
    
      // Check if the summaryText is less than 500 characters long
      if (summaryText.length < 500) {
        alert("The chat is too short to scan.");
        scanButton.disabled = false;
        scanButton.textContent = "Generate Automatically";
        return;
      }
    
      // Send a request to the API using fetch method
      const response = await fetch('https://api.cohere.ai/v1/summarize', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer npknXHWGCEpBMB87M5KEYZJFpeZB4uKoSN7pQXSj',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: summaryText,
          length: 'auto',
          format: 'bullets',
          model: currentlySelectedModel,
          additional_command: 'Extract facts and events from the conversation. Do not make up any information.',
          temperature: 0.6
        })
      });
      scanButton.textContent = "Generate Automatically";
      scanButton.disabled = false;
      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        return
      }
    
      const data = await response.json();
      var summary = "";
      summary = convertToMemoryString(data);
      importMemoryString(summary);
      console.log(data);
    }
    
    
    
    

    function openImportDialog() {
      var importDialog = document.createElement("div");
      importDialog.id = "import-dialog";
      importDialog.style.position = "fixed";
      importDialog.style.left = "50%";
      importDialog.style.top = "50%";
      importDialog.style.transform = "translate(-50%, -50%)";
      importDialog.style.backgroundColor = "white";
      importDialog.style.padding = "20px";
      importDialog.style.borderRadius = "5px";
      importDialog.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";

      var textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "100px";
      textarea.placeholder = "Paste your memory string here...";
      importDialog.appendChild(textarea);

      var confirmButton = document.createElement("button");
      confirmButton.innerText = "Confirm";
      confirmButton.style.marginTop = "10px";
      confirmButton.style.backgroundImage =
        "linear-gradient(to right, #00c6ff, #0072ff)";
      confirmButton.style.padding = "5px 10px";
      confirmButton.style.borderRadius = "5px";
      confirmButton.style.border = "none";
      confirmButton.style.color = "white";
      confirmButton.style.cursor = "pointer";
      confirmButton.addEventListener("click", function () {
        var importedMemoryString = textarea.value;

        if (isValidMemoryString(importedMemoryString)) {
          importMemoryString(importedMemoryString);
          sidebar.removeChild(importDialog);
        } else {
          alert(
            "Invalid memory string format. Please provide a valid memory string."
          );
        }
      });
      importDialog.appendChild(confirmButton);

      var cancelButton = document.createElement("button");
      cancelButton.innerText = "Cancel";
      cancelButton.style.marginTop = "10px";
      cancelButton.style.backgroundImage =
        "linear-gradient(to right, #ff0000, #ff6666)";
      cancelButton.style.padding = "5px 10px";
      cancelButton.style.borderRadius = "5px";
      cancelButton.style.border = "none";
      cancelButton.style.color = "white";
      cancelButton.style.cursor = "pointer";
      cancelButton.addEventListener("click", function () {
        sidebar.removeChild(importDialog);
      });
      importDialog.appendChild(cancelButton);

      sidebar.appendChild(importDialog);
    }

    // Function to validate the imported memory string format
    function isValidMemoryString(memoryString) {
      // Modify this regex pattern according to the expected format
      var regexPattern =
        /^\[ AI memories: "[^"]*(?:";\s*"[^"]*)*" ](?:\n\[ User Facts: "[^"]*(?:";\s*"[^"]*)*" ])?$/;
      return regexPattern.test(memoryString);
    }
  }
}

function toggleFixedField() {
  var fixedField = document.getElementById("fixed-field");
  var toggleButton = document.getElementById("toggle-fixedfield-button");

  if (fixedField.style.display === "block") {
    fixedField.style.display = "none";
    toggleButton.innerHTML = "&#8942;";
  }
  else {
    fixedField.style.display = "block";
    toggleButton.innerHTML = "&#8942;";
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
    fixedField.style.position = "fixed";
    fixedField.style.width = "100%";
    fixedField.style.left = "0";
    fixedField.style.bottom = "0";
    fixedField.style.height = "90px";

    // Create a button to toggle the fixed field
    if (!document.getElementById("toggle-fixedfield-button")) {
      var toggleButton2 = document.createElement("button");
      toggleButton2.id = "toggle-fixedfield-button";
      toggleButton2.innerHTML = `&#8942;`;
      toggleButton2.style.right = "0";
      toggleButton2.style.top = "100px";
      toggleButton2.style.padding = "5px 10px";
      toggleButton2.style.border = "none";
      toggleButton2.style.position = "fixed";
      toggleButton2.style.zIndex = 9999;

      toggleButton2.addEventListener("click", function () {
        toggleFixedField();
      })

      document.body.appendChild(toggleButton2);
    }
    // Move fixedField to below the #root div
    document.body.insertAdjacentElement("afterend", fixedField);
  } else {
    if (sidebar) {
      sidebar.style.width = "25%";
      toggleButton.style.top = "10px";
      sidebar.style.zIndex = 999;
    }
    fixedField.style.position = "fixed";
    fixedField.style.display = "block";
    fixedField.style.marginBottom = "0";
    fixedField.style.width = "115px";
    fixedField.style.left = "20px";
    fixedField.style.height = "60px";
    fixedField.style.bottom = "20px";

    if (document.getElementById("toggle-fixedfield-button"))
    {
      document.getElementById("toggle-fixedfield-button").remove();
    }

    // Move fixedField to above the #root div
    document.body.insertAdjacentElement("afterbegin", fixedField);
  }
}

// Add an event listener to the window's resize event
window.addEventListener("resize", updateSidebarWidth);

function toggleRoundedAvatars() {
  const roundedAvatarsEnabled =
    localStorage.getItem("roundedAvatars") === "true";
  const images = document.querySelectorAll("img");

  function applyRoundedStyle(image) {
    image.style.borderRadius = roundedAvatarsEnabled ? "0" : "45px";
  }

  images.forEach((image) => {
    if (image.src.includes("https://characterai.io/i/80/static/avatars/")) {
      if (image.complete) {
        applyRoundedStyle(image);
      } else {
        image.onload = function () {
          applyRoundedStyle(image);
        };
      }
    }
  });
}

// Observe mutations in the document to handle dynamically loaded content
const observer = new MutationObserver(function (mutationsList) {
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
fixedField.style.position = screenWidth <= 960 ? "fixed" : "fixed";
fixedField.style.left = screenWidth <= 960 ? "0" : "20px";
fixedField.style.bottom <= 960 ? "0" : "20px";
fixedField.style.width = screenWidth <= 960 ? "100%" : "115px";
fixedField.style.height = "60px";
fixedField.style.marginBottom = screenWidth <= 960 ? "0" : "0";
fixedField.style.backgroundColor = "#f0f0f0";
fixedField.style.zIndex = "9999";
fixedField.style.padding = "10px";
fixedField.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.1)";
document.body.insertAdjacentElement("afterend", fixedField);

updateSidebarWidth();

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
if (
  initialRoundedAvatarsState === "false" ||
  initialRoundedAvatarsState === null
) {
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
          Accept: "application/json",
        },
      });

      const responseData = await e.json();
      const r = responseData.external_id;

      if (!r) {
        alert(
          "Unexpected response from Character.AI. Check the console for more info."
        );
        console.warn("Unexpected response from Character.AI", responseData);
        return;
      }

      window.location.href = `https://beta.character.ai/chat?char=${n}&hist=${r}`;
    } catch (error) {
      alert(
        "Failed to create a new chat using the legacy API. Check the console for more info."
      );
      console.error("Failed to create a new chat using the legacy API.", error);
    }
  });

  // Append the New Legacy Chat button to the document body
  fixedField.appendChild(newLegacyChatButton);
}
