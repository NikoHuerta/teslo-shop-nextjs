import { NextPage, GetServerSideProps } from 'next';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'

import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts'
import { IOrder } from '../../../interfaces';
import { dbOrders } from '../../../database';

interface Props {
  order: IOrder;
}

const ViewOrderPage:NextPage<Props> = ({ order }) => {

  const { _id='', user='', orderItems, shippingAddress, billingAddress, paymentResult='', numberOfItems, subTotal, tax, total, isPaid, paidAt='' } = order;

  return (
    <AdminLayout 
    title='Order'
    subTitle={ _id }
    icon={ <ConfirmationNumberOutlined /> }
    >
      {/* <Typography variant='h1' component='h1'>Order: { _id }</Typography> */}

      {
          isPaid ?
          (
              <Chip 
                  sx={{ my:2 }}
                  label='Order Status: Paid'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlined />}
              />
          )
          :
          (
              <Chip 
                  sx={{ my:2 }}
                  label='Order Status: Pending'
                  variant='outlined'
                  color='error'
                  icon={<CreditCardOffOutlined />}
              />
          )
      }

      <Grid container sx={{ mt:3 }} className='fadeIn'>
          <Grid item xs={12} sm={7}>

              {/* Cart List */}
              <CartList products={ orderItems } />

          </Grid>
          <Grid item xs={12} sm={5}>
              <Card className='summary-card'>
                  <CardContent>
                      <Typography variant='h2' component='h2'>Summary ({ numberOfItems } { numberOfItems===1 ? 'product' : 'products' })</Typography>
                      <Divider sx={{ my: 1 }} />


                      <Box display='flex' justifyContent='space-between'>
                          <Typography variant='subtitle1'>Delivery Address</Typography>
                      </Box>

                      {/* <Box display='flex' flexDirection='column' alignItems='start'> */}
                      <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                      <Typography>{ shippingAddress.address }</Typography>
                      {
                          shippingAddress.address2 ?
                          ( <Typography>{ shippingAddress.address2 }</Typography> ) 
                          : ''
                      }
                      <Typography>{ shippingAddress.city }, { shippingAddress.zipCode }</Typography>

                      
                      <Typography>{ shippingAddress.country }</Typography>
                      <Typography>{ shippingAddress.phone }</Typography>
                      {/* </Box> */}
                      <Divider sx={{ my:1 }}></Divider>
                      

                      {/* Order Summary */}
                      <OrderSummary 
                          orderData={ {
                              numberOfItems,
                              subTotal,
                              total,
                              tax,
                          }}
                      />
                      

                      <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                          <Box
                              display='flex' 
                              justifyContent='center' 
                              className='fadeIn'
                              flexDirection='column'
                              sx={{ display: 'flex', flex: 1 }}
                          >
                              {
                                  isPaid ? 
                                  (
                                      <Chip 
                                          sx={{ my:2 }}
                                          label='Order Status: Paid'
                                          variant='outlined'
                                          color='success'
                                          icon={<CreditScoreOutlined />}
                                      />
                                  ) 
                                  : 
                                  (
                                    <Chip 
                                        sx={{ my:2 }}
                                        label='Order Status: Pending'
                                        variant='outlined'
                                        color='success'
                                        icon={<CreditCardOffOutlined />}
                                    />
                                  )
                              }
                          </Box>
                          
                      </Box>

                  </CardContent>
              </Card>
          </Grid>

      </Grid>
    </AdminLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req , query}) => {
  // const { data } = await  // your fetch function here 

  const { id = '' } = query;
  const order = await dbOrders.getOrderById( id.toString() );

  if( !order ){
      //order not found
      return {
          redirect: {
              destination: '/admin/orders',
              permanent: false,
          }
      }
  }

  return {
    props: {
      order
    }
  }
}

export default ViewOrderPage;