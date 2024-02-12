import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// define function
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/util/mail/mail.service';
import { UsersService } from 'src/users/users.service';

// Entity
import { Tokens } from './entity/signin.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { SignupEntity } from './entity/signup.entity';
import { ForgotpasswordEntity } from './entity/forgotpassword.entity';

// DTO
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetpasswordDto } from './dto/resetpassword.dto';
import { UpdateRefreshDto } from 'src/users/dto/update-refresh.dto';
import { SigninDto } from './dto/signin.dto';
// import { VerifyemailDto } from './dto/verifyemail.dto';

import {
  EmailDynamicTemplate,
  EmailMessage,
} from 'src/util/sendgrid/email.type';
import {
  GETRESTYLE_COMPANY_ADDRESS,
  GETRESTYLE_SUPPORT_EMAIL,
  MAIL_BATCHED_UPDATE_TEMPLATE_ID,
  WEB_ROOT,
} from 'src/environments';

// import { sendGridEmailWithDynamicTemplate } from 'src/util/sendgrid';
import { sendTestMail } from 'src/util/sendgrid/testmail';
import { forgotPassMail } from 'src/util/sendgrid/forgotPassMail';
import { VerifyTokenDto } from 'src/users/dto/verify-token.dto';
import { VerifyemailDto } from 'src/users/dto/verifyemail.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async me(email: string): Promise<UserEntity> {
    return await this.usersService.findByUserEmail(email);
  }

  async signUp(createUserDto: CreateUserDto): Promise<SignupEntity> {
    let newUser: UserEntity;

    const hash = await this.hashData(createUserDto.password);
    // Check if user exists
    const userExists = await this.usersService.findByUserEmail(
      createUserDto.email,
    );
    if (userExists.email) {
      if (userExists.verifyemail) {
        throw new BadRequestException('このメールアドレスは、すでにご登録済のメールアドレスのため ログインアカウントからご入力ください。');
      }
      createUserDto.password = hash;
      newUser = await this.usersService.updatePass(
        userExists.id,
        createUserDto,
      );
    } else {
      newUser = await this.usersService.create({
        ...createUserDto,
        password: hash,
      });
    }

    // Hash password
    const tokens: Tokens = await this.getTokens(newUser.id, newUser.email);
    const verifyTokenDto: VerifyTokenDto = {
      verifytoken: tokens.accessToken,
    };
    await this.usersService.updateVerifyToken(newUser.id, verifyTokenDto);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    const url = `${WEB_ROOT}/auth/verify-email?accessToken=${tokens.accessToken}`;
    return {
      sendverifymailstate: await sendTestMail(newUser, url),
      email: newUser.email,
    };
  }

  async signIn(signinDto: SigninDto) {
    // Check if user exists
    const user = await this.usersService.findByUserEmail(signinDto.email);
    console.log('------------------------>', user);
    await this.usersService.userLogin(signinDto.email);
    if (!user) {
      console.log('==========================XXXXX');
      throw new BadRequestException({msg:'こちらのメールアドレスは、登録がございません。', type: "email"});
    }
    // ----------------------------->> This is Updated part
    if (!user.verifyemail)
      throw new BadRequestException({msg:'確認済みのメールではありません。', type: "email"});
    const passwordMatches = await argon2.verify(
      user.password,
      signinDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException({msg:'正しいパスワードを入力してください', type: "password"});
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      tokens: tokens,
      userInfo: user,
      userStatus: true,
    };
  }

  async logout(userId: number) {
    let updateRefreshDto: UpdateRefreshDto;
    updateRefreshDto.refreshtoken = 'null';
    return this.usersService.updateToken(userId, updateRefreshDto);
  }

  async verifyemail(verifyTokenDto: VerifyTokenDto) {
    const user = await this.prisma.user.findUnique({
      where: { verifytoken: verifyTokenDto.verifytoken },
    });
    if (!user) {
      throw new NotFoundException(`Not user found for email`);
    }
    const verifyemailDto: VerifyemailDto = {
      verifyemail: true,
    };
    const verifyUser = await this.usersService.verifyemail(
      user.id,
      verifyemailDto,
    );
    if (verifyUser.verifyemail) {
      const tokens = await this.getTokens(verifyUser.id, verifyUser.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      console.log('verify success');
      return {
        tokens: tokens,
        userInfo: verifyUser,
        userStatus: true,
      };
    } else {
      console.log('verify false');
      return false;
    }
  }

  async forgotpassword(email: string): Promise<ForgotpasswordEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`Not user found for email: ${email}`);
    }
    const tokens = await this.getTokens(user.id, user.email);
    const verifyTokenDto: VerifyTokenDto = {
      verifytoken: tokens.accessToken,
    };
    await this.usersService.updateVerifyToken(user.id, verifyTokenDto);
    if (user.verifyemail == true) {
      const url = `${WEB_ROOT}/auth/reset-password?accessToken=${tokens.accessToken}`;
      return {
        sendmailState: await forgotPassMail(user, url),
        email: user.email,
      };
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userid: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const updateRefreshDto: UpdateRefreshDto = {
      refreshtoken: hashedRefreshToken,
    };
    updateRefreshDto.refreshtoken = hashedRefreshToken;
    await this.usersService.updateToken(userid, updateRefreshDto);
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshtoken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshtoken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: number, useremail: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          useremail,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          useremail,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async resetpassword(resetpasswordDto: ResetpasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { verifytoken: resetpasswordDto.verifytoken },
    });
    if (!user.verifyemail) {
      throw new BadRequestException('User is not registered.');
    }
    const hash = await this.hashData(resetpasswordDto.password);
    resetpasswordDto.password = hash;
    const updateUser = await this.usersService.resetPassword(
      user.id,
      resetpasswordDto,
    );
    const tokens = await this.getTokens(updateUser.id, updateUser.email);
    await this.updateRefreshToken(updateUser.id, tokens.refreshToken);
    return {
      tokens: tokens,
      userInfo: user,
      userStatus: true,
    };
  }

  async sendMail(user: UserEntity, url: string): Promise<boolean> {
    try {
      // const user: OemUserEntity = await this.verifyPayload({ username: email });
      //TODO: all const text should be in separated files
      const subject = `Your email login link`;

      //TODO: we really need to have a separated email service!!!
      const dynamicTemplateData: EmailDynamicTemplate = {
        // logoURL: GETRESTYLE_LOGO_URL,
        CTA: url,
        subject: subject,
        body: `To login to Getrestyle, please click the link below`,
        companyAddress: GETRESTYLE_COMPANY_ADDRESS,
        emailverify: `This message was sent to ${user.email} because you're a user in the ${user.name} Getrestyle account.`,
        showButton: true,
        ctaText: `Login`,
      };

      return true;
    } catch (error) {
      console.error('Email Login Error', error);
      throw new UnauthorizedException(`Cannot login via email: ${user.email}`);
    }
  }
}
