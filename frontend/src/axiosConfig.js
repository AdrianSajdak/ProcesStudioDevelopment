import axios from 'axios';

const accessToken = sessionStorage.getItem('accessToken');

axios.defaults.headers.common['Authorization'] = accessToken ? `Bearer ${accessToken}` : '';

