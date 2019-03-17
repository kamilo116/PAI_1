const express = require('express');
const router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');
let Find = require('../models/find');


function checkIfAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

function addArticle(res, req) {
  let is_correct = validateArticle(req, res);

  if(is_correct){
    res.render('add_article', {
      title:'Add Article',
      errors:is_correct
    });
  } else {
    saveArticle(req, res);
  }
}


function saveArticle(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;
  article.image = req.body.image;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Article Added');
      res.redirect('/');
    }
  });
}


function updateArticle(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.image = req.body.image;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
}


function deleteArticle(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Article removed');
      });
    }
  });
}

function renderArticleById(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article:article,
        author: user.name
      });
    });
  });
}


function renderArticleToEditById(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
}


function validateArticle(req, res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  return req.validationErrors();
}


function renderAddingArticlePage(res){
  res.render('add_article', {
    title:'Add Article'
  });
}


router.get('/add', checkIfAuthenticated, function(req, res){
  renderAddingArticlePage(res);
});


router.post('/add', function(req, res){
  addArticle(res, req);
});


router.get('/edit/:id', checkIfAuthenticated, function(req, res){
  renderArticleToEditById(req, res);
});


router.post('/edit/:id', function(req, res){
  updateArticle(req, res);
});

router.delete('/:id', function(req, res){
  deleteArticle(req, res);
});

router.get('/:id', function(req, res){
  renderArticleById(req, res);
});


// router.post('/display/:keyword', checkIfAuthenticated, function(req, res){
// router.post('/display', checkIfAuthenticated, function(req, res){
//   // Article.find({ "body": {$regex: /aaa/}}, (err, articles) => {res.json(articles)})
//   // req.flash('danger', 'DISPLAY');
//
//   // console.log(articles);
//   console.log("AAAAAAAAAAAAAAAA");
//
//   // Article.findById(req.params.id, function(err, article){
//   //   if(article.author != req.user._id){
//   //     req.flash('danger', 'Not Authorized');
//   //     res.redirect('/');
//   //   }
//   //   res.render('edit_article', {
//   //     title:'Edit Article',
//   //     article:article
//   //   });
//   // });
// });




module.exports = router;
