import { createContext } from 'react';
import { IUserContext, IUser } from '../../interfaces';

interface ContextProps{
    //Props
    isLoggedIn: boolean;
    user?: IUser;

    //Methods
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string | undefined; }>;
    checkToken: () => Promise<void>;

}

export const AuthContext = createContext({} as ContextProps);