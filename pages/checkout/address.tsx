import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';

const AddressPage = () => {
  return (
    <ShopLayout title='Delivery Address' pageDescription='Confirm the delivery address'>
        <Typography variant='h1' component='h1'>Address</Typography>

        <Grid container spacing={2} sx={{ mt:5 }}>
            <Grid item xs={12} sm={6}>
                <TextField label='Name' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Lastname' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField label='Address' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Address 2 (optional)' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField label='Postal Code' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='City' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                        variant='filled'
                        label='Country'
                        value={1}   
                    >
                        <MenuItem value={1}> Chile </MenuItem>
                        <MenuItem value={2}> Argentina </MenuItem>
                        <MenuItem value={3}> Peru </MenuItem>
                        <MenuItem value={4}> Bolivia </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Telephone' variant='filled' fullWidth />
            </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large'>
                Check order
            </Button>
        </Box>
    </ShopLayout>
  )
}

export default AddressPage;