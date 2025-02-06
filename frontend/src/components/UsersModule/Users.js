import React from 'react';
import { Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useUsersData from './hooks/useUsersData';
import UsersListTab from './components/Tabs/UsersListTab';
import AddUserTab from './components/Tabs/AddUserTab';

function Users() {
  const theme = useTheme();
  const { usersList, refreshUsers, loggedInUser } = useUsersData();
  const [tabValue, setTabValue] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    severity: 'success',
    message: '',
  });

  if (!loggedInUser) {
    return <Box>Loading...</Box>;
  }

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        p: 2,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{ 
          mb: 2,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center'
          }
        }}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        <Tab label="Lista Pracowników" />
        {loggedInUser?.is_superuser && <Tab label="Dodaj Pracownika" />}
      </Tabs>

      {tabValue === 0 && (
        <UsersListTab 
          usersList={usersList} 
          onUserUpdated={refreshUsers}
          showSnackbar={showSnackbar}
          loggedInUser={loggedInUser}
        />
      )}
      {tabValue === 1 && (
        <AddUserTab
          onUserAdded={refreshUsers}
          showSnackbar={showSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Users;