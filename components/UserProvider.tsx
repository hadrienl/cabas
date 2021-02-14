import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User as SBUser } from '@supabase/supabase-js';

import supabase from 'lib/supabase';
import { User } from 'types/Entities';

export interface UserContext {
  authUser?: SBUser;
  user?: User | null;
  signout: () => void;
}

export const context = createContext<UserContext>({
  signout: () => {},
});

export const useUser = () => useContext(context);

export const UserProvider: FC = ({ children }) => {
  const [authUser, setAuthUser] = useState<SBUser | undefined>();
  const [user, setUser] = useState<User | null | undefined>();

  const fetchUser = useCallback(async () => {
    const authUser = supabase.auth.user();
    setAuthUser(authUser || undefined);
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id);
    if (!data) {
      setUser(null);
      return;
    }
    setUser({
      ...data[0],
      email: authUser.email,
    });
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event);
        if (event === 'SIGNED_IN') {
          fetchUser();
        }
        if (event === 'SIGNED_OUT') {
          setAuthUser(undefined);
          setUser(null);
        }
      }
    );
    fetchUser();
    return () => {
      authListener && authListener.unsubscribe();
    };
  }, []);

  const signout = useCallback(() => {
    setUser(undefined);
    setAuthUser(undefined);
    supabase.auth.signOut();
  }, []);

  return (
    <context.Provider value={{ authUser, user, signout }}>
      {children}
    </context.Provider>
  );
};
export default UserProvider;
