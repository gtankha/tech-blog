const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models')
const withAuth = require('../utils/auth');

// Routes for all activities on the dashboard

// get all blogs with user information
router.get('/', withAuth, (req, res) => {

    Blog.findAll({
        where: {
            user_id: req.session.user_id
        },
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

    })
        .then(dbBlogData => {
            // pass a single blog object into the homepage template

            const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
   
            res.render('dashboard', {
                blogs,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
           
            res.status(500).json(err);
        });
});

// Add a blog
router.get('/addblog',withAuth, (req, res) => {
    if (req.session.loggedIn) {
      res.render('addblog');
      return;
    }
  
    res.render('signup');
  });

  // get a single blog with comment and user information

  router.get('/blog/:id',withAuth, (req, res) => {

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
   
     res.render('blogedit', {
      blogs,
      loggedIn: req.session.loggedIn
    });
    })
    .catch(err => {
  
      res.status(500).json(err);
    });
});

// edit a single blog
router.get('/editblog/:id',withAuth, (req, res) => {

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
  
     res.render('editblog', {
      blogs,
      loggedIn: req.session.loggedIn
    });
    })
    .catch(err => {

      res.status(500).json(err);
    });
});

module.exports = router;