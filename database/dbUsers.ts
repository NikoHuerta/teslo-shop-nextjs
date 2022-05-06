import bcrypt from 'bcryptjs';

import { User } from "../models";
import { db } from ".";


export const checkUserEmailPassword = async ( loginEmail: string = '', password: string = '' ) => {

    await db.connect();
    const user = await User.findOne({ email: loginEmail }).lean();
    await db.disconnect();

    if( !user ){
        return null;
    }

    if( !bcrypt.compareSync( password, user.password! ) ){
        return null;
    }

    const { _id, name, email, role } = user;

    return{
        _id,
        name,
        email: email.toLocaleLowerCase(),
        role,
    }
}

//Crea  o verifica el usuario de OAuth
export const oAuthToDbUser = async ( oAuthEmail: string, oAuthName: string ) => {

    await db.connect();
    const user = await User.findOne({ email: oAuthEmail }).lean();

    if ( user ){
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email: email.toLocaleLowerCase(), role, };
    }

    const newUser = new User({
        name: oAuthName,
        email: oAuthEmail,
        password: ':P',
        role: 'client',
    });

    await newUser.save();
    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return {
        _id,
        name,
        email: email.toLocaleLowerCase(),
        role,
    };

}