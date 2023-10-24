import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
