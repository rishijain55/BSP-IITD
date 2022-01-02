import { Schema } from 'mongoose';
import CommentSchema from './comment.schema';
import ReactionSchema from './reaction.schema';

const PostSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    comments: {
        type: [Schema.Types.ObjectId]
    },
    reactions: {
        type: [ReactionSchema]
    }
});

export default PostSchema;
