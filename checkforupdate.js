document.addEventListener("DOMContentLoaded", function() {
    update();
});

function update()
{
        // Get the current version
        var currentVersion = document.getElementById("currentVersion").textContent.trim();

        // Clear the warning and the latest version text
        document.getElementById("update-warn").innerHTML = "";
    
        // Get the latest version from the version.txt file
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Trim whitespace from the latest version
                var latestVersion = this.responseText.trim();
                document.getElementById("latestVersion").textContent = latestVersion;
    
                console.log("Current version: " + currentVersion + "\nLatest version: " + latestVersion);
    
                if (currentVersion !== latestVersion) {
                    document.getElementById("update-warn").innerHTML = "There is a new version available! <a href='https://github.com/LyubomirT/c.ai-addons/releases' target='_blank'>Download it here</a>.";
                } else {
                    document.getElementById("update-warn").innerHTML = "You are using the latest version of the extension.";
                }
            }
        };
    
        xhttp.open("GET", "https://raw.githubusercontent.com/lyubomirt/c.ai-addons/main/version/version.txt", true);
        xhttp.send();
        document.getElementById("updateButton").addEventListener("click", function() {
            update();
        });
}