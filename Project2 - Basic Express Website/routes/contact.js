var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('contact', { title: 'Profile' });
});

router.post('/send', (req, res, next) => {
    var tranposter = nodemailer.createTransport({
        proxy: 'http://proxy.fpt.vn:80',
        service: 'Gmail',
        auth: {
            user: 'pristan106@gmail.com',
            pass: '123456'
        }
    })

    var mailOptions = {
        from: 'Pristan <tansang106@gmail.com>',
        to: 'pristan106@gmail.com',
        subject: 'Website submission',
        text: `You have a new submission with following detail ... Name: ${req.body.name} Email: ${req.body.email} Message: ${req.body.message}`,
        html: `<p>Following detail</p><ul><li>Name: ${req.body.name}</li><li>Email: ${req.body.email}</li><li>Message: ${req.body.message}</li></ul>`
    }

    tranposter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error send mail', err);
            res.redirect('/')
        } else {
            console.log(`Message send: ${info.response}`)
            res.redirect('/')
        }
    })
})
module.exports = router;
