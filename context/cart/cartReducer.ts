import { CartState } from './';

import { ICartProduct } from '../../interfaces';

type CartActionType =
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change product quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove product in cart', payload: ICartProduct }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch( action.type ) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                cart: [... action.payload] 
            }
        
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [... action.payload]
            }

        case '[Cart] - Change product quantity':
            return {
                ...state,
                cart: state.cart.map( (product: ICartProduct) => {
                    if( product._id !== action.payload._id ) return product; // if not the same product, return the product
                    if( product.size !== action.payload.size ) return product; // if not the same size, return the product
                    return action.payload;
                })
            }

        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter( (product: ICartProduct) => 
                    ! (product._id === action.payload._id && product.size === action.payload.size)
                )
            }
        
        
        default:
            return state;
    }
}