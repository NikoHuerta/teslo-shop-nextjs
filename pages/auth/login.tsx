import { useState } from 'react';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { tesloAPI } from '../../api';
import { ErrorOutline, LoopOutlined } from '@mui/icons-material';

type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const [showError, setShowError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false);
        setIsFetching(true);

        try{
            const { data } = await tesloAPI.post('/user/login', { email, password });
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
        <AuthLayout title={'Login Page'}>
            <form onSubmit={ handleSubmit( onLoginUser ) } noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Login</Typography>
                            <Chip label='User / Password incorrect'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                type='email'
                                label='Email' 
                                variant='filled' 
                                fullWidth 
                                {...register("email", { 
                                    required: 'Email is required',
                                    // validate: ( val ) => validations.isEmail( val )
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
                                {...register("password", { 
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                                })} 
                                error={ !! errors.password } 
                                helperText={ errors.password?.message }
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
                                    ? 'Login'
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
                            <NextLink href='/auth/register' passHref>
                                <Link>
                                    <Typography variant='body2' color='textSecondary' sx={{ textDecoration: 'underline' }}>Register Here</Typography>
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;