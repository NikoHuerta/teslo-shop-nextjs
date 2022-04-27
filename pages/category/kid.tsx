import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';



const KidPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kid');

    return (
        <ShopLayout title={'Teslo-Shop - Kids'} pageDescription={'Find the best Teslo products here -- Kids'}>
            <Typography variant='h1' component='h1'>Kids</Typography>
            <Typography variant='h2' sx={{ marginBottom: 1 }}>Products for kids</Typography>
        

        {
            isLoading 
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }

        </ShopLayout>

    )
}
    
    export default KidPage;