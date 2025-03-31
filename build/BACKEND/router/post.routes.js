import { Router } from 'express';
import Posts from '../models/post.js';

const router = Router();

router.get('/', async (request, response, next) => {
    const page = request.query.page || 1; // valore di default di page se non presente
    let perPage = request.query.perPage || 5; // valore di default di perPage se non presente
    if (perPage > 10) perPage = 10; // valore massimo accettabile di perPage

    const totalPosts = await Posts.countDocuments(); // conta tutti le ricette nella collection recipes
    const totalPages = Math.ceil(totalPosts / perPage); // calcola il totale di pagine (l'ultima pagina puo' non essere piena)

    const post = await Posts.where({})
        .sort({ title: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    response.send({
        page,
        perPage,
        totalPages,
        totalResources: totalPosts,
        data: post,
    });
});

router.get('/:postId', async (request, response, next) => {
    const thePost = await Posts.findById(request.params.postId);
    if (!thePost) next(404);
    else response.send(thePost);
});

router.post('/', async (request, response, next) => {
    try {
        const newPost = await Posts.create(request.body);
        response.send(newPost);
    } catch (error) {
        console.log(error);
        next(400);
    }
});

router.put('/:postId', async (request, response, next) => {
    try {
        const postModified = await Posts.findByIdAndUpdate(
            request.params.recipeId,
            request.body,
            { new: true } // per restituire i dati modificati e non quelli originali
        );
        if (!postModified) next(404);
        else response.send(postModified);
    } catch (error) {
        console.log(error);
        next(400);
    }
});

router.delete('/:postId', async (request, response, next) => {
    const postDeleted = await Posts.findByIdAndDelete(
        request.params.postId
    );
    response.send({ message: 'post deleted' });
});

export default router;