import React from 'react'
import useSWR from 'swr';

import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';


interface usersResponse {
    ok:         boolean;
    message?:   string;
    users?:     IUser[];
    user?:      IUser;
}

const UsersPage = () => {

    const { data, error } = useSWR<usersResponse>('/api/admin/users', {

    });

    if( !error && !data ) {
        return (<div>Loading...</div>);
    }

    if( error ) {
        console.log(error);
        return <Typography>Error loading data, check console log.</Typography>
    }



    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Full Name', width: 300 },
        { field: 'role', headerName: 'Role', width: 300 },
        { field: 'origin', headerName: 'Origin', width: 200 },
    ];

    const rows = data!.users!.map( user => ({
        id : user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        origin: user.origin
    }) );


  return (
    <AdminLayout
        title='Users'
        subTitle='Manage users'
        icon={<PeopleOutline />}
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

export default UsersPage