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
  user?: (User & { new_email?: string }) | null;
  customer?: Customer | null;
  signout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (customerData: Partial<Customer>) => void;
}

export const context = createContext<UserContext>({
  signout: () => {},
  updateUser: () => {},
  updateProfile: () => {},
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
    if (!data) {
      setUser(null);
    }
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
    setCustomer(null);
    supabase.auth.signOut();
  }, []);

  const updateUser = useCallback(async ({ email }) => {
    await supabase.auth.update({ email });
  }, []);

  const updateProfile: UserContext['updateProfile'] = useCallback(
    async ({ firstName, lastName, ...data }) => {
      const { data: newCustomer } = await supabase
        .from('customer')
        .update({
          first_name: firstName || customer?.firstName,
          last_name: lastName || customer?.lastName,
          ...data,
        })
        .single();
      newCustomer &&
        setCustomer({
          ...newCustomer,
          firstName: newCustomer.first_name,
          lastName: newCustomer.last_name,
        });
    },
    [customer]
  );

  return (
    <context.Provider
      value={{ user, customer, signout, updateUser, updateProfile }}
    >
      {children}
    </context.Provider>
  );
};
export default UserProvider;
