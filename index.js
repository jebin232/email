

const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const {
        fullName,
        collegeName,
        College_Roll_number,
        yearOfPassing,
        Degree,
        Time_Slot,
        mobileNumber,
        email,
        address,
        permanentAddress,
        selectedCategory,
        positionName,
        resumeUrl,
        amountPaid,
        submissionDate,
        testDate,        // New field for the test date
        testLink         // New field for the test link
    } = req.body;

    // Prepare the content for the owner
    const ownerContent = `
        Full Name: ${fullName}
        College Name: ${collegeName}
        College Roll Number: ${College_Roll_number}
        Year Of Passing: ${yearOfPassing}
        Degree: ${Degree}
        Time Slot: ${Time_Slot}
        Mobile Number: ${mobileNumber}
        Email: ${email}
        Address: ${address}
        Permanent Address: ${permanentAddress}
        Selected Category: ${selectedCategory}
        Position Name: ${positionName}
        Resume URL: ${resumeUrl}
        Amount Paid: ${amountPaid}
        Submission Date: ${submissionDate}
        Test Date: ${testDate}
        Test Link: ${testLink}
    `;

    // Prepare the content for the user
    const userContent = `
        Dear ${fullName},

        Thank you for AIVQT Registration.

        Your online test is confirmed for ${testDate}.

        Please note your registered Full Name, Mobile no., and Email ID for your Test Login.

        Please use the below link on the date of your Test:
        ${testLink}

        Login is allowed only 5 mins before and 5 mins after the online test starts.
        Example: If the online test time is 11:00 AM, then you are allowed to log in between 10:55 AM – 11:05 AM.
        No extra time will be given for late logins.

        For any queries or to reschedule the test, contact us at 8884455485 or write to us at info@aivqt.com.

        Best regards,

        Prophecy Technologies
    `;

    // Email to the owner
    const ownerMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'jebincocjebnjebin232@gmail.com', // Owner's email address
        subject: `New Submission from ${fullName}`,
        text: ownerContent
    };

    // Email to the user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Online Test Confirmation - AIVQT',
        text: userContent
    };

    // Send email to the owner
    transporter.sendMail(ownerMailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(`Error sending email to owner: ${error.toString()}`);
        }

        // If the first email is sent successfully, send the second email
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(`Error sending email to user: ${error.toString()}`);
            }
            res.status(200).send('Emails sent successfully!');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
