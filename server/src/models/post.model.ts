import mongoose, { Schema } from 'mongoose';
import IComment from '../interfaces/comment';
import IPost, { IReaction } from '../interfaces/post';

export const CommentSchema: Schema = new Schema({
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

export const ReactionSchema: Schema = new Schema({
    picture: {
        type: Image,
        required: true
    },
    count: {
        type: Number
    }
});

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

export const ReactionModel = mongoose.model<IReaction>('Reaction', ReactionSchema);
export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
