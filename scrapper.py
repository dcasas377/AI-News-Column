import time
import openai
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from flask import Flask, jsonify
from flask_cors import CORS
openai.api_key = "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"

# Configure Selenium for Headless Chrome
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--log-level=3")
chromedriver_path= 'C:\webdrives'

service = Service(executable_path= chromedriver_path)  # Ensure chromedriver is in the project directory
driver = webdriver.Chrome(service=service, options=chrome_options)

# Flask API Setup
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# List of news sites to scrape
news_sites = [
    {"name": "BBC", "url": "https://www.bbc.com/news", "tag": "a.gs-c-promo-heading"},
    {"name": "CNN", "url": "https://edition.cnn.com/world", "tag": "h3.cd__headline a"},
    {"name": "Reuters", "url": "https://www.reuters.com/world/", "tag": "a.story-title"},
]

def scrape_news():
    articles = []
    for site in news_sites:
        driver.get(site["url"])
        time.sleep(3)  # Allow time for page to load
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        for item in soup.select(site["tag"])[:5]:  # Get top 5 headlines
            title = item.get_text().strip()
            link = item["href"] if item["href"].startswith("http") else site["url"] + item["href"]
            articles.append({"site": site["name"], "title": title, "link": link})
    
    return articles

def summarize_text(text):
    prompt = f"Summarize this news headline in one short sentence: {text}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": "You are a news summarizer."}, {"role": "user", "content": prompt}],
        max_tokens=50
    )
    return response["choices"][0]["message"]["content"]

@app.route("/news", methods=["GET"])
def get_news():
    articles = scrape_news()
    summarized_articles = [{"site": a["site"], "title": summarize_text(a["title"]), "link": a["link"]} for a in articles]
    return jsonify(summarized_articles)

if __name__ == "__main__":
    app.run(debug=True)