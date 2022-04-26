import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts';

const RegisterScreen = () => {
    return (
        <AuthLayout title={'Register Page'}>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Register Account</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label='Full Name' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Email' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Password' variant='filled' type='password' fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Confirm Password' variant='filled' type='password' fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <Button color='secondary' className='circular-btn' size='large' fullWidth>
                            Register
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
        </AuthLayout>
    )
}

export default RegisterScreen