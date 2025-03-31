import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';




const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
            process.env.BACKEND_HOST + process.env.GOOGLE_CALLBACK_PATH, // deve essere tra quelli registrati su Google
    },

    async function (accessToken, refreshToken, profile, cb) {
        // in profile avremo i dati dell'utente che Google ci ha passato
        console.log(profile);

        // cerchiamo l'utente con il suo Google ID nel nostro database
        // recuperiamo i suoi dati dal db
        let user = await User.findOne({ googleId: profile.id });

        // se non lo troviamo lo creiamo
        if (!user) {
            user = await User.create({
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                email: profile._json.email,
                googleId: profile.id,
                avatar: profile._json.picture,
            });
        }

        // creiamo il JWT con cui rispondiamo
        jwt.sign(
            { userId: user.id }, // id di Mongo
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, jwtToken) => {
                return cb(err, { jwtToken: jwtToken }); // finirà in response.user
            }
        );
    }
);



export default googleStrategy;