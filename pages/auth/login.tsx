import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, getProviders, signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import { ErrorOutline, LoopOutlined } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';


import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const router = useRouter();
    const destination = router.query.p?.toString() || '/';
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    
    const [showError, setShowError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [providers, setProviders] = useState<any>({  });

    useEffect(() => {
      getProviders().then(( prov ) => {
        // console.log(prov);
        setProviders(prov);
      });
    }, []);
    

    
    
    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false);
        setIsFetching(true);

        const loginData: any = await signIn('credentials', { redirect: false, email, password });
        setIsFetching(false);
        // console.log(loginData);

        if(loginData.error!){
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
            return;
        }
        router.replace( destination );
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
                            <NextLink href={`/auth/register?p=${ destination }`} passHref>
                                <Link>
                                    <Typography variant='body2' color='textSecondary' sx={{ textDecoration: 'underline' }}>Register Here</Typography>
                                </Link>
                            </NextLink>
                        </Grid>

                        {/* Providers */}
                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                Object.values( providers ).map( (provider: any) => {
                                    if( provider.id === 'credentials' ) return;
                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                                            onClick={ () => signIn( provider.id ) }
                                        >   
                                            
                                            { provider.id === 'github' 
                                                ?  <GitHubIcon />
                                                : provider.id === 'facebook' 
                                                    ? <FacebookIcon />
                                                    : provider.id === 'google' ?
                                                        <GoogleIcon />
                                                        : null
                                            }
                                            <Typography variant='body2' color='primary' sx={{ ml: 5 }}>{ provider.name }</Typography>
                                            
                                        </Button>
                                    )
                                })
                            }
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

export default LoginPage;