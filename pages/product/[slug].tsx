import { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { IProduct } from '../../interfaces';
import { dbProducts } from '../../database';


interface Props{
  product: IProduct;
}


const ProductPage: NextPage<Props> = ({ product }) => {

  // const { query } = useRouter();
  // const {products: product, isLoading} = useProducts<Response>(`/products/${query.slug}`); --> view Response Interface para useProducts, products : IProduct

  // if(isLoading){
  //   return <ShopLayout title={'Loading...'} pageDescription={'Loading...'}>
  //           <Typography variant='h2'>Loading...</Typography>
  //         </ShopLayout> 
  // }

  // if(!product){
  //   return <h1>No existe</h1>
  // }



  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* TODO: Slideshow */}
          <ProductSlideshow images={ product.images } />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* Titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{`$${ product.price }`}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Quantity</Typography>
              <ItemCounter />
              <SizeSelector 
                // selectedSize={ product.sizes[0] } 
                sizes={ product.sizes } 
              />
            </Box>

            {/* Agregar al Carrito */}
            <Button color='secondary' className='circular-btn'>
              Add to cart
            </Button>

            {/* <Chip label='No hay disponibles' color='error' variant='outlined'/> */}

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Description</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>
    </ShopLayout>
  )
}


//* NO USAR SERVER SIDE RENDERING SSR
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductsBySlug(slug); // your fetch function here 

//   if ( !product ){
//     return {
//         redirect: {
//             destination: '/',
//             permanent: false,
//         }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }
//* NO USAR SERVER SIDE RENDERING SSR

//getStaticPaths
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const slugs = await dbProducts.getAllProductsSlug();

  return {
    paths: slugs.map( ({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: "blocking" // optional, default: false
  }
}

//getStaticProps
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductsBySlug( slug );

  if ( !product ){
    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400 //cada dia se vuelve a revalidar la data (60 segundos * 60 minutos * 24 horas)
  }
}

export default ProductPage;