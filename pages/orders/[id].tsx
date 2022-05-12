import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


interface Props {
    order: IOrder;
}


const OrderPage: NextPage<Props> = ({ order }) => {

    const { _id='', user='', orderItems, shippingAddress, billingAddress, paymentResult='', numberOfItems, subTotal, tax, total, isPaid, paidAt='' } = order;

  return (
    <ShopLayout title='Order Summary 123456' pageDescription='Summary of the order 123456' >
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


          

        <Grid container sx={{ mt:3 }}>
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
                                    <h1>Pay</h1>
                                )
                            }

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

    return {
        props: {
            order
        }
    }
}


export default OrderPage;