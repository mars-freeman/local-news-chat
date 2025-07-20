const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const log = document.getElementById("chat-log");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message
  appendMessage(userMessage, "user");

  input.value = "";

  // Simulate bot response for now
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
  // This will later call your OpenAI API
  return "Bot says: " + userInput;
}