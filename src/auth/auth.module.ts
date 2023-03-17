import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { 
  AccessTokenStrategy, 
  RefreshTokenStrategy, 
  LocalStrategy 
} from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
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
  providers: [
    AuthService, 
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
