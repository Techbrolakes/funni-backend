import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Mailgen from 'mailgen';
dotenv.config();

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'FurniZen',
        link: 'https://www.linkedin.com/in/lekandar/',
    },
});

const welcomeTemplate = ({ name, email, otp }: { name: string; email: string; otp: number }) =>
    mailGenerator.generate({
        body: {
            name,
            intro: "Welcome to FurniZen! We're very excited to have you on board.",
            action: {
                instructions: `To get started with your account, please enter this otp ${otp}, it will expiry in 15 Minutes`,
                button: {
                    color: '#336B6B',
                    text: 'Enter the otp',
                    link: 'https://www.linkedin.com/in/lekandar/',
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    });

// Nodemail Smtp Transporter Config
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // use SSL
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// test transporter connection
transporter.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

const sendEmail = ({
    to,
    subject = '',
    email,
    name,
    otp,
}: {
    email: string;
    name: string;
    otp: number;
    to: string[];
    subject?: string;
}) => {
    const mailOptions = {
        from: process.env.SMTP_USER as string,
        to: email,
        subject: subject,
        html: welcomeTemplate({ email, name, otp }),
    };
};
