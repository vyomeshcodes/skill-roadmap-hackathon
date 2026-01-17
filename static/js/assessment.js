document.getElementById("assessmentForm").addEventListener("submit", function(e){

 e.preventDefault();

 let userProfile = {
   skills: skills.value.split(","),
   certificates: certificates.value.split(","),
   sector: sector.value,
   hoursPerDay: hours.value,
   level: level.value
 };

 localStorage.setItem("userProfile", JSON.stringify(userProfile));

 alert("Assessment saved successfully!");
 window.location = "dashboard.html";

});
