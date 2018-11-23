var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', (req, res, next) => {
    var db = req.db;
    var posts = db.get('posts');
    posts.find({ category: req.params.category }, (err, posts) => {
        res.render('index', {
            'title': req.params.category,
            'posts': posts
        })
    })
})

router.get('/add', function (req, res, next) {
    res.render('addcategory', {
        'title': 'Add Category'
    })
});

router.post('/add', (req, res, next) => {
    var title = req.body.title;

    req.checkBody('title', 'Title field is required').notEmpty();

    // check error 
    var errors = req.validationErrors();

    if (errors) {
        res.render('addcategory', {
            'errors': errors,
            'title': title,
        })
    } else {
        var categories = db.get('categories')

        //insert to db
        categories.insert({
            'title': title
        }, (err, category) => {
            if (err) {
                res.send('There are issue insert category into db')
            } else {
                req.flash('Success', 'Inserted')
                res.location('/');
                res.redirect('/')
            }
        })
    }

})

module.exports = router;
