import { FC, useContext } from "react"

import { Grid, Typography } from "@mui/material"
import { CartContext } from "../../context"
import { currency } from "../../utils";

interface Props {
    orderData?: {
        numberOfItems : number;
        subTotal      : number;
        total         : number;
        tax           : number;
    }
}

export const OrderSummary:FC<Props> = ({ orderData }) => {
    
    const { numberOfItems, subTotal, total, tax } = orderData ? orderData : useContext(CartContext);


  return (
    <Grid container>
        
        <Grid item xs={6}>
            <Typography>N° Products</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ numberOfItems } { numberOfItems > 1 ? 'products' : 'product' }</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ currency.format(subTotal) }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Tax ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ currency.format(tax) }</Typography>
        </Grid>

        <Grid item xs={6} sx={{ mt: 2 }}>
            <Typography variant='subtitle1'>Total: </Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{ currency.format(total) }</Typography>
        </Grid>

    </Grid>
  )
}
