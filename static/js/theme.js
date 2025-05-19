// theme.js

export function initTheme() {
    // Add functionality to the toggle switch
    const toggle = document.getElementById("darkModeCheckbox");
    toggle.addEventListener("change", function () {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme); // Save the selected theme to localStorage
    });

    // Load user selected theme on page reload
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
        toggle.checked = savedTheme === "dark"; 
    }
}