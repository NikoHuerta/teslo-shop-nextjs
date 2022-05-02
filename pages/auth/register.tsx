import { useRef, useState } from 'react';
import NextLink from 'next/link';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline, LoopOutlined } from '@mui/icons-material';

import { validations } from '../../utils';
import { AuthLayout } from '../../components/layouts';
import { tesloAPI } from '../../api';


type FormData = {
    fullName: string;
    email: string;
    password: string;
    password2: string;
}


const RegisterScreen = () => {

    const [showError, setShowError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

    const passwordRef = useRef({});
    passwordRef.current = watch('password', '');


    const onRegisterForm = async ({ fullName, email, password }: FormData) => {
        
        setShowError(false);
        setIsFetching(true);

        try{
            const { data } = await tesloAPI.post('/user/register', { name: fullName, email, password });
            const { token, user }  = data;
            console.log({token, user});
            
        }catch( error ){
            setShowError(true);
            console.log(error);

        }finally{
            setIsFetching(false);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }

        //TODO: navigate to previous page or home
    }


    return (
        <AuthLayout title={'Register Page'}>
            <form onSubmit={ handleSubmit( onRegisterForm ) } noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Register Account</Typography>
                        <Chip label='Error creating user account'
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Full Name' 
                            variant='filled' 
                            fullWidth
                            {...register('fullName', {
                                required: 'Full Name is required',
                                minLength: { value: 3, message: 'Full Name must be at least 3 characters' },
                            })}
                            error={ !! errors.fullName }
                            helperText={ errors.fullName?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type='email' 
                            label='Email' 
                            variant='filled' 
                            fullWidth 
                            {...register('email', {
                                required: 'Email is required',
                                validate: validations.isEmail
                            })}
                            error={ !! errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type='password' 
                            label='Password' 
                            variant='filled' 
                            fullWidth 
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                            error={ !! errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type='password' 
                            label='Confirm Password' 
                            variant='filled' 
                            fullWidth
                            {...register('password2', {
                                required: 'Confirm Password is required',
                                validate: (val) => val === passwordRef.current || 'Passwords do not match'
                            })}
                            error={ !! errors.password2 }
                            helperText={ errors.password2?.message }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            type='submit'
                            color='secondary' 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            disabled={ isFetching }
                        >
                            { 
                            
                                !isFetching 
                                    ? 'Register' 
                                    : ( 
                                        <LoopOutlined 
                                            sx={{
                                                animation: 'spin 2s linear infinite',
                                                '@keyframes spin': {
                                                    '0%': { transform: 'rotate(360deg)' },
                                                    '100%': { transform: 'rotate(0deg)' },
                                                }    
                                            }}
                                        /> 
                                    ) 
                            }
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href='/auth/login' passHref>
                            <Link>
                                <Typography variant='body2' color='textSecondary' sx={{ textDecoration: 'underline' }}>Already have an account? Login Here</Typography>
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterScreen