import nodemailer from 'nodemailer';
import EmailDto from '../Dtos/EmailDto';

const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "api",
        pass: "fa36e80b0688f9130f0096f47f630ecb"
    }
});

const SendEmail = async (EmailDto : EmailDto) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: EmailDto.receiver,
            subject: EmailDto.subject,
            text: EmailDto.text
        });
        console.log('Email sent');
    } catch (error) {
        console.error(error);
    }
};

export default SendEmail;