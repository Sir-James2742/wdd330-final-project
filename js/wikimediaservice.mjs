
const WIKIMEDIA_SEARCH_URL ="https://en.wikipedia.org/w/rest.php/v1/search/page";

const WIKIMEDIA_SUMMARY_URL ="https://en.wikipedia.org/api/rest_v1/page/summary";

class WikimediaService {
    async getExtraInfo(searchTerm) {
        const searchUrl = new URL(WIKIMEDIA_SEARCH_URL);
        searchUrl.searchParams.set("q", searchTerm);
        searchUrl.searchParams.set("limit", "1");

        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
            throw new Error("Wikimedia search failed.");
        }

        const searchData = await searchResponse.json();
        const article = searchData.pages?.[0];

        if (!article?.title) {
            return null;
        }

        const summaryUrl =
            `${WIKIMEDIA_SUMMARY_URL}/${encodeURIComponent(article.title)}`;

        const summaryResponse = await fetch(summaryUrl);

        if (!summaryResponse.ok) {
            throw new Error("Could not retrieve the Wikipedia summary.");
        }

        const summary = await summaryResponse.json();

        return {
            title: summary.title || article.title,
            description: summary.extract || "",
            url: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, "_"))}`
        };
    }
    
    async renderExtraInfo(searchTerm) {
        const container = document.querySelector("#wikimedia-info");

        if (!container) return;

        container.innerHTML = `
            <h2>Discover the Story Behind This Dish</h2>
            <p>Finding background information...</p>
        `;

        try {
            const info = await this.getExtraInfo(searchTerm);

            if (!info) {
                container.innerHTML = `
                    <h2>Discover the Story Behind This Dish</h2>
                    <p>No additional information was found.</p>
                `;
                return;
            }

            const heading = document.createElement("h2");
            heading.textContent = info.title;

            const paragraph = document.createElement("p");
            paragraph.textContent =
                info.description || "No summary is available for this article.";

            const link = document.createElement("a");
            link.href = info.url;
            link.textContent = "Read more on Wikipedia";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            container.replaceChildren(heading, paragraph, link);
        } catch (error) {
            console.error("Wikimedia error:", error);

            container.innerHTML = `
                <h2>Discover the Story Behind This Dish</h2>
                <p>Extra information is temporarily unavailable.</p>
            `;
        }
    }

}

export default WikimediaService;
