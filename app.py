from flask import Flask, render_template, request, redirect, session, url_for, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__)
app.secret_key = "skill_roadmap_hackathon_secret"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")
DATA_DIR = os.path.join(BASE_DIR, "data")

# ---------------- DATABASE ----------------

def get_db():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()

# ---------------- HELPERS ----------------

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return render_template("index.html")

# -------- AUTH --------

@app.route("/login", methods=["GET", "POST"])
def login():
    print("LOGIN ROUTE HIT:", request.method)

    if request.method == "POST":
        user_id = request.form.get("email")
        password = request.form.get("password")

        print("POST DATA:", user_id, password)

        if not user_id or not password:
            flash("All fields required")
            return render_template("login.html")

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT password_hash FROM users WHERE user_id = ?",
            (user_id,)
        )
        result = cursor.fetchone()
        conn.close()

        print("DB RESULT:", result)

        if result and check_password_hash(result[0], password):
            session["user"] = user_id
            print("LOGIN SUCCESS:", user_id)
            flash("Login successful!")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password")
            return render_template("login.html")

    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        user_id = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if not user_id or not password or not confirm_password:
            flash("All fields required")
            return render_template("signup.html")

        if password != confirm_password:
            flash("Passwords do not match")
            return render_template("signup.html")

        password_hash = generate_password_hash(password)

        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (user_id, password_hash) VALUES (?, ?)",
                (user_id, password_hash)
            )
            conn.commit()
            conn.close()
            flash("Account created! Please log in.")
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            flash("Email already exists")
            return render_template("signup.html")

    return render_template("signup.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))

# -------- PROTECTED --------

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))

    skills = load_json("skills.json")
    courses = load_json("courses.json")

    return render_template(
        "dashboard.html",
        user=session["user"],
        skills=skills,
        courses=courses
    )


@app.route("/assessment")
def assessment():
    if "user" not in session:
        return redirect(url_for("login"))

    return render_template("assessment.html")

# ---------------- MAIN ----------------

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5004)
