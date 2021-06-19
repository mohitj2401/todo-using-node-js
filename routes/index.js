const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Feedback = require('../models/Feedback');


const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);



deleteTweet = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id
    });
    const deleteTweet = await Post.deleteOne(post);
    res.redirect('back')
  } catch (e) {
    console.log(e);
    res.redirect('/home')
  }


}
router.get('/delete/:id', ensureAuthenticated, deleteTweet);

router.get("/home", ensureAuthenticated, function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts,
      user: req.user
    });
  });
});

router.get("/user/:userName", ensureAuthenticated, function (req, res) {

  const requestedUser = req.user.email;

  Post.find({
    email: requestedUser
  }, function (err, post) {
    res.render("user", {
      posts: post,
      user: req.user
    });
  });

});



router.post("/compose", function (req, res) {
  let postAuthor = "";
  const a = req.body.vehicle1;
  if (a == "click") {
    postAuthor = req.user.name;
  } else {
    postAuthor = "Anonymous"
  }
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: postAuthor,
    name: req.user.name,
    email: req.user.email
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
router.get("/compose", ensureAuthenticated, function (req, res) {

  res.render("compose", {
    user: req.user
  });
});


router.get("/posts/:postId", ensureAuthenticated, function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      author: post.author,
      user: req.user
    });
  });

});

router.get("/user/usersstrories/:postId", ensureAuthenticated, function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    res.render("usersstories", {
      title: post.title,
      content: post.content,
      author: post.author,
      user: req.user,
      id: post._id
    });
  });

});

router.post("/user/usersstrories/:id", function (req, res) {
  let postBody = req.body.postBody;
  Post.findByIdAndUpdate(
    // the id of the item to find
    req.params.id,

    // the change to be made. Mongoose will smartly combine your existing 
    // document with this change, which allows for partial updates too
    {
      $set: {
        content: postBody
      }
    },

    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
    {
      new: true
    },
    // the callback function
    (err, post) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.redirect("/home");
    }
  )
});


router.get("/about", ensureAuthenticated, function (req, res) {
  res.render("about", {
    // aboutContent: aboutContent,
    user: req.user

  });
});

router.post("/about", ensureAuthenticated, function (req, res) {
  const feedback = new Feedback({
    Email: req.body.Email,
    username: req.body.username,
    Queries: req.body.Queries

  });
  feedback.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});


router.get("/admin", ensureAuthenticated, function (req, res) {
  if (req.user.email != "admin_email") {
    req.logout();
    req.flash('success_msg', 'You are Not admin');
    res.redirect('/users/login');
  } else {
    Post.find({}, function (err, posts) {
      res.render("admin", {
        posts: posts,
        user: req.user
      });
    });
  }
});


module.exports = router;