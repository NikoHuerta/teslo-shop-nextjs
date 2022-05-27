import NextLink from 'next/link';

import { AddOutlined, CategoryOutlined } from "@mui/icons-material"
import { Grid, Typography, CardMedia, Link, Box, Button } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from "swr";

import { AdminLayout } from "../../../components/layouts"
import { FullScreenLoading } from '../../../components/ui';
import { IProduct } from "../../../interfaces";

const columns: GridColDef[] = [
  { 
      field: 'img', 
      headerName: 'Photo',
      renderCell: ({ row }: GridValueGetterParams ) => {
        return (
            <a href={ `/product/${ row.slug }` } target='_blank' rel='noreferrer' >
                <CardMedia 
                    component='img'
                    alt={ row.title }
                    className='fadeIn'
                    image= { row.img }
                    // image={ `/products/${ row.img }` }
                />
            </a>
        )
    }

},
  { 
    field: 'title', 
    headerName: 'Title', 
    width: 250,
    renderCell: ({ row }: GridValueGetterParams ) => {
      return (
        <NextLink href={`/admin/products/${ row.slug }`} passHref>
          <Link underline='always'>
            { row.title }
          </Link>
        </NextLink>
      )
    }
  },
  { field: 'gender', headerName: 'Gender' },
  { field: 'type', headerName: 'Type' },
  { field: 'inStock', headerName: 'Stock' },
  { field: 'price', headerName: 'Price' },
  { field: 'sizes', headerName: 'Sizes', width: 250 },
  
];


interface productResponse {
    ok: boolean;
    message?: string;
    products?: IProduct[];
    product?: IProduct;
}

const ProductsPage = () => {

  const { data, error } = useSWR<productResponse>('/api/admin/products', { });

  if ( !error && !data )  return (<FullScreenLoading />);

  if( error ) {
    console.log(error);
    return <Typography>Error loading data, check console log.</Typography>
  }

  // console.log(data);

  const rows = data!.products!.map( product => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }) );

  return (
    <AdminLayout 
      title= { `Products (${ data?.products!.length })` }
      subTitle='Manage products' 
      icon={  <CategoryOutlined /> }
      >
      
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }} >
        <Button
          startIcon={ <AddOutlined /> }
          color='secondary'
          href='/admin/products/new'
        >
          Create Product
        </Button>
      </Box>


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

export default ProductsPage