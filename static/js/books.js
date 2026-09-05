(function () {
    const SHEET_ID = "1vDVdopw7tYpQ54LE9lItyS8LsAY2LETn20IarGSocrk";
    const BOOKS_ENDPOINT = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Books`;

    async function loadBooks() {
        const container = document.getElementById("books");
        if (!container) return;

        try {
            const res = await fetch(BOOKS_ENDPOINT);
            const text = await res.text();

            // Snip the Google wrapper to get pure JSON
            const jsonString = text.substring(
                text.indexOf("(") + 1,
                text.lastIndexOf(")"),
            );
            const response = JSON.parse(jsonString);

            if (response.status !== "ok") throw new Error("Google API error");

            // Map raw Google data into clean objects, skipping the header row
            const books = response.table.rows
                .slice(1)
                .map((row) => ({
                    status: row.c[0]?.v || "",
                    title: row.c[1]?.v || "Untitled",
                    url: row.c[3]?.v || "",
                }))
                .filter((b) => b.status === "Read");

            if (books.length === 0) {
                container.innerHTML = "";
                return;
            }

            container.innerHTML = `
            <ul>
                ${books
                    .map(
                        (b) => `
                    <li>
                        ${b.title} 
                        ${b.url ? `<a href="${b.url}" target="_blank" rel="noopener">↗</a>` : ""}
                    </li>
                `,
                    )
                    .join("")}
            </ul>
        `;
        } catch (err) {
            console.error("Failed to load books:", err);
            container.innerHTML =
                '<p class="paper-status">Could not load books.</p>';
        }
    }

    // Start the process
    document.addEventListener("DOMContentLoaded", loadBooks);
})();
