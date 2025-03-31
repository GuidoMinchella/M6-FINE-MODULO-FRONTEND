import { Router } from 'express';
import Recipe from '../models/post.js';

const router = Router();

router.post('/recipes/:recipeId/comments', async (request, response, next) => {
    try {
        const recipe = await Recipe.findById(request.params.recipeId);
        recipe.comments.push({
            ...request.body,
            date: new Date().toISOString(),
        });
        const modifiedRecipe = await recipe.save();
        response.send(modifiedRecipe);
    } catch (error) {
        console.log(error);
        next(400);
    }
});

router.put(
    '/recipes/:recipeId/comments/:commentId',
    async (request, response, next) => {
        try {
            const recipe = await Recipe.findById(request.params.recipeId);
            const theComment = recipe.comments.id(request.params.commentId);

            // theComment.text = request.body.text;

            for (let key in request.body) {
                theComment[key] = request.body[key];
            }

            const modifiedRecipe = await recipe.save();

            if (!recipe) next(404);
            else response.send(modifiedRecipe);
        } catch (error) {
            console.log(error);
            next(400);
        }
    }
);

router.delete(
    '/recipes/:recipeId/comments/:commentId',
    async (request, response, next) => {
        const recipe = await Recipe.findById(request.params.recipeId);
        const theComment = recipe.comments.id(request.params.commentId);

        theComment.deleteOne();

        const modifiedRecipe = await recipe.save();

        response.send(modifiedRecipe);
    }
);

export default router;