const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Blog.findAll({
      attributes: [
        'id', 
        'title',
        'content',
        'user_id',
        'created_at',
      ],
    include: [
        {
            model: User,
            attributes: ['username']
        }
    ]
    
} )
      .then(dbBlogData => {
        // pass a single blog object into the homepage template
       
       const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
       console.log(blogs);
       res.render('homepage', {
        blogs,
        loggedIn: req.session.loggedIn
      });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      console.log(" I am logged in")
      res.redirect('/');
      return;
    }
    console.log("I am not logged in")
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      console.log(" I am signing up")
      res.redirect('/');
      return;
    }
    console.log("I am not logged in")
    res.render('signup');
  });
  router.get('/blog/:id', (req, res) => {

      Blog.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'title','content','created_at'],
        include: [
            // include the Comment model here:
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: User,
              attributes: ['username']
            }
          ]
      })

      .then(dbBlogData => {
        // pass a single blog object into the homepage template
       
       const blogs = dbBlogData.get({ plain: true });
       console.log(blogs);
       res.render('singleblog', {
        blogs,
        loggedIn: req.session.loggedIn
      });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;