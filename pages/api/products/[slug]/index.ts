import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../../interfaces';
import { Product } from '../../../../models';
import { db } from '../../../../database';


type Data = {
    ok: boolean;
    message: string;
    product?: IProduct;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method) {
        case 'GET':
            return getProductBySlug(req, res);
        
        default:
            return res.status(400).json({ ok: false, message: 'Bad Request' });
    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { slug } = req.query;
    try{
        await db.connect();
        const product = await Product.findOne({ slug }).lean();
        await db.disconnect();

        if(!product){
            return res.status(404).json({ ok: false, message: 'Product not found' });
        }
        return res.status(200).json({ ok: true, message: 'Process done', product });

    }catch(e: any){
        await db.disconnect();
        return res.status(500).json({ ok: false, message: 'Error getting product' });
    }
    
}
