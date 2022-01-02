import { NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import IUser, { AuthToken } from '../interfaces/user';
import bcrypt from 'bcrypt';
import config from '../config/config';
import CommentSchema from '../schema/comment.schema';
import PostSchema from '../schema/post.schema';
import crypto from 'crypto';

// const Hostels: string[] = ['Kailash', 'Himadri', 'Kumaon', 'Girnar', 'Zanskar', 'Vindhyachal', 'Udaigiri', 'Satpura', 'Aravali', 'Nilgiri', 'Jwalamukhi', 'Karakoram', 'Shivalik'];

const UserSchema: Schema = new Schema<IUser>(
    {
        uid: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            trim: true,
            minlength: 3
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        username: {
            type: String,
            unique: true,
            minlength: 3,
            maxlength: 20
        },
        year: {
            type: Number
        },
        department: {
            type: String,
            enum: ['AM1', 'BB1', 'CE1', 'CH1', 'CH7', 'CS1', 'CS5', 'EE1', 'EE3', 'ES1', 'MS1', 'ME1', 'ME2', 'MT1', 'MT6', 'PH1', 'TT1']
        },
        hostel: {
            type: String,
            enum: ['Kailash', 'Himadri', 'Kumaon', 'Girnar', 'Zanskar', 'Vindhyachal', 'Udaigiri', 'Satpura', 'Aravali', 'Nilgiri', 'Jwalamukhi', 'Karakoram', 'Shivalik']
        },
        passwordResetExpires: String,
        passwordResetToken: String,
        ownPosts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post'
            }
        ],
        likedPosts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post'
            }
        ],
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        bookmarks: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post'
            }
        ],
        tokens: Array
    },
    {
        timestamps: true
    }
);

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

//Password Hash MiddleWare
UserSchema.pre('save', function save(next: NextFunction) {
    let user = this as IUser;
    if (!user.isModified('password')) {
        return next;
    }

    bcrypt.genSalt(config.saltWorkFactor, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err: mongoose.Error | undefined, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error | undefined, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

UserSchema.methods.comparePassword = comparePassword;

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
