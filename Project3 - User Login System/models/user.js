var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

mongoose.connect(
    "mongodb://localhost/nodeauth",
    { useNewUrlParser: true }
);

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema)

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch)
    })
}

module.exports.getUserByUserName = (username, callback) => {
    var query = { username: username };
    User.findOne(query, callback)
}

module.exports.getUserById = (id, callback) => {
    // var query = { username: username };
    User.findById(id, callback)
}

module.exports.createUser = (newUser, callback) => {
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        //Set hash password
        newUser.password = hash;
        //Create user
        newUser.save(callback)
    });

}