const express = require('express');
const app = express();
const mongoose = require('mongoose');
// require('dotenv').config();
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

// ===== DB
const connectDB = require('./db/connect');

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ===== ROUTERS
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(express.json()); // el body-parser
app.use(helmet());
app.use(morgan('tiny'));

//===== MULTER pa subir archivos
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/images');
   },
   filename: (req, file, cb) => {
      // cb(null, req.body.name);
      cb(null, file.originalname);
   },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
   try {
      return res.status(200).json('File uploded successfully');
   } catch (error) {
      console.error(error);
   }
});

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
