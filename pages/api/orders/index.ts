import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { IOrder } from '../../../interfaces';
import { Product, Order } from '../../../models';
import { db } from '../../../database';

type Data = {
    ok: boolean;
    message?: string;
    order?: IOrder;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method){
        case 'POST':
            createOrder(req, res);
            break;
        
        default:
            res.status(400).json({ ok: false, message: 'Bad Request' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { orderItems, total } = req.body as IOrder;

    // Verificar la session de usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ ok: false, message: 'Unauthorized, please sign in.' });
    }

    //Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );
    await db.connect();

    //Obtener los productos que la persona quiere desde la DB
    const dbProducts = await Product.find( { _id: { $in: productsIds } } );
    
    try {

        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find( product => product.id === current._id)!.price;
            if ( !currentPrice ){
                // Si el producto no existe en la base de datos, no se puede crear el pedido
                throw new Error('Verify the cart integrity, some products does not exists.');
            }
            
            return (currentPrice * current.quantity) + prev
        }, 0);
        
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal + (subTotal * taxRate);

        if ( backendTotal !== total ){
            console.log({backendTotal}, {total});

            throw new Error('The total does not match with the prices.');
        }

        //Todo bien hasta el momento, se puede crear el pedido
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId});
        //siempre se va a tener 2 decimales
        newOrder.total = Math.round(newOrder.total * 100) / 100;

        await newOrder.save();
        await db.disconnect();

        return res.status(201).json({ ok: true, message: 'Order created successfully.', order: newOrder });

    } catch ( error: any ){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ ok: false, message: error.message || 'Error creating order, check server logs.' });
    }
}
