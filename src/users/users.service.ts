import { ClassSerializerInterceptor, ForbiddenException, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { cloneDeep } from 'lodash';
import { JwtPayload, Tokens } from 'src/users/auth/types';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './models/user.model';
import { UserResponse } from './models/userResponse.model';

@Injectable()
export class UsersService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    private users: User[] = [];

    async checkIsUserExists(email: string): Promise<boolean> {
        return this.users.some((user) => user.email === email);
    }

    async createUser(createUserDto: CreateUserDto): Promise<Tokens> {
        const user: User = await User.fromCreateUserDto(createUserDto);
        const isUserExists: boolean = await this.checkIsUserExists(user.email);
        const tokens = await this.getTokens({ email: user.email, sub: user.id });
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        if(!isUserExists) await this.insertUser(user);
        return tokens;
    }

    // ======================== crud queries ========================
    async insertUser(user: User): Promise<void> {
        this.users.push(user);
    }

    // ======================== search queries ========================
    async findUserByEmail(email: string): Promise<User> {
        return cloneDeep(this.users.find((user) => user.email === email));
    }

    async findUserById(id: string): Promise<User> {
        return cloneDeep(this.users.find((user) => user.id === id));
    }

    // ======================== jwt queries ========================
    async logoutUser(id: string): Promise<void> {
        const user: User = await this.findUserById(id);
        user.hashedRefreshToken = null;
    }

    async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
        const user: User = await this.findUserById(id);
        user.hashedRefreshToken = await User.hashRefreshToken(refreshToken);
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user: User = await this.findUserById(userId);
        if (user) {
            const isRefreshTokenMatch: boolean = await user.compareRefreshToken(refreshToken);
            if (isRefreshTokenMatch) {
                const tokens = await this.getTokens({ email: user.email, sub: user.id });
                await this.updateRefreshToken(user.id, tokens.refresh_token);
                return tokens;
            }
            throw new ForbiddenException('Invalid refresh token');
        }
        throw new NotFoundException('User not found');
    }

    @UseInterceptors(ClassSerializerInterceptor)
    async validate(email: string, password: string): Promise<UserResponse> {
        const user: User = await this.findUserByEmail(email);
        if (user) {
            const isPasswordMatch: boolean = await user.comparePassword(password);
            if (isPasswordMatch) {
                return plainToClass(UserResponse, user, {
                    excludeExtraneousValues: true,
                });
            }
            throw new ForbiddenException('Invalid password');
        }
        throw new NotFoundException('User not found');
    }

    private getToken({
        jwtPayload,
        expiresIn,
        type
    }: {
        jwtPayload: JwtPayload,
        expiresIn?: string | number | undefined,
        type: 'ACCESS' | 'REFRESH'
    }): string {
        return this.jwtService.sign(
            jwtPayload,
            { expiresIn, secret: this.configService.get(`${type}_TOKEN_SECRET`) }
        );
    }

    async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
        return {
            access_token: this.getToken({ jwtPayload, expiresIn: '15m', type: 'ACCESS' }),
            refresh_token: this.getToken({ jwtPayload, expiresIn: '7d', type: 'REFRESH' })
        };
    }
}
