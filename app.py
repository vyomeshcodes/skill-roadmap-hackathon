from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from twilio.rest import Client
import random

# -------------------- APP SETUP --------------------
app = Flask(__name__)
app.secret_key = "planify_secret_key"

# -------------------- MAIL CONFIG --------------------
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "yourgmail@gmail.com"
app.config["MAIL_PASSWORD"] = "your_gmail_app_password"

mail = Mail(app)
serializer = URLSafeTimedSerializer(app.secret_key)

# -------------------- TWILIO CONFIG --------------------
TWILIO_SID = "YOUR_TWILIO_SID"
TWILIO_AUTH = "YOUR_TWILIO_AUTH"
TWILIO_PHONE = "+1234567890"

twilio_client = Client(TWILIO_SID, TWILIO_AUTH)
otp_store = {}

# -------------------- TEMP DATABASE --------------------
users = {}  
# Structure:
# users[email] = {
#     "password": hashed,
#     "verified": True/False,
#     "profile": {...},
#     "roadmap": {...}
# }

# ======================================================
# -------------------- ROUTES --------------------------
# ======================================================

@app.route("/")
def home():
    return render_template("index.html")

# -------------------- SIGNUP --------------------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        confirm = request.form.get("confirm_password")

        if not email or not password or not confirm:
            return render_template("signup.html",
                                   error="All fields are required")

        if password != confirm:
            return render_template("signup.html",
                                   error="Passwords do not match")

        if email in users:
            return render_template("signup.html",
                                   error="User already exists")

        users[email] = {
            "password": generate_password_hash(password),
            "verified": False,
            "profile": None,
            "roadmap": None
        }

        # Send verification email
        token = serializer.dumps(email, salt="email-verify")
        link = url_for("confirm_email", token=token, _external=True)

        msg = Message(
            subject="Verify your Planify account",
            sender=app.config["MAIL_USERNAME"],
            recipients=[email],
            body=f"Click to verify your account:\n{link}"
        )
        mail.send(msg)

        return render_template("login.html",
                               success="Signup successful! Verify email to login.")

    return render_template("signup.html")

# -------------------- EMAIL CONFIRM --------------------
@app.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = serializer.loads(token, salt="email-verify", max_age=3600)

        if email in users:
            users[email]["verified"] = True
            return render_template("login.html",
                                   success="Email verified! You can login.")

        return "User not found", 404

    except:
        return "Verification link invalid or expired", 400

# -------------------- LOGIN --------------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    email = request.form.get("email")
    password = request.form.get("password")

    if email not in users:
        return render_template("login.html",
                               error="User not found")

    user = users[email]

    if not user["verified"]:
        return render_template("login.html",
                               error="Please verify your email first")

    if not check_password_hash(user["password"], password):
        return render_template("login.html",
                               error="Invalid password")

    # SUCCESS LOGIN
    session["user"] = email

    # If user already did assessment → dashboard
    if user.get("roadmap"):
        return redirect(url_for("dashboard"))
    else:
        return redirect(url_for("assessment"))

# -------------------- ASSESSMENT PAGE --------------------
@app.route("/assessment")
def assessment():
    if "user" not in session:
        return redirect(url_for("login"))

    return render_template("assessment.html")

# -------------------- ANALYZE ASSESSMENT (API) --------------------
@app.route("/analyze", methods=["POST"])
def analyze():

    if "user" not in session:
        return jsonify({"error": "not logged in"}), 401

    data = request.get_json()

    # Very simple gap logic (you can improve later)
    skills = [s.strip().lower() for s in data.get("skills", [])]

    required = {
        "web": ["html", "css", "javascript"],
        "ai": ["python", "ml", "math"],
        "core": ["c", "dsa"]
    }

    sector = data.get("sector", "web")

    needed = required.get(sector, [])
    missing = [s for s in needed if s not in skills]

    score = int(100 * (len(needed) - len(missing)) / max(1, len(needed)))

    roadmap = {
        "missing_skills": missing,
        "score": score,
        "message": f"You are {score}% ready for {sector}"
    }

    # Save to user
    users[session["user"]]["profile"] = data
    users[session["user"]]["roadmap"] = roadmap

    return jsonify(roadmap)

# -------------------- DASHBOARD --------------------
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))

    email = session["user"]
    user = users.get(email)

    return render_template(
        "dashboard.html",
        user=email,
        roadmap=user.get("roadmap"),
        profile=user.get("profile")
    )

# -------------------- LOGOUT --------------------
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))

# -------------------- SEND OTP --------------------
@app.route("/send-otp", methods=["POST"])
def send_otp():
    phone = request.form.get("phone")
    if not phone:
        return "Phone number required", 400

    otp = str(random.randint(100000, 999999))
    otp_store[phone] = otp

    twilio_client.messages.create(
        body=f"Your Planify OTP is {otp}",
        from_=TWILIO_PHONE,
        to=phone
    )

    return redirect(url_for("verify_otp"))

# -------------------- VERIFY OTP --------------------
@app.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():
    if request.method == "POST":
        phone = request.form.get("phone")
        otp = request.form.get("otp")

        if otp_store.get(phone) == otp:
            session["user"] = phone
            otp_store.pop(phone)
            return redirect(url_for("dashboard"))

        return "Invalid OTP", 400

    return render_template("verify_otp.html")

# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(debug=True)
