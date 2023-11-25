import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';

const Report: React.FC = () => {
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(loggedIn);
    if (!loggedIn) {
      navigate('/');
    }
  }, []);
  return <>Report</>;
};

export default Report;
