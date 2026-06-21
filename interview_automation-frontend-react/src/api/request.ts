/* eslint-disable no-param-reassign */
import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import api from '../common/api';

const snapshotApi = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

snapshotApi.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response?.data.message);
      }
    }
  },
);

snapshotApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    let decodedToken: {
      sub: string,
      key: string,
      iat: number,
      exp: number
    } = {
      sub: '',
      key: '',
      iat: 0,
      exp: 0,
    };

    let isExpired = false;

    if (token) {
      decodedToken = jwtDecode(token);
      isExpired = dayjs.unix(decodedToken.exp as number).diff(dayjs()) < 1;
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isExpired) {
      await axios.post(`${api.baseURL}/auth/refresh-token`, {
        refresh_token: localStorage.getItem('refresh_token'),
      }).then((response) => {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        config.headers.Authorization = `Bearer ${response.data.access_token}`;
      })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/sign-in';
          toast.error('Перелогінтесь');
        });
    }

    return config;
  },
  (error) => {
    toast.error(error.message);
  },
);

export default snapshotApi;
