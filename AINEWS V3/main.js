const NEWS_API_KEY = "a41ab1de4a6a4d218b19e566300c612f"; // Replace with your NewsAPI key
const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key

async function fetchNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        if (!data.articles || data.articles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No articles found.</p>";
            return;
        }
        displayNews(data.articles.slice(0, 20));
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
                model: "gpt-4",
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
            <img src="${article.urlToImage || 'https://via.placeholder.com/400'}" class="img-fluid rounded mb-2" alt="Article Image">
            <h5>${article.title}</h5>
            <p style="font-size: 0.85rem; color: #ccc;">
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
        if (query.length < 3) {
            document.getElementById("news-container").innerHTML = "<p>Please enter at least 3 characters.</p>";
            return;
        }

        const url = `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(query)}&language=en&sortBy=relevancy&apiKey=${NEWS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No articles found for your search.</p>";
            return;
        }

        // Additional STRICT client-side filter on TITLE ONLY (exact match)
        const exactFilteredArticles = data.articles.filter(article => 
            article.title && article.title.toLowerCase().includes(query.toLowerCase())
        );

        if (exactFilteredArticles.length === 0) {
            document.getElementById("news-container").innerHTML = "<p>No exact matches found for your search.</p>";
            return;
        }

        displayNews(exactFilteredArticles.slice(0, 15));

    } catch (error) {
        console.error("Error searching news:", error);
        document.getElementById("news-container").innerHTML = "<p>Error loading search results.</p>";
    }
}






async function fetchCategoryNews(category) {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`);
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
    function applyTheme() {
        const theme = localStorage.getItem("theme") || "dark";
        document.body.className = theme === "light" ? "bg-light text-dark" : "bg-dark text-light";

        // Update nav style
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.remove("bg-black", "navbar-dark", "navbar-light", "bg-light", "bg-dark");
            if (theme === "light") {
                navbar.classList.add("navbar-light", "bg-light");
            } else {
                navbar.classList.add("navbar-dark", "bg-black");
            }
        }
    }

    document.getElementById("theme-toggle").addEventListener("click", () => {
        const currentTheme = localStorage.getItem("theme") || "dark";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        applyTheme();
    });

    window.addEventListener("DOMContentLoaded", applyTheme);

}


fetchNews(); // Load news on page load