document.addEventListener("DOMContentLoaded", function () {
    const memorySwitch = document.getElementById("memory-switch");
    const memoryManager = document.getElementById("memory-manager");

    // Load memory manager state from local storage, if available
    const memoryManagerEnabled = localStorage.getItem("memoryManagerEnabled") === "true";
    memorySwitch.checked = memoryManagerEnabled;
    memoryManager.style.display = memoryManagerEnabled ? "block" : "none";

    memorySwitch.addEventListener("change", function () {
      const isEnabled = memorySwitch.checked;

      // Store the state in local storage
      localStorage.setItem("memoryManagerEnabled", isEnabled);

      // Display a message indicating that the page needs to be reloaded
      const reloadMessage = document.createElement("p");
      reloadMessage.textContent = "Reload the page for the changes to apply.";
      reloadMessage.style.marginTop = "10px";
      document.body.appendChild(reloadMessage);
    });
  });