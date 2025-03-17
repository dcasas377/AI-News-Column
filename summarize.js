const OPENAI_API_KEY = "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";  // 🔑 Replace with actual OpenAI API key

async function summarizeArticle(text) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5", // Change to "gpt-3.5-turbo" if needed
                messages: [
                    { role: "system", content: "Summarize the following news article in one concise headline." },
                    { role: "user", content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("OpenAI API Response:", data);  // 👀 Debugging

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            console.error("Error in API response:", data);
            return "Summary not available.";
        }
    } catch (error) {
        console.error("Error summarizing article:", error);
        return "Summary error.";
    }
}