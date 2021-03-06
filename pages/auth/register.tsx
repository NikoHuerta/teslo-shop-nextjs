import { useContext, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline, LoopOutlined } from '@mui/icons-material';

import { AuthContext } from '../../context';
import { validations } from '../../utils';
import { AuthLayout } from '../../components/layouts';


type FormData = {
    fullName: string;
    email: string;
    password: string;
    password2: string;
}


const RegisterScreen = () => {

    const router = useRouter();
    const { registerUser } = useContext( AuthContext );

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

    const passwordRef = useRef({});
    passwordRef.current = watch('password', '');

    const destination = router.query.p?.toString() || '/';


    const onRegisterForm = async ({ fullName, email, password }: FormData) => {
        
        setShowError(false);
        setIsFetching(true);

        const { hasError, message ='' } = await registerUser(fullName, email, password);
        setIsFetching(false);

        if( hasError ){
            setShowError(true);
            setErrorMessage( message );
            setTimeout(() => setShowError(false) , 3000);
            return;
        }

        await signIn('credentials', { email, password });

        //TODO: navigate to previous page or home
        // router.replace( destination ); //home
        
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
                        <NextLink href={`/auth/login?p=${ destination }`} passHref>
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

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    const { p = '/' } = query;

    if( session ){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: { }
    }
}

export default RegisterScreen