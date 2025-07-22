// Import Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabase = createClient(
  'https://keuudgbcykhdpqbpixrv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldXVkZ2JjeWtoZHBxYnBpeHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzE5MzgsImV4cCI6MjA2ODU0NzkzOH0.QGwsGXHgbmrV84uBvkTW3NDO7b7KWul-xP5x9IsZjVU'
);

// DOM elements
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const log = document.getElementById("chat-log");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email-input");
const statusMsg = document.getElementById("status-msg");

// Check current user on load
supabase.auth.getUser().then(({ data: { user } }) => {
  updateAuthUI(user);
  if (user) {
    loadChatHistory(user.email);
  }
});

// Form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  input.value = "";

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
  // Get current user to include email
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return "⚠️ Error: User not authenticated";
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      message: userInput,
      userEmail: user.email 
    }),
  });

  const data = await response.json();
  return response.ok ? data.reply : "⚠️ Error: " + data.error;
}

async function loadChatHistory(userEmail) {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
      return;
    }

    // Clear existing messages
    log.innerHTML = '';

    // Display messages
    messages.forEach(msg => {
      const sender = msg.role === 'user' ? 'user' : 'bot';
      appendMessage(msg.content, sender);
    });
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

function updateAuthUI(user) {
  if (user) {
    document.getElementById("chat-window").style.display = "block";
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    statusMsg.textContent = `👋 Hello, ${user.email}`;
    loadChatHistory(user.email);
  } else {
    document.getElementById("chat-window").style.display = "none";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    statusMsg.textContent = `🔐 Please log in to continue.`;
    // Clear chat log when user logs out
    log.innerHTML = '';
  }
}

// Login with magic link
loginBtn.onclick = async () => {
  const email = emailInput.value;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  statusMsg.textContent = error
    ? "❌ " + error.message
    : "📩 Check your email for the login link!";
};

// Optional: Add logout handler
logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  updateAuthUI(null);
};