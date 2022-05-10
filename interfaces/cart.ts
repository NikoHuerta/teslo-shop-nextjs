import { ISize, IGender } from ".";

export interface ICartProduct {
    _id: string;
    title: string;
    size?: ISize;
    gender: IGender;
    quantity: number;
    slug: string;
    images: string;
    price: number;
}
 
export interface ShippingAddress{
   
    firstName:  string;
    lastName:   string;
    address:    string;
    address2?:  string;
    zipCode:    string;
    city:       string;
    country:    string;
    phone:      string;
 }