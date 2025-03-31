import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authorization = (request, response, next) => {
    // verifacere se c'è l'header Authorization e se è di tipo Bearer
    // Authorization: Bearer asdhklasdre.bkjdskdfhkshksdfjsdbf.ddsfsdfsdfsdfsddf

    if (!request.headers.authorization) return response.status(401).send();
    const parts = request.headers.authorization.split(' ');
    if (parts.length != 2) return response.status(401).send();
    if (parts[0] != 'Bearer') return response.status(401).send();

    const jwtToken = parts[1];

    // verificare la firma del token
    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, payload) => {
        // errore: probabilmente il token è stato manomesso
        if (err) return response.status(401).send();

        // recuperiamo i dati dell'utente dal database
        const user = await User.findById(payload.userId);

        // l'utente potrebbe aver eliminato l'account nel frattempo e quindi non esistere più nel database
        if (!user) return response.status(401).send();

        // aggiungiamo i dati dell'utente loggato all'oggetto request in maniera
        // da essere utilizzabili dai middlawares successivi in caso ne avessero bisogno
        request.authUser = user;
        // console.log(user);

        // chiamiamo il prossimo middlaware
        next();
    });
};