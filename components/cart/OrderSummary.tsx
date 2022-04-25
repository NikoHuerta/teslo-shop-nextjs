import { Grid, Typography } from "@mui/material"

export const OrderSummary = () => {
  return (
    <Grid container>
        
        <Grid item xs={6}>
            <Typography>N° Products</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>3 items</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ `$${155.36}` }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Tax (19%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ `$${29.52}` }</Typography>
        </Grid>

        <Grid item xs={6} sx={{ mt: 2 }}>
            <Typography variant='subtitle1'>Total: </Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{ `$${184.88}` }</Typography>
        </Grid>

    </Grid>
  )
}
