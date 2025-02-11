import React, { useEffect, useState, useRef } from 'react';
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
  Menu,
  MenuItem,
  Checkbox,
  Divider,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import AccountMenu from './AccountMenu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Footer from './Footer';
import { Link, useLocation, useNavigate  } from 'react-router-dom';

import AxiosInstance from '../../Axios';
import PeopleAltIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

import logo_ps from '../images/logo_ps.png';

export default function ClippedDrawer(props) {
  const { drawerWidth, content, onLogout } = props;
  const location = useLocation();
  const path = location.pathname;

  const [open, setOpen] = React.useState(false);
  const [userRole, setUserRole] = useState(null);

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const setupWebSocket = async () => {
    try {
      await AxiosInstance.post('/token/verify/', { token: sessionStorage.getItem('accessToken') });

      const tokenResponse = await AxiosInstance.get('/notifications/get_ws_token/');
      
      const encodedToken = encodeURIComponent(tokenResponse.data.ws_token);

      if (!socketRef.current) {
        socketRef.current = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${encodedToken}`);
        
        socketRef.current.onopen = () => {
          console.log('WebSocket connected');
        };
        
        socketRef.current.onmessage = (e) => {
          const notification = JSON.parse(e.data);
          // Upewnij się, że nie dodajesz duplikatu – np. przez sprawdzenie unikalnego identyfikatora:
          setNotifications(prev => {
            if (prev.find(n => n.notification_id === notification.notification_id)) {
              return prev;
            }
            return [notification, ...prev];
          });
        };

        socketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        socketRef.current.onclose = () => {
          console.warn('WebSocket closed, retrying in 5s');
          socketRef.current = null;
          setTimeout(setupWebSocket, 5000);
        };
      }
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setTimeout(setupWebSocket, 5000);
    }
  };
  useEffect(() => {
    AxiosInstance.get('/notifications/')
      .then(response => {
        console.log("Fetched notifications:", response.data);
        setNotifications(response.data);
      })
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  useEffect(() => {
    setupWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const navigate = useNavigate();

  const handleCheckboxChange = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id =>
          AxiosInstance.patch(`/notifications/${id}/mark-read/`)
        )
      );
      
      setNotifications(prev => 
        prev.filter(n => !selectedNotifications.includes(n.notification_id))
      );
      setSelectedNotifications([]);
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

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

  const NOTIFICATION_ROUTES = {
    'TASK': '/tasks',
    'PROJECT': '/projects',
    'VACATION': '/tasks',
    'PHASE': '/projects',
    'USER': '/users',
    'CLIENT': '/clients'
  };

  const handleNotificationClick = async (notif) => {
    try {
      await AxiosInstance.patch(`/notifications/${notif.notification_id}/mark-read/`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  
    setNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id));
  
    setAnchorEl(null);

    const route = NOTIFICATION_ROUTES[notif.type] || '/';
    navigate(route);
  };

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
              to="/reinforcementDimensioning"
              selected={"/reinforcementDimensioning" === path}
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
              <ListItemText primary="Zginanie" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/slicing"
              selected={"/slicing" === path}
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
              <ListItemText primary="Ścinanie" />
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
              onClick={() => navigate('/home')}
              style={{ 
                width: '50px', 
                height: '25px',
                cursor: 'pointer' 
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {notifications.length === 0 ? (
                <MenuItem>Brak powiadomień</MenuItem>
              ) : (
                <>
                  <Typography
                    sx={{
                      p: 2,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderBottom: '1px solid rgba(0,0,0,0.12)'
                    }}
                  >
                    Powiadomienia
                  </Typography>
                  {notifications.map((notif) => (
                    <MenuItem
                      key={notif.notification_id}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Checkbox
                        checked={selectedNotifications.includes(notif.notification_id)}
                        onChange={() => handleCheckboxChange(notif.notification_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Typography 
                        onClick={() => handleNotificationClick(notif)}
                        sx={{ cursor: 'pointer' }}
                      >
                        {notif.title}
                      </Typography>
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={selectedNotifications.length === 0}
                      onClick={handleMarkSelectedAsRead}
                      sx={{
                        backgroundColor: 'violet.main',
                        '&:hover': { backgroundColor: 'violet.light' },
                      }}
                    >
                      Oznacz jako odczytane ({selectedNotifications.length})
                    </Button>
                  </MenuItem>
                </>
              )}
            </Menu>

            <AccountMenu onLogout={onLogout} />
          </Box>
        </Toolbar>
      </AppBar>

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
