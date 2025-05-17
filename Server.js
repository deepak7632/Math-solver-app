const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ==== आपके द्वारा दिया गया OpenAI API Key ====
const OPENAI_API_KEY = "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";
// ==============================================

app.use(cors());
app.use(bodyParser.json());

app.post("/solve", async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ error: "Missing question" });

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "तुम एक Class 10 Math tutor हो, जो हिंदी में स्टेप-बाय-स्टेप हल करता है।"
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "कोई हल नहीं मिला।";
    res.json({ answer: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
