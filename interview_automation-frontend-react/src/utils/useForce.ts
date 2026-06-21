import { useEffect } from 'react';
import { Location } from 'react-router-dom';

import { useAppDispatch } from '../hooks/redux';
import getUser from '../store/reducers/user/actions';

function useForce(location: Location): void {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && location.pathname !== '/sign-in') dispatch(getUser());
  }, [dispatch, location.pathname, token]);
}

export default useForce;
