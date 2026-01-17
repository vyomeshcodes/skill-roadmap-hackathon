document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  loginBtn.addEventListener("click", () => {
    window.location.href = "/login";
  });

  signupBtn.addEventListener("click", () => {
    window.location.href = "/signup";
  });
});
