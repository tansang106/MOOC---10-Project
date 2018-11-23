var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.get("/register", function (req, res, next) {
    res.render("register", {
        title: "Register"
    });
});

router.get("/login", (req, res, next) => {
    res.render("login", {
        title: "Login"
    })
})

router.post("/register", (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //check file
    if (req.files.profileimage) {
        console.log("Uploading file...");

        var profileimageOriginalName = req.files.profileimage.originalname;
        var profileImageName = req.files.profileimage.name;
        var profileImageMine = req.files.profileimage.minetype;
        var profileImagePath = req.files.profileimage.path;
        var profileImageExt = req.files.profileimage.extendsion;
        var profileImageSize = req.files.profileimage.size;
    } else {
        var profileImageName = "noimage.png";
    }

    //Form validation
    req.checkBody("name", "Name field is required").notEmpty();
    req.checkBody("email", "Email field is required").notEmpty();
    req.checkBody("email", "Email not valid").isEmail();
    req.checkBody("username", "Username field is required").notEmpty();
    req.checkBody("password", "Name field is required").notEmpty();
    req.checkBody("password2", "Password do not match").equals(req.body.password);

    //Check error
    var errors = req.validationErrors();

    if (errors) {
        res.render("register", {
            errors: errors,
            name,
            email,
            username,
            password,
            password2
        });
    } else {
        var newUser = new User({
            name,
            email,
            username,
            password,
            profileimage: profileImageName
        });

        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });

        req.flash("success", "You are now register");

        res.location("/");
        res.redirect("/");
    }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUserName(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            console.log('Unknown User')
            return done(null, false, {message: 'Unknown User'})
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                console.log('Invalid Password')
                return done(null, false, { message: 'Invalid Password'})
            }
        })
    })
}))

router.post("/login", passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password' }), (req, res) => {
    console.log('Authenticate Successful')
    req.flash('success', 'You are logged in');
    res.redirect('/');
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('Success', 'You have logout')
    res.redirect('/users/login')
})

module.exports = router;
