import { FC, useContext } from "react"
import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { ICartProduct, IOrderItem } from "../../interfaces";
import { CartContext } from '../../context';
import { ItemCounter } from '../ui';


interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}


export const CartList:FC<Props> = ({ editable = false, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product );
    }

    const onRemoveProduct = (product: ICartProduct) => {
        removeCartProduct( product );
    }

    const productsToShow = products ? products : cart;


  return (
    <>
        {
            productsToShow.map(product => (
                <Grid container key={ product.slug + product.size } sx={{ mx: 1 }}>
                    <Grid item xs={3}>                        
                        <NextLink href= { `/product/${ product.slug }` } passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        // image={ `/products/${ product.images }` }
                                        image={ product.images }
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
                            <Typography variant='body1'>Size: <strong>{ product.size }</strong></Typography>

                            {/* Condicional */}
                            {
                                editable 
                                ?   (
                                        <ItemCounter 
                                            currentValue={product.quantity} 
                                            maxValue={ 10 } 
                                            updatedQuantity={ ( value ) => onNewCartQuantityValue(product as ICartProduct, value) } 
                                        />
                                    )
                                :   <Typography variant='h5'>{ product.quantity } item</Typography>
                            }

                        </Box>                        
                    </Grid>

                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column' >
                        <Typography variant='subtitle1'>$ { product.price }</Typography>
                        {/* Editable */}
                        {
                            editable && (
                                <Button 
                                    variant='text' 
                                    color='secondary'
                                    onClick={ () => onRemoveProduct( product as ICartProduct ) }
                                >
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
