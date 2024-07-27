// CheckModalContext.js

import React, { createContext, useContext, useState } from 'react';

const CheckModalContext = createContext();

export const CheckModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    show: false,
    header: '',
    contents: ''
  });

  const openCheckModal = (header, contents) => {
    setModalState({
      show: true,
      header,
      contents
    });
  };

  const closeCheckModal = () => {
    setModalState({
      show: false,
      header: '',
      contents: ''
    });
  };

  return (
    <CheckModalContext.Provider
      value={{ modalState, openCheckModal, closeCheckModal }}
    >
      {children}
    </CheckModalContext.Provider>
  );
};

export const useCheckModal = () => {
  const context = useContext(CheckModalContext);
  if (!context) {
    throw new Error('useCheckModal must be used within a CheckModalProvider');
  }
  return context;
};
