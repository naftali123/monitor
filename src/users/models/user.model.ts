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
        public id: string
    ) {}

    static async fromCreateUserDto(createUserDto: CreateUserDto): Promise<User> {
        return new User(
            createUserDto.fname,
            createUserDto.lname,
            createUserDto.email,
            createUserDto.phone,
            await hash(createUserDto.password, 10),
            randomUUID()
        );
    }

    async comparePassword(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }
}