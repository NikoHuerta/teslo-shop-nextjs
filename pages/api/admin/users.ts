import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data = {
    ok: boolean,
    message?: string,
    users?: IUser[],
    user?: IUser,
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ){
        case 'GET':
            return getUsers( req, res );
        
        case 'PUT':
            return updateUser( req, res );
        
        default:
            return res.status(400).json({ ok: false, message: 'Bad Request' });
    }


}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json({ ok: true, users });
}


const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', role = '' } = req.body;

    if( !isValidObjectId(userId) ){
        return res.status(400).json({ ok: false, message: 'Invalid User ID' });
    }

    const validRoles = ['admin', 'SEO', 'super-user', 'client'];
    if( !validRoles.includes( role ) ) {
        return res.status(400).json({ ok: false, message: 'Invalid Role, valids: ' + validRoles.join(', ')  });
    }

    await db.connect();

    const user = await User.findById(userId).select('-password');

    if( !user ){
        return res.status(404).json({ ok: false, message: 'User not found ' + userId });
    }

    user.role = role;
    await user.save();
    await db.disconnect();

    return res.status(200).json({ ok: true, user });
}

