import React, { createContext, useContext, useState } from "react";

const SuccessModalContext = createContext();

export const SuccessModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    show: false,
    header: "",
    username: "",
    day: "",
    selectedTime: "",
    selectedGuests: "",
    onClose: null
  });

  const openSuccessModal = (header, username, day, selectedTime, selectedGuests, onClose) => {
    setModalState({
      show: true,
      header,
      username,
      day,
      selectedTime,
      selectedGuests,
      onClose
    });
  };

  const closeSuccessModal = () => {
    setModalState({
      show: false,
      header: "",
      username: "",
      day: "",
      selectedTime: "",
      selectedGuests: "",
      onClose: null
    });
    if (modalState.onClose) {
      modalState.onClose();
    }
  };

  return (
    <SuccessModalContext.Provider
      value={{ modalState, openSuccessModal, closeSuccessModal }}
    >
      {children}
    </SuccessModalContext.Provider>
  );
};

export const useSuccessModal = () => {
  const context = useContext(SuccessModalContext);
  if (!context) {
    throw new Error(
      "useSuccessModal must be used within a SuccessModalProvider"
    );
  }
  return context;
};
