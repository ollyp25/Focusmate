from flask import Flask, request, render_template
from datetime import datetime
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()
FOCUSMATE_EMAIL = os.getenv("FOCUSMATE_EMAIL")
FOCUSMATE_PASSWORD = os.getenv("FOCUSMATE_PASSWORD")

app = Flask(__name__)

today = datetime.now()

@app.route("/")
def home():
    return render_template("index.html", year=today.year)

@app.route("/about")
def about():
    return render_template("about.html", year=today.year)

@app.route("/faq")
def faq():
    return render_template("faq.html", year=today.year)

@app.route("/contact", methods=["POST", "GET"])
def contact():
    if request.method == "POST":
        data = request.form
        send_email(data["name"], data["email"], data["message"])
        return render_template("contact.html", msg_sent=True, year=today.year)
    else:
        return render_template("contact.html", msg_sent=False, year=today.year)
    

def send_email(name, email, message):
    msg = EmailMessage()
    msg['Subject'] = 'New Contact Message from Focusmate'
    msg['From'] = FOCUSMATE_EMAIL
    msg['To'] = FOCUSMATE_EMAIL
    msg.set_content(f"""
    You received a new message from the contact form:

    Name: {name}
    Email: {email}
    Message:
    {message}
    """)

    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()
        connection.login(FOCUSMATE_EMAIL, FOCUSMATE_PASSWORD)
        connection.send_message(msg)



if __name__ == '__main__':
    app.run(debug=True)