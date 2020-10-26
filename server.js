const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Session is setup so that it expires after 30 secs of no activity on the page. It's short only for testing purposes.
const sess = {
  secret: 'Super secret secret',
  cookie: {maxAge: 30 * 1000},
  resave: true,
  rolling: true,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
 app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});