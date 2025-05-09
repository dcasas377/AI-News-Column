const GNEWS_API_KEY = "95bc2510fe565445d1474c36ce83bff2"; // Replace with your GNews API key
const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key

async function fetchNews() {
    try {
        const response = await fetch(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&token=${GNEWS_API_KEY}`);
        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No articles found.</p>";
            return;
        }
        displayNews(data.articles.slice(0, 40));
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    const category = document.getElementById("category-select").value;

    if (query) {
        searchNews(query, category);
    }
});

document.getElementById("category-select").addEventListener("change", function () {
    const category = this.value;
    if (category) {
        fetchCategoryNews(category);
    }
});

async function summarizeArticle(text) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Summarize this news article in one sentence." },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim();
        } else {
            console.error("Error in summary response:", data);
            return "Summary not available.";
        }
    } catch (error) {
        console.error("Error summarizing article:", error);
        return "Summary error.";
    }
}

async function displayNews(articles) {
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    for (let article of articles) {
        const summary = await summarizeArticle(article.description || article.title);

        const newsCard = `
        <div class="col-md-4">
            <div class="news-card p-3 custom-card h-100">
                <img src="${article.image || 'https://via.placeholder.com/400'}" class="img-fluid rounded mb-2" alt="Article Image">
                <h5>${article.title}</h5>
                <p style="font-size: 0.85rem; color: #bbb;">
                    ${article.source?.name || "Unknown Source"} • 
                    ${new Date(article.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>
                <p>${article.description || "No description available."}</p>
                <p class="summary"><strong>AI Summary:</strong> ${summary}</p>
                <a href="${article.url}" target="_blank" class="btn btn-primary mt-2">Read More</a>
            </div>
        </div>
        `;

        container.innerHTML += newsCard;
    }
}

async function searchNews(query, category = "") {
    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&token=${GNEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No articles found for your search.</p>";
            return;
        }

        // Refine results based on actual keyword match
        const filtered = data.articles.filter(article =>
            article.title?.toLowerCase().includes(query.toLowerCase()) ||
            article.description?.toLowerCase().includes(query.toLowerCase())
        );

        displayNews(filtered.slice(0, 20));
    } catch (error) {
        console.error("Error searching news:", error);
        document.getElementById("news-container").innerHTML = "<p>Error loading search results.</p>";
    }
}


async function fetchCategoryNews(category) {
    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(category)}&lang=en&country=us&token=${GNEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No articles found for this category.</p>";
            return;
        }
        displayNews(data.articles.slice(0, 15));
    } catch (error) {
        console.error("Error fetching category news:", error);
        document.getElementById("news-container").innerHTML = "<p>Error loading category results.</p>";
    }
}

fetchNews();
