export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { message } = req.body;
  
    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";
  
    const payload = {
      model: "gpt-4",  // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: message }],
    };
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: data.error.message });
    }
  }