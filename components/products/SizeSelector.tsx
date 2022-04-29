import { FC } from "react"
import { Box, Button } from "@mui/material";

import { ISize } from "../../interfaces";

interface Props{
    selectedSize?: ISize;
    sizes: ISize[];

    //Method
    selectSize: (size: ISize) => void;
}


export const SizeSelector:FC<Props> = ({ selectedSize, sizes, selectSize }) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    key={ size }
                    size='small'
                    color={ size === selectedSize ? 'primary' : 'info' }
                    onClick={ () => selectSize( size ) }
                >
                    { size }
                </Button>
            ))
        }
    </Box>
  )
}
