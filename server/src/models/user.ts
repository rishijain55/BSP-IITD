import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

const Hostels: string[] = ['Kailash', 'Himadri', 'Kumaon', 'Girnar', 'Zanskar', 'Vindhyachal', 'Udaigiri', 'Satpura', 'Aravali', 'Nilgiri', 'Jwalamukhi', 'Karakoram', 'Shivalik'];

const UserSchema: Schema = new Schema(
    {
        uid: { type: String, unique: true },
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
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
