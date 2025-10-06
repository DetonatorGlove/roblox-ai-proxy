import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/roblox-ai", async (req, res) => {
  try {
    const userMessage = req.body.message ?? "";

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a friendly AI living inside Roblox. Keep your answers short and natural." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await aiResponse.json();

    if (data.error) {
      console.error(data.error);
      return res.json({ Response: "Hmm, I'm having trouble connecting to OpenAI right now." });
    }

    res.json({ Response: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.json({ Response: "Error talking to OpenAI." });
  }
});

app.get("/", (req, res) => res.send("✅ Roblox AI Proxy is running. POST /roblox-ai to talk."));
app.listen(3000, () => console.log("Server running on port 3000"));
