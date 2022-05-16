import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import axios from 'axios';
import { isValidObjectId } from 'mongoose';

import { db } from '../../../database';
import { Order } from '../../../models';
import { IPaypal } from '../../../interfaces';

type Data = {
    ok: boolean;
    message: string;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return payOrder( req, res );
        default: 
            return res.status(400).json({ok: false, message: 'Method not allowed' });
    }
}


const getPaypalBearerToken = async ():Promise<string|null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {

        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`, 
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch ( error ){

        if ( axios.isAxiosError( error ) ){
            console.log( error.response?.data );
        } else {
            console.log( error );
        }
        
        return null;
    }

}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    // Verificar la session de usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ ok: false, message: 'Unauthorized, please sign in.' });
    }

    // Obtener Bearer Token de paypal
    const paypalBearerToken = await getPaypalBearerToken();
    
    if( !paypalBearerToken ){
        return res.status(400).json({ ok: false, message: 'Error getting paypal bearer token' });
    }

    // Obtener datos de body
    const { transactionId='', orderId='' } = req.body;

    if( !isValidObjectId( orderId ) ){
        return res.status(400).json({ ok: false, message: 'Invalid order id' });
    }

    try {

        //obtener response de paypal api
        const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }` || '', { 
            headers: {
                'Authorization': `Bearer ${ paypalBearerToken }`
            }
        });


        if (data.status !== 'COMPLETED') {
            return res.status(400).json({ ok: false, message: 'Order not completed' });
        }
        
        await db.connect();
        const dbOrder = await Order.findById( orderId );
    
        if( !dbOrder ){
            await db.disconnect();
            return res.status(400).json({ ok: false, message: 'Order not found' });
        }
    
        if( dbOrder.total !== Number( data.purchase_units[0].amount.value ) ){
            await db.disconnect();
            return res.status(400).json({ ok: false, message: 'Order total and Paypal total, does not match' });
        }
    
        dbOrder.transactionId = data.id;
        dbOrder.isPaid = true;
        await dbOrder.save();
    
        await db.disconnect();
        return res.status(200).json({ ok: true, message: 'Order Paid' });


    } catch ( error: any ){
        return res.status(400).json({ ok: false, message: 'transactionId not found' });
    }
}
