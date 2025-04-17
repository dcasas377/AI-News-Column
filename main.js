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
        displayNews(data.articles.slice(0, 15));
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

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
                <div class="news-card">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/400'}" class="img-fluid rounded">
                    <h4>${article.title}</h4>
                    <p>${article.description || "No description available."}</p>
                    <p class="summary"><strong>AI Summary:</strong> ${summary}</p>
                    <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `;
        container.innerHTML += newsCard;
    }
}

fetchNews(); // Load news on page load