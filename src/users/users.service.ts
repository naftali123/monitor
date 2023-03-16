import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(
        // private readonly usersService: UsersService,
        // private readonly authService: AuthService,
        // private readonly eventEmitter: EventEmitter2,
    ) {}

    private users: User[] = [];

    async checkIsUserExists(email: string): Promise<boolean> {
        return this.users.some((user) => user.email === email);
    }

    private encryptPassword(password: string): string {
        return password;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user: User = await User.fromCreateUserDto(createUserDto);
        const isUserExists: boolean = await this.checkIsUserExists(user.email);
        if(!isUserExists){
            this.users.push(user);
            return cloneDeep(user);
        }
        return null;
    }

    async findUserByEmail(email: string): Promise<User> {
        return cloneDeep(this.users.find((user) => user.email === email));
    }

    async findUserById(id: string): Promise<User> {
        return cloneDeep(this.users.find((user) => user.id === id));
    }
}
