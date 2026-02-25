const editBtn = document.getElementById("editBtn");
const modal = document.getElementById("editModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const displayName = document.getElementById("displayName");
const nickname = document.getElementById("nickname");
const birthday = document.getElementById("birthday");
const bio = document.getElementById("bio");

const editName = document.getElementById("editName");
const editNickname = document.getElementById("editNickname");
const editBirthday = document.getElementById("editBirthday");
const editBio = document.getElementById("editBio");

const avatarInput = document.getElementById("editAvatar");
const previewAvatar = document.getElementById("previewAvatar");
const mainAvatar = document.querySelector(".profile-avatar");

const deleteBtn = document.getElementById("deletePhotoBtn");
const DEFAULT_IMAGE = "avatar.png";


// ==========================
// LOAD SAVED DATA
// ==========================

const savedName = localStorage.getItem("name");
const savedNickname = localStorage.getItem("nickname");
const savedBirthday = localStorage.getItem("birthday");
const savedBio = localStorage.getItem("bio");
const savedAvatar = localStorage.getItem("avatar");

if (savedName) displayName.textContent = savedName;
if (savedNickname) nickname.textContent = "Called: " + savedNickname + " 💕";
if (savedBirthday) birthday.textContent = savedBirthday;
if (savedBio) bio.textContent = savedBio;

if (savedAvatar) {
  previewAvatar.src = savedAvatar;
  mainAvatar.src = savedAvatar;
}


// ==========================
// AVATAR UPLOAD
// ==========================

avatarInput.addEventListener("change", function() {
  const file = this.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      previewAvatar.src = reader.result;
      mainAvatar.src = reader.result;
      localStorage.setItem("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  }
});


// ==========================
// DELETE AVATAR
// ==========================

if (deleteBtn) {
  deleteBtn.addEventListener("click", function() {
    previewAvatar.src = DEFAULT_IMAGE;
    mainAvatar.src = DEFAULT_IMAGE;
    localStorage.removeItem("avatar");
  });
}


// ==========================
// MODAL OPEN / CLOSE
// ==========================

editBtn.onclick = () => {
  modal.classList.remove("hidden");
};

cancelBtn.onclick = () => {
  modal.classList.add("hidden");
};


// ==========================
// SAVE PROFILE
// ==========================

saveBtn.onclick = () => {
  
  if (editName.value.trim() !== "") {
    displayName.textContent = editName.value;
    localStorage.setItem("name", editName.value);
  }
  
  if (editNickname.value.trim() !== "") {
    nickname.textContent = "Called: " + editNickname.value + " 💕";
    localStorage.setItem("nickname", editNickname.value);
  }
  
  if (editBirthday.value !== "") {
    const date = new Date(editBirthday.value);
    
    const formatted =
      String(date.getDate()).padStart(2, "0") + "/" +
      String(date.getMonth() + 1).padStart(2, "0") + "/" +
      date.getFullYear();
    
    birthday.textContent = formatted;
    localStorage.setItem("birthday", formatted);
  }
  
  if (editBio.value.trim() !== "") {
    bio.textContent = editBio.value;
    localStorage.setItem("bio", editBio.value);
  }
  
  modal.classList.add("hidden");
};