import type { NextPage, GetServerSideProps } from 'next';

import { Typography, Box } from '@mui/material';

// import { useProducts } from '../../hooks';
import { ShopLayout } from '../../components/layouts';
// import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';



interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Find the best Teslo products here'}>
      <Typography variant='h1' component='h1'>Search Product</Typography>
        {
            foundProducts 
            ? <Typography variant='h2' sx={{ marginBottom: 1 }} textTransform='capitalize'>{ `Search: ${ query }` }</Typography>
            :   
                (
                    <Box display='flex' sx={{ marginLeft: 2 }}>
                        <Typography variant='h2' sx={{ marginBottom: 1 }}>No Products Found</Typography>
                        <Typography variant='h2' sx={{ marginLeft: 1, marginBottom: 1 }} color='secondary'>{ `${ query }` }</Typography>
                    </Box>
                )
        }

      

      <ProductList products={ products } />
      {/* {
         isLoading 
         ? <FullScreenLoading />
         : <ProductList products={ products } />
      } */}

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = '' } = params as { query: string };
    
    if(query.length === 0) 
        return { 
            redirect: { 
                destination: '/', 
                permanent: true 
            } 
        };
    
    // no hay productos
    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if(!foundProducts) {
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;
