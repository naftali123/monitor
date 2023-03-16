import { Exclude, Expose } from "class-transformer";
import { User } from "./user.model";

export class UserResponse extends User {
    
    @Exclude()
    password: string;
    
    @Exclude()
    id: string;

    @Expose()
    fname: string;
    
    @Expose()
    lname: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;
}