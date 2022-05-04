import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';

import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from '.';
import { tesloAPI } from '../../api';
import { IUser } from '../../interfaces';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

interface Prop {
   children: ReactNode;
}

type ServerError = { message: string };

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}


export const AuthProvider:FC<Prop> = ({ children }) => {

   const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
   const router = useRouter();

   //check token en primer render
    useEffect(() => {
        checkToken();
    }, []);
    
    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {

            const { data } = await tesloAPI.post('/user/login', { email, password });
            const { user, token } = data;
            Cookies.set( 'token', token );
            dispatch({ type: '[Auth] - Login', payload: { ...user } });
            return true;

        } catch( e ){
            return false;
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {
        try{

            const { data } = await tesloAPI.post('/user/register', { name, email, password });
            const { user, token }  = data;
            Cookies.set( 'token', token );
            dispatch({ type: '[Auth] - Login', payload: { ...user } });

            return { hasError: false };

        } catch( error ) {

            if( axios.isAxiosError( error ) ) {
                const serverError = error as AxiosError<ServerError>;

                return {
                    hasError: true,
                    message: serverError.response?.data.message,
                }
            }

            return {
                hasError: true,
                message: 'The user could not be created, please try again later',
            }
        }
    }

    const checkToken = async () => {

        if ( !Cookies.get( 'token' ) ) {
            return ;
        }

        try {
            //COOKIES ARE SENT BY DEFAULT TO SERVER
            const { data } = await tesloAPI.post('/user/validate-token');
            const { user, token } = data;
            Cookies.set( 'token', token );
            dispatch({ type: '[Auth] - Login', payload: { ...user } });

        } catch ( error ){
            Cookies.remove('token');
        }
    }

    const logoutUser = () => {
        Cookies.remove('token');
        Cookies.remove('cart');

        router.reload();

        // dispatch({ type: '[Auth] - Logout' });
    }


   return (
   <AuthContext.Provider value={{
        ...state,

        //Methods
        loginUser,
        registerUser,
        checkToken,
        logoutUser,
   }}>
       { children }
   </AuthContext.Provider>
   )
}