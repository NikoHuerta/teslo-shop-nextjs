import { createContext } from 'react';

interface ContextProps{
    isMenuOpen: boolean;

    //Methods
    toogleSideMenu: () => void;
}

export const UIContext = createContext({} as ContextProps);