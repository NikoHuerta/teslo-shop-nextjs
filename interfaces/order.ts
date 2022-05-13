import { IUser, ISize, IGender, ShippingAddress } from './';

export interface IOrder {

    _id?            : string;
    user?           : IUser | string;
    orderItems      : IOrderItem[];
    shippingAddress : ShippingAddress;
    billingAddress  : ShippingAddress;
    paymentResult?  : string;

    numberOfItems   : number;
    subTotal        : number;
    tax             : number;
    total           : number;

    isPaid          : boolean;
    paidAt?         : string;

    createdAt?      : string;
    transactionId?  : string;
}


export interface IOrderItem {
    _id: string;
    title: string;
    size: ISize;
    gender: IGender;
    quantity: number;
    slug: string;
    images: string;
    price: number;
}