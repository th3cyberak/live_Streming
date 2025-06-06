import axios from 'axios';

export default axios.create({
  baseURL: 'https://streamapi.gamingsoftech.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});
