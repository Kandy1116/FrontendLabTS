'use client';

import React from 'react';
import { useUser } from "@/src/UserContext";
import AuthModal from "@/src/components/AuthModal";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showModal, closeModal } = useUser();

  return (
    <>
      {children}
      {showModal && <AuthModal onClose={closeModal} />}
    </>
  );
};

export default AppWrapper;
