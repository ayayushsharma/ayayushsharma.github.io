function getInitialTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
        return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

applyTheme(getInitialTheme());

document.addEventListener("DOMContentLoaded", function () {
    fetch("static/templates/nav.html")
        .then(function (r) {
            return r.text();
        })
        .then(function (html) {
            document.getElementById("nav-placeholder").innerHTML = html;
            applyTheme(getInitialTheme());
            document
                .querySelector(".theme-toggle")
                .addEventListener("click", function () {
                    var next =
                        document.documentElement.getAttribute("data-theme") ===
                        "dark"
                            ? "light"
                            : "dark";
                    applyTheme(next);
                    localStorage.setItem("theme", next);
                });
        });
    fetch("static/templates/footer.html")
        .then(function (r) {
            return r.text();
        })
        .then(function (html) {
            document.getElementById("footer-placeholder").innerHTML = html;
        });
});
