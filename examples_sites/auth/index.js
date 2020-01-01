const path = require('path')

const express = require('express')
const session = require('express-session')
const bodyParser = require("body-parser")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


// See http://www.passportjs.org/docs/username-password/
passport.use(new LocalStrategy(function(username, password, done) {
    if (username === 'test' && password === 'test') {
        done(null, {username, password})
    }
    else {
        done(null, false, {message: 'Incorrect credentials.'})
    }
}))
passport.serializeUser(function({username, password}, done) {
    done(null, `${username}--${password}`)
});

passport.deserializeUser(function(hash, done) {
    [username, password] = hash.split('--')
    done(null, {username, password})
});


const app = express()
const port = 3000

app.use(session({secret: "1Wages-4Marin-6Peril-3lustfully-forge-Removal"}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.post('/', passport.authenticate('local', {
    successRedirect: '/cal',
    failureRedirect: '/',
    failureFlash: false,
}))

app.get('/cal', (req, res) => {
    if (req.user) {
        res.sendFile(path.join(__dirname, 'cal.html'))
    }
    else {
        res.redirect('/')
    }
})

app.get('/1.html', (req, res) => {
    if (req.user) {
        res.sendFile(path.join(__dirname, '1.html'))
    }
    else {
        res.redirect('/')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))