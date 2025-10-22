require("dotenv").config();
const prompt = require("./prompt");

class SpamFilter {
    url = "https://api.x.ai/v1/chat/completions";
    headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`
    };

    async detectSpam(message) {
        const options = {
            messages: [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: `New Lead Received. Message = ${message}`
                }
            ],
            model: "grok-beta", 
            max_tokens: 500, 
            temperature: 0.1 
        };

        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(options)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content;

            if (!aiResponse) {
                throw new Error("No response content from API");
            }

            let parsed;
            try {
                parsed = JSON.parse(aiResponse);
            } catch (parseError) {
                throw new Error(`Invalid JSON in AI response: ${aiResponse}. Parse error: ${parseError.message}`);
            }

            const { is_spam, reason = "" } = parsed;

            if (typeof is_spam !== "boolean") {
                throw new Error("AI response missing valid 'is_spam' boolean");
            }

            console.log(`Spam detection result: is_spam=${is_spam}, reason="${reason}"`);
            return { is_spam, reason };

        } catch (error) {
            console.error("Error occurred in detectSpam function:", error);

            return { is_spam: false, reason: "Detection failed due to error" };
        }
    }
}

module.exports = SpamFilter;