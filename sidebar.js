document.addEventListener("DOMContentLoaded", () => {
  
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburgerBtn");
  const overlay = document.getElementById("overlay");
  const logoutBtn = document.getElementById("logoutBtn");
  const chatItem = document.getElementById("chatItem");
  
  if (!sidebar || !hamburger || !overlay) {
    console.log("Sidebar elements missing");
    return;
  }
  
  // Toggle sidebar
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  
  // Close on overlay click
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
  
  // Single chat item
  if (chatItem) {
    chatItem.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
  
});