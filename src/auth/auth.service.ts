import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from 'src/shared/authentication/jwt/model/jwt.model';
import { JwtConfigHelper } from 'src/shared/constants/constants';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    return await this.usersService.findOne(email, password);
  }

  async login(req: any) {
    try {
      const user = await this.validateUser(req.email, req.password);

      const accessToken = await this.getJwtAccessToken(
        user.username,
        user.id,
        user.role,
      );
      const refreshToken = await this.getJwtRefreshToken(
        user.username,
        user.id,
        user.role,
      );
      return {
        accessToken,
        refreshToken,
      };

      // const accessToken = await this.getJwtAccessToken({ username: user.email, userId: user.id, role: user.role });
      //

      // const payload = { email: user.email, userId: user.id, role: user.role };
      // return {
      //   ...payload,
      //   token: this.jwtService.sign(payload),
      // };
    } catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }
  }

  // async getUserIfRefreshTokenMatches(
  //   refreshToken: string,
  //   tokenId: string,
  //   payload: ITokenPayload,
  // ) {
  //   const foundToken = await this.prismaService.token.findUnique({
  //     where: {
  //       id: tokenId,
  //     },
  //   });

  //   const isMatch = await argon.verify(
  //     foundToken.refreshToken ?? '',
  //     refreshToken,
  //   );

  //   const issuedAt = dayjs.unix(payload.iat);
  //   const diff = dayjs().diff(issuedAt, 'seconds');

  //   if (foundToken == null) {
  //     //refresh token is valid but the id is not in database
  //     //TODO:inform the user with the payload sub
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   }

  //   if (isMatch) {
  //     return await this.generateTokens(payload, tokenId);
  //   } else {
  //     //less than 1 minute leeway allows refresh for network concurrency
  //     if (diff < 60 * 1 * 1) {
  //       console.log('leeway');
  //       return await this.generateTokens(payload, tokenId);
  //     }

  //     //refresh token is valid but not in db
  //     //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
  //     if (payload.sub !== foundToken.userId) {
  //       //the sub of the token isn't the id of the token in db
  //       // log out all session of this payalod id, reFreshToken has been compromised
  //       await this.tokenService.deleteMany({
  //         where: {
  //           userId: payload.sub,
  //         },
  //       });
  //       throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //     }

  //     throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // private async generateTokens(payload: ITokenPayload, tokenId: string) {
  //   const { accessToken } = await this.getJwtAccessToken(
  //     payload.userId,
  //     payload.username,
  //     payload.role
  //   );

  //   const { refreshToken: newRefreshToken } = await this.getJwtRefreshToken(
  //     payload.userId,
  //     payload.username,
  //     payload.role
  //   );

  //   const hash = await argon.hash(newRefreshToken);

  //   await this.prismaService.token.update({
  //     where: {
  //       id: tokenId,
  //     },
  //     data: {
  //       refreshToken: hash,
  //     },
  //   });

  //   return {
  //     accessToken,
  //     refreshToken: newRefreshToken,
  //     tokenId: tokenId,
  //     accessTokenExpires: getAccessExpiry(),
  //     user: {
  //       id: payload.sub,
  //       email: payload.email,
  //     },
  //   };
  // }

  async getJwtAccessToken(
    userId: string,
    username: string,
    role: string,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: ITokenPayload = {
      userId,
      role,
      username,
      isSecondFactorAuthenticated,
    };
    return await this.jwtService.signAsync(payload, {
      secret: JwtConfigHelper.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: JwtConfigHelper.JWT_ACCESS_TOKEN_EXPIRES,
    });
  }

  public async getJwtRefreshToken(
    userId: string,
    username: string,
    role: string,
  ) {
    const payload: ITokenPayload = { userId, username, role };
    return await this.jwtService.signAsync(payload, {
      secret: JwtConfigHelper.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: JwtConfigHelper.JWT_REFRESH_TOKEN_EXPIRES,
    });
  }
}
