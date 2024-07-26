from flask import Flask, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'live.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'api'
app.config['MAIL_PASSWORD'] = '0a814261483b0f5dd7feb4b762d1ce83'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    full_name = data.get('full_name')
    mobile_number = data.get('mobile_number')
    email = data.get('email')
    test_date = data.get('test_date')
    test_link = data.get('test_link')

    msg = Message('Thank you for AIVQT Registration',
                  sender='No Reply <mailtrap@demomailtrap.com>',
                  recipients=[email])
    msg.html = f"""
    <html>
      <body>
        <p>Thank you for AIVQT Registration.</p>
        <p>Your online test is confirmed for {test_date}</p>
        <p>Please note your registered Full Name, Mobile no., Email ID for your Test Login.</p>
        <p>Please use the below link on the date of your Test.</p>
        <p><a href="{test_link}">{test_link}</a></p>
        <p>Login is allowed only 5 mins before and 5 mins after the online test starts.</p>
        <p>Example: If the online test time is 11:00 AM, then you are allowed to login in between 10:55 AM – 11:05 AM.</p>
        <p>No Extra time will be given for late logins.</p>
        <p>For any queries or to reschedule of test Contact us- 8884455485 or write us to info@aivqt.com</p>
      </body>
    </html>
    """

    try:
        mail.send(msg)
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
