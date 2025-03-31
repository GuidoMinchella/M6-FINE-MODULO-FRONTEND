import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';


const router = Router();

router.post('/register', async (request, response, next) => {
    // {
    //     firstName: 'Asdf',
    //     lastName: 'Fdsa',
    //     email: 'asdf@asdf.asdf',
    //     password: 'asdf'
    // }

    const newUser = await User.create({
        ...request.body,
        password: await bcrypt.hash(request.body.password, 10),
    });

    // const user = new User({
    //     ...request.body,
    //     password: await bcrypt.hash(request.body.password, 10);
    // });
    // const newUser = await user.save();

    response.status(201).send(newUser);
});

router.post('/login', async (request, response, next) => {
    // {
    //     email: 'asdf@asdf.asdf',
    //     password: 'asdf'
    // }
    // verificare se la password è corretta
    // se corretta genero un token (JWT)
    // rispondo con il token

    const user = await User.findOne({ email: request.body.email }).select(
        '+password'
    );

    if (!user) return response.status(401).send('credenziali sbagliate');

    try {
        await bcrypt.compare(request.body.password, user.password);
    } catch (e) {
        return response.status(401).send('credenziali sbagliate');
    }

    jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, jwtToken) => {
            if (err) return response.status(500).send();

            return response.send({
                token: jwtToken,
            });
        }
    );
});

router.get(
    '/login-google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/callback-google',
    passport.authenticate('google', { session: false }), // questo è importante perchè il nostro sito è fatto in React e non usa le sessioni
    (request, response, next) => {
        // una pagina del frontend che gestirà il JWT, cioè lo salverà nel local storage
        response.redirect(
            process.env.FRONTEND_HOST + '/login?jwt=' + request.user.jwtToken
        );
    }
);

export default router;