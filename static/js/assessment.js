document.getElementById("assessmentForm").addEventListener("submit", function(e){

    e.preventDefault();

    let userProfile = {
        skills: document.getElementById("skills").value.split(","),
        certificates: document.getElementById("certificates").value.split(","),
        sector: document.getElementById("sector").value,
        hoursPerDay: document.getElementById("hours").value,
        level: document.getElementById("level").value
    };

    // 1. Save basic profile locally
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // 2. Send data to backend for analysis
    fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfile)
    })
    .then(res => res.json())
    .then(result => {

        // 3. Save roadmap result for dashboard
        localStorage.setItem("roadmapResult", JSON.stringify(result));

        alert("Assessment analyzed successfully!");

        // 4. Go to dashboard
        window.location = "dashboard.html";
    })
    .catch(err => {
        console.log(err);
        alert("Error while analyzing assessment");
    });

});
