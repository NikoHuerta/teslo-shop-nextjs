import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = {
    ok: boolean;
    message?: string;
    products?: IProduct[];
    product?: IProduct;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'GET':
            return getProducts( req, res );
        
        case 'PUT':
            return updateProduct( req, res );
        
        default:
            return res.status(400).json({ ok: false, message: 'Bad Request' });
    }
    
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    await db.disconnect();

    //TODO:
    // Tendremos que actualizar las imagenes de los productos

    return res.status(200).json({ ok: true, products });

}

const updateProduct = (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    throw new Error('Function not implemented.');

}

