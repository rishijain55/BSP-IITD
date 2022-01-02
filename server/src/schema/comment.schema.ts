import { Schema } from 'mongoose';

const CommentSchema: Schema = new Schema({
    text: {
        type: String
    },
    picture: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

export default CommentSchema;
