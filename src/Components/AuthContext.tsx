import React, { useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import { auth } from '../Firebase/firebase';
import { User } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { toggleLoggedIn } from '../Redux/features/account/account-slice';
import { useAppSelector } from '../Redux/hooks';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const dispatch = useDispatch();
  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (firebaseUser) => {});
  }, []);

  // if (pending) return <>loading</>;

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
