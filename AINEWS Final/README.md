# AI_News_Summary
The Point is an AI-powered news aggregation and summarization web app that helps users stay updated with the latest headlines, condensed into bite-sized insights. It combines data from NewsAPI and OpenAI to present current events with clarity and efficiency.

## Features

- 🔍 **Search by Keyword**: Type in any topic to see the most recent articles.
- 📂 **Category Filter**: Filter news by Business, Technology, Health, and more.
- 🤖 **AI Summaries**: Each article includes a one-sentence summary powered by OpenAI GPT-3.5.
- 🌙 **Dark Mode Ready**: Automatically applies dark or light theme based on user preference.
- 💬 **Contact Form**: Easily get in touch using the built-in contact page.
- 📱 **Responsive Design**: Fully mobile- and tablet-friendly layout.

## Tech Stack

- **Frontend**: HTML, CSS (with Bootstrap 5), JavaScript
- **APIs**:
  - [GNEWs]([https://gnews.io/) – for fetching live news articles
  - [OpenAI GPT-3.5](https://platform.openai.com/) – for summarizing content

## Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/the-point.git
    cd the-point
    ```

2. **Insert Your API Keys**:
    - Open `main.js`
    - Replace placeholders for:
      ```js
      const NEWS_API_KEY = "YOUR_NEWSAPI_KEY";
      const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
      ```

3. **Run Locally**:
    - You can open `index.html` directly in a browser, or
    - Use a simple local server:
      ```bash
      npx serve .
      ```
      - Or you can install LiveServer Plugin on vscode 
