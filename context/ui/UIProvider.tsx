import { FC, ReactNode, useReducer } from 'react';
import { UIContext, uiReducer } from '.';

export interface UIState {
   isMenuOpen: boolean;
}

interface Prop {
   children: ReactNode;
}

const UI_INITIAL_STATE: UIState = {
   isMenuOpen: false,
}


export const UIProvider:FC<Prop> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toogleSideMenu = () => {
        dispatch({
            type: '[UI] - Toggle Menu',
        });
    }


   return (
   <UIContext.Provider value={{
       ...state,

       //Methods
       toogleSideMenu,
   }}>
       { children }
   </UIContext.Provider>
   )
}