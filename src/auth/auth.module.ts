import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get('jwtSecret');
        return {
          expiresIn: '60s',
          secret
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule
  ],
  providers: [
    AuthService, 
    LocalStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
