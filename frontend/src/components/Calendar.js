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
} from 'date-fns';
import './Calendar.css';

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

  // Nawigacja po miesiącach:
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Generujemy listę dni do wyświetlenia (pełne tygodnie w obrębie miesiąca)
  const generateCalendarDays = () => {
    const startOfCurMonth = startOfMonth(currentDate);
    const endOfCurMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(startOfCurMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfCurMonth, { weekStartsOn: 1 });

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
    return events.filter((ev) => {
      return isSameDay(new Date(ev.date), date);
    });
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

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{'<'}</button>
        <h2>{format(currentDate, 'LLLL yyyy')}</h2>
        <button onClick={handleNextMonth}>{'>'}</button>
      </div>

      <div className="calendar-weekdays">
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'].map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
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

              {/* Kontener eventów */}
              {dayEvents.length > 0 && (
                <div className="calendar-events-scrollable">
                  {dayEvents.map((ev) => {
                    // 1) Jeżeli to post
                    if (ev.type === 'post') {
                      return (
                        <div
                          key={ev.id}
                          className="calendar-event post"
                          onClick={(e) => handleEventClickLocal(e, ev)}
                        >
                          <strong>
                            {ev.data.assigned_task?.name || 'Post'}
                          </strong>{' '}
                          — {ev.data.work_hours}h
                        </div>
                      );
                    }
                    else {
                      // ev.type === 'vacation'
                      // status: 'PENDING' lub 'CONFIRMED'
                      const vacStatus = ev.data.status;
                      let vacClass = 'vacation-PENDING'; // domyślnie
                      if (vacStatus === 'CONFIRMED') {
                        vacClass = 'vacation-CONFIRMED';
                      }

                      return (
                        <div
                          key={ev.id}
                          className={`calendar-event vacation ${vacClass}`}
                          onClick={(e) => handleEventClickLocal(e, ev)}
                        >
                          <strong>Urlop</strong>{' '}
                          ({ev.data.assigned_user?.username})
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
    </div>
  );
});

export default Calendar;