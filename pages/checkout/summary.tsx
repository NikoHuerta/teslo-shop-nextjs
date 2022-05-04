import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

type addressData = {
    firstName:  string;
    lastName:   string;
    address:    string;
    address2?:  string;
    zipCode:    string;
    city:       string;
    country:    string;
    phone:      string;
}

const SummaryPage = () => {

    const { firstName, lastName, address, address2 = undefined , city, zipCode, country, phone  }: addressData = JSON.parse(Cookies.get('addressData') || '');


  return (
    <ShopLayout title='Order Summary' pageDescription='Summary of the order'>
        <Typography variant='h1' component='h1'>Order Summary</Typography>

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
                        <Typography>{ firstName } {lastName}</Typography>
                        <Typography>{ address }</Typography>
                        { 
                            address2 &&
                                <Typography>{ address2 }</Typography>
                        }
                        <Typography>{ city }, {zipCode}</Typography>
                        <Typography>{ country }</Typography>
                        <Typography>{ phone }</Typography>
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
                            <Button color='secondary' className='circular-btn' fullWidth>
                                Confirm Order
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;