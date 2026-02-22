const form = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");

form.addEventListener("submit", async function(e) {
  
  e.preventDefault(); // STOP default submit
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const ageConfirm = document.getElementById("ageConfirm");
  
  if (!email || !password) {
    alert("Please fill all fields 💗");
    return;
  }
  
  if (!ageConfirm.checked) {
    alert("You must confirm you are 18+ to use Petal 💗");
    return;
  }
  
  // 🌷 Show loading state
  registerBtn.innerText = "Registering... 🌸";
  registerBtn.disabled = true;
  
  try {
    const response = await fetch("https://petal2-backend.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert("Registered successfully 🌷 Please login.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed");
    }
    
  } catch (error) {
    alert("Server error ☁️");
  }
  
  // Reset button if error
  registerBtn.innerText = "Register 💗";
  registerBtn.disabled = false;
  
});