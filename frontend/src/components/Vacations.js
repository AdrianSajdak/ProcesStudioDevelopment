// Vacations.js
import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AxiosInstance from '../Axios'; // Upewnij się, że ścieżka jest poprawna
import { format, set } from 'date-fns';
import Calendar from './Calendar'; // Twój komponent kalendarza

function Vacations() {
    const theme = useTheme();

    const [userRole, setUserRole] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [vacations, setVacations] = useState([]);

    // Lista użytkowników
    const [users, setUsers] = useState([]);

    // Dialogi i Menu
    const [menuAnchorVacation, setMenuAnchorVacation] = useState(null);
    const [selectedVacationForMenu, setSelectedVacationForMenu] = useState(null);

    const [openVacationDialog, setOpenVacationDialog] = useState(false);
    const [editVacationDate, setEditVacationDate] = useState('');
    const [editVacationDuration, setEditVacationDuration] = useState('');
    const [editVacationComments, setEditVacationComments] = useState('');

    const [openAddVacationDialog, setOpenAddVacationDialog] = useState(false);
    const [newVacationDate, setNewVacationDate] = useState('');
    const [newVacationDuration, setNewVacationDuration] = useState('');
    const [newVacationComments, setNewVacationComments] = useState('');
    const [newVacationAssignedUser, setNewVacationAssignedUser] = useState('');

    // Informacje o urlopie po kliknięciu na bloczek
    const [openVacationInfoDialog, setOpenVacationInfoDialog] = useState(false);
    const [infoDialogData, setInfoDialogData] = useState(null);

    // ------------------ useRef do kalendarza ------------------
    const calendarRef = useRef(null);

  // ------------------ Ładowanie danych ------------------
    async function fetchCurrentUser() {
        try {
            const res = await AxiosInstance.get('/users/me/');
            setLoggedInUser(res.data);
            setUserRole(res.data.role);
        } catch (error) {
            console.error('Error fetching current user:', error);
            alert('Błąd podczas pobierania danych o zalogowanym użytkowniku.');
        }
    }

    async function fetchVacationsData() {
        try {
            const res = await AxiosInstance.get('/vacations/');
            setVacations(res.data);
        } catch (error) {
            console.error('Error fetching vacations:', error);
            alert('Błąd podczas pobierania danych urlopowych.');
        }
    }

    async function fetchUsersData() {
        try {
            const res = await AxiosInstance.get('/users/');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Błąd podczas pobierania listy użytkowników.');
        }
    }

    useEffect(() => {
        (async () => {
            await fetchCurrentUser();
            await fetchVacationsData();
        })();
    }, []);


  // ------------------ Funkcje obsługi dialogów i menu ------------------

  // Menu Urlopu
    const handleVacationMenuClick = (e, vacation) => {
        if (!vacation) {
            console.error('Vacation object is undefined.');
            return;
        }

        setMenuAnchorVacation(e.currentTarget);
        setSelectedVacationForMenu(vacation);
        setEditVacationDate(vacation.vacation_date);
        setEditVacationDuration(vacation.duration);
        setEditVacationComments(vacation.comments);
    };

    const handleVacationMenuClose = () => {
        setMenuAnchorVacation(null);
    };

    // Edycja Urlopu
    const handleEditVacation = () => {
        if (!selectedVacationForMenu){
            console.error('selectedVacationForMenu is undefined.');
            return
        }

        const body = {
            vacation_date: editVacationDate,
            duration: editVacationDuration,
            comments: editVacationComments,
        };

        AxiosInstance.patch(`/vacations/${selectedVacationForMenu.vacation_id}/`, body)
            .then(() => {
                alert('Urlop zaktualizowany!');
                setOpenVacationDialog(false);
                setSelectedVacationForMenu(null);
                setMenuAnchorVacation(null);
                // Odśwież listę urlopów
                fetchVacationsData();
                // Odśwież kalendarz
                if (calendarRef.current && calendarRef.current.refreshEvents) {
                calendarRef.current.refreshEvents();
                }
            })
            .catch((err) => {
                console.error('Error updating vacation:', err?.response?.data || err);
                alert('Nie udało się zaktualizować urlopu.');
            });
    };

    const handleSelectDayFromCalendar = (date) => {
        if (userRole === 'Boss') {
        setNewVacationDate(format(date, 'yyyy-MM-dd'));
        setOpenAddVacationDialog(true);
        }
    };

    const handleAddVacation = () => {
        if (!newVacationDate || !newVacationDuration || !newVacationAssignedUser) {
        alert('Wypełnij wszystkie wymagane pola.');
        return;
        }

        const body = {
        assigned_user_id: newVacationAssignedUser,
        vacation_date: newVacationDate,
        duration: newVacationDuration,
        comments: newVacationComments,
        };

        AxiosInstance.post('/vacations/', body)
        .then(() => {
            alert('Urlop dodany!');
            setOpenAddVacationDialog(false);
            // Reset formularza
            setNewVacationDate('');
            setNewVacationDuration('');
            setNewVacationComments('');
            setNewVacationAssignedUser('');
            // Odśwież listę urlopów
            fetchVacationsData();
            // Odśwież kalendarz
            if (calendarRef.current && calendarRef.current.refreshEvents) {
            calendarRef.current.refreshEvents();
            }
        })
        .catch((err) => {
            console.error('Error creating vacation:', err?.response?.data || err);
            alert('Nie udało się dodać urlopu.');
        });
    };

    const handleCloseAddVacationDialog = () => {
        setOpenAddVacationDialog(false);
        setNewVacationDate('');
        setNewVacationDuration('');
        setNewVacationComments('');
        setNewVacationAssignedUser('');
    };

    // Wyświetlanie Informacji o Urlopie
    const handleVacationInfoDialogOpen = async (vacation) => {
        if (!vacation || !vacation.assigned_user) {
            console.error('Vacation or assigned_user is undefined.');
            return;
        }

        try {
            const userRes = await AxiosInstance.get(`/users/${vacation.assigned_user__user_id}/`);
            vacation.assigned_user = userRes.data;
        } catch (err) {
            console.error('Failed to fetch assigned user data:', err);
            alert('Nie udało się załadować danych o użytkowniku.');
            return;
        }

        setInfoDialogData(vacation);
        setOpenVacationInfoDialog(true);
    };

    const handleCloseVacationInfoDialog = () => {
        setOpenVacationInfoDialog(false);
        setInfoDialogData(null);
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: '100vh',
                p: 2,
            }}
        >
            <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
                Panel Urlopów
            </Typography>

            {/* Kalendarz Urlopów */}
            <Box sx={{ mt: 3 }}>
                <Calendar
                    ref={calendarRef}
                    events={vacations}
                    onSelectDay={(date) => {
                        handleSelectDayFromCalendar(date);
                        if (userRole === 'Boss') {
                            fetchUsersData();
                            setOpenAddVacationDialog(true);
                        }
                    }}
                    onEventClick={handleVacationMenuClick}
                    type="vacation"
                />
            </Box>

            {/* ================== Menu Urlopu (tylko dla Boss) ================== */}
            {selectedVacationForMenu && (
                <Menu
                    anchorEl={menuAnchorVacation}
                    open={Boolean(menuAnchorVacation)}
                    onClose={handleVacationMenuClose}
                >
                    {loggedInUser.role === 'Boss' && (<MenuItem onClick={() => { setOpenVacationDialog(true); handleVacationMenuClose(); }}>Edytuj urlop</MenuItem>)}
                    <MenuItem onClick={() => { handleVacationInfoDialogOpen(selectedVacationForMenu); handleVacationMenuClose(); }}>Pokaż informacje</MenuItem>
                </Menu>
            )}

            {/* Dialog Edycji Urlopu (tylko dla Boss) */}
            {userRole === 'Boss' && (
                <Dialog
                    open={openVacationDialog}
                    onClose={() => setOpenVacationDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{textAlign: 'center'}}>Edytuj Urlop</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Data Urlopu"
                            type="date"
                            value={editVacationDate}
                            onChange={(e) => setEditVacationDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoFocus
                            margin="dense"
                        />
                        <TextField
                            label="Czas trwania (h)"
                            type="number"
                            value={editVacationDuration}
                            onChange={(e) => setEditVacationDuration(e.target.value)}
                        />
                        <TextField
                            label="Komentarz"
                            multiline
                            rows={3}
                            value={editVacationComments}
                            onChange={(e) => setEditVacationComments(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenVacationDialog(false)}>Anuluj</Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'violet.main',
                                '&:hover': { backgroundColor: 'violet.light' },
                            }}
                            onClick={handleEditVacation}
                        >
                            Zapisz
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog Dodawania Urlopu (tylko dla Boss) */}
            {userRole === 'Boss' && (
                <Dialog
                    open={openAddVacationDialog}
                    onClose={handleCloseAddVacationDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{textAlign: 'center'}}>Dodaj Urlop</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Data Urlopu"
                            type="date"
                            value={newVacationDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                            autoFocus
                            margin="dense"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Pracownik</InputLabel>
                            <Select
                                value={newVacationAssignedUser}
                                label="Pracownik"
                                onChange={(e) => setNewVacationAssignedUser(e.target.value)}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.user_id} value={user.user_id}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Czas trwania (h)"
                            type="number"
                            value={newVacationDuration}
                            onChange={(e) => setNewVacationDuration(e.target.value)}
                        />
                        <TextField
                            label="Komentarze"
                            multiline
                            rows={3}
                            value={newVacationComments}
                            onChange={(e) => setNewVacationComments(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddVacationDialog}>Anuluj</Button>
                        <Button
                            variant="contained"
                            onClick={handleAddVacation}
                            sx={{
                                backgroundColor: 'violet.main',
                                '&:hover': { backgroundColor: 'violet.light' },
                            }}
                        >
                            Dodaj Urlop
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog Informacyjny o Urlopie */}
            <Dialog
                open={openVacationInfoDialog}
                onClose={handleCloseVacationInfoDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{textAlign: 'center'}}>Informacje o Urlopie</DialogTitle>
                <DialogContent>
                    {infoDialogData && (
                        <>
                            <Typography>
                                <strong>Pracownik:</strong> {infoDialogData.assigned_user.username}
                            </Typography>
                            <Typography>
                                <strong>Data Urlopu:</strong> {format(new Date(infoDialogData.vacation_date), 'dd-MM-yyyy')}
                            </Typography>
                            <Typography>
                                <strong>Czas trwania:</strong> {infoDialogData.duration}h
                            </Typography>
                            {infoDialogData.comments && (
                                <Typography>
                                    <strong>Komentarze:</strong> {infoDialogData.comments}
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVacationInfoDialog}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Vacations;
