export const VACATION_TYPES = [
  { value: 'ANNUAL', label: 'Urlop wypoczynkowy' },
  { value: 'ON_DEMAND', label: 'Urlop na żądanie' },
  { value: 'MATERNITY', label: 'Urlop macierzyński' },
  { value: 'PATERNITY', label: 'Urlop ojcowski' },
  { value: 'PARENTAL', label: 'Urlop rodzicielski' },
  { value: 'CHILDCARE', label: 'Urlop wychowawczy' },
  { value: 'UNPAID', label: 'Urlop bezpłatny' },
  { value: 'SPECIAL', label: 'Urlop okolicznościowy' },
  { value: 'TRAINING', label: 'Urlop szkoleniowy' },
  { value: 'HEALTH', label: 'Urlop zdrowotny' }
];

export const VACATION_STATUS = {
  PENDING: 'Oczekujący',
  CONFIRMED: 'Zatwierdzony',
  REJECTED: 'Odrzucony'
};

export const TASK_STATUS = {
  OPEN: 'Otwarty',
  SUSPENDED: 'Wstrzymany',
  CLOSED: 'Zakończony'
};

export const TASK_STATUS_COLORS = {
  OPEN: '#4caf50',
  SUSPENDED: '#ff9800', 
  CLOSED: '#f44336'
};