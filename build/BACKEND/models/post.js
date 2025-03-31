import { model, Schema } from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    readTime: {
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
        },
    },
    author: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email non valida'],
    },
    content: {
        type: String,
        required: true,
    },
});

const Posts = model('Posts', postSchema);

export default Posts;