const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const log = document.getElementById("chat-log");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  appendMessage(userMessage, "user");
  input.value = "";

  // Get bot response from your backend
  const botMessage = await getBotReply(userMessage);
  appendMessage(botMessage, "bot");
});

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

async function getBotReply(userInput) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.reply;
  } else {
    return "⚠️ Error: " + data.error;
  }
}
