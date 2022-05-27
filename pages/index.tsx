import type { NextPage } from 'next';

import { Typography } from '@mui/material';

import { useProducts } from '../hooks';
import { ShopLayout } from '../components/layouts';
import { FullScreenLoading } from '../components/ui';
import { ProductList } from '../components/products';



const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products');
  // console.log(products);

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Find the best Teslo products here'}>
      <Typography variant='h1' component='h1'>Shop</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>All Products</Typography>

      {
         isLoading 
         ? <FullScreenLoading />
         : <ProductList products={ products } />
      }

     

    </ShopLayout>
  )
}

export default HomePage;
