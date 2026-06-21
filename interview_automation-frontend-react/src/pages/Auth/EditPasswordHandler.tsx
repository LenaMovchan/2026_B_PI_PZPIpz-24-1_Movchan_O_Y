import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import snapshotApi from '../../api/request';

function EditPasswordHandler(): JSX.Element {
  const navigate = useNavigate();

  const verifyToken = async (token: string): Promise<void> => {
    const isTokenValid: boolean = await snapshotApi.post('/auth/verify-reset-token', { 'token': token });

    if (isTokenValid) {
      localStorage.setItem('reset-token', token);
      navigate('/reset-password');
    } else {
      navigate('/invalid-link');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      verifyToken(token);
    } else {
      navigate('/invalid-link');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

export default EditPasswordHandler;