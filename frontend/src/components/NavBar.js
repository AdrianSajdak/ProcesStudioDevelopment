import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import AccountMenu from './AccountMenu';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';

import AxiosInstance from '../Axios';
import PeopleAltIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

import logo_ps from './images/logo_ps.png';

export default function ClippedDrawer(props) {
  const { drawerWidth, content, onLogout } = props;
  const location = useLocation();
  const path = location.pathname;

  const [open, setOpen] = React.useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    AxiosInstance.get('/users/me/')
      .then((response) => {
        const user = response.data;
        setUserRole(user.role);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const changeOpenStatus = () => {
    setOpen(!open);
  };

  if (!userRole) {
    return (
      <>
        <AppBar position="fixed">
          <Toolbar>
            <Typography>Loading...</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 8 }}>{content}</Box>
      </>
    );
  }

  const myDrawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/calculator"
              selected={"/calculator" === path}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'violet.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'violet.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <CalculateIcon />
              </ListItemIcon>
              <ListItemText primary="Kalkulator" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/tasks"
              selected={"/tasks" === path}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'violet.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'violet.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="Zadania" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/vacations"
              selected={"/vacations" === path}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'violet.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'violet.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <WorkOffIcon />
              </ListItemIcon>
              <ListItemText primary="Urlopy" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/projects"
              selected={"/projects" === path}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'violet.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'violet.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Projekty" />
            </ListItemButton>
          </ListItem>

          {userRole === 'Boss' && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/clients"
                  selected={path === '/clients'}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: 1,
                    color: 'text.primary',
                    '&.Mui-selected': {
                      backgroundColor: 'violet.main',
                      color: '#fff',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'violet.dark',
                    },
                  }}
                >
                  <ListItemIcon>
                    <EmojiPeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Klienci" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/users"
                  selected={path === '/users'}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: 1,
                    color: 'text.primary',
                    '&.Mui-selected': {
                      backgroundColor: 'violet.main',
                      color: '#fff',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'violet.dark',
                    },
                  }}
                >
                  <ListItemIcon>
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pracownicy" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        <List sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/about"
              selected={"/about" === path}
              sx={{
                my: 1,
                mx: 1,
                borderRadius: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'violet.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'violet.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: 'background.default' }}>
      <CssBaseline />
      {/* AppBar w ciemnym kolorze, nieco innym niż Drawer */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) => theme.palette.violet.dark, // #4E0062
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={changeOpenStatus}
              sx={{
                mr: 2,
                display: { sm: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>
            <img
              src={logo_ps}
              alt="logo"
              style={{ width: '50px', height: '25px' }}
            />
          </Box>

          <AccountMenu onLogout={onLogout} />
        </Toolbar>
      </AppBar>

      {/* Drawer - tło w ciemnym niebieskim z palety */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'blue.main', // #0A1931
          },
        }}
      >
        {myDrawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={open}
        onClose={changeOpenStatus}
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'blue.main',
          },
        }}
      >
        {myDrawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {/* Content */}
        <Box sx={{ flexGrow: 1 }}>{content}</Box>
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}
