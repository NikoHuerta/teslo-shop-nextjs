import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import { CartList, OrderSummary } from '../../components/cart';
import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts';
import { ShippingAddress } from '../../interfaces';
import  { countries } from '../../utils';


const SummaryPage = () => {

    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder, cleanCart } = useContext( CartContext );

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // console.log(shippingAddress);

    useEffect(() => {
        if( !Cookies.get('addressData') ){
            router.push('/checkout/address');
        }
    }, [router]);

    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message }  = await createOrder(); 
        
        if( hasError ){
            setIsPosting(false);
            setErrorMessage( message );
            return;
            
        } else {
            router.replace(`/orders/${ message }`);
            cleanCart();
        }
    }
    


    if( !shippingAddress ){
        return <></>;
    }
    const { firstName, lastName, address, address2 = undefined , city, zipCode, country, phone }: ShippingAddress = shippingAddress!;

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
                        <Typography variant='h2' component='h2'>Summary ( { numberOfItems } { numberOfItems === 1 ? 'product' : 'products' } )</Typography>
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
                        <Typography>{ countries.find( ({ code: valCode }) => valCode === country  )?.name   }</Typography>
                        {/* <Typography>{ country }</Typography> */}
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
                        

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth
                                onClick={ onCreateOrder }
                                disabled={ isPosting }
                            >
                                Confirm Order
                            </Button>

                            <Chip 
                                color='error'
                                label={ errorMessage }
                                sx={{ mt: 2 , display: errorMessage ? 'flex' : 'none' }}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;