const express = require('express'); 
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config();

// serve static files
const app = express();
app.use(express.static(__dirname));

// mail handling
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/send-email", function(req, res) {
    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    let mailOptions = {
        from: '"' + req.body.name + '" <' + req.body.email + '>',
        to: process.env.RECEPIENT_EMAIL,
        subject: "New mail for Ahmed the Ninja",
        // TODO: add phone info
        html: "<b>Received via Ahmed the Ninja</b><p>" + req.body.message + "</p>"
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send({
                message: error
            });
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        return res.status(200).send({
            message: "Message was sent"
        });
    });
});

const listener = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + listener.address().port)
});