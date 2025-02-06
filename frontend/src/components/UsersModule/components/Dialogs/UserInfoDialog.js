import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { getFileUrl } from '../../../../fileUrl';
import { CONTRACT_TYPES } from '../Variables';

const UserInfoDialog = ({ open, onClose, userData, loggedInUser }) => {
  const profilePictureUrl = getFileUrl(userData?.profile_picture);

  const getContractTypeLabel = (value) => {
    const contractType = CONTRACT_TYPES.find(type => type.value === value);
    return contractType ? contractType.label : '-';
  };

  const renderUserInfo = () => {
    if (loggedInUser?.is_superuser) {
      return (
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold',  }}>Nazwa użytkownika:</TableCell>
                <TableCell>{userData.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>E-mail:</TableCell>
                <TableCell>{userData.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Uprawnienia:</TableCell>
                <TableCell>{userData.role}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Data urodzenia:</TableCell>
                <TableCell>{userData.date_of_birth || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>PESEL:</TableCell>
                <TableCell>{userData.pesel || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Płeć:</TableCell>
                <TableCell>{userData.gender || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Adres zamieszkania:</TableCell>
                <TableCell>{userData.residential_address || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Adres korespondencyjny:</TableCell>
                <TableCell>{userData.mailing_address || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Telefon służbowy:</TableCell>
                <TableCell>{userData.work_phone || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Telefon prywatny:</TableCell>
                <TableCell>{userData.private_phone || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Data zatrudnienia:</TableCell>
                <TableCell>{userData.employment_date || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Rodzaj umowy:</TableCell>
                <TableCell>{getContractTypeLabel(userData.contract_type) || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Wymiar etatu (%):</TableCell>
                <TableCell>{userData.work_percentage || '-'} %</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Stanowisko:</TableCell>
                <TableCell>{userData.position || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Stawka wynagrodzenia:</TableCell>
                <TableCell>{userData.salary_rate || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Numer konta bankowego:</TableCell>
                <TableCell>{userData.bank_account || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Nazwa użytkownika:</TableCell>
                <TableCell>{userData.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>E-mail:</TableCell>
                <TableCell>{userData.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Uprawnienia:</TableCell>
                <TableCell>{userData.role}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Telefon służbowy:</TableCell>
                <TableCell>{userData.work_phone || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Data zatrudnienia:</TableCell>
                <TableCell>{userData.employment_date || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Rodzaj umowy:</TableCell>
                <TableCell>{getContractTypeLabel(userData.contract_type) || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Stanowisko:</TableCell>
                <TableCell>{userData.position || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };
          

  return (
    <Dialog open={open} onClose={onClose}  maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Pracownika</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            {profilePictureUrl ? (
              <Avatar src={profilePictureUrl} alt={userData.username} sx={{ width: 150, height: 150 }} />
            ) : (
              <Avatar sx={{ width: 150, height: 150}}>
                {userData.username ? userData.username[0].toUpperCase() : '?'}
              </Avatar>
            )}
            <Typography variant="h5">
              {userData.first_name || '-'} {userData.last_name || '-'}
            </Typography>
          </Box>
          {renderUserInfo()}
        </Box>
      </DialogContent>
      <DialogActions alignItems="center" sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInfoDialog;