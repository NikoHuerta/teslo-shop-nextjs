import { Box, CircularProgress, Typography } from "@mui/material"


export const FullScreenLoading = () => {
  return (
    <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center'
            height='calc(100vh-200px)' 
            sx={{ paddingTop: 20, flexDirection: { xs: 'column' } }}
        >
            <Typography sx={{ mb: 3 }} fontSize={40} fontWeight={200} >Loading...</Typography>
            <CircularProgress thickness={2}/>
        </Box>
  )
}
