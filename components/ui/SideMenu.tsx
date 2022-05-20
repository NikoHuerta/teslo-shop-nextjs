import { useContext, useState } from "react"
import { useRouter } from "next/router";

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"

import { AuthContext, UIContext } from "../../context";
import { IUserContext } from "../../interfaces";


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toogleSideMenu } = useContext( UIContext );
    const { isLoggedIn, user = {} as IUserContext, logoutUser } = useContext( AuthContext );

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        if(searchTerm.trim().length === 0) return;
        
        navigateTo(`/search/${ searchTerm }`);
    }

    const navigateTo = (path: string) => {
        toogleSideMenu();
        router.push(path);
    }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={ toogleSideMenu }
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                        value={ searchTerm } 
                        autoFocus 
                        onChange={ (e) => setSearchTerm(e.target.value) }
                        onKeyPress={ (e) => e.key === 'Enter' && handleSearch() }
                        type='text'
                        placeholder="Search..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={ handleSearch } >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>

                <ListItem 
                    button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/men') }
                >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Men'} />
                </ListItem>

                <ListItem 
                    button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/women') }
                >
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Women'} />
                </ListItem>

                <ListItem 
                    button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick={ () => navigateTo('/category/kid') }
                >
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Kids'} />
                </ListItem>

                {
                    isLoggedIn ?
                    <>
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Profile'} />
                        </ListItem>

                        <ListItem button onClick={ () => navigateTo('/orders/history') }>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'My Orders'} />
                        </ListItem>

                        <ListItem 
                            button
                            onClick={ logoutUser }
                        >
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Logout'} />
                        </ListItem>
                    </>
                    :
                        <ListItem 
                            button
                            onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }
                        >
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Login'} />
                        </ListItem>
                }
                        

                

                {
                    user.role === 'admin' &&
                    (
                        <>
                            {/* Admin */}
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={ () => navigateTo('/admin/') }>
                                <ListItemIcon>
                                    <DashboardOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Products'} />
                            </ListItem>
                            <ListItem button onClick={ () => navigateTo('/admin/orders') } >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Orders'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo('/admin/users') } >
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Users'} />
                            </ListItem>
                        </>
                    )
                }
                
            </List>
        </Box>
    </Drawer>
  )
}