import { randomUUID } from "node:crypto";
import { CreateUserDto } from "../dtos/createUser.dto";
import { hash, compare } from 'bcrypt';

export class User {
    constructor(
        public fname: string,
        public lname: string,
        public email: string,
        public phone: string,
        public password: string,
        public id: string,

        public hashedRefreshToken?: string,

        // public createdAt: Date | string = new Date(),
        // public lastLogin: Date | string = new Date(),
        // public deletedAt: Date | string = new Date(),

        // public isDeleted?: boolean,
        // public isVerified?: boolean,

        // public verificationCode?: string,
        // public verificationCodeExpires?: Date | string,

        // public resetPasswordToken?: string,
        // public resetPasswordExpires?: Date | string,
    ) {}

    static async fromCreateUserDto(createUserDto: CreateUserDto): Promise<User> {
        return new User(
            createUserDto.fname,
            createUserDto.lname,
            createUserDto.email,
            createUserDto.phone,
            await User.hashPassword(createUserDto.password),
            randomUUID()
        );
    }

    static async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async comparePassword(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }

    static async hashRefreshToken(refreshToken: string): Promise<string> {
        return await hash(refreshToken, 10);
    }

    async compareRefreshToken(refreshToken: string): Promise<boolean> {
        return await compare(refreshToken, this.hashedRefreshToken);
    }
    
}