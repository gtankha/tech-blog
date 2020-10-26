const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');


// get all comments
router.get('/',withAuth, (req, res) => {
  Comment.findAll({
    order: [['created_at', 'DESC']],
    attributes: ['id', 'comment_text', 'created_at'],
    include: [
      // include the Comment model here:
      {
        model: Blog,
        attributes: ['id', 'title','content', 'created_at'],
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
   })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
 
      res.status(500).json(err);
    });
});
// get a single comment
router.get('/:id', withAuth,(req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'comment_text', 'created_at'],
    include: [
        // include the Comment model here:
        {
          model: Blog,
          attributes: ['id', 'title','content', 'created_at'],
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No comment found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
    
      res.status(500).json(err);
    });
});
// post a single comment
router.post('/',withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Comment.create({
   comment_text: req.body.comment_text,
   blog_id:  req.body.blog_id,  
   user_id:  req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
   
      res.status(500).json(err);
    });
});
// edit a single comment
router.put('/:id',withAuth,(req, res) => {
  Comment.update(
    {
        comment_text: req.body.comment_text
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No comment found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
    
      res.status(500).json(err);
    });
});
// delete a single comment
router.delete('/:id',withAuth, (req, res) => {
 Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No comment found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
    
      res.status(500).json(err);
    });
});



module.exports = router;