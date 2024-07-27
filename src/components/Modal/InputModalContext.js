import React, { createContext, useContext, useState } from "react";

const InputModalContext = createContext();

export const InputModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    show: false,
    header: "",
    reviewId: null,
    user_id: null,
    rest_id: null,
  });

  const openInputModal = ({ header, reviewId, user_id, rest_id }) => {
    setModalState({
      show: true,
      header,
      reviewId,
      user_id,
      rest_id,
    });
  };

  const closeInputModal = () => {
    setModalState({
      show: false,
      header: "",
      reviewId: null,
      user_id: null,
      rest_id: null,
    });
  };

  return (
    <InputModalContext.Provider
      value={{ modalState, openInputModal, closeInputModal }}
    >
      {children}
    </InputModalContext.Provider>
  );
};

export const useInputModal = () => {
  const context = useContext(InputModalContext);
  if (!context) {
    throw new Error("useInputModal은 반드시 InputModalProvider 내에서 사용해야 합니다");
  }
  return context;
};
