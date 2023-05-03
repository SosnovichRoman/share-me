const nodemailer = require('nodemailer');
const express = require('express');
var cors = require('cors')


const transporter = nodemailer.createTransport(
    {
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
            user: "romansosnovich@yandex.ru",
            pass: "Paqq3333",
        }
    },
    {
        from: "test <romansosnovich@yandex.ru>"
    }
)

const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err)
        console.log("Email Send:", info)
    })
}

//var bodyParser = require('body-parser')

const app = express();
const PORT = 3001;
const EMAIL = "donsimondotcom@gmail.com";

//app.use(bodyParser.json())
app.use(cors())


const jsonParser = express.json();

app.post('/email', jsonParser, function (request, response) {
    console.log(request.body);
    const message = {
        to: EMAIL,
        subject: "New order",
        text: `You have received a new order.
         The details:
         Name: ${request.body.orderName},
         Phone number: ${request.body.orderPhone},
         Address: ${request.body.orderAddress}.
         
         The following paintings were ordered:
         ${request.body.pins.map((pin, index) => `
         ${index + 1}. ${pin.title}`)}`
    }
    mailer(message);

});

app.listen(PORT, () => console.log("listening"));