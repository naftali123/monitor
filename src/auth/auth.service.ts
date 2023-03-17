import { ClassSerializerInterceptor, Injectable, NotFoundException, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/models/user.model';
import { UserResponse } from 'src/users/models/userResponse.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  
  @UseInterceptors(ClassSerializerInterceptor)
  async validate(email: string, password: string): Promise<UserResponse> {
    const user: User = await this.usersService.findUserByEmail(email);
    if(user){
        const isPasswordMatch: boolean = await user.comparePassword(password);
        if(isPasswordMatch){
            return plainToClass(UserResponse, user, {
              excludeExtraneousValues: true,
            });
        }
        throw new UnauthorizedException('Invalid password');
    }
    throw new NotFoundException('User not found');
  }

  async login(user: User) {
    return { 
      access_token: this.jwtService.sign(
        { username: user.email, sub: user.id }, 
        { secret: this.configService.get('jwtSecret')}
      )
    };
  }
}