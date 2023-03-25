import { Request, Response, ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Response as Res } from 'express';
import { Body, Get, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common/decorators";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { API } from "./config";
import { CreateUserDto } from "./dtos/createUser.dto";
import { LoginDto } from "./dtos/login.dto";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "src/users/auth/guards/local/local-auth.guard";
import { Tokens } from "src/users/auth/types";
import { GetCurrentUserId } from "src/users/auth/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "src/users/auth/decorators/get-current-user.decorator";
import { ConfigService } from "@nestjs/config";
import { Public } from "./auth/decorators";
import { RefreshTokenGuard } from "./auth/guards";

const baseUrlReplacer = (url: string): string => url.replace('/users', '');

@Controller(API.USER.CONTROLLER)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService
    ) { }
    
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @Post(baseUrlReplacer(API.USER.LOCAL_SIGNUP))
    @UsePipes(ValidationPipe)
    async signUp(
        @Response() res: Res,
        @Body() createUserDto: CreateUserDto
    ) {
        const { access_token, refresh_token } = await this.usersService.createUser(createUserDto);
        res.cookie('Authentication', access_token, { path: '/', httpOnly: true });
        res.send({ access_token, refresh_token });
    }

    @UseGuards(LocalAuthGuard)
    @Post(baseUrlReplacer(API.USER.LOCAL_LOGIN))
    @UsePipes(ValidationPipe)
    async signIn(
        @Request() req,
        @Response() res: Res,
        @Body() { email }: LoginDto
    ) {
        const { access_token, refresh_token } = await this.usersService.getTokens({ email, sub: req.user.id });
        res.cookie('Authentication', access_token, { path: '/', httpOnly: true });
        res.send({ access_token, refresh_token });
    }

    @Post(baseUrlReplacer(API.USER.LOGOUT))
    async logOut(@Request() req, @Response() res: Res) {
        const { user } = req;
        await this.usersService.logoutUser(user.id);
        this.clearAccessTokenCookie(res);
        return res.sendStatus(200);
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

    // ===== helpers =====
    setAccessTokenCookie(token: string, res: Res) {
        // const maxAge = this.configService.get('JWT_EXPIRATION_TIME');
        res.cookie('Authentication', token, { path: '/', httpOnly: true });
    }
    
    clearAccessTokenCookie(res: Res) {
        const cookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
        res.setHeader('cookie', cookie);
    }
}