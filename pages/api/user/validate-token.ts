import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data = {
    ok: boolean;
    message: string;
    token?: string;
    user?: any;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {

        case 'POST':
            return checkJWT(req, res);

        default:
            return res.status(405).json({ ok: false, message: 'Bad request' });
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { token = '' } = req.cookies;
    let userId = '';

    try{
        userId = await jwt.isValidToken(token);
    } catch ( e ) {
        return res.status(400).json({ ok: false, message: 'Invalid JWT' });
    }

    await db.connect();
    const user = await User.findById( userId ).lean();
    await db.disconnect();

    if( !user ){
        return res.status(400).json({ ok: false, message: 'User not found' });
    }

    const { _id, email, name, role } = user;

    return res.status(200).json({
        ok: true,
        message: 'Revalidated JWT',
        token: jwt.signToken(_id, email),
        user: {
            name, 
            email, 
            role 
        }
    });



    
}
