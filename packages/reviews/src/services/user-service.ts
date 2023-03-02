/**
 * This class will be in charge of comunicate the database to get the information for users.
 * The validation for the users is made in this class 
 */

import { User } from "../entities/user-models/user-model";

export async function ValidateUser(user_name:string, user_password:string){
    
    let user = await User.findOne({user_name:user_name});

    if(!user){
        return false;
    }

    let storagePassword = Buffer.from(user.user_password, 'base64').toString();

    if(storagePassword !== user_password){
        return false;
    }

    return true;
}