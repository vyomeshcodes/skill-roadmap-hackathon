let data = JSON.parse(localStorage.getItem("userProfile"));

if(!data){
  document.getElementById("welcomeText").innerText =
    "No assessment found. Please take assessment first.";
}
else{

  document.getElementById("userNameTop").innerText = "Hi, Learner";

  document.getElementById("sectorText").innerText = data.sector;

  let box = document.getElementById("skillList");

  data.skills.forEach(s => {
    let span = document.createElement("span");
    span.className = "skill-tag";
    span.innerText = s.trim();
    box.appendChild(span);
  });

  let progress = 40;

  if(data.level === "Intermediate") progress = 60;
  if(data.level === "Advanced") progress = 80;

  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("progressText").innerText = progress + "%";
}

document.getElementById("navSelect").addEventListener("change", function(){
  if(this.value === "Logout"){
    window.location = "/login";
  }
});
