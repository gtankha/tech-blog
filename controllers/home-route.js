const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');

// Routes for all activities on the home page
// get all blog information 
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
      
       res.render('homepage', {
        blogs,
        loggedIn: req.session.loggedIn
      });
      })
      .catch(err => {
       
        res.status(500).json(err);
      });
  });

// login a user
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
    
      res.redirect('/');
      return;
    }
    
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {

      res.redirect('/');
      return;
    }
   
    res.render('signup');
  });

  // get info about a single blog
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
    
       res.render('singleblog', {
        blogs,
        loggedIn: req.session.loggedIn
      });
      })
      .catch(err => {
    
        res.status(500).json(err);
      });
  });

  module.exports = router;