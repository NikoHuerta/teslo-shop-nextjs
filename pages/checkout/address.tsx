import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries } from '../../utils';
import { CartContext } from '../../context';
// import { GetServerSideProps } from 'next'
// import { jwt } from '../../utils';

type FormData = {
    firstName:  string;
    lastName:   string;
    address:    string;
    address2?:  string;
    zipCode:    string;
    city:       string;
    country:    string;
    phone:      string;
}

const addressInitialData = {
    firstName   : '',
    lastName    : '',
    address     : '',
    address2    : undefined,
    zipCode     : '',
    city        : '',
    country     : countries[0].code,
    phone       : '',  
}


const getAddressFromCookies = ():FormData => {
    return JSON.parse(Cookies.get('addressData') || JSON.stringify( addressInitialData ));

}

const AddressPage = () => {

    const router = useRouter();
    const { updateShippingAddress } = useContext( CartContext );
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });
    const [defaultCountry, setDefaultCountry] = useState('');


    useEffect(() => {
        const addressFromCookies = getAddressFromCookies();
        reset(getAddressFromCookies());
        setDefaultCountry(addressFromCookies.country);
    }, [ reset ]);


    const onAddressSubmit = ( data: FormData ) =>{
        updateShippingAddress( data );
        router.push('/checkout/summary');
    }

    return (
    <ShopLayout title='Delivery Address' pageDescription='Confirm the delivery address'>
        <Typography variant='h1' component='h1'>Address</Typography>
        <form onSubmit={ handleSubmit( onAddressSubmit ) } noValidate >
            <Grid container spacing={2} sx={{ mt:5 }}>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Name' 
                        variant='filled' 
                        fullWidth
                        {...register('firstName', {
                            required: 'Name is required',
                        })} 
                        error={ !! errors.firstName } 
                        helperText={ errors.firstName?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Lastname' 
                        variant='filled' 
                        fullWidth
                        {...register('lastName', {
                            required: 'Lastname is required',
                        })} 
                        error={ !! errors.lastName } 
                        helperText={ errors.lastName?.message } 
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Address' 
                        variant='filled' 
                        fullWidth 
                        {...register('address', {
                            required: 'Address is required',
                        })} 
                        error={ !! errors.address } 
                        helperText={ errors.address?.message } 
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Address 2 (optional)' 
                        variant='filled' 
                        fullWidth 
                        {...register('address2')} 
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Postal Code' 
                        variant='filled' 
                        fullWidth 
                        {...register('zipCode', {
                            required: 'Postal Code is required',
                        })} 
                        error={ !! errors.zipCode } 
                        helperText={ errors.zipCode?.message } 
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='City' 
                        variant='filled' 
                        fullWidth
                        {...register('city', {
                            required: 'City is required',
                        })} 
                        error={ !! errors.city } 
                        helperText={ errors.city?.message }  
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        {
                            !!defaultCountry && (
                                <TextField
                                    select
                                    variant='filled'
                                    fullWidth
                                    label='Country'
                                    defaultValue={ defaultCountry }
                                    // defaultValue={ countries[0].code }
                                    {...register('country', {
                                        required: 'Country is required',
                                    })}
                                    error={ !! errors.country }
                                    // helperText={ errors.country?.message }
                                >
                                {
                                    countries.map( (country, index) => (
                                        <MenuItem 
                                            key={ country.code } 
                                            value={ country.code }
                                            
                                        >{ country.name }
                                        </MenuItem>
                                    ))
                                }
                                </TextField>
                            )
                        }
                        
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label='Telephone' 
                        variant='filled' 
                        fullWidth
                        {...register('phone', {
                            required: 'Telephone is required',
                        })} 
                        error={ !! errors.phone } 
                        helperText={ errors.phone?.message }   
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                <Button 
                    type='submit'
                    color='secondary' 
                    className='circular-btn' 
                    size='large'
                >
                    Check order
                </Button>
            </Box>
        </form>
    </ShopLayout>
  )
}

// // You should use getServerSideProps when:
// // - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken( token );
//         isValidToken = true;
//     } catch (e){
//         isValidToken = false;
//     }

//     if ( !isValidToken ){
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }

//     return {
//         props: {
            
//         }
//     }
// }

export default AddressPage;