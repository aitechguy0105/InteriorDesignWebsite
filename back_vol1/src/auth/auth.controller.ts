import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { ForgotpasswordEntity } from './entity/forgotpassword.entity';
import { ForgotpasswordDto } from './dto/forgotpassword.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyTokenDto } from 'src/users/dto/verify-token.dto';
import { Request } from 'express';
import { SignupEntity } from './entity/signup.entity';
import { SigninEntity } from './entity/signin.entity';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/util/guards/refreshToken.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetpasswordEntity } from './entity/resetpassword.Entity';
import { ResetpasswordDto } from './dto/resetpassword.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { MeDto } from './dto/me.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async me(@Body() meDto: MeDto) {
    return await this.authService.me(meDto.email);
  }

  @Post('signup')
  @ApiOkResponse({ type: SignupEntity })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOkResponse({ type: SigninEntity })
  signin(@Body() data: SigninDto) {
    return this.authService.signIn(data);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    const userId = refreshTokenDto.userId;
    const refreshToken = refreshTokenDto.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('verifyemail')
  @ApiOkResponse({ type: SigninEntity })
  verifyemail(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyemail(verifyTokenDto);
  }

  @Post('forgotpassword')
  @ApiOkResponse({ type: ForgotpasswordEntity })
  forgotpassword(@Body() { email }: ForgotpasswordDto) {
    return this.authService.forgotpassword(email);
  }

  @Post('resetpassword')
  @ApiOkResponse({ type: ResetpasswordEntity })
  async resetpassword(@Body() resetpasswordDto: ResetpasswordDto) {
    return this.authService.resetpassword(resetpasswordDto);
  }
}
