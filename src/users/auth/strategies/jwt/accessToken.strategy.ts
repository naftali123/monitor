import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from "express";

import { JwtPayload } from '../../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([( request: Request ) => {
        let data = request?.cookies["Authentication"];
        return data ?? null
      }]),
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
