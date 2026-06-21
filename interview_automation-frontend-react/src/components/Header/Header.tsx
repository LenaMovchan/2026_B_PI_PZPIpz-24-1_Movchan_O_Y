import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAppSelector } from '../../hooks/redux';
import useForce from '../../utils/useForce';
import HeaderAccount from './HeaderAccount';
import HeaderSignIn from './HeaderSignIn';

function Header(): React.JSX.Element {
  const user = useAppSelector((state) => state.user.userData);
  const location = useLocation();
  useForce(location);

  return user.id ? <HeaderAccount /> : <HeaderSignIn />;
}

export default Header;
