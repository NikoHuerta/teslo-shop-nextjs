import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import { SummaryTile } from '../../components/admin'

import { AdminLayout } from '../../components/layouts/AdminLayout'
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
  
  
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30*1000, // 30 seconds
  });
  
  const [refreshIn, setRefreshIn] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
    }, 1000);
  
    return () => clearInterval(interval)
  }, []);
  



  if( !error && !data ) {
    return <div>Loading...</div>
  }

  if( error ) {
    console.log(error);
    return <Typography>Error loading data, check console log.</Typography>
  }

  const { numberOfOrders, paidOrders, unPaidOrders, numberofClients, numberofProducts, noStockProducts, lowStockProducts } = data!.data;


  return (
    <AdminLayout 
        title='Dashboard'
        subTitle='General information about the shop'
        icon={<DashboardOutlined />}

    >
        <Grid container spacing={2}>

          <SummaryTile 
            title={ numberOfOrders } 
            subTitle={'Total Orders'} 
            icon={ <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ paidOrders } 
            subTitle={'Paid Orders'} 
            icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ unPaidOrders } 
            subTitle={'Pending Orders'} 
            icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ numberofClients } 
            subTitle={'Customers'} 
            icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ numberofProducts } 
            subTitle={'Products'} 
            icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ noStockProducts } 
            subTitle={'No Stock Products'} 
            icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ lowStockProducts } 
            subTitle={'Low Stock Products'} 
            icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }            
          />

          <SummaryTile 
            title={ refreshIn } 
            subTitle={'Update in'} 
            icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }            
          />

        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage