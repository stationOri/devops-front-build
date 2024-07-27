import React, { createContext, useContext, useReducer } from 'react';

const MenuModalStateContext = createContext();
const MenuModalDispatchContext = createContext();

const initialState = {
  show: false,
  header: '',
  menuname: '',
  menuprice: '',
  menuId: null,
};

function menuModalReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        show: true,
        header: action.header,
        menuname: action.menuname,
        menuprice: action.menuprice,
        menuId: action.menuId,
      };
    case 'CLOSE':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function MenuModalProvider({ children }) {
  const [state, dispatch] = useReducer(menuModalReducer, initialState);

  return (
    <MenuModalStateContext.Provider value={state}>
      <MenuModalDispatchContext.Provider value={dispatch}>
        {children}
      </MenuModalDispatchContext.Provider>
    </MenuModalStateContext.Provider>
  );
}

export function useMenuModalState() {
  const context = useContext(MenuModalStateContext);
  if (context === undefined) {
    throw new Error('useMenuModalState must be used within a MenuModalProvider');
  }
  return context;
}

export function useMenuModalDispatch() {
  const context = useContext(MenuModalDispatchContext);
  if (context === undefined) {
    throw new Error('useMenuModalDispatch must be used within a MenuModalProvider');
  }
  return context;
}

export function useMenuModal() {
  const state = useMenuModalState();
  const dispatch = useMenuModalDispatch();

  const openMenuModal = (header, menuname, menuprice, menuId = null) => {
    dispatch({ type: 'OPEN', header, menuname, menuprice, menuId });
  };

  const closeMenuModal = () => {
    dispatch({ type: 'CLOSE' });
  };

  return {
    menumodalState: state,
    openMenuModal,
    closeMenuModal,
  };
}