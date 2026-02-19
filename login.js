const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("spinner");

loginBtn.addEventListener("click", async () => {
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!email || !password) {
    alert("Please fill all fields 🌷");
    return;
  }
  
// Start loading state
btnText.innerText = "Logging in...";
spinner.style.display = "inline-block";
loginBtn.disabled = true;
loginBtn.style.opacity = "0.7";
  
  
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
      window.location.href = "chat.html";
    } else {
  alert(data.message || "Login failed");
  
  // Reset button
  btnText.innerText = "Login 💗";
  spinner.style.display = "none";
  loginBtn.disabled = false;
  loginBtn.style.opacity = "1";
}
    
  } catch (error) {
  alert("Server error ☁️");
  
  // Reset button
  btnText.innerText = "Login 💗";
  spinner.style.display = "none";
  loginBtn.disabled = false;
  loginBtn.style.opacity = "1";
}
  
});
