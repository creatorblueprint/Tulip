// If no token, redirect to login
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// ===== LOAD SAVED CHAT ON PAGE LOAD =====
async function loadSavedChat() {
  try {
    const response = await fetch("https://petal2-backend.onrender.com/chat", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });


const chatBox = document.getElementById("chatBox");
const inputField = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  setTimeout(() => {
  chatBox.scrollTop = chatBox.scrollHeight;
}, 50);
}


function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typingBubble";
  
  typingDiv.innerHTML = `
    <div class="typing-bubble">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingBubble = document.getElementById("typingBubble");
  if (typingBubble) typingBubble.remove();
}


async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;
  
  addMessage(userMessage, "user");
  inputField.value = "";
  
  showTyping();
  
  try {
    const response = await fetch("https://petal2-backend.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    
   removeTyping();

if (response.status === 429) {
  addMessage("I'm a little tired today 💗 I've talked a lot already. Let me rest and we'll chat again soon 🌸", "bot");
}
else if (response.ok) {
  addMessage(data.reply, "bot");
}
else {
  addMessage("Something went wrong. Try again later.", "bot");
}
    
  } catch (error) {
  removeTyping();
  addMessage("server error", "bot");
}
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});
