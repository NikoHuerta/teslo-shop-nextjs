import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    ok: boolean;
    message?: string;
    orders?: IOrder[];
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'GET':
            return getOrders( req, res );
        
        case 'PUT':
            return updateOrders( req, res );
        
        default:
            return res.status(400).json({ ok: false, message: 'Bad Request' });
    }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .populate('user', 'name email -_id')
        .populate('orderItems', 'title price description -_id')
        .lean();

    await db.disconnect();

    return res.status(200).json({ ok: true, orders });
}

const updateOrders = (req: NextApiRequest, res: NextApiResponse<Data>) => {

    return res.status(400).json({ ok: false, message: 'Bad Request' });
}

