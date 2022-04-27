import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../../interfaces';
import { Product } from '../../../../models';
import { db } from '../../../../database';


type Data = {
    ok: boolean;
    message: string;
    products?: IProduct[];
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method) {
        case 'GET':
            return searchProducts(req, res);
        
        default:
            return res.status(400).json({ ok: false, message: 'Bad Request' });
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    let { query = '' } = req.query;

    if( query.length === 0 ){
        return res.status(400).json({ ok: false, message: 'Bad Request' });
    }

    query = query.toString().toLowerCase();

    try{

        await db.connect();
        // const regex = new RegExp(query as string, 'i');
        const products = await Product.find({
            // $or: [{ title: regex }, { tags: { $in : [regex] } }]
            $text: { $search: query }
            }).lean();
        await db.disconnect();

        if(products.length === 0){
            return res.status(404).json({ ok: true, message: 'Products not found' });
        }
        return res.status(200).json({ ok: true, message: 'Process done', products });


    }catch(e: any){

        await db.disconnect();
        return res.status(500).json({ ok: false, message: 'Error getting product' });
    }
}
