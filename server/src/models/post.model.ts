import mongoose, { Schema } from 'mongoose';
import IPost from '../interfaces/post';
import PostSchema from '../schema/post.schema';

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
