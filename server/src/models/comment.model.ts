import mongoose, { Schema } from 'mongoose';
import IComment from '../interfaces/comment';
import CommentSchema from '../schema/comment.schema';

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;
