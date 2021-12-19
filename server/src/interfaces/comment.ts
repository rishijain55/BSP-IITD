import { Document } from 'mongoose';
import IUser from './user';

export default interface IComment extends Document {
    username: IUser['_id'];
    image?: string;
    content: string;
}
