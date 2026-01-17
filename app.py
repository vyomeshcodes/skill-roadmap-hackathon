from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

app.secret_key = "super_secret_key"

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "yourgmail@gmail.com"
app.config["MAIL_PASSWORD"] = "your_gmail_app_password"

mail = Mail(app)
serializer = URLSafeTimedSerializer(app.secret_key)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form["email"]
        password = generate_password_hash(request.form["password"])

        users[email] = {
            "password": password,
            "verified": False
        }

        token = serializer.dumps(email, salt="email-verify")
        verify_url = url_for("confirm_email", token=token, _external=True)

        msg = Message(
            "Verify your Planify account",
            sender=app.config["MAIL_USERNAME"],
            recipients=[email]
        )
        msg.body = f"Click the link to verify your email:\n{verify_url}"

        mail.send(msg)

        return "Verification email sent. Check your inbox."

    return render_template("signup.html")

@app.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = serializer.loads(token, salt="email-verify", max_age=3600)
        users[email]["verified"] = True
        return redirect("/login")
    except:
        return "Verification link expired or invalid"

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = users.get(email)
        if not user:
            return "User not found"

        if not user["verified"]:
            return "Please verify your email first"

        if not check_password_hash(user["password"], password):
            return "Wrong password"

        session["user"] = email
        return redirect("/dashboard")

    return render_template("login.html")




TWILIO_SID = "YOUR_TWILIO_SID"
TWILIO_AUTH = "YOUR_TWILIO_AUTH"
TWILIO_PHONE = "+1234567890"

twilio_client = Client(TWILIO_SID, TWILIO_AUTH)

otp_store = {}  # temp storage {phone: otp}

@app.route("/send-otp", methods=["POST"])
def send_otp():
    phone = request.form["phone"]
    otp = str(random.randint(100000, 999999))
    otp_store[phone] = otp

    twilio_client.messages.create(
        body=f"Your Planify OTP is {otp}",
        from_=TWILIO_PHONE,
        to=phone
    )

    return redirect("/verify-otp")


@app.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():
    if request.method == "POST":
        phone = request.form["phone"]
        otp = request.form["otp"]

        if otp_store.get(phone) == otp:
            session["user"] = phone
            otp_store.pop(phone)
            return redirect("/dashboard")

        return "Invalid OTP"

    return render_template("verify_otp.html")

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template, request, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "super_secret_key"

# In-memory DB (TEMP – replace later with PostgreSQL)
users = {}

@app.route("/")
def home():
    return render_template("index.html")

# ---------- SIGNUP ----------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        identifier = request.form["identifier"]
        password = request.form["password"]

        if identifier in users:
            return "User already exists!"

        users[identifier] = generate_password_hash(password)
        session["user"] = identifier
        return redirect("/dashboard")

    return render_template("signup.html")

# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        identifier = request.form["identifier"]
        password = request.form["password"]

        if identifier not in users:
            return "User not found!"

        if not check_password_hash(users[identifier], password):
            return "Wrong password!"

        session["user"] = identifier
        return redirect("/dashboard")

    return render_template("login.html")

# ---------- DASHBOARD ----------
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")
    return render_template("dashboard.html")

# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)

import random
from twilio.rest import Client
