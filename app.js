//jshint esversion:6

const passport = require('passport');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const MongoStore = require('connect-mongo')(session);
const app = express();

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('./config/auth');



// Passport Config
require('./config/passport')(passport);

const db = require("./config/keys").mongoURI;

mongoose
  .connect(
    db, {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);


app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.use(express.static("public"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};
app.listen(port, function () {
  console.log('Server has started on port ' + port);
});