import { Document } from 'mongoose';
import IUSer from './user';
import IComment from './comment';

export interface IReaction {
    picture?: string;
    count: number;
}

export default interface IPost extends Document {
    title: string;
    category: string;
    user: IUSer['_id'];
    content: string;
    picture?: string;
    comments: IComment[];
    reactions: IReaction[];
}
