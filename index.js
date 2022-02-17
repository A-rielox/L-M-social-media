const express = require('express');
const app = express();
const mongoose = require('mongoose');
// require('dotenv').config();
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');

// ===== DB
const connectDB = require('./db/connect');

// ===== routers
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(express.json()); // el body-parser
app.use(helmet());
app.use(morgan('tiny'));

// @@@@@@@@@@@@@@@@@@@@ RUTAS
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = 8800;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);

      app.listen(port, () => {
         console.log(`app listening on port ${port}....🐸`);
      });
   } catch (error) {
      console.log(error);
   }
};

start();
