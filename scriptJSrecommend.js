document.addEventListener("DOMContentLoaded", function() {
    fetch('http://127.0.0.1:5000/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            data.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'col-md-4';
                newsItem.innerHTML = `
                    <div class="card bg-light text-dark">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.site}</p>
                            <a href="${article.link}" class="btn btn-primary" target="_blank">Read more</a>
                        </div>
                    </div>
                `;
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});
