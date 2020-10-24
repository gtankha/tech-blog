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
        blogs
      });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;