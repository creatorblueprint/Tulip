document.addEventListener("DOMContentLoaded", () => {
  
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburgerBtn");
  const overlay = document.getElementById("overlay");
  const logoutBtn = document.getElementById("logoutBtn");
  const chatItem = document.getElementById("chatItem");
  const memoryToggle = document.getElementById("memoryToggle");
  const memoryList = document.getElementById("memoryList");

if (memoryToggle && memoryList) {
  memoryToggle.addEventListener("click", () => {
    const isOpen = memoryList.style.display === "block";

    memoryList.style.display = isOpen ? "none" : "block";
    memoryToggle.innerHTML = isOpen
      ? "💗 Saved Memories ▼"
      : "💗 Saved Memories ▲";
  });
}
  
  if (!sidebar || !hamburger || !overlay) {
    console.log("Sidebar elements missing");
    return;
  }
  
  // Toggle sidebar
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    loadMemories(); //
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
