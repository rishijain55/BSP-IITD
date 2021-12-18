import { Document } from 'mongoose';
import IComment from './comment';
import IPost from './post';

export interface UserInput {
    email: string;
    name: string;
    password: string;
    hostel: string;
    username: string;
}

export default interface IUser extends UserInput, Document {
    year?: number;
    department?: string;
    uid: string;
    createdAt: Date;
    updatedAt: Date;
    ownPosts: IPost[];
    likedPosts: IPost[];
    comments: IComment[];
    bookmarks: string;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}
