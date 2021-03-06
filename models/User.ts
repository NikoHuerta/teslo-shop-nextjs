import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    origin: { type: String, required: false, default: 'web' },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client', 'SEO', 'super-user'],
            message: '{VALUE} is not a valid role',
            default: 'client',
            required: true,
        }
    }
},
{
    timestamps: true
});


const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;