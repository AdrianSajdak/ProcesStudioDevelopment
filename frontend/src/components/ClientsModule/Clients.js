import React from 'react';
import { Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useClientsData from './hooks/useClientsData';
import ClientsListTab from './components/Tabs/ClientsListTab';
import AddClientTab from './components/Tabs/AddClientTab';

function Clients() {
  const theme = useTheme();
  const { clientsList, refreshClients, loggedInUser } = useClientsData();
  const [tabValue, setTabValue] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
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
        maxWidth: 800,
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
        <Tab label="Lista Klientów" />
        {loggedInUser?.is_superuser && (
          <Tab label="Dodaj Klienta" />
        )}
      </Tabs>

      {tabValue === 0 && (
        <ClientsListTab
          clientsList={clientsList}
          onClientUpdated={refreshClients}
          loggedInUser={loggedInUser}
          showSnackbar={showSnackbar}
        />
        )}
      {tabValue === 1 && loggedInUser?.is_superuser && (
        <AddClientTab
          onClientAdded={refreshClients}
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

export default Clients;
