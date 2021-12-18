import { Document } from 'mongoose';

export interface UserInput {
    email: string;
    name: string;
    password: string;
    hostel: string;
    username: string;
}

export interface IUser extends UserInput, Document {
    uid: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}
