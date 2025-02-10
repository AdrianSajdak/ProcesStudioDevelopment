import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClientInfoDialog from '../Dialogs/ClientInfoDialog';
import ClientEditDialog from '../Dialogs/ClientEditDialog';
import * as clientsApi from '../../api/clientsApi';

const ClientListTab = ({ clientsList, showSnackbar, onClientUpdated, loggedInUser }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenInfoDialog = (client) => {
    setSelectedClient(client);
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setSelectedClient(null);
  };

  const handleOpenEditDialog = (client) => {
    setSelectedClient(client);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedClient(null);
  };

  const handleSaveEdit = async (editedValues) => {
    try {
      const formData = new FormData();
      const readOnlyFields = ['client_id'];
      Object.keys(editedValues).forEach(key => {
        if (readOnlyFields.includes(key)) return;
        if (editedValues[key] !== '' && editedValues[key] !== null && editedValues[key] !== undefined) {
          formData.append(key, editedValues[key]);
        }
      });
      await clientsApi.updateClient(selectedClient.client_id, formData);
      showSnackbar('success', 'Dane klienta zaktualizowane pomyślnie');
      onClientUpdated();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating client:', error);
      showSnackbar('error', 'Błąd podczas aktualizacji danych klienta');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
              <TableCell>Nazwa klienta</TableCell>
              <TableCell>NIP</TableCell>
              <TableCell>Kontakt</TableCell>
              <TableCell>Adres</TableCell>
              {loggedInUser?.is_superuser && (
                <TableCell>Akcje</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {clientsList.sort((a, b) => a.client_id - b.client_id).map((client) => {
              const address = `${client.city || '-'} ${client.postcode || '-'}, ${client.street || '-'}`;
              return (
                <TableRow
                  key={client.client_id || client.id}
                  onClick={() => handleOpenInfoDialog(client)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    },
                    outline: '1px solid' 
                  }}
                >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.nip || '-'}</TableCell>
                  <TableCell>
                    {client.contact_person || '-'}<br />
                    {client.contact_email || '-'}
                  </TableCell>
                  <TableCell>{address}</TableCell>
                  {loggedInUser?.is_superuser && (
                    <TableCell>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenEditDialog(client);
                        }}
                        size="small"
                        sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedClient && (
        <>
          <ClientInfoDialog
            open={infoDialogOpen}
            onClose={handleCloseInfoDialog}
            clientData={selectedClient}
          />
          <ClientEditDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            clientData={selectedClient}
            onSave={handleSaveEdit}
            showSnackbar={showSnackbar}
          />
        </>
      )}
    </Box>
  );
};

export default ClientListTab;