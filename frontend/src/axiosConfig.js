import axios from 'axios';

const accessToken = localStorage.getItem('access_token');

axios.defaults.headers.common['Authorization'] = accessToken ? `Bearer ${accessToken}` : '';

