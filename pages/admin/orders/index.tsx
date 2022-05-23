import NextLink from 'next/link';

import { ConfirmationNumberOutlined } from "@mui/icons-material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Chip, Grid, Typography, Link } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from "swr";
import moment from 'moment';

import { AdminLayout } from "../../../components/layouts"
import { FullScreenLoading } from '../../../components/ui';
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Full Name', width: 250 },
  { field: 'total', headerName: 'Total amount', width: 150 },
  { 
    field: 'isPaid', 
    headerName: 'Paid',
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid
        ? ( <Chip variant='outlined' label='Paid' color='success' /> )
        : ( <Chip variant='outlined' label='Pending' color='error' /> )
    },
    width: 150 
  },
  { field: 'numProducts', headerName: 'N° Products', align: 'center', width: 150 },
  {
    field: 'check',
    headerName: 'View Order',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/orders/${ row.id }`} passHref> 
            <Link>
                <SearchOutlinedIcon />
            </Link>
        </NextLink>
    )}
  },
  { field: 'createdAt', headerName: 'Created At', width: 250 },
];


interface ordersResponse {
  ok:         boolean;
  message?:   string;
  orders?:    IOrder[];
  order?:     IOrder;
}

const OrdersPage = () => {

  const { data, error } = useSWR<ordersResponse>('/api/admin/orders', { });

  if ( !error && !data )  return (<FullScreenLoading />);

  if( error ) {
    console.log(error);
    return <Typography>Error loading data, check console log.</Typography>
  }

  // console.log(data);

  const rows = data!.orders!.map( order => ({
    id      : order._id,
    email   : (order.user as IUser).email,
    name    : (order.user as IUser).name,
    total   : order.total,
    isPaid  : order.isPaid,
    numProducts : order.orderItems.length,
    createdAt: moment(order.createdAt).format('MMMM Do YYYY, h:mm')
  }) );

  return (
    <AdminLayout 
      title='Orders'
      subTitle='Manage orders' 
      icon={ <ConfirmationNumberOutlined /> }
      >

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

    </AdminLayout>
  )
}

export default OrdersPage