(function () {
    const SHEET_ID = "1vDVdopw7tYpQ54LE9lItyS8LsAY2LETn20IarGSocrk";
    // Note: We removed the responseHandler from the URL
    const PAPERS_ENDPOINT = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    async function loadPapers() {
        const container = document.getElementById("research-papers");
        if (!container) return;

        try {
            const res = await fetch(PAPERS_ENDPOINT);
            const text = await res.text();

            // 1. "Snip" the Google wrapper to get pure JSON
            // This finds the text between the first '(' and last ')'
            const jsonString = text.substring(
                text.indexOf("(") + 1,
                text.lastIndexOf(")"),
            );
            const response = JSON.parse(jsonString);

            if (response.status !== "ok") throw new Error("Google API error");

            // 2. Map raw Google data into clean objects
            const allPapers = response.table.rows.map((row) => ({
                status: row.c[0]?.v || "",
                title: row.c[1]?.v || "Untitled",
                date: row.c[2]?.f || row.c[2]?.v || "",
                author: row.c[3]?.v || "",
                org: row.c[4]?.v || "",
                url: row.c[5]?.v || "",
                tags: row.c[6]?.v || "",
                comment: row.c[7]?.v || "",
            }));

            // 3. Filter and Sort
            const read = allPapers
                .filter((p) => p.status === "Read")
                .sort((a, b) => b.date.localeCompare(a.date));

            const wishlist = allPapers.filter((p) => p.status === "Wishlist");

            // 4. Render to UI
            container.innerHTML = `
            ${renderSection("Already Read", read)}
            ${renderSection("Wishlist", wishlist, true)}
        `;
        } catch (err) {
            console.error("Failed to load papers:", err);
            container.innerHTML =
                '<p class="paper-status">Could not load research papers.</p>';
        }
    }

    function renderSection(heading, papers, collapsible) {
        if (papers.length === 0) return "";
        const body = `
        <ul>
            ${papers
                .map(
                    (p) => `
                <li>
                    ${p.title} 
                    ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">↗</a>` : ""}
                    <div class="paper-meta">
                        ${[p.date, p.author, p.tags].filter(Boolean).join(" · ")}
                    </div>
                </li>
            `,
                )
                .join("")}
        </ul>
    `;
        if (collapsible) {
            return `
            <div class="paper-group">
                <h2>${heading}</h2>
                <details>
                    <summary>Show wishlist</summary>
                    ${body}
                </details>
            </div>
        `;
        }
        return `
        <div class="paper-group">
            <h2>${heading}</h2>
            ${body}
        </div>
    `;
    }

    // Start the process
    document.addEventListener("DOMContentLoaded", loadPapers);
})();
