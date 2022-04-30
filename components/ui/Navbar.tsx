import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { UIContext, CartContext } from '../../context';

export const Navbar = () => {

  const { asPath, push } = useRouter();
  const { toogleSideMenu  } = useContext(UIContext);
  const { numberOfItems } = useContext(CartContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearch = () => {
      if(searchTerm.trim().length === 0) return;
      push(`/search/${ searchTerm }`);
  }

  const openMenu = () => {
    toogleSideMenu();
  }

  return (
    <AppBar>
        <Toolbar>

            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={ 1 } />

            <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn'>
              <NextLink href='/category/men' passHref>
                <Link>
                  <Button color={ asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
                </Link>
              </NextLink>
              <NextLink href='/category/women' passHref>
                <Link>
                  <Button color={ asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                </Link>
              </NextLink>
              <NextLink href='/category/kid' passHref>
                <Link>
                  <Button color={ asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                </Link>
              </NextLink>
            </Box>
            

            <Box flex={ 1 } />

            {/* Pantallas Grandes */}
            {
              isSearchVisible ?
              (
                <Input
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                  className='fadeIn' 
                  autoFocus 
                  value={ searchTerm }
                  onChange={ (e) => setSearchTerm(e.target.value) }
                  onKeyPress={ (e) => e.key === 'Enter' && handleSearch() }
                  type='text'
                  placeholder="Buscar..."
                  endAdornment={
                      <InputAdornment position="end">
                          <IconButton onClick={ () => setIsSearchVisible(false) } >
                            <ClearOutlined />
                          </IconButton>
                      </InputAdornment>
                  }
                />
              )
              :
              ( <IconButton
                  className='fadeIn'
                  onClick={ () => setIsSearchVisible(true) }
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <SearchOutlined />
                </IconButton> 
              )
            }
            {/* Pantallas Grandes */}

            {/* Pantallas Pequeñas */}
            <IconButton
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={ openMenu }
            >
              <SearchOutlined />
            </IconButton>
            {/* Pantallas Pequeñas */}

            <NextLink href='/cart' passHref>
              <Link>
                <IconButton>
                  <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
                    <ShoppingCartOutlined/>
                  </Badge>
                </IconButton>
              </Link>
            </NextLink>

            <Button
              onClick={ openMenu }
            >
              Menu
            </Button>


        </Toolbar>
    </AppBar>
  )
}
