import { ISize, IGender } from ".";

export interface ICartProduct {
    _id: string;
    images: string;
    price: number;
    size?: ISize;
    slug: string;
    title: string;
    gender: IGender;
    quantity: number;
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