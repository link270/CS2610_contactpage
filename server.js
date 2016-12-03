var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var validator = require('validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// replace with your email
var email = "";
// replace with your password
var password = "";

email = encodeURIComponent(email);
password = encodeURIComponent(password);

var transporter = nodemailer.createTransport(`smtps://${email}:${password}@smtp.gmail.com`)

app.use(cookieParser('keyboard cat'));
app.use(session({
	cookie: {maxAge: 60000},
	resave: false,
	secret: 'keybaord cat',
	saveUninitialized: true
}));

app.use(flash());

app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res) {
	res.render('contact', {message: req.flash("messagesForContactPage"), error: req.flash("errorsForContactPage")});
})

app.post('/contactmailer', function(req, res) {
 	if(!validator.isEmail(req.body.email)) {
 		console.log('Invalid email');
 		req.flash("errorsForContactPage", "Invalid email");
 		res.redirect("/");
 		return;
 	}

 	var mailOptions = {
	    from: `"${req.body.firstname} ${req.body.lastname}" <${req.body.email}>`, // sender address
	    to: 'testinge1243@gmail.com', // list of receivers
	    subject: "CONTACT INFO", // Subject line
	    html: `
	    <p>${req.body.message}</p>
	    <p>Email: ${req.body.email}</p>
	    `
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
			req.flash("errorsForContactPage", "Something went wrong with emailing");
			res.redirect("/");
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});

	req.flash("messagesForContactPage", "Success");
	res.redirect("/");
})

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
})