import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    ok: boolean;
    data: {
        numberOfOrders: number;
        paidOrders: number;
        unPaidOrders: number;
        numberofClients: number;
        numberofProducts: number;
        noStockProducts: number;
        lowStockProducts: number;

    } | string;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method){
        case 'GET':
            return getDashboardData(req, res);
        
        default:
            res.status(400).json({ ok: false, data: 'Bad Request' });
    }
}

const getDashboardData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // return res.status(200).json({ ok: true, data: 'method building in progress' });

    try {

        await db.connect();
        // const numberOfOrders = await Order.countDocuments();
        // const paidOrders = await Order.countDocuments({ isPaid: true });
        // const unPaidOrders = await Order.countDocuments({ isPaid: false });
        // const numberofClients = await User.countDocuments({ role: 'client' });
        // const numberofProducts = await Product.countDocuments();
        // const noStockProducts = await Product.countDocuments({ inStock: 0 });
        // const lowStockProducts = await Product.countDocuments({ inStock: { $lte: 10 } });

        const [numberOfOrders, paidOrders, unPaidOrders, numberofClients, numberofProducts, noStockProducts, lowStockProducts] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ isPaid: true }),
            Order.countDocuments({ isPaid: false }),
            User.countDocuments({ role: 'client' }),
            Product.countDocuments(),
            Product.countDocuments({ inStock: 0 }),
            Product.countDocuments({ inStock: { $lte: 10 } })
        ]);

        await db.disconnect();

        return res.status(200).json({ ok: true, data: {
            numberOfOrders,
            paidOrders,
            unPaidOrders,
            numberofClients,
            numberofProducts,
            noStockProducts,
            lowStockProducts,
        } });

    } catch ( e ) {
        console.log(e);
        return res.status(500).json({ ok: false, data: 'Error getting data from mongoose' });
    }



    


    
}
