import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { Product } from '../../models';

type Data = {
    ok: boolean;
    message: string;
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if(process.env.NODE_ENV === 'production')
        return res.status(403).json({ ok: false, message: 'Forbidden' });

    try {
        await db.connect();

        await Product.deleteMany();
        await Product.insertMany(seedDatabase.initialData.products);

        await db.disconnect();
    } catch(e: any){
        console.error(e);
        return res.status(500).json({ ok: false, message: 'Error creating seed' });
    }
    
    return res.status(200).json({ ok: true, message: 'Process done' });
}