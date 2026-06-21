const frontUrl = import.meta.env.VITE_FRONT_URL || 'http://localhost:5173';
const backUrl = import.meta.env.VITE_BACK_URL || 'http://localhost:8080';

export default {
  frontURL: frontUrl.replace(/\/$/, ''),
  baseURL: `${backUrl.replace(/\/$/, '')}/rest`,
};
