import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Chip, Grid, Typography, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import moment from 'moment';

import { ShopLayout } from '../../components/layouts'
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Full Name', width: 300 },
    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Info about payment status of the order',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid 
                ? <Chip color='success' label='Paid' variant='outlined' />
                : <Chip color='error' label='Not Paid' variant='outlined' />
            )
        }
    },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
    {
        field: 'view',
        headerName: 'View',
        description: 'View Order',
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                 <NextLink href={`/orders/${params.row.orderId}`} passHref> 
                    <Link>
                        <SearchOutlinedIcon />
                    </Link>
                </NextLink>
            )
        }

    }
];

interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    

    const rows = orders.map( (order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullName: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
        orderId: order._id,
        createdAt: moment(order.createdAt).format('MMMM Do YYYY, h:mm'),
    }));

  return (
    <ShopLayout title={'Order History'} pageDescription={'Order History of the client '}>
        <Typography variant='h1' component='h1'>Order History</Typography>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width:'100%' }}>
                <DataGrid
                    columns={ columns } 
                    rows={ rows }                    
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
    const session: any = await getSession({ req });

    if( !session ){
        return {
            redirect: {
                destination: `/auth/login/?p=/orders/history`,
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrderByUserId( session.user._id );

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;