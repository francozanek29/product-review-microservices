/**
 * Function created to authenticate the user. The information comes in the Authorization header 
 * following the format userName:password
 */

import {Request, Response, NextFunction} from 'express';
import * as userService from  "../services/user-service";

export async function AuthenticationHandler(request:Request, response: Response, next: NextFunction){
    let authorizationHeader  = request.headers.authorization;

    if(!authorizationHeader){
        return response.status(401).json({status: "error", code: "No credentials were found"});
    }

    let user_information = authorizationHeader.split(":");

    if(user_information.length != 2){
        //The user information is not coming in the expected format
        return response.status(401).json({status: "error", code: "User information is incorrect"}); 
    }

    if(await userService.ValidateUser(user_information[0],user_information[1])){
        next();
    }else{
        return response.status(401).json({status: "error", code: "User name or Password are incorrect"});  
    }
}