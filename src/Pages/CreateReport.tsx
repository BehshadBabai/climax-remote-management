import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import { useNavigate } from 'react-router-dom';

const CreateReport: React.FC = () => {
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loggedIn) {
      navigate('/');
    }
  }, []);
  return <>Create Report</>;
};

export default CreateReport;
