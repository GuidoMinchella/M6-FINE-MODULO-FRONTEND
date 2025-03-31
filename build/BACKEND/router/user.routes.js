import { Router } from 'express';
import User from '../models/user.js';
import uploadLocal from '../middlewares/uploadLocal.js';
import uploadCloudinary from '../middlewares/uploadCloudinary.js';
import mailer from '../helpers/mailer.js';

const router = Router();

router.get('/', async (request, response, next) => {
    const page = request.query.page || 1; // valore di default di page se non presente
    let perPage = request.query.perPage || 5; // valore di default di perPage se non presente
    if (perPage > 10) perPage = 10; // valore massimo accettabile di perPage

    const totalUsers = await User.countDocuments(); // conta tutti gli utenti nella collection users
    const totalPages = Math.ceil(totalUsers / perPage); // calcola il totale di pagine (l'ultima pagina puo' non essere piena)

    const users = await User.where({})
        .sort({ firstName: 1, lastName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    response.send({
        page,
        perPage,
        totalPages,
        totalResources: totalUsers,
        data: users,
    });
});

router.get('/:userId', async (request, response, next) => {
    const theUser = await User.findById(request.params.userId);
    if (!theUser) response.status(404).send({ message: 'Not found' });
    else response.send(theUser);
});

router.post(
    '/',
    // uploadLocal.single('profile'),
     uploadCloudinary.single('profile'),
    async (request, response, next) => {
        //console.log(request.file);
        const data = { ...request.body, profile: request.file.filename };
        try {
            const newUser = await User.create(data);

            response.send(newUser);

            await mailer.sendMail({
                from: 'guidominchella3@gmail.com', // sender address
                to: request.body.email, // list of receivers
                subject: 'Benvenuto', // subject line
                text: `Benvenuto ${request.body.firstName}`, // plain text body
                html: `<b>Benvenuto ${request.body.firstName}</b>`, // html body
            });
        } catch (error) {
            console.log(error);
            next(400);
        }
    }
);

router.put('/:userId', async (request, response, next) => {
    try {
        const userModified = await User.findByIdAndUpdate(
            request.params.userId,
            request.body,
            { new: true } // per restituire i dati modificati e non quelli originali
        );
        if (!userModified) next(404);
        else response.send(userModified);
    } catch (error) {
        console.log(error);
        next(400);
    }
});

router.delete('/:userId', async (request, response, next) => {
    const userDeleted = await User.findByIdAndDelete(request.params.userId);
    response.send({ message: 'user deleted' });
});

export default router;