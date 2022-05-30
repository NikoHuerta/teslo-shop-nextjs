import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { PayPalButtons } from "@paypal/react-paypal-js";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartContext } from '../../context';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloAPI } from '../../api';


interface Props {
    order: IOrder;
    refererPage: string;
}

interface OrderResponseBody {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
}


const OrderPage: NextPage<Props> = ({ order, refererPage }) => {

    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false);
    const { cleanCart } = useContext( CartContext );
    const { _id='', user='', orderItems, shippingAddress, billingAddress, paymentResult='', numberOfItems, subTotal, tax, total, isPaid, paidAt='' } = order;

    
    useEffect(() => {
        if(refererPage === 'summary')
            cleanCart();
    }, [ cleanCart, refererPage ]);
    
    const onOrderCompleted = async ( details: OrderResponseBody ) => {
        
        if( details.status !== 'COMPLETED' ){
            return alert('NO HAY PAGO EN PAYPAL');
        }

        setIsPaying(true);

        try {

            const { data } = await tesloAPI.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: _id,
            });

            // console.log(data);
            router.reload();


        } catch (e: any) {
            setIsPaying(false);
            console.log( e );
            alert(`Error: ${ e }`);
        }

    };

  return (
    <ShopLayout title={`Order Summary ${ _id }`} pageDescription={`Summary of the order ${ _id }`} >
        <Typography variant='h1' component='h1'>Order: { _id }</Typography>

        {
            isPaid ?
            (
                <Chip 
                    sx={{ my:2 }}
                    label='Order Status: Paid'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlined />}
                />
            )
            :
            (
                <Chip 
                    sx={{ my:2 }}
                    label='Order Status: Pending'
                    variant='outlined'
                    color='error'
                    icon={<CreditCardOffOutlined />}
                />
            )
        }

        <Grid container sx={{ mt:3 }} className='fadeIn'>
            <Grid item xs={12} sm={7}>

                {/* Cart List */}
                <CartList products={ orderItems } />

            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' component='h2'>Summary ({ numberOfItems } { numberOfItems===1 ? 'product' : 'products' })</Typography>
                        <Divider sx={{ my: 1 }} />


                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery Address</Typography>
                        </Box>

                        {/* <Box display='flex' flexDirection='column' alignItems='start'> */}
                        <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                        <Typography>{ shippingAddress.address }</Typography>
                        {
                            shippingAddress.address2 ?
                            ( <Typography>{ shippingAddress.address2 }</Typography> ) 
                            : ''
                        }
                        <Typography>{ shippingAddress.city }, { shippingAddress.zipCode }</Typography>

                        
                        <Typography>{ shippingAddress.country }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>
                        {/* </Box> */}
                        <Divider sx={{ my:1 }}></Divider>
                        

                        {/* Order Summary */}
                        <OrderSummary 
                            orderData={ {
                                numberOfItems,
                                subTotal,
                                total,
                                tax,
                            }}
                        />
                        

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                            <Box 
                                display='flex' 
                                justifyContent='center' 
                                className='fadeIn'
                                sx={{ display: isPaying ? 'flex' : 'none' }}
                            >
                                <CircularProgress /> 
                            </Box>

                            

                            <Box
                                display='flex' 
                                justifyContent='center' 
                                className='fadeIn'
                                flexDirection='column'
                                sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                            >
                                {
                                    isPaid ? 
                                    (
                                        <Chip 
                                            sx={{ my:2 }}
                                            label='Order Status: Paid'
                                            variant='outlined'
                                            color='success'
                                            icon={<CreditScoreOutlined />}
                                        />
                                    ) 
                                    : 
                                    (
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${ order.total }`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted(details);
                                                    // console.log({ details });
                                                    // const name = details.payer.name!.given_name;
                                                    
                                                });
                                            }}
                                        />
                                    )
                                }
                            </Box>
                            
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query;
    const session: any = await getSession({ req });
    // console.log(req.headers.referer);
    const refererPage = req.headers.referer?.substring( req.headers.referer?.lastIndexOf('/') + 1 );


    if( !session ){
        return {
            redirect: {
                destination: `/auth/login/?p=orders/${ id }`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() );
    if( !order ){
        //order not found
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }
    if( order.user !== session.user._id ){
        //usuario tiene que ser el mismo que el de la orden
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }
    //todo bien
    return {
        props: {
            order,
            refererPage
        }
    }
}


export default OrderPage;