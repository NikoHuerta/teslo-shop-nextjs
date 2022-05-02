import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data = {
    ok: boolean;
    message: string;
    token?: string;
    user?: any;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method){
        case 'POST':
            return registerUser(req, res);

        default:
            return res.status(405).json({ ok:false, message: 'Bad request' });
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { name = '', email = '', password = ''} = req.body as { name: string, email: string, password: string };

    if( name.length < 3 ) {
        return res.status(400).json({ ok: false, message: 'Name must be at least 3 characters long' });
    }

    if( password.length < 6 ) {
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
    }

    // console.log(validations.isValidEmail( email )); // true - false
    // console.log(validations.isEmail( email )); // undefined - 'Email is not valid'

    if( !validations.isValidEmail( email ) ){
        return res.status(400).json({ ok: false, message: 'Email is not valid' });
    }

    await db.connect();

    const user = await User.findOne({ email });
    if( user ){
        await db.disconnect();
        return res.status(400).json({ ok: false, message: 'Email already exists' });
    }

    const newUser = new User({
        name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ),
        role: 'client'
    });

    // await db.connect();

    try{
        await newUser.save();
        await db.disconnect();

    } catch ( e ) {
        console.error(e);
        await db.disconnect();
        return res.status(500).json({ ok: false, message: 'Something went wrong, check server log...' });
    }

    const { _id, email: userEmail, role } = newUser;

    const token = jwt.signToken(_id, userEmail);

    return res.status(200).json({
        ok: true,
        message: 'User created successfully',
        token,
        user: {
            name, 
            userEmail, 
            role 
        }
    });
}
