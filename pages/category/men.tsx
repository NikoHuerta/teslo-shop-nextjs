import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';



const MenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=men');

    return (
        <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Find the best Teslo products here -- Men'}>
            <Typography variant='h1' component='h1'>Men</Typography>
            <Typography variant='h2' sx={{ marginBottom: 1 }}>Products for him</Typography>
        

        {
            isLoading 
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }

        </ShopLayout>

    )
}
    
    export default MenPage;