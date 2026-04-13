import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AppOAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      authorizationURL: config.getOrThrow<string>('OAUTH2_AUTHORIZATION_URL'),
      tokenURL: config.getOrThrow<string>('OAUTH2_TOKEN_URL'),
      clientID: config.getOrThrow<string>('OAUTH2_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('OAUTH2_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('OAUTH2_CALLBACK_URL'),
      scope: config
        .get<string>('OAUTH2_SCOPE', 'openid profile email')
        .split(' ')
        .filter(Boolean),
    });
  }

  async validate(accessToken: string) {
    const userinfoUrl = this.config.get<string>('OAUTH2_USERINFO_URL');
    if (!userinfoUrl) {
      throw new UnauthorizedException('OAUTH2_USERINFO_URL is not configured');
    }
    const res = await fetch(userinfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      throw new UnauthorizedException('oauth2_userinfo_failed');
    }
    const body = (await res.json()) as Record<string, unknown>;
    const oauth_subject = String(body.sub ?? body.id ?? '');
    if (!oauth_subject) {
      throw new UnauthorizedException('oauth2_missing_subject');
    }
    const user = await this.usersService.upsertFromOAuth({
      oauth_provider: 'oauth2',
      oauth_subject,
      email: typeof body.email === 'string' ? body.email : null,
      display_name:
        typeof body.name === 'string'
          ? body.name
          : typeof body.preferred_username === 'string'
            ? body.preferred_username
            : null,
    });
    return { id: user.id };
  }
}
