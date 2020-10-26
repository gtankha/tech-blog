const router = require('express').Router();
const { User, Blog, Comment } = require("../../models");

// get all users
router.get('/', (req, res) => {


    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            
            res.status(500).json(err);
        });

});

// get a single user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Blog,
                attributes: ['id', 'title', 'content']
            },
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text']
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
        
            res.status(500).json(err);
        });

});

// add a  user
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;
                res.json(dbUserData);
            });
        })
        .catch(err => {
       
            res.status(500).json(err);
        });


});

// edit a user
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
        
            res.status(500).json(err);
        });


});

// delete a user
router.delete('/:id', (req, res) => {

    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
         
            res.status(500).json(err);
        });
});

// add a single user
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.uname
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});
// logout a user
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});
module.exports = router;