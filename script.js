const chatBox = document.getElementById("chatBox");
const inputField = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;
  
  addMessage(userMessage, "user");
  inputField.value = "";
  
  typingIndicator.style.display = "block";
  
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
    
    typingIndicator.style.display = "none";
    
    if (response.ok) {
      addMessage(data.reply, "bot");
    } else {
      addMessage(data.error || "Error occurred", "bot");
    }
    
  } catch (error) {
    typingIndicator.style.display = "none";
    addMessage("Server error ☁️", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});