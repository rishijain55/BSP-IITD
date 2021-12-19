import { Document } from 'mongoose';
import IComment from './comment';
import IPost from './post';

export interface UserInput {
    email: string;
    name: string;
    password: string;
    hostel: string;
    username: string;
    year: number;
    department: number;
}

export default interface IUser extends UserInput, Document {
    uid: string;
    createdAt: Date;
    updatedAt: Date;
    ownPosts: IPost[];
    likedPosts: IPost[];
    comments: IComment[];
    bookmarks: string;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}
