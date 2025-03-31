import 'dotenv/config'; // carica il file .env
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './router/user.routes.js';
import postRouter from './router/post.routes.js';
import commentRouter from './router/comments.routes.js';
import authRouter from './router/auth.routes.js';
import morgan from 'morgan';
import googleStrategy from './config/passport.config.js';
import passport from 'passport';

// import expressListEndpoints from 'express-list-endpoints';
// import helmet from 'helmet';

const server = express(); // creato il server base

server.use(cors()); // serve a risolvere i problemi di CORS quando si collega l'api con il frontend
server.use(morgan('dev'));

passport.use(googleStrategy);

server.use(express.json()); // serve ad accettare json nel body delle richieste

server.use('/uploads', express.static('uploads'));

server.use('/api/v1/users', userRouter); // collegato il router al server
server.use('/api/v1/posts', postRouter); // collegato il router al server
server.use('/api/v1', commentRouter); // collegato il router al server
server.use('/api/v1', authRouter); // collegato il router al server

// gestore di errori
server.use((errorCode, request, response, next) => {
    if (errorCode == 404) next();
    else if (Number.isInteger(errorCode)) response.status(errorCode).send();
    else response.status(500).send();
});

// gestore della 404
server.use((request, response) => {
    response.status(404).send({ message: 'resource not found' });
});

// connessione a MongoDB
await mongoose
    .connect(process.env.MONGO_STRING)
    .then(() => console.log('Database connesso'))
    .catch((err) => console.log(err));

// avvio del server
server.listen(process.env.PORT, () => {
    // console.clear();
    console.log('Server avviato');
});


process.on('SIGINT', () => {
    console.log('\n🛑 Server chiuso correttamente');
    process.exit(0);
  });
  