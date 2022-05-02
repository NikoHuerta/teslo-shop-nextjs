import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = {
    ok: boolean;
    message: string;
    token?: string;
    user?: any;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    // res.status(200).json({ name: 'Example' })

    switch( req.method ) {

        case 'POST':
            return loginUser(req, res);

        default:
            return res.status(405).json({ ok: false, message: 'Bad request' });
    }


}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>)  => {
    // console.log('Function not implemented.', req, res);

    const { email= '', password= '' } = req.body;
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if( !user ) {
        return res.status(400).json({ ok: false, message: 'Invalid user or password -- email' });
    }

    if( ! bcrypt.compareSync( password, user.password! ) ) {
        return res.status(400).json({ ok: false, message: 'Invalid user or password -- password' });
    }

    const { role, name, _id } = user;
    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        ok: true,
        message: 'User logged successfully',
        token,
        user: {
            name, email, role 
        }
    });
}
