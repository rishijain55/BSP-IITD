import mongoose, { Schema } from 'mongoose';
import IPost from '../interfaces/post';
import CommentSchema from '../schema/comment.schema';
import ReactionSchema from '../schema/reaction.schema';

export const PostSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
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
        type: [CommentSchema]
    },
    reactions: {
        type: [ReactionSchema]
    }
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
