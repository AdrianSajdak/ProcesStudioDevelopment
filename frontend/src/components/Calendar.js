// Calendar.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
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

// events: [{ id, type: 'post'|'vacation', date: '2023-01-01', data: {...} }, ...]
// onEventClick(event), onEmptyDayClick(day, anchorEl)
const Calendar = forwardRef(({ events = [], onEventClick, onEmptyDayClick }, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Umożliwiamy Tasks.js wywołanie refreshEvents(),
  useImperativeHandle(ref, () => ({
    refreshEvents: () => {
      // Nie robimy tu nic, bo i tak events przychodzi z props.
      // Ewentualnie można w Tasks.js wywoływać setState i przekazywać w props events na nowo.
    },
  }));

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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
              {dayEvents.length > 0 && (
                <div className="calendar-events-scrollable">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`calendar-event ${
                        ev.type === 'vacation' ? 'vacation' : 'post'
                      }`}
                      onClick={(e) => handleEventClickLocal(e, ev)}
                    >
                      {ev.type === 'vacation' ? (
                        <>
                          <strong>Urlop</strong> ({ev.data.assigned_user?.username})  
                        </>
                      ) : (
                        <>
                          <strong>{ev.data.assigned_task?.name || 'Post'}</strong>{' '}
                          — {ev.data.work_hours}h
                        </>
                      )}
                    </div>
                  ))}
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
