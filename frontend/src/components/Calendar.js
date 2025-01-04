import React, { useState, useEffect, forwardRef } from 'react';
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
  parseISO
} from 'date-fns';
import AxiosInstance from '../Axios';
import './Calendar.css';

function Calendar({ onSelectDay, onPostClick }, ref) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState([]);

  // Ładujemy posty
  const fetchPosts = () => {
    AxiosInstance.get('/posts/')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Metoda do odświeżenia z zewnątrz
  const refreshPosts = () => {
    fetchPosts();
  };

  // Jeśli korzystamy z forwardRef
  if (ref) {
    // Jeżeli rodzic używa forwardRef, możemy wystawić refreshPosts
    ref.current = {
      refreshPosts
    };
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Generujemy listę dni
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

  const getPostsForDay = (date) => {
    return posts.filter((p) => {
      const postDate = parseISO(p.post_date);
      return isSameDay(postDate, date);
    });
  };

  // Kliknięcie w tło dnia
  const handleDayClick = (e, dayItem) => {
    // Zapobiegamy propagacji na wypadek, gdyby kliknięcie bloczka też to wywoływało
    e.stopPropagation();
    if (onSelectDay) {
      onSelectDay(dayItem);
    }
  };

  // Kliknięcie w bloczek posta
  const handlePostClickLocal = (e, post) => {
    e.stopPropagation();
    if (onPostClick) {
      onPostClick(post);
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
          const dayPosts = getPostsForDay(dayItem);
          const inSameMonth = isSameMonth(dayItem, currentDate);

          return (
            <div
              key={dayItem.toISOString()}
              className={`calendar-cell ${!inSameMonth ? 'disabled' : ''}`}
              onClick={(e) => handleDayClick(e, dayItem)}
            >
              <div className="calendar-date">{format(dayItem, 'd')}</div>

              {dayPosts.length > 0 && (
                <div className="calendar-events-scrollable">
                  {dayPosts.map((post) => (
                    <div
                      key={post.post_id}
                      className="calendar-event"
                      onClick={(e) => handlePostClickLocal(e, post)}
                    >
                      <strong>{post.assigned_task?.name || 'Task'}</strong> —{' '}
                      {post.work_hours}h
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
}

export default forwardRef(Calendar);