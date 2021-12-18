import { Schema } from 'mongoose';

const CommentSchema: Schema = new Schema({
    text: {
        type: String
    },
    picture: {
        type: String
    },
    username: {
        type: String,
        required: true
    }
});

export default CommentSchema;
