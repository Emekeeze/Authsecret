require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')


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
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
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
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    })
    newUser.save().then(function(){
        res.render("secrets")
    }).catch(function(err){
        console.log(err)
        res.redirect("/")
    })
  })
  app.post("/login", (req, res) => {
    const email = req.body.username;
       const  password = req.body.password;
       User.findOne({email: email}).then(function(foundUser){
        if(foundUser){
            if (foundUser.password === password){
                res.render("secrets")
            }
        }
       }).catch((err) => {
        console.log(err)
        res.redirect('/')
       })
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
