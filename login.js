const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!email || !password) {
    alert("Please fill all fields 🌷");
    return;
  }
  
  try {
    
    const response = await fetch("https://petal2-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful 💗");
      window.location.href = "chat.html";
    } else {
      alert(data.message || "Login failed");
    }
    
  } catch (error) {
    alert("Server error ☁️");
  }
  
});