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
    
    const data = await response.json();
    
    if (data.messages) {
      data.messages.forEach(msg => {
        addMessage(
          msg.content,
          msg.role === "assistant" ? "bot" : "user"
        );
      });
    }
    
  } catch (err) {
    console.log("Failed to load chat");
  }
}

loadSavedChat();
loadUserPlan();


const chatBox = document.getElementById("chatBox");
const inputField = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const avatar = document.querySelector(".avatar img");
const imageModal = document.getElementById("imageModal");


avatar.addEventListener("click", () => {
  imageModal.classList.add("active");
});

imageModal.addEventListener("click", () => {
  imageModal.classList.remove("active");
});


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
    
    console.log("Full response:", data);
    
   removeTyping();

if (response.status === 429) {
  
  if (data.error === "FAIR_USAGE_LIMIT") {
    addMessage(
      "You’ve reached today’s fair usage limit… and honestly, I loved spending this time with you. Let’s continue tomorrow when I can give you my full attention again. 💞",
      "bot"
    );
  } else {
    addMessage(
      "I'm a little tired today 💗 I've talked a lot already. Let me rest and we'll chat again soon 🌸",
      "bot"
    );
  }
}
else if (response.status === 403) {
  showUpgradeModal();
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


async function loadMemories() {
  const res = await fetch("https://petal2-backend.onrender.com/get-memories", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });
  
  const data = await res.json();
  
  const memoryList = document.getElementById("memoryList");
  memoryList.innerHTML = "";
  
  data.memories.forEach((mem, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${mem.content}
      <button onclick="deleteMemory(${index})">❌</button>
    `;
    memoryList.appendChild(li);
  });
}

async function deleteMemory(index) {
  await fetch("https://petal2-backend.onrender.com/delete-memory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ index })
  });
  
  loadMemories();
}

function goToProfile() {
  window.location.href = "profile.html";
}


function showUpgradeModal() {
  document.getElementById("upgradeModal").classList.remove("hidden");
}

function closeUpgrade() {
  document.getElementById("upgradeModal").classList.add("hidden");
}


 //Upgrade Function//
async function upgradePlan(planType) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  // Step 1: Create order
  const response = await fetch(
    "https://petal2-backend.onrender.com/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ plan: planType })
    }
  );
  
  const order = await response.json();
  
  // Step 2: Open Razorpay
  const options = {
    key: "rzp_live_SKhRyte22gTj4e", // Put your TEST key here
    amount: order.amount,
    currency: order.currency,
    name: "Petal 💗",
    description: planType + " Plan",
    order_id: order.id,
    handler: async function(response) {
      
      // Step 3: Verify payment
      await fetch(
        "https://petal2-backend.onrender.com/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        }
      );
      
      alert("Payment successful 💗 Plan activated!");
      location.reload();
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}


//Payment History//
async function openPaymentHistory() {
  const token = localStorage.getItem("token");
  
  const res = await fetch("https://petal2-backend.onrender.com/payment-history", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
  
  const data = await res.json();
  
  let historyHtml = "<h3>Your Payment History 💗</h3>";
  
  if (data.history.length === 0) {
    historyHtml += "<p>No purchases yet.</p>";
  } else {
    data.history.forEach(item => {
      historyHtml += `
        <div class="history-card">
          <p><b>Plan:</b> ${item.plan}</p>
          <p><b>Amount:</b> ₹${item.amount}</p>
          <p><b>Purchased:</b> ${new Date(item.purchasedAt).toLocaleString()}</p>
          <p><b>Expires:</b> ${new Date(item.expiresAt).toLocaleString()}</p>
        </div>
        <hr>
      `;
    });
  }
  
  document.getElementById("historyModalContent").innerHTML = historyHtml;
  document.getElementById("historyModal").style.display = "block";
}


function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}




async function loadUserPlan() {
  const token = localStorage.getItem("token");
  if (!token) return;
  
  try {
    const response = await fetch(
      "https://petal2-backend.onrender.com/me",
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
     const badge = document.getElementById("planBadge");

badge.innerText = data.plan.toUpperCase();
badge.className = "plan-badge " + data.plan;
      
    }
    
  } catch (err) {
    console.log("Failed to load plan");
  }
}



sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});
