export interface IUser{
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    role     : string;
    
    createdAt: string;
    updatedAt: string;

}

export interface IUserContext{
    email: string;
    name: string;
    role: string;
}