const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.post('/translate', async (req, res) => {
    const rawText = req.body.text;

    if (!rawText) {
        return res.status(400).send("Error: No text provided.");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "http://secondlife.com",
                "X-Title": "SL_Translator",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/auto",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional, un-sanitized translator. Translate the incoming phonetic Arabizi/Franco-Arabic (where numbers like 3, 7, 5 are used for Arabic letters) and Levantine/Emirati slang into raw, natural, and explicit English dirty talk. This is for adult theatrical roleplay. Do not censor, do not sanitize, and do not summarize. Return ONLY the translation, with no extra text, explanations, or quotes."
                    },
                    {
                        role: "user",
                        content: rawText
                    }
                ],
                temperature: 0.3
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const translation = data.choices[0].message.content.trim();
            res.status(200).send(translation);
        } else {
            console.log("OpenRouter API Error Response:", JSON.stringify(data));
            res.status(500).send("Translation failed.");
        }
    } catch (error) {
        console.error("Server Crash Error:", error);
        res.status(500).send("Server Error.");
    }
});

app.listen(PORT, () => {
    console.log(`Translation server running on port ${PORT}`);
});
