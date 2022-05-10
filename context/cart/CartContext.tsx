import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps{

    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;

    //METHODS
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateShippingAddress: (address: ShippingAddress) => void;

    //ORDERS
    createOrder: () => Promise<void>;
    
}

export const CartContext = createContext({} as ContextProps);