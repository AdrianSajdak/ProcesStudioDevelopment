import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../Axios';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';


function AccountMenu({ onLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      AxiosInstance.get('/users/me/')
        .then(res => {
          setUserData(res.data);
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
        });
    } else {
      setUserData(null);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    onLogout();
    handleClose();
  };

  let profilePictureUrl = null;
  if (userData && userData.profile_picture) {
    profilePictureUrl = `${AxiosInstance.defaults.baseURL.replace('/api','')}${userData.profile_picture}`;
  }

  return (
    <div>
      <IconButton
        id="account-button"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        {userData ? (
          profilePictureUrl ? (
            <Avatar src={profilePictureUrl} />
          ) : (
            <Avatar
              sx={{bgcolor: 'violet.light' }}
            />
          )
        ) : (
          <Avatar
            sx={{bgcolor: 'violet.light' }}
          />
        )}
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'account-button',
        }}
      >

        <MenuItem component={Link} to="/profile" onClick={handleClose}>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Wyloguj</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default AccountMenu;