import NextLink from 'next/link';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';

import { ShopLayout } from '../../components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout title='Order Summary 123456' pageDescription='Summary of the order 123456' >
        <Typography variant='h1' component='h1'>Order: 123456</Typography>


        {/* <Chip 
            sx={{ my:2 }}
            label='Order Status: Pending'
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined />}
        /> */}

        <Chip 
            sx={{ my:2 }}
            label='Order Status: Paid'
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined />}
        />  

        <Grid container sx={{ mt:3 }}>
            <Grid item xs={12} sm={7}>

                {/* Cart List */}
                <CartList />

            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' component='h2'>Summary (3 products)</Typography>
                        <Divider sx={{ my: 1 }} />


                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery Address</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>
                                    Edit
                                </Link>
                            </NextLink>
                        </Box>

                        {/* <Box display='flex' flexDirection='column' alignItems='start'> */}
                        <Typography>Nicolas Huerta</Typography>
                        <Typography>Sazie 2128</Typography>
                        <Typography>Santiago, 832400</Typography>
                        <Typography>Chile</Typography>
                        <Typography>+569 92181355</Typography>
                        {/* </Box> */}
                        <Divider sx={{ my:1 }}></Divider>
                        

                        {/* Order Summary */}
                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>
                                    Edit
                                </Link>
                            </NextLink>
                        </Box>
                        <OrderSummary />
                        

                        <Box sx={{ mt: 3 }}>
                            {/* TODO */}
                            <h1>Pay</h1>

                            <Chip 
                                sx={{ my:2 }}
                                label='Order Status: Paid'
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined />}
                            /> 
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default OrderPage;