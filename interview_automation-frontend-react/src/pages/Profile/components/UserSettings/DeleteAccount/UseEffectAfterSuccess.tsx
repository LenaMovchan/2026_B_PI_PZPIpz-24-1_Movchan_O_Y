import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearState } from '../../../../../store/reducers/account/accountSlice';
import { deleteUser } from '../../../../../store/reducers/user/userSlice';
import { RootState } from '../../../../../store/store';

function UseEffectAfterSuccess(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const success = useSelector((state: RootState) => state.account.success);

  useEffect(() => {
    if (success) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      dispatch(deleteUser());

      setTimeout(() => {
        navigate('/');
        dispatch(clearState());
      }, 3000);

    }
  }, [success, navigate, dispatch]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

export default UseEffectAfterSuccess;
