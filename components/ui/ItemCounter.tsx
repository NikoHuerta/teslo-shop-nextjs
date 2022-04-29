import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"

interface Props{
  currentValue: number;
  maxValue: number;

  //METHODS
  updatedQuantity: (quantity: number) => void;
}


export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {

  const modifyQuantity = (operation: string) => {

    if(operation === 'remove'){
      if(currentValue === 1) return currentValue;

      return updatedQuantity(currentValue - 1);
    }

    if(operation === 'add'){
      if(currentValue === maxValue) return currentValue;

      return updatedQuantity(currentValue + 1);
    }
  }


  return (
    <Box display='flex' alignItems='center'>
        <IconButton
          onClick={ () => modifyQuantity( 'remove' ) }
        >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>
        <IconButton
          onClick={ () => modifyQuantity( 'add' ) }
        >
            <AddCircleOutline />
        </IconButton>

    </Box>
  )
}
