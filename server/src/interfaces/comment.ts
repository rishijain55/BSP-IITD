import { Document } from 'mongoose';

export default interface IComment extends Document {
    uid: string;
    image?: string;
    content: string;
}
