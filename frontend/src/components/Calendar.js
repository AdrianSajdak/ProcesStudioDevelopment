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
import AxiosInstance from '../Axios';
import './Calendar.css';

const Calendar = forwardRef(({ onSelectDay, onEventClick, type = 'post' }, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    const endpoint = type === 'vacation' ? '/vacations/' : '/posts/';
    AxiosInstance.get(endpoint)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(`Error fetching ${type}s:`, err));
  };

  useEffect(() => {
    fetchEvents();
  }, [type]);

  useImperativeHandle(ref, () => ({
    refreshEvents: () => {
      fetchEvents();
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
    return events.filter((event) => {
      const eventDate = type === 'vacation' ? new Date(event.vacation_date) : new Date(event.post_date);
      return isSameDay(eventDate, date);
    });
  };

  const handleDayClick = (e, dayItem) => {
    e.stopPropagation();
    if (onSelectDay) {
      onSelectDay(dayItem);
    }
  };

  const handleEventClickLocal = (e, event) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(e, event);
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
                  {dayEvents.map((event) => (
                    <div
                      key={type === 'vacation' ? event.vacation_id : event.post_id}
                      className={`calendar-event ${type === 'post' ? 'post' : 'vacation'}`}
                      onClick={(e) => handleEventClickLocal(e, event)}
                    >
                      <strong>
                        {type === 'vacation'
                          ? `Urlop (${event.assigned_user?.username})`
                          : event.assigned_task?.name || 'Task'}
                      </strong>{' '}
                      — {type === 'vacation' ? `${event.duration}h` : `${event.work_hours}h`}
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
