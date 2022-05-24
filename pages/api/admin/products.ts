import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

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

        case 'POST':
            return createProduct( req, res );
        
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

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [], tags = []  } = req.body as IProduct;

    if(!isValidObjectId(_id))
        return res.status(400).json({ ok: false, message: 'Invalid Product ID' });
    
    if(images.length < 2)
        return res.status(400).json({ ok: false, message: 'At least 2 images are required' });
    
    //TODO: posiblemente tendremos un localhost:3000/products/asdasda.jpg

    try{
        await db.connect();
        const product = await Product.findById(_id);
        
        if( !product ){
            await db.disconnect();
            return res.status(400).json({ ok: false, message: 'Product ID not found' });
        }

        //TODO: eliminar fotos en Cloudinary

        // await product.update( req.body );
        req.body.tags = tags.sort();
        const updatedProduct = await Product.findByIdAndUpdate( _id, req.body, { runValidators: true, new: true } );
        await db.disconnect();

        return res.status(200).json({ ok: true, product: updatedProduct as IProduct });

    } catch ( error: any ){
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ ok: false, message: 'Error updating product, check server side log' });
    }



}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images=[], tags = []  } = req.body as IProduct;

    if( images.length < 2 )
        return res.status(400).json({ ok: false, message: 'At least 2 images are required' });
    
    //TODO: posiblemente tendremos un localhost:3000/products/asdasda.jpg

    try { 

        await db.connect();

        const productInDb = await Product.findOne({ slug: req.body.slug });
        if( productInDb ){
            await db.disconnect();
            return res.status(400).json({ ok: false, message: 'A Product with that slug already exists' });
        }
         
        req.body.tags = tags.sort();

        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        res.status(200).json({ ok: true, product });
        
     } catch ( error: any ){
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ ok: false, message: 'Error creating product, check server side log' });
    }
}

