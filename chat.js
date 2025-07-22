import { supabase } from './api/supabase.js';

export default async function handler(req, res) {
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { message, userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";
  
    const payload = {
      model: "gpt-4",  // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: message }],
    };

    try {
      // Save user message to database
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert({
          user_email: userEmail,
          role: 'user',
          content: message
        });

      if (userMessageError) {
        console.error('Error saving user message:', userMessageError);
        return res.status(500).json({ error: 'Failed to save user message' });
      }
  
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
        const assistantReply = data.choices[0].message.content;
        
        // Save assistant message to database
        const { error: assistantMessageError } = await supabase
          .from('messages')
          .insert({
            user_email: userEmail,
            role: 'assistant',
            content: assistantReply
          });

        if (assistantMessageError) {
          console.error('Error saving assistant message:', assistantMessageError);
          // Don't fail the request, just log the error
        }

        res.status(200).json({ reply: assistantReply });
      } else {
        res.status(500).json({ error: data.error.message });
      }
    } catch (error) {
      console.error('Error in chat handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }