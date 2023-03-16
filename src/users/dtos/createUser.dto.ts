/**
export type User = {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    id: string;
    password: string;
}
 */

import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword, isStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    
    @MinLength(3)
    @IsString()
    fname: string;

    @MinLength(3)
    @IsString()
    lname: string;

    @IsEmail()
    email: string;

    // @IsPhoneNumber('IS')
    phone: string;

    @IsString()
    @IsStrongPassword()
    password: string;
}