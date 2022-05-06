const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// Modules
const logger = require('./winston-config');
const routes = require('./src/routes');

require('dotenv').config();

// create express app
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested, Content-Type, Accept Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  // app.use(morgan('dev'));
  app.use(
    morgan('dev', {
      stream: logger.stream,
      // only log error responses
      // skip: (req, res) => {
      //     return res.statusCode < 400;
      // },
    })
  );
}

// logger.info(`env varsss MONGO_URI ${process.env.MONGO_URI}`);
// logger.info(`env varsss NODE_PORT ${process.env.NODE_PORT}`);

// Mongo Database connection
// {`mongodb+srv://${USERNAME}:${PASSWORD}@${DB_STRING}`}
mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.DB_STRING}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on('error', (err) => logger.error(`connection error: ${err.stack}`));
db.once('open', () => {
  logger.info('We are connected to the database');

  app.use('/api', routes);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  // error handler middleware
  app.use((error, req, res, next) => {
    logger.error(`Error occured: ${error}`);
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  });
});

const server = app.listen(process.env.PORT, () => {
  logger.info(`server started on port ${process.env.PORT}`);
});

process.on('SIGINT', () => {
  logger.warn('SIGINT RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
