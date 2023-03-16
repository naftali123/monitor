import { Request, ClassSerializerInterceptor, NotFoundException, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import { Body, Get, Post, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common/decorators";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { plainToClass } from "class-transformer";
import { API } from "./config";
import { CreateUserDto } from "./dtos/createUser.dto";
import { SignInDto } from "./dtos/signIn.dto";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";
import { UserResponse } from "./models/userResponse.model";
import { LocalAuthGuard } from "src/auth/local-auth.guard";

const baseUrlReplacer = (url: string): string => url.replace('/users', '');

@Controller(API.USER.CONTROLLER)
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post(baseUrlReplacer(API.USER.SIGN_UP))
    @UsePipes(ValidationPipe)
    async signUp(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.usersService.createUser(createUserDto);
        return user;
    }
    
    @UseGuards(LocalAuthGuard)
    @Post(baseUrlReplacer(API.USER.LOG_IN))
    @UsePipes(ValidationPipe)
    async signIn(@Request() req, @Body() { email, password }: SignInDto) {
        // return connected response
        return req.user;
    }

    // SIGN_OUT

    @Get(baseUrlReplacer(API.USER.GET_USER_BY_ID))
    async getUserById(@Body() id: string): Promise<User> {
        return null;
    }

    @Get(baseUrlReplacer(API.USER.GET_USER_BY_EMAIL))
    async getUserByEmail(@Body() email: string): Promise<User> {
        return null;
    }
}