import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { FC } from "react"
import { initialData } from "../../database/products";
import { ItemCounter } from '../ui';




const productInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
];


interface Props {
    editable?: boolean;
}


export const CartList:FC<Props> = ({ editable = false }) => {
  return (
    
    <>
        {
            productInCart.map(product => (
                <Grid container key={ product.slug } sx={{ mx: 1 }}>
                    <Grid item xs={3}>                        
                        {/* TODO: llevar a la pagina del producto  `/product/${ product.slug }` */}
                        <NextLink href='product/slug' passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={ `products/${ product.images[0] }` }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Size: <strong>M</strong></Typography>

                            {/* Condicional */}
                            {
                                editable 
                                ?   <ItemCounter />
                                :   <Typography variant='h5'>3 items</Typography>
                            }

                        </Box>                        
                    </Grid>

                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column' >
                        <Typography variant='subtitle1'>$ { product.price }</Typography>
                        {/* Editable */}
                        {
                            editable && (
                                <Button variant='text' color='secondary'>
                                    Remove
                                </Button>
                            )   
                        }
                        
                    </Grid>
                </Grid>

                
            ))
        }
    </>

  )
}
