const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');

router.get('/', (req, res) => {

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
            console.log(blogs);
            res.render('dashboard', {
                blogs,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/addblog', (req, res) => {
    if (req.session.loggedIn) {
      res.render('addblog');
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
     res.render('blogedit', {
      blogs,
      loggedIn: req.session.loggedIn
    });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.get('/editblog/:id', (req, res) => {

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
     res.render('editblog', {
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