import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy } from 'src/users/auth/strategies';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          expiresIn: '60s',
          secret: configService.get('ACCESS_TOKEN_SECRET')
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    JwtService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ],
  exports: [UsersService]
})
export class UsersModule {}