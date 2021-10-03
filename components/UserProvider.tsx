import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '@supabase/supabase-js';

import supabase from 'lib/supabase';
import { Customer } from 'types/Entities';

export interface UserContext {
  user?: User | null;
  customer?: Customer;
  signout: () => void;
}

export const context = createContext<UserContext>({
  signout: () => {},
});

export const useUser = () => useContext(context);

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserContext['user']>();
  const [customer, setCustomer] = useState<UserContext['customer']>();

  const fetchUser = useCallback(async () => {
    const user = supabase.auth.user();
    setUser(user || null);
    if (!user) {
      setCustomer(undefined);
      return;
    }
    const { data } = await supabase
      .from<Customer>('customer')
      .select(
        `id,
        firstName: first_name,
        lastName: last_name,
        phone,
        photo
      `
      )
      .eq('id', user.id)
      .single();
    setCustomer(data || undefined);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchUser();
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    fetchUser();
    return () => {
      authListener && authListener.unsubscribe();
    };
  }, [fetchUser]);

  const signout = useCallback(() => {
    setUser(null);
    supabase.auth.signOut();
  }, []);

  return (
    <context.Provider value={{ user, customer, signout }}>
      {children}
    </context.Provider>
  );
};
export default UserProvider;
