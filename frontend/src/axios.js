import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chatroom-0644.onrender.com',
  withCredentials: true, // Enables sending cookies with requests
  
});

export default instance;
