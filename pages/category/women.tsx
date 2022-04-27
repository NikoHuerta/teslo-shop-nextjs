import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';



const WomenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=women');

    return (
        <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Find the best Teslo products here -- Women'}>
            <Typography variant='h1' component='h1'>Women</Typography>
            <Typography variant='h2' sx={{ marginBottom: 1 }}>Products for her</Typography>
        

        {
            isLoading 
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }

        </ShopLayout>

    )
}
    
    export default WomenPage;