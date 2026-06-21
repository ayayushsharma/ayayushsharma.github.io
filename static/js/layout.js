document.addEventListener("DOMContentLoaded", function () {
    fetch("static/templates/nav.html")
        .then(function (r) {
            return r.text();
        })
        .then(function (html) {
            document.getElementById("nav-placeholder").innerHTML = html;
        });
    fetch("static/templates/footer.html")
        .then(function (r) {
            return r.text();
        })
        .then(function (html) {
            document.getElementById("footer-placeholder").innerHTML = html;
        });
});
