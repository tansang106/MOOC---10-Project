var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id', (req, res, next) => {
    var posts = db.get('posts');
    console.log(posts);
    posts.findOne(req.params.id, function (err, post) {
        res.render('show', {
            "post": post
        });
    });
});

router.get('/add', (req, res, next) => {
    var categories = db.get('categories')

    categories.find({}, {}, (err, categories) => {
        res.render('addpost', {
            'title': 'Add Post',
            'categories': categories
        })
    })
});

router.post('/add', (req, res, next) => {
    var title       = req.body.title;
    var category    = req.body.category;
    var body        = req.body.body;
    var author      = req.body.author;
    var date = new Date();
    if (req.files.length = 1) {
        var mainImageOriginalName   = req.files[0].originalname;
        var mainImageName           = req.files[0].filename;
        var mainImageMine           = req.files[0].mimetype;
        var mainImagePath           = req.files[0].path;
        var mainImageDes            = req.files[0].destination;
        var mainImageSize           = req.files[0].size;
    } else if (req.files.length > 1) {
        console.log('Multiple image')
    } else {
        var mainImageName = 'noimage.png';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();
    
    // check error 
    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            'errors': errors,
            'title': title,
            'body': body
        })
    } else {
        var posts = db.get('posts')

        //insert to db
        posts.insert({
            'title': title,
            'body': body,
            'category': category,
            'date': date,
            'author': author,
            'mainImage': mainImageName
        }, (err, post) => {
            if (err) {
                res.send('There are issue insert post into db')
            } else {
                req.flash('Success', 'Inserted')
                res.location('/');
                res.redirect('/')
            }
        })
    }

})

router.post('/addcomment', (req, res, next) => {
    var name        = req.body.name;
    var email       = req.body.email;
    var body        = req.body.body;
    var postid      = req.body.postid;
    var commentDate = new Date();

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not format correctly').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();

    // check error 
    var errors = req.validationErrors();

    if (errors) {
        var posts = db.get('posts');
        posts.findOne(postid, (err, post) => {
            res.render('show', {
                'error': err,
                'post': post
            })
        })
    } else {
        var comment = { 'name': name, 'email': email, 'body': body, 'commentdate': commentDate }
        
        var posts = db.get('posts');

        posts.update({
            '_id': postid
            },
            {
                $push: {
                    'comments': comment
                }
            },
            (err, comment) => {
                if (err) {
                    throw err
                } else {
                    req.flash('success', 'Comment add');
                    res.location('/posts/show/' + postid);
                    res.redirect('/posts/show/' + postid);
                }
            }
        )
    }

})

module.exports = router;
