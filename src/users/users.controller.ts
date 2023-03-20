import { Request, ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Body, Get, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common/decorators";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { API } from "./config";
import { CreateUserDto } from "./dtos/createUser.dto";
import { LoginDto } from "./dtos/login.dto";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "src/users/auth/guards/local/local-auth.guard";
import { JwtAccessTokenGuard, RefreshTokenGuard } from "src/users/auth/guards";
import { Tokens } from "src/users/auth/types";
import { GetCurrentUserId } from "src/users/auth/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "src/users/auth/decorators/get-current-user.decorator";

const baseUrlReplacer = (url: string): string => url.replace('/users', '');

@Controller(API.USER.CONTROLLER)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post(baseUrlReplacer(API.USER.LOCAL_SIGNUP))
    @UsePipes(ValidationPipe)
    async signUp(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
        return await this.usersService.createUser(createUserDto)
    }
    
    @UseGuards(LocalAuthGuard)
    @Post(baseUrlReplacer(API.USER.LOCAL_LOGIN))
    @UsePipes(ValidationPipe)
    async signIn(
        @Request() req, 
        @Body() { email }: LoginDto
    ): Promise<Tokens> {
        return await this.usersService.getTokens({ email, sub: req.user.id });
    }

    @UseGuards(JwtAccessTokenGuard)
    @Post(baseUrlReplacer(API.USER.LOGOUT))
    async logoutUser(@Body() id: string): Promise<void> {
        return await this.usersService.logoutUser(id);
    }

    @UseGuards(RefreshTokenGuard)
    @Post(baseUrlReplacer(API.USER.REFRESH_TOKEN))
    refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<Tokens> {
        return this.usersService.refreshTokens(userId, refreshToken);
    }

    @Get(baseUrlReplacer(API.USER.GET_USER_BY_ID))
    async getUserById(@Body() id: string): Promise<User> {
        return null;
    }

    @Get(baseUrlReplacer(API.USER.GET_USER_BY_EMAIL))
    async getUserByEmail(@Body() email: string): Promise<User> {
        return null;
    }
}