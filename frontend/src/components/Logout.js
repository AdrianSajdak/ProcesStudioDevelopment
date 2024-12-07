import { useNavigate } from 'react-router-dom';

export function logoutUser(navigate) {
  localStorage.removeItem('token');

  navigate('/login');
}