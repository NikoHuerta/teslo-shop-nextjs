import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import axios, { AxiosError } from 'axios';

import { CartContext, cartReducer } from '.';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { tesloAPI } from '../../api';

interface Prop {
   children: ReactNode;
}

type ServerError = { message: string };


type ResponseDataCreateOrder = {
   ok: boolean;
   message?: string;
   order?: IOrder;
}

export interface CartState {

   isLoaded: boolean;
   cart: ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;

   shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
   isLoaded: false,
   cart: [],
   numberOfItems: 0,
   subTotal: 0,
   tax: 0,
   total: 0,

   shippingAddress: undefined

   // cart: Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [],
}


export const CartProvider:FC<Prop> = ({ children }) => {

   const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

   // ERROR CON REACT18 SE EJECUTA PRIMERO ESTE USE EFFECT Y LUEGO EL CART_INITIAL_STATE ... TRABAJAR CONDICION EN EL CART_INITIAL_STATE
   //next.config.js --> const nextConfig = { reactStrictMode: false, }
   useEffect(() => {
      const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
   }, []);

   useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart));
   }, [state.cart]);

   useEffect(() => {

      const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev , 0);
      const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

      const orderSummary = {
         numberOfItems,
         subTotal,
         tax: subTotal * taxRate,
         total: subTotal + (subTotal * taxRate),
      }

      dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });

   }, [state.cart]);

   useEffect( () => {
      const cookieAddress:ShippingAddress = Cookie.get('addressData') ? JSON.parse( Cookie.get('addressData')! ) : undefined;

      if( cookieAddress )
         dispatch({ type: '[Cart] - LoadAddress from cookies', payload: cookieAddress });
   }, []);
   
   const addProductToCart = async (product: ICartProduct) => {

      //si son ids diferentes
      const productsInCart = state.cart.some( item => item._id === product._id );
      if( !productsInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

      //si son ids diferentes o iguales pero con diferentes tamaños
      const productsInCartButWithDifferentSize = state.cart.some( item => item._id === product._id && item.size === product.size );
      if( !productsInCartButWithDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

      //si son ids iguales y tamaños iguales
      //acumular la cantidad
      const updatedProducts = state.cart.map( item => {
         //si no es mismo id o si no es mismo tamaño, dejar igual...
         if( item._id !== product._id || item.size !== product.size ) return item;

         item.quantity += product.quantity;
         return item;
      });

      return dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
   }

   const updateCartQuantity = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Change product quantity', payload: product });
   }

   const removeCartProduct = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Remove product in cart', payload: product });
   }

   const updateShippingAddress = (address: ShippingAddress) => {
      Cookie.set('addressData', JSON.stringify( address ));
      dispatch({ type: '[Cart] - Update Address', payload: address });
   }

   const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {
      
      if( !state.shippingAddress ){
         throw new Error('No shipping address');
      }

      const body: IOrder = {
         orderItems: state.cart.map( p => ({
            ...p,
            size: p.size!,
         }) ),
         shippingAddress: state.shippingAddress,
         billingAddress: state.shippingAddress,
         numberOfItems: state.numberOfItems,
         subTotal: state.subTotal,
         tax: state.tax,
         total: state.total,
         isPaid: false,
      }

      try{

         const { data } = await tesloAPI.post<ResponseDataCreateOrder>('/orders', body);
         
         // no usar aqui para que no se vea en blanco los datos al hacer submit
         // dispatch({ type: '[Cart] - Order Complete'});

         return {
            hasError: false,
            message: data.order?._id!,
         }

      } catch(error){

         if(axios.isAxiosError(error)){
            const serverError = error as AxiosError<ServerError>;
            return {
               hasError: true,
               message: serverError.response?.data.message!
            }
         }

         return {
            hasError: true,
            message: 'Uncontrolled error, please contact the administrator'
         }

      }
   }

   const cleanCart = () => {
      dispatch({ type: '[Cart] - Order Complete'});
   }

   return (
   <CartContext.Provider value={{
       ...state,

       //Methods
       addProductToCart,
       removeCartProduct,
       updateCartQuantity,
       updateShippingAddress,
       
       createOrder,
       cleanCart,
       
   }}>
       { children }
   </CartContext.Provider>
   )
}