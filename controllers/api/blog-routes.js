const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');


// get all blogs
router.get('/', (req, res) => {
  Blog.findAll({
    order: [['created_at', 'DESC']],
    attributes: [
      'id', 
      'title',
      'content',
      'created_at',
    ],
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
     
      res.status(500).json(err);
    });
});

// get a single blog
router.get('/:id', (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'title', 'content','created_at'],
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
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
    
      res.status(500).json(err);
    });
});

// post a single blog
router.post('/',withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Blog.create({
    title: req.body.title,
    content: req.body.content,
    user_id:  req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
     
      res.status(500).json(err);
    });
});

// edit a single blog
router.put('/:id',(req, res) => {
  Blog.update(
    {
      title: req.body.title,
      content: req.body.content
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      
      res.status(500).json(err);
    });
});

// delete a single blog
router.delete('/:id',withAuth, (req, res) => {
 Blog.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
 
      res.status(500).json(err);
    });
});



module.exports = router;