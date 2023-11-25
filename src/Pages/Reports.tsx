import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(loggedIn);
    if (!loggedIn) {
      navigate('/');
    }
  }, []);
  return <>Reports</>;
};

export default Reports;
