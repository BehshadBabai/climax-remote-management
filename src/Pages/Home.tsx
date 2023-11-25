import React from 'react';
import { useAppSelector } from '../Redux/hooks';
import LoggedIn from '../Components/HomeParts/LoggedIn';
import LoggedOut from '../Components/HomeParts/LoggedOut';

const Home: React.FC = () => {
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  return loggedIn ? <LoggedIn /> : <LoggedOut />;
};

export default Home;
