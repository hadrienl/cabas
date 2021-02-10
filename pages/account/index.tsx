import Box from 'components/Box';
import Header from 'components/Header';
import { Layout } from 'components/Layout';
import Main from 'components/Main';
import supabase from 'lib/supabase';
import Head from 'next/head';
import Link from 'next/link';
import AccountLayout from './AccountLayout';

export const AccountIndex = () => {
  const user = supabase.auth.user();

  if (!user) return null;

  return <AccountLayout>Yo</AccountLayout>;
};

export default AccountIndex;
