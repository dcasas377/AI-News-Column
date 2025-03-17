const NEWS_API_KEY = "a41ab1de4a6a4d218b19e566300c612f";  // 🔑 Replace with actual key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

async function fetchNews() {
    try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        console.log("NewsAPI Response:", data);

        if (data.status === "ok" && data.articles.length > 0) {
            return data.articles.slice(0, 15);
        } else {
            console.error("No articles found or API error:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}

// Display news with AI-generated summaries
async function displayNews() {
    const articles = await fetchNews();
    const articlesDiv = document.getElementById("articles");
    articlesDiv.innerHTML = ""; // Clear previous content

    if (articles.length === 0) {
        articlesDiv.innerHTML = "<p>No articles found.</p>";
        return;
    }

    for (let article of articles) {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const textToSummarize = article.description || article.title; // Use description or fallback to title
        const summary = await summarizeArticle(textToSummarize); // 🔥 Calls the function from summarize.js

        articleDiv.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.description || "No description available."}</p>
      <p class="summary">AI Summary: ${summary}</p>
      <a href="${article.url}" target="_blank">Read full article</a>
    `;

        articlesDiv.appendChild(articleDiv);
    }
}

// Run on page load
displayNews();