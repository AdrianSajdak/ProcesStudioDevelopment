import React from 'react';
import { Box, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem as MUIMenuItem } from '@mui/material';
import Calendar from '../Calendar/Calendar';

const CalendarTab = ({
  events,
  tasks,
  users,
  userRole,
  hideVacations,
  setHideVacations,
  calendarUserFilter,
  setCalendarUserFilter,
  calendarTaskFilter,
  setCalendarTaskFilter,
  onEventClick,
  onEmptyDayClick,
  calendarRef,
}) => {
  return (
    <Box sx={{ mt: 3, minHeight: 500 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hideVacations}
              onChange={(e) => setHideVacations(e.target.checked)}
            />
          }
          label="Ukryj urlopy"
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Task</InputLabel>
          <Select
            value={calendarTaskFilter}
            label="Task"
            onChange={(e) => setCalendarTaskFilter(e.target.value)}
          >
            <MUIMenuItem value="">Wszystkie taski</MUIMenuItem>
            {tasks.map((t) => (
              <MUIMenuItem key={t.task_id} value={t.task_id}>
                {t.name}
              </MUIMenuItem>
            ))}
          </Select>
        </FormControl>
        {userRole === 'Boss' && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Użytkownik</InputLabel>
            <Select
              value={calendarUserFilter}
              label="Użytkownik"
              onChange={(e) => setCalendarUserFilter(e.target.value)}
            >
              <MUIMenuItem value="">Wszyscy użytkownicy</MUIMenuItem>
              {users.map((u) => (
                <MUIMenuItem key={u.user_id} value={u.user_id}>
                  {u.username}
                </MUIMenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Calendar
        ref={calendarRef}
        events={events}
        onEventClick={onEventClick}
        onEmptyDayClick={onEmptyDayClick}
      />
    </Box>
  );
};

export default CalendarTab;
