import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';
import { tesloAPI } from '../../api';


interface usersResponse {
    ok:         boolean;
    message?:   string;
    users?:     IUser[];
    user?:      IUser;
}

const UsersPage = () => {

    const { data, error } = useSWR<usersResponse>('/api/admin/users', { });
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if ( data )
            setUsers(data.users!);
    }, [ data ]);

    if( !error && !data ) {
        return (<div>Loading...</div>);
    }

    if( error ) {
        console.log(error);
        return <Typography>Error loading data, check console log.</Typography>
    }

    const onRoleUpdated = async ( userId: string, newRole: string ) => {
        // console.log(userId, newRole);

        const previousUsers = users.map ( user => ({ ...user }) );
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }) );

        setUsers(updatedUsers);
        
        try{
            //setUsers no va aqui para que el cambio se refleje instantaneamente.
            await tesloAPI.put('/admin/users', { userId, role: newRole });

        } catch( error: any ){
            setUsers(previousUsers);
            console.log( 'User role could not be updated' );
            console.log(error);
        }
    }



    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Full Name', width: 300 },
        { 
            field: 'role', 
            headerName: 'Role', 
            width: 300,
            renderCell: ({ row }: GridValueGetterParams) => {
                return ( 
                    <Select
                        value={ row.role }
                        label='Role'
                        onChange={ ( { target } ) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value ='admin'> Admin </MenuItem>
                        <MenuItem value ='client'> Client </MenuItem>
                        <MenuItem value ='SEO'> SEO </MenuItem>
                        <MenuItem value ='super-user'> Super User </MenuItem>
                    </Select>
                 )
            },

        },
        { field: 'origin', headerName: 'Origin', width: 200 },


    ];

    // const rows = data!.users!.map( user => ({
    const rows = users.map( user => ({
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