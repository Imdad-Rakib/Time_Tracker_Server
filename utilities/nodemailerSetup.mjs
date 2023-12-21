import nodemailer from 'nodemailer'


async function sendEmail(author, pass, receiver, url, subject) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: author,
            pass
        }
    });
    const resetPass = 
                    `<html>
                    <body>
                    <p>Hi there!</p>
                    <p>Click on the link below to reset your password: <br> <a href = ${url}> ${url}</p>
                    <p>Thanks!</p>
                    </body>
                    </html>`;
    const verifyEmail = 
                    `<html>
                    <body>
                    <p>Hi there!</p>
                    <p>You have recently visited out site and entered your email for sign up</p>
                    <p>Click on the link below to proceed: <br> <a href = ${url}> ${url}</p>
                    <p>Thanks!</p>
                    </body>
                    </html>`
    try {
        await transporter.sendMail({

            from: author,
            to: receiver,
            subject,
            html: (subject === "Password Reset" ? resetPass: verifyEmail)

        });
        console.log('Email Sent Successfully');
        return true;
    } catch (err) {
        console.log('Error', err);
        return false
    }
}

export {sendEmail};