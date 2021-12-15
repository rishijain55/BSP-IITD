import { Document } from 'mongoose';
import IUSer from './user';
import IComment from './comment';

export default interface IPost extends Document {
    title: string;
    author: IUSer;
    content: string;
    picture?: string;
    comments: IComment[];
}
