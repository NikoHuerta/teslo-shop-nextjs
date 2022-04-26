import NextLink from 'next/link';

import { Chip, Grid, Typography, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { ShopLayout } from '../../components/layouts'


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Full Name', width: 300 },
    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Info about paid status of the order',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid 
                ? <Chip color='success' label='Paid' variant='outlined' />
                : <Chip color='error' label='Not Paid' variant='outlined' />
            )
        }
    },
    {
        field: 'view',
        headerName: 'View',
        description: 'View Order',
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                 <NextLink href={`/orders/${params.row.id}`} passHref> 
                    <Link>
                        <SearchOutlinedIcon />
                    </Link>
                </NextLink>
            )
        }

    }
];

const rows = [
    { id: 1, paid: true, fullName: 'John Doe' },
    { id: 2, paid: false, fullName: 'Jane Doe' },
    { id: 3, paid: true, fullName: 'John Smith' },
    { id: 4, paid: false, fullName: 'Jane Smith' },
];



const HistoryPage = () => {
  return (
    <ShopLayout title={'Order History'} pageDescription={'Order History of the client '}>
        <Typography variant='h1' component='h1'>Order History</Typography>

        <Grid container>
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

export default HistoryPage;