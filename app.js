require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


const app = express()
const port = 3000
 

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/authentificationDB');

const userSchema  = new mongoose.Schema({
    email:"string",
    password:"string"
})
const secret = process.env.SECRET_KEY;

 const User = new mongoose.model("User", userSchema);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
  })
  app.get('/register', (req, res) => {
    res.render('register')
  })
  app.post("/register", (req, res) => {
    bcrypt.hash('req.body.password', salt, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password:hash
    })
    newUser.save().then(function(){
        res.render("secrets")
    }).catch(function(err){
        console.log(err)
        res.redirect("/")
    })
    });
    
   
  })
  const bcrypt = require('bcryptjs'); // Import bcrypt library

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password; // Removed unnecessary parentheses around req.body.password

    User.findOne({ email: email }).then(function(foundUser) {
        if (foundUser) {
            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.render("secrets");
                } else {
                    res.redirect('/'); // Redirect if password does not match
                }
            });
        } else {
            res.redirect('/'); // Redirect if user is not found
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
