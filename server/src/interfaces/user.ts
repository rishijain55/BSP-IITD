import { Document } from 'mongoose';
import IComment from './comment';
import IPost from './post';

export interface AuthToken {
    accessToken: string;
    kind: string;
}
export interface UserInput {
    email: string;
    name: string;
    password: string;
    hostel: string;
    username: string;
    year: number;
    department: string;
}

export default interface IUser extends UserInput, Document {
    uid: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    tokens: AuthToken[];
    createdAt: Date;
    updatedAt: Date;
    ownPosts: IPost['_id'];
    likedPosts: IPost['_id'];
    comments: IComment['_id'];
    bookmarks: IPost['_id'];
    comparePassword: comparePasswordFunction;
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;
