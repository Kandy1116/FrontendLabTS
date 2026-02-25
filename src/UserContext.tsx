'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/src/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { UserContextType } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && pathname === '/') {
      router.push('/for-you');
    }
  }, [user, pathname, router]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const value = {
    user,
    loading,
    logout,
    showModal,
    openModal,
    closeModal,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
