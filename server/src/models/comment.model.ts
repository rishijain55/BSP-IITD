import { NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import IComment from '../interfaces/comment';
import CommentSchema from '../schema/comment.schema';
import UserModel from './user.model';
import PostModel from './post.model';

CommentSchema.post('save', async function (comment, next: NextFunction) {
    let user_id = this.user;
    let post = this.post;

    const user = await UserModel.findById(user_id);
    const mainPost = await PostModel.findById(post);

    if (!user || !mainPost) {
        return next();
    }
    post.comments.push(comment);
    user.comments.push(comment);
    next();
});
const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;
