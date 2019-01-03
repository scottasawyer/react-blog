// Dependencies
const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  errorHandler = require('errorhandler'),
  mongoose = require('mongoose'),
  logger = require('morgan');

// Initializing the App
const app = express();

// Setting up the Database
const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));

// Setting up Cors
app.use(cors());

// Setting up Morgan Middleware
app.use(require('morgan')('dev'));

// Setting up Body-Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setting up the Static Directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'reaCTBlog', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


// Setting up Models
require('./models/Articles');

// Setting up Routes
app.use(require('./routes'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

//starting server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});