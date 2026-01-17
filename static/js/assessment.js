document.getElementById("assessmentForm").addEventListener("submit", function(e){

 e.preventDefault();

let userProfile = {
   skills: document.getElementById("skills").value.split(","),
   certificates: document.getElementById("certificates").value.split(","),
   sector: document.getElementById("sector").value,
   hoursPerDay: document.getElementById("hours").value,
   level: document.getElementById("level").value
};


 localStorage.setItem("userProfile", JSON.stringify(userProfile));

 alert("Assessment saved successfully!");
 window.location = "dashboard.html";

});
