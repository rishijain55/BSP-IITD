import { NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';
import bcrypt from 'bcrypt';
import config from '../config/config';
import { CommentSchema, PostSchema } from './post.model';

// const Hostels: string[] = ['Kailash', 'Himadri', 'Kumaon', 'Girnar', 'Zanskar', 'Vindhyachal', 'Udaigiri', 'Satpura', 'Aravali', 'Nilgiri', 'Jwalamukhi', 'Karakoram', 'Shivalik'];

const UserSchema: Schema = new Schema(
    {
        uid: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20
        },
        hostel: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        dept: {
            type: String,
            required: true
        },
        ownPosts: {
            type: [PostSchema]
        },
        likedPosts: {
            type: [PostSchema]
        },
        comments: {
            type: [CommentSchema]
        },
        bookmarks: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next: NextFunction) {
    let user = this as IUser;
    if (!user.isModified('password')) {
        return next;
    }

    const salt = await bcrypt.genSalt(config.saltWorkFactor);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
    const user = this as IUser;
    return bcrypt.compare(candidatePassword, user.password).catch((error) => false);
};

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
