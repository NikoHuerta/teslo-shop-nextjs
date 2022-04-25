import NextLink from 'next/link';

import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';

const EmptyPage = () => {
  return (
    <ShopLayout title='Empty Cart' pageDescription='There is no articles in the shopping cart'>
        <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center'
            height='calc(100vh-200px)' 
            sx={{ paddingTop: 20, flexDirection: { xs: 'column', sm: 'row' } }}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }}/>
            <Box 
                display='flex' 
                flexDirection='column' 
                alignItems='center'
            >
                <Typography>Your shopping cart is empty</Typography>
                <NextLink href='/' passHref>
                    <Link typography='h4' color='secondary'>
                        Go to shop
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage;