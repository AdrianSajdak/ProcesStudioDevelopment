import React, { useState } from 'react';
import AxiosInstance from '../../../../Axios';
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
  Avatar,
} from '@mui/material';
import * as usersApi from '../../api/usersApi';
import UserInfoDialog from '../Dialogs/UserInfoDialog';
import UserEditDialog from '../Dialogs/UserEditDialog';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

const UsersListTab = ({ usersList, showSnackbar, onUserUpdated, loggedInUser }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenInfoDialog = (user) => {
    setSelectedUser(user);
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setSelectedUser(null);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // Funkcja obsługująca zapis zmian z dialogu edycji
  const handleSaveEdit = async (editedValues) => {
    try {
      const formData = new FormData();
      const readOnlyFields = ['user_id'];
      Object.keys(editedValues).forEach(key => {
        if (readOnlyFields.includes(key)) return;
        if (key === 'profile_picture' || key === 'contract_file') {
          if (editedValues[key] instanceof File) {
            formData.append(key, editedValues[key]);
          }
        } else if (editedValues[key] !== '' && editedValues[key] !== null && editedValues[key] !== undefined) {
          formData.append(key, editedValues[key]);
        }
      });
      await usersApi.updateUser(selectedUser.user_id, formData);
      showSnackbar('success', 'Dane użytkownika zaktualizowane pomyślnie');
      onUserUpdated();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('error', 'Błąd podczas aktualizacji danych użytkownika');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
              <TableCell>Avatar</TableCell>
              <TableCell>Imię i Nazwisko</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon służbowy</TableCell>
              <TableCell>Stanowisko</TableCell>
              <TableCell>Uprawnienia</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.sort((a, b) => a.user_id - b.user_id).map((user) => {
              const profilePictureUrl = user.profile_picture
                ? `${AxiosInstance.defaults.baseURL.replace('/api','')}${user.profile_picture}`
                : null;
              const contractFileUrl = user.contract_file
                ? `${AxiosInstance.defaults.baseURL.replace('/api','')}${user.contract_file}`
                : null;
              return (
                <TableRow key={user.user_id || user.id} onClick={() => handleOpenInfoDialog(user)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }, outline: '1px solid' }}>
                  <TableCell>
                    {profilePictureUrl ? (
                      <Avatar src={profilePictureUrl} alt={user.username} />
                    ) : (
                      <Avatar>{user.username ? user.username[0].toUpperCase() : '?'}</Avatar>
                    )}
                  </TableCell>
                  <TableCell>{`${user.first_name || '-'} ${user.last_name || '-'}`}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.work_phone || '-'}</TableCell>
                  <TableCell>{user.position || '-'}</TableCell>
                  <TableCell>{user.role || '-'}</TableCell>
                  <TableCell >
                    {contractFileUrl && loggedInUser?.is_superuser && (
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(contractFileUrl, '_blank');
                        }}
                        size='small'
                        sx={{
                          color: 'white.main',
                          '&:hover': { color: 'violet.main' },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    )}

                    {loggedInUser?.is_superuser && (
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenEditDialog(user);
                        }}
                        size='small'
                        sx={{
                          color: 'white.main',
                          '&:hover': { color: 'violet.main' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <>
          <UserInfoDialog
            open={infoDialogOpen}
            onClose={handleCloseInfoDialog}
            userData={selectedUser}
            loggedInUser={loggedInUser}
          />
          <UserEditDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            userData={selectedUser}
            onSave={handleSaveEdit}
            showSnackbar={showSnackbar}
          />
        </>
      )}
    </Box>
  );
};

export default UsersListTab;