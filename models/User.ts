import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not a valid role',
            default: 'user',
            required: true,
        }
    }
},
{
    timestamps: true
});


const User:Model<IUser> = mongoose.models.User || model('User', userSchema);