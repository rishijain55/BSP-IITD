import { Document } from 'mongoose';

export default interface IComment extends Document {
    username: string;
    image?: string;
    content: string;
}
