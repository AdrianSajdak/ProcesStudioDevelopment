import React, { useState, forwardRef } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isSameWeek,
} from 'date-fns';
import './Calendar.css';
import { Popover, TextField } from '@mui/material';
// Używamy DatePicker oraz PickersDay z MUI X
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

/**
 * Komponent kalendarza – obsługuje dwa rodzaje eventów:
 * - type === 'post'   -> posty
 * - type === 'vacation' -> urlopy
 *
 * props:
 *   events: Array -> [{ id, type, date, data }]
 *   onEventClick: (event) => void  -> kliknięcie w bloczek eventu
 *   onEmptyDayClick: (day, anchorEl) => void  -> klik w pusty dzień
 */
const Calendar = forwardRef(({ events = [], onEventClick, onEmptyDayClick }, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Stan określający tryb widoku: 'month', 'week' lub 'day'
  const [viewMode, setViewMode] = useState('month');
  // Stan do obsługi Popovera z DatePickerem
  const [anchorEl, setAnchorEl] = useState(null);
  // Stan przechowujący aktualnie podświetlony dzień w widoku tygodnia
  const [hoveredWeekDate, setHoveredWeekDate] = useState(null);

  // Nawigacja – zmiana daty w zależności od trybu widoku:
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Otwieranie DatePickera po kliknięciu w nagłówek daty
  const handleDateClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // Zamykanie Popovera z DatePickerem
  const handleDatePickerClose = () => {
    setAnchorEl(null);
  };

  // Funkcja generująca listę dni do wyświetlenia w zależności od trybu:
  const generateCalendarDays = () => {
    let startDate, endDate;
    if (viewMode === 'month') {
      const startOfCurMonth = startOfMonth(currentDate);
      const endOfCurMonth = endOfMonth(currentDate);
      startDate = startOfWeek(startOfCurMonth, { weekStartsOn: 1 });
      endDate = endOfWeek(endOfCurMonth, { weekStartsOn: 1 });
    } else if (viewMode === 'week') {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (viewMode === 'day') {
      startDate = currentDate;
      endDate = currentDate;
    }
    let dayList = [];
    let day = startDate;
    while (day <= endDate) {
      dayList.push(day);
      day = addDays(day, 1);
    }
    return dayList;
  };

  const calendarDays = generateCalendarDays();

  const getEventsForDay = (date) => {
    return events.filter((ev) => isSameDay(new Date(ev.date), date));
  };

  const handleDayClick = (e, dayItem) => {
    e.stopPropagation();
    if (onEmptyDayClick) {
      onEmptyDayClick(dayItem, e.currentTarget);
    }
  };

  const handleEventClickLocal = (e, event) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Funkcja formatująca nagłówek w zależności od trybu widoku:
  const renderHeaderTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'LLLL yyyy');
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'd MMM yyyy')} - ${format(end, 'd MMM yyyy')}`;
    } else if (viewMode === 'day') {
      return format(currentDate, 'PPPP');
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrev}>{'<'}</button>
        {/* Kliknięcie w nagłówek z datą otwiera DatePicker */}
        <h2 onClick={handleDateClick} style={{ cursor: 'pointer' }}>
          {renderHeaderTitle()}
        </h2>
        <button onClick={handleNext}>{'>'}</button>
      </div>

      {/* Komponent Popover z DatePickerem */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleDatePickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {viewMode === 'month' ? (
          // DatePicker do wyboru miesiąca – użytkownik zaczyna od wyboru roku, potem wybiera miesiąc.
          <DatePicker
            openTo="year"
            views={['year', 'month']}
            value={currentDate}
            disableCloseOnSelect
            onAccept={(newDate) => {
              if (newDate) {
                // Ustawiamy datę na pierwszy dzień wybranego miesiąca
                setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
              }
              handleDatePickerClose();
            }}
            inputFormat="LLLL yyyy"
            renderInput={(params) => <TextField {...params} />}
          />
        ) : viewMode === 'week' ? (
          <DatePicker
            value={currentDate}
            onChange={(newDate) => {
              if (newDate) {
                const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
                setCurrentDate(weekStart);
              }
              handleDatePickerClose();
            }}
            inputFormat="dd MMM yyyy"
            renderInput={(params) => <TextField {...params} label="Wybierz tydzień" />}
          />
        ) : (
          // Standardowy DatePicker – wybór pojedynczego dnia
          <DatePicker
            value={currentDate}
            onChange={(newDate) => {
              if (newDate) {
                setCurrentDate(newDate);
              }
              handleDatePickerClose();
            }}
            inputFormat="PPPP"
            renderInput={(params) => <TextField {...params} />}
          />
        )}
      </Popover>

      <div className="calendar-view-modes">
        <button
          className={viewMode === 'month' ? 'active' : ''}
          onClick={() => setViewMode('month')}
        >
          Miesiąc
        </button>
        <button
          className={viewMode === 'week' ? 'active' : ''}
          onClick={() => setViewMode('week')}
        >
          Tydzień
        </button>
        <button
          className={viewMode === 'day' ? 'active' : ''}
          onClick={() => setViewMode('day')}
        >
          Dzień
        </button>
      </div>

      {/* Wiersz nagłówkowy dni tygodnia – wyświetlany tylko dla trybów 'month' i 'week' */}
      {viewMode !== 'day' ? (
        <div className="calendar-weekdays">
          {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((d) => (
            <div key={d} className="calendar-weekday">
              {d}
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-weekdays day-view">
          <div className="calendar-weekday">
            {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'][format(currentDate, 'i') - 1]}
          </div>
        </div>
      )}

      {/* Siatka kalendarza – dynamiczne style dla trybów */}
      <div
        className={`calendar-grid ${viewMode}`}
        style={{ gridTemplateColumns: viewMode === 'day' ? '1fr' : 'repeat(7, 1fr)' }}
      >
        {calendarDays.map((dayItem) => {
          const dayEvents = getEventsForDay(dayItem);
          const inSameMonth = isSameMonth(dayItem, currentDate);

          return (
            <div
              key={dayItem.toISOString()}
              className={`calendar-cell ${!inSameMonth ? 'disabled' : ''}`}
              onClick={(e) => handleDayClick(e, dayItem)}
            >
              <div className="calendar-date">{format(dayItem, 'd')}</div>
              {dayEvents.length > 0 && (
                <div className="calendar-events-scrollable">
                  {dayEvents.map((ev) => {
                    if (ev.type === 'post') {
                      return (
                        <div
                          key={ev.id}
                          className="calendar-event post"
                          onClick={(e) => handleEventClickLocal(e, ev)}
                        >
                          <strong>{ev.data.assigned_task?.name || 'Post'}</strong> — {ev.data.work_hours}h
                        </div>
                      );
                    } else {
                      const vacStatus = ev.data.status;
                      let vacClass = 'vacation-PENDING';
                      if (vacStatus === 'CONFIRMED') {
                        vacClass = 'vacation-CONFIRMED';
                      }
                      return (
                        <div
                          key={ev.id}
                          className={`calendar-event vacation ${vacClass}`}
                          onClick={(e) => handleEventClickLocal(e, ev)}
                        >
                          <strong>Urlop</strong> ({ev.data.assigned_user?.username})
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color post"></span>
          <span>Post</span>
        </div>
        <div className="legend-item">
          <span className="legend-color vacation-PENDING"></span>
          <span>Urlop oczekujący</span>
        </div>
        <div className="legend-item">
          <span className="legend-color vacation-CONFIRMED"></span>
          <span>Urlop zatwierdzony</span>
        </div>
      </div>
    </div>
  );
});

export default Calendar;
