const express = require('express');
const http = require("http");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config();

// serve static files
const app = express();
app.use(express.static(__dirname));

// prevent Heroku app from sleeping
setInterval(function() {
    http.get(`http://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
    console.log("Prevented app from sleeping");
}, process.env.PING_INTERVAL);

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
        from: `"ahmedtawfeeq.me" <${process.env.SMTP_USER}>`,
        to: process.env.RECEPIENT_EMAIL,
        subject: `New mail for Ahmed Tawfeeq`,
        // email template from:
        // https://zurb.com/playground/projects/responsive-email-templates/basic.html
        html: 
        `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <!-- If you delete this meta tag, Half Life 3 will never be released. -->
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>ZURBemails</title>
            <style type="text/css">
            @media only screen and (max-width: 600px) {
                a[class="btn"] { display:block!important; margin-bottom:10px!important; background-image:none!important; margin-right:0!important;}
                div[class="column"] { width: auto!important; float:none!important;}
                table.social div[class="column"] {
                    width:auto!important;
                }
            }
            </style>
        </head>
        <body bgcolor="#FFFFFF" style='margin:0;padding:0;font-family:"Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;height:100%;width:100% !important;'>
            <!-- BODY -->
            <table class="body-wrap" style='width:100%;'>
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF" style='display:block !important;max-width:600px !important;margin:0 auto !important;clear:both !important;'>
                <div class="content" style='padding:15px;max-width:600px;margin:0 auto;display:block;'>
                    <table style='width:100%;'>
                    <tr>
                        <td>
                        <p class="lead" style='white-space: pre;margin-bottom:10px;font-weight:normal;font-size:14px;line-height:1.6;font-size:17px;'>${req.body.message}</p>
                        <br/>
                        <!-- social & contact -->
                        <table class="social" width="100%" style='background-color:#ebebeb;width:100%;'>
                            <tr>
                            <td>
                                <!-- column 2 -->
                                <table align="left" class="column" style='width:300px;width:100%;min-width:279px;float:left;'>
                                <tr>
                                    <td style='padding:15px;'>
                                    <h5 class="" style='font-family:"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;line-height:1.1;margin-bottom:15px;color:#000;font-weight:900;font-size:17px;'>Contact Info:</h5>
                                    <p style='margin-bottom:10px;font-weight:normal;font-size:14px;line-height:1.6;'>
                                    Name: <strong>
                                        ${req.body.name}
                                    </strong>
                                    <br/>
                                    Phone: <strong>
                                        ${req.body.phone}
                                    </strong>
                                    <br/>
                                    Email: <strong style='color:#2BA6CB;'>
                                        ${req.body.email}
                                    </strong></p>
                                    </td>
                                </tr>
                                </table>
                                <!-- /column 2 -->
                                <span class="clear" style='display:block;clear:both;'></span>
                            </td>
                            </tr>
                        </table>
                        <!-- /social & contact -->
                        </td>
                    </tr>
                    </table>
                </div>
                <!-- /content -->
                </td>
                <td></td>
            </tr>
            </table>
            <!-- /BODY -->
        </body>
        </html>
        `
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